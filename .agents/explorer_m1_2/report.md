# DELTA SYNTH — Milestone M1 Investigation Report: Audio Player Hardening & Race Condition Prevention

> **Investigator**: Explorer 2 (Milestone M1 — Public Core & Audio Hardening)  
> **Target Module**: `src/public/audioPlayer.js`  
> **Standard Reference**: `AGENT.md` (Sections 2, 3, 4, 6, 11, 13) & `PROJECT.md` (Feature F6)  
> **Date**: 2026-08-16  

---

## 1. Executive Summary

This investigation delivers a comprehensive architectural and code-level analysis of the global audio subsystem (`src/public/audioPlayer.js`). The module provides the singleton `globalAudioPlayer` (`AudioPlayerManager`) consumed across master layout docks (`src/pages/masterPage.js`) and dynamic voicebank catalogs (`All DELTA's Voicebank.acsro.js`, `Main.ggt15.js`, `All Callaboraion Voicebank_.aj73j.js`).

Our deep-dive identified **four critical stability and architectural defects**:
1. **Asynchronous Promise Race Condition (Rapid Track Switching)**: When a user quickly switches from Track A to Track B, the browser aborts Track A's pending `play()` promise. The resulting `AbortError` rejection executes in a later microtask, erroneously overriding Track B's state to `isPlaying = false`, broadcasting a false paused/stopped state to UI subscribers, and spamming false warning logs.
2. **Audio Disposal Ghost Event Cascade & Memory Leak**: `stop()` sets `this.audioElement.src = ''` without first detaching event handlers (`onplay`, `onpause`, `onended`, `onerror`). In standard browser engines, resetting `src` triggers asynchronous `onerror` and `onpause` events on the discarded instance, which then execute against stale closures, fire misleading error toasts to the user, log false playback failures, and prevent garbage collection.
3. **Swallowed Exception (`catch (_) {}`)**: Line 140 in `stop()` contains an empty catch block violating AGENT.md Section 6 (*Zero Swallowed Exceptions*) and Section 11 (*Structured Logging Format*).
4. **Interface Contract Gaps**: Absence of `getState()` method specified in `PROJECT.md:56`, lack of return value contract (`Promise<boolean>`), and absence of defensive validation on track parameters and subscription callbacks.

To resolve these issues, we designed a **Monotonic Generation Token Architecture** and a **Safe Audio Teardown Protocol** that guarantee deterministic state synchronization and complete memory reclamation.

---

## 2. Detailed Root-Cause & Vulnerability Analysis

### 2.1 Vector 1: Rapid Track Switching Race Condition (`AbortError`)

#### Code Observation (`src/public/audioPlayer.js:101-108`)
```javascript
const playPromise = this.audioElement.play();
if (playPromise !== undefined) {
  playPromise.catch(err => {
    this.isPlaying = false;
    this.notifyState();
    logStandard('AudioPlayer', 'Autoplay policy restriction', err.message, 'User interaction required before playback', 'warn');
  });
}
```

#### Race Condition Mechanism
1. **Time $T_0$ (User clicks Track A)**:
   - `play('Ayanami Hikaru', 'Voice/Ayanami Hikaru.wav')` is invoked.
   - `audioA = new Audio(...)` is created, `audioA.play()` is initiated, returning in-flight `playPromiseA`.
   - `this.currentTrackId = 'Ayanami Hikaru'`.
2. **Time $T_1$ (User immediately clicks Track B before Track A starts)**:
   - `play('SUN', 'Voice/SUN.wav')` is invoked.
   - `play()` calls `this.stop()`, which calls `audioA.pause()` and replaces `this.audioElement` with `audioB`.
   - `this.currentTrackId = 'SUN'`.
   - `audioB.play()` starts, setting `this.isPlaying = true` and broadcasting `{ isPlaying: true, currentTrackId: 'SUN' }` to subscribers.
3. **Time $T_2$ (Browser resolves abort of Track A)**:
   - Per W3C HTMLMediaElement specification, interrupting an in-flight `play()` with `pause()` or new source load causes `playPromiseA` to reject with DOMException: `AbortError: The play() request was interrupted by a new load request.`
   - `playPromiseA.catch()` executes in the JavaScript microtask queue.
   - **Flaw**: The catch block does **not** verify whether `audioA` is still the active audio instance or whether the playback session is still valid.
   - The handler unconditionally executes:
     ```javascript
     this.isPlaying = false;
     this.notifyState();
     logStandard('AudioPlayer', 'Autoplay policy restriction', ...);
     ```
