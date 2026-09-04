# Handoff Report — Track 3: Public Core & Data Modules E2E Test Specification

**Agent:** Explorer 3 (Public Core & Data Track)  
**Recipient:** Parent Orchestrator (`07760b81-c1d6-4b54-8e7e-30cbedfe73f3`)  
**Working Directory:** `e:\Program Developing\DELTA_SYNTH-main\.agents\sub_orch_e2e_exp3`  
**Date:** 2026-08-16  

---

## 1. Observation

Direct examination of the DELTA SYNTH public codebase revealed the following exact structures and contracts:

1. **`src/public/utils.js`**:
   - Lines 19-34: `$wSafely(selector, action = null)` wraps `$w(selector)` inside a `try...catch` block. Returns element if found and executes `action(el)`; returns `null` on failure.
   - Lines 42-52 & 60-71: `debounce` (300ms default) and `throttle` (300ms default) timing utilities.
   - Lines 79-103: `formatDateThai(dateInput, includeTime = false)` adds 543 to the Gregorian year and uses an array of 12 Thai month names (`'มกราคม'` to `'ธันวาคม'`), returning `'ไม่ระบุวันที่'` on invalid input.
   - Lines 112-131: `searchFilter(items, query, keys)` performs multi-key case-insensitive search across string and string-array fields.
   - Lines 138-144: `sanitizeInput(text)` strips `/[<>]/g`, trims whitespace, and slices to 1000 characters.
   - Lines 151-154: `formatNumber(num)` uses `num.toLocaleString('th-TH')`, returning `'0'` for non-numbers.
   - Lines 164-176: `logStandard(component, action, cause = '', suggestedAction = '', level = 'info')` produces format `"[${component}] ${action} failed: ${cause}. Suggested action: ${suggestedAction}."` and routes to `console.error`, `console.warn`, or `console.log`.

2. **`src/public/toast.js` & `src/public/theme.js`**:
   - `src/public/theme.js` lines 41-48: `THEME.toast = { maxWidth: 280, maxHeight: 80, offsetRight: 16, offsetBottom: 20, borderRadius: 6, durationMs: 3500 }`.
   - `src/public/theme.js` lines 17-35: Theme colors `#CC2200` (Primary/Error), `#1A1A1A` (Dark), `#F0F0F0` (Light), `#00C853` (Success), `#FFD600` (Warning), `#00B0FF` (Info).
   - `src/public/toast.js` lines 27-104: `showToast` binds `#toastContainer`, `#toastMessage`, `#toastAction`, `#toastIcon`, handles action callbacks, auto-dismiss timeout, and falls back to `console.log` in non-DOM/SSR environments.
   - `src/public/toast.js` lines 128-151: Shorthands `toastSuccess`, `toastError` (duration 4500ms), `toastWarning`, `toastInfo`.

3. **`src/public/audioPlayer.js`**:
   - Lines 15-22: `AudioPlayerManager` state `{ currentTrackId: null, currentTrackUrl: null, isPlaying: false, audioElement: null, onStateChangeCallbacks: Set }`.
   - Lines 29-49: `subscribe` returns an unsubscribe closure; `notifyState` safely isolates subscriber callback exceptions with `try...catch` and logs via `logStandard`.
   - Lines 56-117: `play(trackId, trackUrl)` validates `trackUrl`, toggles pause if the same track is active, stops existing playback, instantiates `Audio` with volume 0.85, binds `onplay`, `onpause`, `onended`, `onerror`, catches autoplay promise rejections, and updates state.
   - Lines 122-146: `pause()` and `stop()` methods reset state and notify subscribers.

4. **`src/public/voicebankData.js`**:
   - Lines 11-1092: Exactly 54 virtual singer objects with 18 mandatory schema fields (`id`, `name`, `nameTh`, `gender`, `age`, `voicer`, `engine`, `type`, `genre`, `language`, `status`, `image`, `imageFull`, `audioSample`, `detailUrl`, `downloadUrl`, `description`, `tags`).
   - Lines 1099-1103: `getVoicebankById(id)` provides case-insensitive trimmed lookup.
   - Lines 1114-1129: `queryVoicebanks({ gender, engine, type, query })` provides multi-criteria filtering.

5. **`src/public/projectData.js`**:
   - Contains `PROJECTS` (3 items), `MUSIC_FILES` (5 items: USTX, SVP, MIDI, VSQX), `EVENTS` (2 items), `BETA_VOICEBANKS` (3 items), `CHANGELOGS` (3 items).

