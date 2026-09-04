# Handoff Report — Explorer M1.2: Audio Player Hardening & Concurrency Architecture

## 1. Observation

1. **Aborted `playPromise` Race Condition in Rapid Track Switching**:
   - File: `src/public/audioPlayer.js`, Lines 101–108:
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
   - When a subsequent track is played before `playPromise` resolves, the browser triggers `pause()` / source replacement and rejects `playPromise` with `AbortError`. The rejection callback executes after the newer track has already initialized, setting `this.isPlaying = false` and invoking `notifyState()`.

2. **Ghost Events and Resource Leak in Audio Disposal**:
   - File: `src/public/audioPlayer.js`, Lines 133–146:
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
   - Lines 79–99 attach event listeners (`onplay`, `onpause`, `onended`, `onerror`) directly to `this.audioElement`. In `stop()`, setting `src = ''` triggers `onerror` and `onpause` in browser engines. Because event listeners are not nulled prior to clearing `src`, the discarded instance's `onerror` executes asynchronously, invoking `notifyState()`, logging false errors, and triggering `showToast({ message: 'ไม่สามารถเล่นไฟล์เสียงได้', ... })`.

3. **Swallowed Exception**:
   - File: `src/public/audioPlayer.js`, Line 140:
     `catch (_) {}` violates AGENT.md Section 6 (*Zero Swallowed Exceptions*) and Section 11 (*Structured Logging*).

4. **Missing Interface Contract Methods**:
   - `PROJECT.md:56` specifies `globalAudioPlayer.getState(): { isPlaying: boolean, currentTrackId: string|null, currentTrackUrl: string|null }`.
   - `src/public/audioPlayer.js` currently omits `getState()`.
   - `PROJECT.md:52` specifies `play(trackId, trackUrl): Promise<boolean>`, whereas current `play()` returns `undefined`.

---

## 2. Logic Chain

1. **From Observation 1**: Because `playPromise.catch()` lacks a token generation guard or error type inspection, any aborted promise from an earlier track will overwrite active playback state in the event loop microtask, leading to desynchronized UI state where audio is playing but the dock shows "▶ เล่นต่อ" (Paused).
2. **From Observation 2**: Because HTMLAudioElement dispatches an error event upon empty string `src` assignment, retaining callback references in memory leads to unwanted toast notifications, false console errors, and prevents GC of discarded audio decoding buffers.
3. **From Observation 3**: Swallowing exceptions in `stop()` conceals potential DOMException failures (such as security sandbox restrictions or invalid state transitions) during audio teardown.
4. **From Observation 4**: Callers in masterPage and future test harnesses need `getState()` and `Promise<boolean>` return contracts to cleanly inspect state and await playback initiation.
5. **Synthesis**: Implementing a private `_disposeAudio()` helper that detaches all event handlers before resetting media sources, introducing a monotonic `_playGeneration` token checked across all callbacks and promises, replacing `catch (_) {}` with `logStandard()`, and adding `getState()` completely resolves all four vectors.

---

## 3. Caveats

- In headless SSR or non-browser environments (where `typeof Audio === 'undefined'`), the player relies on immediate synchronous state transitions and returns `Promise.resolve(true)`.
- Autoplay browser restrictions (e.g. `NotAllowedError`) are legitimately logged as warnings with suggestions for user interaction, whereas `AbortError` is treated as a benign cancellation.

---

## 4. Conclusion

The audio player module (`src/public/audioPlayer.js`) requires the proposed refactoring detailed in `report.md`. The design guarantees:
1. Zero race conditions during rapid track switching via monotonic play generation tokens.
2. Complete elimination of ghost events and memory leaks via proactive listener detachment in `_disposeAudio()`.
3. 100% compliance with AGENT.md logging and zero swallowed exception rules.
4. Full contract adherence with `PROJECT.md` (`getState()` and `Promise<boolean>` return values).

---

## 5. Verification Method

1. **Source Inspection**: Inspect `src/public/audioPlayer.js` to ensure `_playGeneration`, `currentPlayToken`, `_disposeAudio()`, `getState()`, and `logStandard()` are properly structured.
2. **Automated Concurrency Unit Test**: Run Node.js test script mocking `HTMLAudioElement` with delayed `AbortError` rejections and verify that rapid consecutive calls to `play()` retain the state of the final track.
3. **Ghost Event Test**: Trigger `stop()` on an active audio instance and assert that no `onerror` callbacks or error toasts fire.
4. **Linting Check**: Run `npx eslint src/public/audioPlayer.js` to confirm zero lint errors or warnings.