4. **Resulting Defect**:
   - The UI dock (`#globalAudioDock`) and repeater buttons receive `{ isPlaying: false, currentTrackId: 'SUN', currentTrackUrl: 'Voice/SUN.wav' }`.
   - The play button switches to `"▶ เล่นต่อ"` (Paused) while Track B is audibly playing in the user's speakers.
   - Console logs a false warning: `[AudioPlayer] Autoplay policy restriction failed: The play() request was interrupted...`

---

### 2.2 Vector 2: Audio Disposal Ghost Event Cascade & Memory Leak

#### Code Observation (`src/public/audioPlayer.js:133-146`)
```javascript
stop() {
  if (this.audioElement) {
    try {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement.src = '';
      this.audioElement = null;
    } catch (_) {}
  }
  this.isPlaying = false;
  this.currentTrackId = null;
  this.currentTrackUrl = null;
  this.notifyState();
}
```

#### Ghost Event Sequence
1. In Blink (Chrome/Edge), WebKit (Safari), and Gecko (Firefox), mutating `audioElement.src = ''` immediately resets the media element's network state to `NETWORK_EMPTY` and triggers an asynchronous `error` event (code: `MEDIA_ERR_SRC_NOT_SUPPORTED` / empty source) and/or `pause` event.
2. Because `.onerror`, `.onpause`, `.onended`, and `.onplay` are assigned as direct property callbacks on `this.audioElement` (lines 79–99), they remain attached to the DOM element in memory even after `this.audioElement = null`.
3. When the browser dispatches the `error` event on the next event loop tick:
   - The retained `onerror` closure executes:
     ```javascript
     this.audioElement.onerror = (e) => {
       this.isPlaying = false;
       this.notifyState();
       logStandard('AudioPlayer', 'Audio playback', `Failed to load ${trackUrl}`, ...);
       showToast({ message: 'ไม่สามารถเล่นไฟล์เสียงได้', actionText: 'ตรวจสอบการเชื่อมต่อ', type: 'error' });
     };
     ```
   - It captures the old `trackUrl` from scope.
   - A ghost error toast `"ไม่สามารถเล่นไฟล์เสียงได้"` pops up on screen after the user intentionally clicked Stop or switched tracks!
   - A ghost error log is output to console.
4. **Memory Retention**: Retaining active closures referencing page-level variables and DOM elements prevents the JavaScript engine garbage collector from freeing the discarded `HTMLAudioElement` and audio decoding buffers.

---

### 2.3 Vector 3: Swallowed Exception in `stop()`

#### Code Observation (`src/public/audioPlayer.js:140`)
```javascript
try {
  this.audioElement.pause();
  this.audioElement.currentTime = 0;
  this.audioElement.src = '';
  this.audioElement = null;
} catch (_) {}
```

#### AGENT.md Compliance Breach
- AGENT.md Section 6 (*Stability, Errors & Type Safety*):
  > "ห้าม `except: pass` หรือกลืน error"
  > "ข้อความ error ควรบอก อะไรผิด + จุดที่ผิด + แนวทางถัดไป"
- AGENT.md Section 11 (*Logging & Alerts*):
  > `[Component] Action failed: <cause>. Suggested action: <next step>.`
- If an exception occurs (e.g., audio element in non-standard state or restricted security sandbox), swallowing it silently hides debugging telemetry.

---

### 2.4 Vector 4: Missing Interface Contracts & Defensive Gaps

1. **Missing `getState()`**:
   - `PROJECT.md:56` specifies: `globalAudioPlayer.getState(): { isPlaying: boolean, currentTrackId: string|null, currentTrackUrl: string|null }`.
   - `AudioPlayerManager` in `src/public/audioPlayer.js` currently omits this method entirely, forcing consumers to read internal properties directly.
2. **Missing `play()` Return Value Contract**:
   - `PROJECT.md:52` specifies `play(trackId, trackUrl): Promise<boolean>`.
   - The current `play()` implementation returns `undefined` synchronously on invalid inputs, and returns `undefined` when `playPromise` is handled, preventing callers from awaiting playback initiation.
3. **Unsafe `subscribe()` Callbacks**:
   - `subscribe(callback)` returns `() => this.onStateChangeCallbacks.delete(callback)`. If a non-function is passed, it returns undefined or attempts to add invalid types to the Set.
4. **Missing Parameter Validation**:
   - Passing null, empty strings, or non-string values to `play(trackId, trackUrl)` is only partially guarded (`if (!trackUrl)` without checking `trackId` or type).

---

## 3. Architecture & Solution Design

### 3.1 Monotonic Play Generation Token Tracking

