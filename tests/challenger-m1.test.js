/**
 * DELTA SYNTH — Challenger 1 Empirical Verification Test Harness (Milestone M1)
 * 
 * Comprehensive Stress-Test & Adversarial Challenge Suite for:
 * - src/public/utils.js
 * - src/public/audioPlayer.js
 * - src/public/wixPageTemplate.js
 * 
 * Empirical Verification Scope:
 * 1. Audio Player Rapid Switching Race Condition (delayed AbortError rejections)
 * 2. Audio Player Disposal & Ghost Callback Prevention (src removal & listener detachment)
 * 3. Audio Player State Snapshot & Subscription Lifecycle (isolation & return contracts)
 * 4. Scoped $wSafely Resolution & Error Boundaries (missing selectors & throwing actions)
 * 5. formatDateThai Thai Buddhist Era & Boundary Safety (null, undefined, timestamps, fallbacks)
 * 6. debounce & throttle High-Frequency Stress & Cancellation (.cancel() & arg preservation)
 * 7. sanitizeInput XSS Neutralization & Length Clamping (HTML tags & boundary truncation)
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  setupTestEnvironment,
  teardownTestEnvironment,
  canvasEngine,
  MockAudio,
  ConsoleSpy,
  assertStructuredLog,
  loadPublicModule
} from './test-helpers.js';

describe('Challenger M1: Empirical Stress Tests & Edge-Case Harness', () => {
  let env;
  let spy;

  beforeEach(() => {
    env = setupTestEnvironment();
    spy = new ConsoleSpy();
  });

  afterEach(() => {
    spy.restore();
    teardownTestEnvironment();
  });

  // ==========================================================================
  // SECTION 1: Audio Player Concurrency & Race Condition Stress Tests
  // ==========================================================================
  describe('1. Audio Player Rapid Switching Race Condition & Token Invalidation', async () => {
    const audioMod = await loadPublicModule('audioPlayer');
    const { AudioPlayerManager, globalAudioPlayer } = audioMod;

    it('CH-AUD-01: Rapid switching with delayed AbortError does NOT corrupt final playing state', async () => {
      const player = new AudioPlayerManager();
      const stateHistory = [];
      player.subscribe(s => stateHistory.push({ ...s }));

      // Simulate a custom MockAudio that rejects play() with delayed AbortError
      class DelayedAbortAudio extends MockAudio {
        async play() {
          this.paused = false;
          // Return a promise that rejects with AbortError after a delay
          return new Promise((_, reject) => {
            setTimeout(() => {
              const abortErr = new Error('The play() request was interrupted by a new load request.');
              abortErr.name = 'AbortError';
              abortErr.code = 20;
              reject(abortErr);
            }, 25);
          });
        }
      }

      // Track 1 uses delayed abort
      globalThis.Audio = DelayedAbortAudio;
      const playPromise1 = player.play('track_1', 'Voice/track1.wav');

      // Immediately switch to Track 2 before Track 1 rejection resolves
      const playPromise2 = player.play('track_2', 'Voice/track2.wav');

      // Immediately switch to Track 3 which succeeds
      class InstantSuccessAudio extends MockAudio {
        async play() {
          this.paused = false;
          this._emit('play');
          return Promise.resolve();
        }
      }
      globalThis.Audio = InstantSuccessAudio;
      const playPromise3 = player.play('track_3', 'Voice/track3.wav');

      const [res1, res2, res3] = await Promise.all([playPromise1, playPromise2, playPromise3]);

      // Verify return contracts
      assert.strictEqual(res1, false, 'Superseded track 1 play promise must resolve to false');
      assert.strictEqual(res2, false, 'Superseded track 2 play promise must resolve to false');
      assert.strictEqual(res3, true, 'Active track 3 play promise must resolve to true');

      // Verify final player state
      const finalState = player.getState();
      assert.strictEqual(finalState.isPlaying, true, 'Player must remain in isPlaying=true for track 3');
      assert.strictEqual(finalState.currentTrackId, 'track_3');
      assert.strictEqual(finalState.currentTrackUrl, 'Voice/track3.wav');

      // Verify no delayed AbortError from Track 1/2 corrupted state back to isPlaying=false
      await new Promise(r => setTimeout(r, 60));
      const stateAfterDelay = player.getState();
      assert.strictEqual(stateAfterDelay.isPlaying, true, 'State must NOT be corrupted after delayed AbortError');
      assert.strictEqual(stateAfterDelay.currentTrackId, 'track_3');
    });

    it('CH-AUD-02: Play promise returns false when trackUrl is empty, null, or non-string', async () => {
      const player = new AudioPlayerManager();

      const r1 = await player.play('', 'Voice/test.wav');
      assert.strictEqual(r1, false);

      const r2 = await player.play('track1', '');
      assert.strictEqual(r2, false);

      const r3 = await player.play(null, 'Voice/test.wav');
      assert.strictEqual(r3, false);

      const r4 = await player.play('track1', null);
      assert.strictEqual(r4, false);

      const r5 = await player.play(undefined, undefined);
      assert.strictEqual(r5, false);

      const state = player.getState();
      assert.strictEqual(state.isPlaying, false);
      assert.strictEqual(state.currentTrackId, null);
    });

    it('CH-AUD-03: Multiple rapid play calls on identical track ID toggle playback', async () => {
      const player = new AudioPlayerManager();
      
      const r1 = await player.play('same_track', 'Voice/same.wav');
      assert.strictEqual(r1, true);
      assert.strictEqual(player.getState().isPlaying, true);

      const r2 = await player.play('same_track', 'Voice/same.wav');
      assert.strictEqual(r2, false);
      assert.strictEqual(player.getState().isPlaying, false);
      assert.strictEqual(player.getState().currentTrackId, 'same_track');

      const r3 = await player.play('same_track', 'Voice/same.wav');
      assert.strictEqual(r3, true);
      assert.strictEqual(player.getState().isPlaying, true);
    });
  });

  // ==========================================================================
  // SECTION 2: Audio Player Disposal & Ghost Callback Detachment
  // ==========================================================================
  describe('2. Audio Player Disposal & Ghost Callback Prevention', async () => {
    const audioMod = await loadPublicModule('audioPlayer');
    const { AudioPlayerManager } = audioMod;

    it('CH-DISP-01: .stop() detaches all event handlers preventing ghost onerror / onpause callbacks', async () => {
      const player = new AudioPlayerManager();
      let ghostErrorFired = false;
      let ghostPauseFired = false;

      let capturedAudioInstance = null;

      class CustomAudio extends MockAudio {
        constructor(src) {
          super(src);
          capturedAudioInstance = this;
        }

        removeAttribute(attr) {
          super.removeAttribute?.(attr);
          if (attr === 'src') {
            // In some browsers, removing src triggers an error or pause event on the media element
            if (typeof this.onerror === 'function') {
              ghostErrorFired = true;
              this.onerror(new Error('Ghost media error on src detachment'));
            }
            if (typeof this.onpause === 'function') {
              ghostPauseFired = true;
              this.onpause();
            }
          }
        }
      }

      globalThis.Audio = CustomAudio;

      await player.play('track_disp', 'Voice/disp.wav');
      assert.ok(capturedAudioInstance !== null);

      // Stop player which triggers _disposeAudio()
      player.stop();

      assert.strictEqual(player.audioElement, null, 'audioElement reference must be cleared');
      assert.strictEqual(capturedAudioInstance.onplay, null, 'onplay handler must be detached');
      assert.strictEqual(capturedAudioInstance.onpause, null, 'onpause handler must be detached');
      assert.strictEqual(capturedAudioInstance.onerror, null, 'onerror handler must be detached');
      assert.strictEqual(capturedAudioInstance.onended, null, 'onended handler must be detached');
      assert.strictEqual(ghostErrorFired, false, 'Ghost onerror callback must NOT fire');
      assert.strictEqual(ghostPauseFired, false, 'Ghost onpause callback must NOT fire');
    });

    it('CH-DISP-02: Repeated calls to .stop() and .pause() on an already stopped player are idempotent', () => {
      const player = new AudioPlayerManager();
      assert.doesNotThrow(() => {
        player.stop();
        player.stop();
        player.pause();
        player.pause();
        player.stop();
      });
      const state = player.getState();
      assert.strictEqual(state.isPlaying, false);
      assert.strictEqual(state.currentTrackId, null);
      assert.strictEqual(state.currentTrackUrl, null);
    });
  });

  // ==========================================================================
  // SECTION 3: Audio Player State Snapshot & Subscriber Lifecycle
  // ==========================================================================
  describe('3. Audio Player State Snapshot & Subscription Lifecycle', async () => {
    const audioMod = await loadPublicModule('audioPlayer');
    const { AudioPlayerManager } = audioMod;

    it('CH-SUB-01: getState() returns an immutable snapshot', async () => {
      const player = new AudioPlayerManager();
      await player.play('snap_track', 'Voice/snap.wav');

      const snapshot1 = player.getState();
      snapshot1.isPlaying = false;
      snapshot1.currentTrackId = 'tampered';

      const snapshot2 = player.getState();
      assert.strictEqual(snapshot2.isPlaying, true, 'Internal player state must not be mutated by snapshot modification');
      assert.strictEqual(snapshot2.currentTrackId, 'snap_track');
    });

    it('CH-SUB-02: subscribe() returns working unsubscribe function and handles non-function gracefully', async () => {
      const player = new AudioPlayerManager();
      let callCount = 0;

      const unsubInvalid = player.subscribe('not_a_function');
      assert.strictEqual(typeof unsubInvalid, 'function');
      assert.doesNotThrow(() => unsubInvalid());

      const unsub = player.subscribe(() => {
        callCount++;
      });

      await player.play('sub_1', 'Voice/1.wav');
      assert.strictEqual(callCount, 1);

      unsub();
      await player.play('sub_2', 'Voice/2.wav');
      assert.strictEqual(callCount, 1, 'Unsubscribed listener must not receive further state notifications');
    });

    it('CH-SUB-03: Faulty subscriber throwing error does not prevent subsequent subscribers from receiving notification', async () => {
      const player = new AudioPlayerManager();
      let sub2Received = null;

      player.subscribe(() => {
        throw new Error('Subscriber 1 runtime crash');
      });

      player.subscribe((state) => {
        sub2Received = state;
      });

      await player.play('sub_iso', 'Voice/iso.wav');

      assert.notStrictEqual(sub2Received, null);
      assert.strictEqual(sub2Received.currentTrackId, 'sub_iso');
      assert.strictEqual(sub2Received.isPlaying, true);
    });
  });

  // ==========================================================================
  // SECTION 4: Scoped $wSafely Resolution & Error Isolation
  // ==========================================================================
  describe('4. Scoped $wSafely Resolution & Action Error Boundaries', async () => {
    const utils = await loadPublicModule('utils');
    const { $wSafely } = utils;

    it('CH-SAF-01: $wSafely resolves elements with global $w and scoped $item correctly', () => {
      canvasEngine.registerElement('#globalHeader', 'Text');
      const globalEl = $wSafely('#globalHeader');
      assert.ok(globalEl);
      assert.strictEqual(globalEl.id, 'globalHeader');

      const scopedStore = new Map();
      const mockItem = (sel) => {
        const id = sel.replace(/^#/, '');
        if (!scopedStore.has(id)) {
          scopedStore.set(id, { id, uniqueId: `item_${id}`, text: 'Repeater Item' });
        }
        return scopedStore.get(id);
      };

      const scopedEl = $wSafely('#itemTitle', (el) => {
        el.text = 'Updated Item';
      }, mockItem);

      assert.ok(scopedEl);
      assert.strictEqual(scopedEl.id, 'itemTitle');
      assert.strictEqual(scopedEl.text, 'Updated Item');
    });

    it('CH-SAF-02: $wSafely supports scope objects containing .$w query method', () => {
      const customScope = {
        $w: (sel) => ({ id: sel.replace(/^#/, ''), type: '$w.Box', isVisible: true })
      };

      const res = $wSafely('#scopedBox', null, customScope);
      assert.ok(res);
      assert.strictEqual(res.id, 'scopedBox');
    });

    it('CH-SAF-03: $wSafely returns null on missing elements, whitespace, and non-string selectors', () => {
      assert.strictEqual($wSafely('#nonExistentElement_999'), null);
      assert.strictEqual($wSafely(''), null);
      assert.strictEqual($wSafely('   '), null);
      assert.strictEqual($wSafely(null), null);
      assert.strictEqual($wSafely(undefined), null);
      assert.strictEqual($wSafely(12345), null);
      assert.strictEqual($wSafely({}), null);
    });

    it('CH-SAF-04: Action callback throwing exception is safely caught, logged via logStandard, and does not crash caller', () => {
      canvasEngine.registerElement('#actionCrashEl', 'Button');

      let returnedEl = null;
      assert.doesNotThrow(() => {
        returnedEl = $wSafely('#actionCrashEl', (el) => {
          throw new TypeError('Simulated property assignment error on undefined reference');
        });
      });

      assert.ok(returnedEl);
      assert.strictEqual(returnedEl.id, 'actionCrashEl');

      const errLogs = spy.getLogs('error');
      assert.ok(errLogs.length >= 1);
      const structuredMatch = assertStructuredLog(errLogs[0].message);
      assert.strictEqual(structuredMatch.component, '$wSafely');
      assert.strictEqual(structuredMatch.action, 'Action execution on "#actionCrashEl"');
      assert.ok(structuredMatch.cause.includes('Simulated property assignment error'));
    });
  });

  // ==========================================================================
  // SECTION 5: formatDateThai Buddhist Era & Edge Case Formatting
  // ==========================================================================
  describe('5. formatDateThai Buddhist Era & Edge Case Safety', async () => {
    const utils = await loadPublicModule('utils');
    const { formatDateThai } = utils;

    it('CH-DAT-01: Formats ISO date strings, Date objects, and numeric timestamps correctly to BE', () => {
      const r1 = formatDateThai('2026-08-16');
      assert.strictEqual(r1, '16 สิงหาคม 2569');

      const d = new Date(2026, 0, 1); // 1 Jan 2026
      const r2 = formatDateThai(d);
      assert.strictEqual(r2, '1 มกราคม 2569');

      const ts = new Date(2024, 11, 31).getTime(); // 31 Dec 2024
      const r3 = formatDateThai(ts);
      assert.strictEqual(r3, '31 ธันวาคม 2567');
    });

    it('CH-DAT-02: Formats with time string when includeTime=true', () => {
      const d = new Date(2026, 7, 16, 9, 5, 0); // 16 Aug 2026 09:05
      const res = formatDateThai(d, true);
      assert.strictEqual(res, '16 สิงหาคม 2569 เวลา 09:05 น.');
    });

    it('CH-DAT-03: Gracefully handles null, undefined, empty strings, and invalid dates without false BE 2513 dates', () => {
      assert.strictEqual(formatDateThai(null), 'ไม่ระบุวันที่');
      assert.strictEqual(formatDateThai(undefined), 'ไม่ระบุวันที่');
      assert.strictEqual(formatDateThai(''), 'ไม่ระบุวันที่');
      assert.strictEqual(formatDateThai('   '), 'ไม่ระบุวันที่');
      assert.strictEqual(formatDateThai('invalid-date-string'), 'ไม่ระบุวันที่');
      assert.strictEqual(formatDateThai(NaN), 'ไม่ระบุวันที่');
      assert.strictEqual(formatDateThai({}), 'ไม่ระบุวันที่');
      assert.strictEqual(formatDateThai([]), 'ไม่ระบุวันที่');
    });
  });

  // ==========================================================================
  // SECTION 6: debounce & throttle Stress & Cancellation
  // ==========================================================================
  describe('6. debounce & throttle High-Frequency Stress & Cancellation', async () => {
    const utils = await loadPublicModule('utils');
    const { debounce, throttle } = utils;

    it('CH-TIM-01: debounce forwards latest arguments, maintains context, and can be cancelled', async () => {
      let callCount = 0;
      let lastArgs = null;

      const debounced = debounce(function (...args) {
        callCount++;
        lastArgs = args;
      }, 40);

      debounced('arg1', 100);
      debounced('arg2', 200);
      debounced('final', 999);

      assert.strictEqual(callCount, 0);

      // Cancel before timer expires
      debounced.cancel();

      await new Promise(r => setTimeout(r, 60));
      assert.strictEqual(callCount, 0, 'Cancelled debounce must not fire');

      // Fire again and allow it to complete
      debounced('resumed', 42);
      await new Promise(r => setTimeout(r, 60));
      assert.strictEqual(callCount, 1);
      assert.deepStrictEqual(lastArgs, ['resumed', 42]);
    });

    it('CH-TIM-02: throttle executes leading call immediately, suppresses rapid calls, and supports .cancel()', async () => {
      let runCount = 0;
      const throttled = throttle(() => {
        runCount++;
      }, 50);

      throttled(); // Call 1 (leading - runs)
      throttled(); // Suppressed
      throttled(); // Suppressed
      assert.strictEqual(runCount, 1);

      // Cancel throttle lock
      throttled.cancel();

      // Immediately call again after cancel
      throttled(); // Call 2 (leading - runs immediately because lock was reset)
      assert.strictEqual(runCount, 2);
    });

    it('CH-TIM-03: debounce and throttle safely handle non-function inputs', () => {
      const dInvalid = debounce(null);
      assert.strictEqual(typeof dInvalid, 'function');
      assert.doesNotThrow(() => dInvalid());
      assert.doesNotThrow(() => dInvalid.cancel?.());

      const tInvalid = throttle(undefined);
      assert.strictEqual(typeof tInvalid, 'function');
      assert.doesNotThrow(() => tInvalid());
      assert.doesNotThrow(() => tInvalid.cancel?.());
    });
  });

  // ==========================================================================
  // SECTION 7: sanitizeInput XSS Neutralization & Length Clamping
  // ==========================================================================
  describe('7. sanitizeInput XSS Neutralization & Length Clamping', async () => {
    const utils = await loadPublicModule('utils');
    const { sanitizeInput } = utils;

    it('CH-SAN-01: Neutralizes nested HTML/XML/Script tags and retains safe content', () => {
      const payload1 = '<script type="text/javascript">alert(document.cookie);</script>DELTA SYNTH';
      assert.strictEqual(sanitizeInput(payload1), 'script type="text/javascript"alert(document.cookie);/scriptDELTA SYNTH');

      const payload2 = '<<SCRIPT>alert("nested");//<</SCRIPT>';
      const cleaned = sanitizeInput(payload2);
      assert.ok(!cleaned.includes('<'));
      assert.ok(!cleaned.includes('>'));
    });

    it('CH-SAN-02: Clamps length strictly according to custom and default maxLength', () => {
      const str100 = 'x'.repeat(100);
      assert.strictEqual(sanitizeInput(str100, 20).length, 20);
      assert.strictEqual(sanitizeInput(str100, 50).length, 50);

      const str2000 = 'y'.repeat(2000);
      assert.strictEqual(sanitizeInput(str2000).length, 1000, 'Default maxLength must be 1000');
    });

    it('CH-SAN-03: Handles non-string primitives, numbers, and falsy values safely', () => {
      assert.strictEqual(sanitizeInput(123456), '123456');
      assert.strictEqual(sanitizeInput(0), '0');
      assert.strictEqual(sanitizeInput(null), '');
      assert.strictEqual(sanitizeInput(undefined), '');
      assert.strictEqual(sanitizeInput(false), '');
      assert.strictEqual(sanitizeInput({}), '');
      assert.strictEqual(sanitizeInput([]), '');
    });
  });
});