6. **`src/public/wixPageTemplate.js`**:
   - Lines 68 & 71 show legacy string signatures `showToast('ดำเนินการสำเร็จ', 'success')` which require correction to `showToast({ message: '...', type: '...' })` or `toastSuccess('...')`.

---

## 2. Logic Chain

1. **Defensive Utility Hardening**:
   - In Wix Velo, canvas elements may not exist on all page states or inside repeater templates.
   - Therefore, `$wSafely` must safely catch missing DOM exceptions and support both root `$w` and scoped `$item` functions.
   - Logging must strictly match AGENT.md Section 11 to allow automated error parsing across frontend and backend.

2. **Security & Input Sanitization**:
   - User inputs in search bars, contact forms, and beta registrations can carry malicious HTML or extreme length payloads.
   - `sanitizeInput` must strip all `<` and `>` characters and clamp length to 1000 chars before passing queries to `queryVoicebanks` or backend endpoints.

3. **Audio Player State Integrity**:
   - Fast UI interactions (rapid track clicking, switching between singers) can lead to race conditions or orphaned audio instances.
   - The singleton `AudioPlayerManager` must halt previous audio instances, clear `src`, reset volume, and isolate subscriber callbacks so a bug in one component listener cannot break global playback.

4. **Bilingual Data Integrity**:
   - The 54-voicebank catalog and project catalogs contain rich bilingual metadata (Thai and English).
   - Date conversions must cleanly render Buddhist Era (+543 years) and Thai month names without locale corruption.

5. **4-Tier Test Coverage**:
   - By enumerating 48 explicit test cases across Tier 1 (Feature Coverage), Tier 2 (Boundary & Corner Cases), Tier 3 (Cross-Feature Combinations), and Tier 4 (Real-World Scenarios), the test harness can guarantee zero regressions and strict AGENT.md compliance.

---

## 3. Caveats

1. **Mock Environment for Wix Velo**: Wix Velo runtime globals (`$w`, `$item`, canvas animations) do not run natively in Node.js; the test runner must use lightweight test helper mocks (`tests/test-helpers.js`).
2. **Web Audio / HTML5 Audio in Node**: Node.js does not provide a native `Audio` object; a mock `Audio` class simulating `play()`, `pause()`, `onplay`, `onerror`, and autoplay promise rejection must be configured in `tests/test-helpers.js`.
3. **Backend & Page Scripts**: Backend JSW services and Page scripts are outside the direct scope of this Track 3 Public Core report and are covered by Tracks 1 and 2.

---

## 4. Conclusion

The Public Core layer of DELTA SYNTH is architecturally sound and conforms closely to AGENT.md standards. A comprehensive 4-Tier test suite specification has been produced in `report.md`, detailing:
- **Tier 1 (Feature Coverage)**: 36 test cases covering all individual utility functions, toast engine, audio singleton, 54-singer catalog schema, and project datasets.
- **Tier 2 (Boundary & Corner Cases)**: 12 test cases covering malformed selectors, throw-in-action errors, XSS vectors, 1000-char clamping, rapid audio track switching, subscriber error isolation, and prototype pollution defense.
- **Tier 3 (Cross-Feature Combinations)**: 5 end-to-end integration scenarios verifying audio-toast interactions, catalog filter-to-preview pipelines, theme token consistency, and repeater scoped lookups.
- **Tier 4 (Real-World Scenarios)**: 4 full user journeys covering catalog search/filtering/playback, music file downloads with Thai date formatting, debounced beta feedback submission, and audio playback error recovery.

---

## 5. Verification Method

To independently verify this specification and its underlying public modules:

1. **Inspect Report Artifact**:
   - Read `e:\Program Developing\DELTA_SYNTH-main\.agents\sub_orch_e2e_exp3\report.md`
2. **Validate Public Source Files**:
   - `src/public/utils.js`
   - `src/public/audioPlayer.js`
   - `src/public/toast.js`
   - `src/public/theme.js`
   - `src/public/voicebankData.js`
   - `src/public/projectData.js`
3. **Automated Test Execution** (once test harness is generated in M4):
   - Command: `node --test tests/tier1-feature-coverage.test.js tests/tier2-boundary-corner.test.js tests/tier3-cross-feature.test.js tests/tier4-real-world-workloads.test.js`
   - Invalidation Condition: Any test assertion failure, uncaught exception in `$wSafely`, missing voicebank in the 54-catalog, or departure from AGENT.md toast geometry / logging formats.