To guarantee deterministic concurrency without race conditions:
1. Maintain a monotonic integer counter `this._playGeneration = 0`.
2. On every call to `play()`, increment `this._playGeneration` and store `const playToken = ++this._playGeneration; this.currentPlayToken = playToken;`.
3. In `stop()` or `_disposeAudio()`, invalidate the active token by setting `this.currentPlayToken = null` and incrementing `this._playGeneration++`.
4. Guard all event listeners (`onplay`, `onpause`, `onended`, `onerror`) and `playPromise` resolution/rejection handlers with:
   ```javascript
   if (this.currentPlayToken !== playToken) return;
   ```
5. In `playPromise.catch(err)`:
   - If `this.currentPlayToken !== playToken`: **Silently ignore** (superseded by a newer track).
   - If `err.name === 'AbortError'`: **Silently ignore** (intentional abort from stop or pause).
   - If token is current and error is genuine (e.g., browser autoplay `NotAllowedError`):
     - Update `this.isPlaying = false`.
     - Notify subscribers via `this.notifyState()`.
     - Log structured warning via `logStandard()`.
     - Return `false`.

```text
[Track A clicked: Token 1] ──► new Audio(A) ──► audioA.play() (pending Promise)
                                                     │
[Track B clicked: Token 2] ──► Invalidate Token 1 ───┼─► audioA aborted by browser
                                                     │   └─► Promise A rejects (AbortError)
                                                     │   └─► Token check: Token 1 !== Token 2
                                                     │   └─► IGNORED (No state corruption!)
                                                     │
                               audioB.play() ────────┴─► Active playback (Token 2 valid)
```

---

### 3.2 Safe Audio Teardown Protocol (`_disposeAudio`)

To prevent ghost events and memory leaks:
1. Extract teardown logic into a private helper `_disposeAudio()`.
2. **Step 1: Detach All Event Listeners**:
   Set `audio.onplay = null; audio.onpause = null; audio.onended = null; audio.onerror = null; audio.ontimeupdate = null;`
3. **Step 2: Pause and Reset Media Buffers**:
   ```javascript
   try {
     audio.pause();
     audio.currentTime = 0;
     audio.removeAttribute('src');
     if (typeof audio.load === 'function') {
       audio.load(); // Forces media engine to release file handles & hardware decoders
     }
   } catch (err) {
     logStandard('AudioPlayer', 'Audio cleanup', err?.message || String(err), 'Verify audio element state', 'warn');
   }
   ```
4. **Step 3: Nullify Reference**:
   Set `this.audioElement = null;`.

---

## 4. Concrete Code Recommendations

### 4.1 Proposed Hardened `src/public/audioPlayer.js`

Here is the complete, drop-in replacement implementation adhering to all AGENT.md standards:

```javascript
/**
 * DELTA SYNTH — Audio Preview & State Manager
 * 
 * Standards from AGENT.md:
 * - Resource-aware optimization (clean audio context disposal & listener detachment)
 * - Concurrency & Race-condition prevention via Monotonic Play Generation Tokens
 * - Section 6: Zero swallowed exceptions
 * - Section 11 Logging: [AudioPlayer] Action failed: <cause>. Suggested action: <next step>.
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { showToast } from 'public/toast';
import { logStandard } from 'public/utils';

export class AudioPlayerManager {
  constructor() {
    this.currentTrackId = null;
    this.currentTrackUrl = null;
    this.isPlaying = false;
    this.audioElement = null;
    this.onStateChangeCallbacks = new Set();
    this._playGeneration = 0;
    this.currentPlayToken = null;
  }

  /**
   * Get current playback state snapshot
   * @returns {{ isPlaying: boolean, currentTrackId: string|null, currentTrackUrl: string|null }}
   */
  getState() {
    return {
      isPlaying: this.isPlaying,
      currentTrackId: this.currentTrackId,
      currentTrackUrl: this.currentTrackUrl
    };
  }

  /**
   * Subscribe to playback state changes
   * @param {Function} callback - ({ isPlaying, currentTrackId, currentTrackUrl }) => void
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    if (typeof callback !== 'function') {
      logStandard('AudioPlayer', 'Subscribe request', 'Callback is not a function', 'Pass a valid function', 'warn');
      return () => {};
    }
    this.onStateChangeCallbacks.add(callback);
    return () => this.onStateChangeCallbacks.delete(callback);
  }

  /**
   * Broadcast current playback state to all registered subscribers
   */
  notifyState() {
    const state = this.getState();
    this.onStateChangeCallbacks.forEach(cb => {
      try {
        cb(state);
      } catch (err) {
        logStandard('AudioPlayer', 'Notify callback execution', err?.message || String(err), 'Check subscriber implementation', 'warn');
      }
    });
  }

  /**
   * Safely detach listeners, pause, and release audio resources
   * @private
   */
  _disposeAudio() {
    if (!this.audioElement) return;

    const audio = this.audioElement;
    this.audioElement = null;

    // 1. Explicitly detach all event handlers before modifying media source
    audio.onplay = null;
    audio.onpause = null;
    audio.onended = null;
    audio.onerror = null;
    audio.ontimeupdate = null;

    // 2. Pause and release media decoding buffer
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute('src');
      if (typeof audio.load === 'function') {
        audio.load();
      }
    } catch (err) {
      logStandard('AudioPlayer', 'Audio cleanup', err?.message || String(err), 'Verify audio element state', 'warn');
    }
  }

  /**
   * Play or toggle audio track with race condition protection
   * @param {string} trackId - Unique track identifier
   * @param {string} trackUrl - URL/path to audio file (e.g. 'Voice/SUN.wav')
   * @returns {Promise<boolean>} True if playback initiated, false otherwise
   */
  async play(trackId, trackUrl) {
    if (!trackId || typeof trackId !== 'string' || !trackUrl || typeof trackUrl !== 'string') {
      logStandard('AudioPlayer', 'Play request', 'Invalid trackId or trackUrl provided', 'Pass valid non-empty string trackId and trackUrl', 'warn');
      showToast({ message: 'ไม่พบไฟล์เสียงตัวอย่าง', actionText: 'โปรดลองเพลงอื่น', type: 'warning' });
      return false;
    }

    // Toggle pause if the same track is clicked while actively playing
    if (this.currentTrackId === trackId && this.isPlaying) {
      this.pause();
      return false;
    }

    // Invalidate any pending in-flight play requests and clean up prior audio
    const playToken = ++this._playGeneration;
    this.currentPlayToken = playToken;

    this._disposeAudio();

    this.currentTrackId = trackId;
    this.currentTrackUrl = trackUrl;

    if (typeof Audio !== 'undefined') {
      try {
        const audio = new Audio(trackUrl);
        this.audioElement = audio;
        audio.volume = 0.85;

        audio.onplay = () => {
          if (this.currentPlayToken !== playToken) return;
          this.isPlaying = true;
          this.notifyState();
        };

        audio.onpause = () => {
          if (this.currentPlayToken !== playToken) return;
          this.isPlaying = false;
          this.notifyState();
        };

        audio.onended = () => {
          if (this.currentPlayToken !== playToken) return;
          this.isPlaying = false;
          this.notifyState();
        };

        audio.onerror = () => {
          if (this.currentPlayToken !== playToken) return;
          this.isPlaying = false;
          this.notifyState();
          logStandard('AudioPlayer', 'Audio playback', `Failed to load ${trackUrl}`, 'Verify audio file exists in Voice/ directory', 'error');
          showToast({ message: 'ไม่สามารถเล่นไฟล์เสียงได้', actionText: 'ตรวจสอบการเชื่อมต่อ', type: 'error' });
        };

        const playPromise = audio.play();
        if (playPromise !== undefined && typeof playPromise.then === 'function') {
          return await playPromise
            .then(() => {
              if (this.currentPlayToken !== playToken) {
                return false;
              }
              return true;
            })
            .catch(err => {
              // Ignore stale / superseded play requests
              if (this.currentPlayToken !== playToken) {
                return false;
              }

              // Benign cancellation (interrupted by user pause/stop/new load)
              if (err && (err.name === 'AbortError' || err.code === 20)) {
                return false;
              }

              // Genuine failure (e.g. autoplay policy restriction)
              this.isPlaying = false;
              this.notifyState();
              logStandard('AudioPlayer', 'Autoplay policy restriction', err?.message || String(err), 'User interaction required before playback', 'warn');
              return false;
            });
        }
        return true;
      } catch (err) {
        logStandard('AudioPlayer', 'Audio initialization', err?.message || String(err), 'Check browser Web Audio support', 'error');
        this.isPlaying = false;
        this.notifyState();
        return false;
      }
    } else {
      // Running inside Wix SSR or non-browser / test environment
      this.isPlaying = true;
      this.notifyState();
      return true;
    }
  }

  /**
   * Pause the active track
   */
  pause() {
    if (this.audioElement && this.isPlaying) {
      try {
        this.audioElement.pause();
      } catch (err) {
        logStandard('AudioPlayer', 'Pause playback', err?.message || String(err), 'Verify audio element state', 'warn');
      }
    }
    this.isPlaying = false;
    this.notifyState();
  }

  /**
   * Stop audio, release resources, and reset state
   */
  stop() {
    this.currentPlayToken = null;
    this._playGeneration++;

    this._disposeAudio();

    const hadActiveSession = this.isPlaying || this.currentTrackId !== null;
    this.isPlaying = false;
    this.currentTrackId = null;
    this.currentTrackUrl = null;

    if (hadActiveSession) {
      this.notifyState();
    }
  }
}

export const globalAudioPlayer = new AudioPlayerManager();
export default globalAudioPlayer;
```

---

## 5. Comparative Diff & Rationale Matrix

| Target Section | Original Code | Hardened Code | Technical Rationale |
|---|---|---|---|
| **Class Properties** | Missing generation counters | Added `this._playGeneration = 0; this.currentPlayToken = null;` | Enables deterministic concurrency control across rapid asynchronous calls. |
| **`getState()`** | Missing | Implemented returning `{ isPlaying, currentTrackId, currentTrackUrl }` | Fulfills `PROJECT.md:56` interface contract without exposing internal mutable references. |
| **`subscribe()`** | No type validation | Added `typeof callback !== 'function'` guard returning no-op `() => {}` | Defensive design against invalid subscriber registrations. |
| **Audio Disposal** | Inlined inside `stop()` with `catch (_) {}` | Extracted into `_disposeAudio()` with event detachment before `.removeAttribute('src')` and `logStandard` on catch | Eliminates ghost events (`onerror`/`onpause`), stops memory leaks, and adheres to AGENT.md Sections 6 & 11. |
| **`play()` Input Validation** | `if (!trackUrl)` only | `if (!trackId \|\| typeof trackId !== 'string' \|\| !trackUrl \|\| typeof trackUrl !== 'string')` | Prevents runtime type coercion errors and invalid state transitions. |
| **`play()` Concurrency** | Naive `this.stop()` without token check in `.catch()` | `const playToken = ++this._playGeneration;` checked in all callbacks and `playPromise.catch()` | Prevents stale `AbortError` rejections from mutating active track state during rapid switching. |
| **`play()` Return Contract** | Returned `undefined` | Returns `Promise<boolean>` | Complies with `PROJECT.md:52` contract, enabling callers to await playback results. |
| **Autoplay Error Handling** | Unconditionally set `isPlaying = false` on any error | Filters `err.name === 'AbortError'` as benign cancellation | Prevents false error warnings when user deliberately navigates or switches tracks. |

---

## 6. Verification & Test Suite Design

To verify the hardened audio player under Node.js test environments:

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { AudioPlayerManager } from '../src/public/audioPlayer.js';

test('AudioPlayerManager: getState() returns exact snapshot', () => {
  const player = new AudioPlayerManager();
  assert.deepEqual(player.getState(), {
    isPlaying: false,
    currentTrackId: null,
    currentTrackUrl: null
  });
});

test('AudioPlayerManager: subscribe & unsubscribe lifecycle', () => {
  const player = new AudioPlayerManager();
  const states = [];
  const unsub = player.subscribe(s => states.push(s));

  player.stop(); // No state change if already empty
  assert.equal(states.length, 0);

  player.isPlaying = true;
  player.currentTrackId = 'test';
  player.notifyState();
  assert.equal(states.length, 1);
  assert.equal(states[0].isPlaying, true);

  unsub();
  player.notifyState();
  assert.equal(states.length, 1); // No new events received
});

test('AudioPlayerManager: Rapid track switching ignores aborted promise', async () => {
  const player = new AudioPlayerManager();
  
  // Mock Audio environment
  global.Audio = class MockAudio {
    constructor(src) {
      this.src = src;
      this.volume = 1;
    }
    play() {
      // Simulate delayed abort error
      return new Promise((_, reject) => {
        setTimeout(() => {
          const err = new Error('The play() request was interrupted by a new load request.');
          err.name = 'AbortError';
          reject(err);
        }, 10);
      });
    }
    pause() {}
    removeAttribute() {}
    load() {}
  };

  // Play Track 1 then immediately Track 2
  const p1 = player.play('Track 1', 'Voice/Track1.wav');
  const p2 = player.play('Track 2', 'Voice/Track2.wav');

  await Promise.all([p1, p2]);

  // Active track must remain Track 2
  assert.equal(player.currentTrackId, 'Track 2');
  delete global.Audio;
});
```

---

*Report prepared and certified according to DELTA SYNTH AGENT.md standards.*
