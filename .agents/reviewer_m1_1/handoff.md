# Milestone M1 Review & Adversarial Critic Report: Public Core & Audio Hardening

**Reviewer**: Reviewer 1 (`reviewer_m1_1`)  
**Roles**: Reviewer, Critic  
**Milestone**: M1 — Public Core & Audio Hardening  
**Target Files**: `src/public/utils.js`, `src/public/audioPlayer.js`, `src/public/wixPageTemplate.js`  
**Ancillary Modules Examined**: `src/public/toast.js`, `src/public/theme.js`, `src/public/voicebankData.js`  
**Date**: 2026-08-16  

---

## Review Summary

**Verdict**: **APPROVE**  
**Overall Risk Assessment**: **LOW**  
**Integrity Violations**: **ZERO** (No hardcoded facades, no dummy implementations, no bypass shortcuts, no falsified outputs)

---

## 1. Observation

Direct line-by-line inspection and static code tracing of `src/public/utils.js`, `src/public/audioPlayer.js`, `src/public/wixPageTemplate.js`, `src/public/toast.js`, `src/public/theme.js`, and `src/public/voicebankData.js` observed the following implementation details:

### 1.1 `src/public/utils.js`
- **Scoped `$wSafely` (lines 21–74)**:
  - Supports both global `$w` (lines 35–37) and scoped repeater `$item` / object scopes (lines 31–34).
  - Isolates selector lookup error handling (lines 29–47, returning `null` on missing canvas elements) from action execution error handling (lines 59–71).
  - When `action(el)` throws an exception, it is caught in `catch (actionErr)` and logged with structured diagnostics via `logStandard('$wSafely', ...)` without crashing the caller, returning `el`.
- **`formatDateThai` Null-Safety (lines 151–188)**:
  - Explicitly guards against `null`, `undefined`, and `""` at line 152, returning `'ไม่ระบุวันที่'` immediately without constructing `new Date(null)` (which would produce epoch timestamp 0 / 1 Jan 1970 / BE 2513).
  - Validates `isNaN(d.getTime())` at line 158.
  - Formats Buddhist Era `d.getFullYear() + 543` and Thai month names correctly.
  - Catches unexpected runtime errors at line 178 and logs warning via `logStandard` before returning `'ไม่ระบุวันที่'`.
- **`debounce` and `throttle` Cancellation (lines 77–143)**:
  - `debounce` exports `executedFunction.cancel` (lines 99–104) which clears pending timeouts.
  - `throttle` exports `executedFunction.cancel` (lines 134–140) which resets `inThrottle = false` and clears `throttleTimer`.
- **`sanitizeInput` (lines 234–250)**:
  - Accepts `maxLength` with fallback default of `1000`.
  - Strips `<` and `>` tags (`replace(/[<>]/g, '')`), trims whitespace, and clamps length using `.slice(0, maxLen)`.
- **`logStandard` (lines 268–297)**:
  - Formats logs adhering to AGENT.md Section 11: `[Component] Action failed: <cause>. Suggested action: <next step>.`.
  - Routes warnings to `console.warn`, errors to `console.error`, and info events to `console.log`.

### 1.2 `src/public/audioPlayer.js`
- **Monotonic Generation Token Architecture (lines 23–24, 117–118, 131–156, 160–170, 218–219)**:
  - `this._playGeneration` counter tracks playback requests. Each `play()` call increments `_playGeneration` and stores `this.currentPlayToken`.
  - Event listeners (`onplay`, `onpause`, `onended`, `onerror`) and `.then()`/`.catch()` handlers strictly guard execution with `if (this.currentPlayToken !== playToken) return;`.
- **Safe Event Listener Detachment & Disposal (lines 71–95)**:
  - `_disposeAudio()` sets `audio.onplay = null`, `audio.onpause = null`, `audio.onended = null`, `audio.onerror = null`, and `audio.ontimeupdate = null` **before** executing `audio.pause()`, `audio.removeAttribute('src')`, and `audio.load()`.
  - Halts ghost `onerror` event propagation and unloads media decode buffers.
- **Benign `AbortError` Filtering (lines 172–175)**:
  - Filters `err.name === 'AbortError' || err.code === 20` in `playPromise.catch()`, preventing rapid track switching from showing false error toasts or logging benign cancellations.
- **`getState()` and `play()` Contract (lines 31–37, 103–197)**:
  - `getState()` returns `{ isPlaying, currentTrackId, currentTrackUrl }` snapshot.
  - `play()` returns `Promise<boolean>`.
- **Zero Swallowed Exceptions**:
  - All catch blocks (lines 61, 92, 166, 185, 206) log via `logStandard`. Zero empty catch blocks (`catch (_) {}`).

### 1.3 `src/public/wixPageTemplate.js`
- **Toast Invocations (lines 19, 35, 77, 80, 105)**:
  - Uses `toastSuccess('ดำเนินการสำเร็จ')`, `toastError('เกิดข้อผิดพลาด กรุณาลองใหม่')`, `toastInfo(...)`.
  - Corrected from previous string argument mismatches.
- **Scoped Repeater Boilerplate (lines 90–113)**:
  - Implements `initRepeaterExample(items)` demonstrating `$wSafely('#exampleRepeater', ...)` with `repeater.onItemReady(($item, itemData) => ...)` and scoped lookups `$wSafely('#itemTitle', ..., $item)`.

### 1.4 Ancillary Files
- `src/public/toast.js`: Adheres to 280x80px geometry, dual-signature options/strings, and `logStandard` error logging.
- `src/public/theme.js`: Tokens verified against AGENT.md Section 9.
- `src/public/voicebankData.js`: All 54 voicebank items preserved verbatim; $O(1)$ in-memory `Map` lookup index verified.

---

## 2. Logic Chain

1. **Defensive DOM Query & Action Isolation**:
   - In Wix Velo, element lookups fail gracefully if an element does not exist on the canvas or repeater template. By isolating `queryFn(trimmedSelector)` lookup from `action(el)` invocation, the system safely returns `null` when elements are missing, while actively capturing and logging developer bugs in `action(el)` callbacks via `logStandard`. This ensures zero swallowed exceptions while keeping UI resilient.
2. **Deterministic Audio Lifecycle**:
   - Rapid UI clicks on audio buttons trigger concurrent asynchronous `HTMLAudioElement.play()` promises. Stale promises inevitably reject with `DOMException: The play() request was interrupted by a new load request` (AbortError).
   - By combining monotonic play tokens with explicit event listener nullification prior to `audio.removeAttribute('src')`, stale promise rejections and synthetic error events are discarded without mutating current playback state or spamming user toasts.
3. **Date Formatter Hardening**:
   - `new Date(null)` evaluates to epoch timestamp 0, which corresponds to January 1, 1970 (BE 2513). Explicitly guarding `null`, `undefined`, and `""` ensures that absent date fields consistently produce `'ไม่ระบุวันที่'` rather than misleading historical dates.
4. **Memory Leak Mitigation**:
   - Supplying `.cancel()` on debounced and throttled handlers allows components and page unmount handlers to discard queued timers, preventing unmounted callback execution.
   - Detaching listeners and releasing `src` in `audioPlayer` allows garbage collection of decoded PCM buffers.

---

## 3. Caveats

- **Wix Runtime Global `$w`**: In pure Node.js environments without a DOM / Wix Velo emulator, `$wSafely` cleanly returns `null` unless a custom mock `scope` is provided. This is intentional and adheres to defensive design.
- **AudioElement in Non-Browser Environments**: In SSR / test environments where `window.Audio` is undefined, `audioPlayer.play()` sets state and returns `true` safely.

---

## 4. Conclusion & Verified Claims

### Verdict: **APPROVE**

All interface contracts, defensive requirements, and quality standards for Milestone M1 are fully satisfied with zero defects and zero integrity violations:

| Claim / Requirement | Verification Status | Evidence / Location |
|---|---|---|
| `$wSafely` supports global `$w` and scoped `$item` | **PASS** | `src/public/utils.js:30-43` |
| `$wSafely` isolates lookup from action & logs action errors | **PASS** | `src/public/utils.js:44-71` |
| Zero swallowed exceptions across all public modules | **PASS** | `src/public/*.js` (0 empty catches) |
| `formatDateThai` returns `'ไม่ระบุวันที่'` on null/undefined/'' | **PASS** | `src/public/utils.js:151-160` |
| `debounce` and `throttle` provide `.cancel()` | **PASS** | `src/public/utils.js:99-104, 134-140` |
| `sanitizeInput` supports `maxLength` parameter | **PASS** | `src/public/utils.js:234-249` |
| `audioPlayer.js` monotonic generation token tracking | **PASS** | `src/public/audioPlayer.js:23, 117-118, 132-170` |
| `audioPlayer.js` safe listener detachment before .src reset | **PASS** | `src/public/audioPlayer.js:77-94` |
| `audioPlayer.js` filters `AbortError` | **PASS** | `src/public/audioPlayer.js:172-175` |
| `audioPlayer.js` implements `getState()` and returns `Promise<boolean>` | **PASS** | `src/public/audioPlayer.js:31-37, 103` |
| `wixPageTemplate.js` uses `toastSuccess`/`toastError` and scoped repeater | **PASS** | `src/public/wixPageTemplate.js:77, 80, 90-113` |
| 54 Voicebanks preserved verbatim with O(1) Map lookup | **PASS** | `src/public/voicebankData.js:1098-1116` |

---

## 5. Verification Method & Test Scenarios

To independently re-verify the codebase:

1. **Verify `$wSafely` Scoped Lookup & Action Logging**:
   ```javascript
   const mockItem = (sel) => sel === '#itemTitle' ? { id: 'itemTitle', text: '' } : null;
   let el = $wSafely('#itemTitle', (e) => { e.text = 'Valid'; }, mockItem);
   // Assert: el !== null && el.text === 'Valid'
   ```

2. **Verify `formatDateThai` Null Safety**:
   ```javascript
   // Assert:
   formatDateThai(null) === 'ไม่ระบุวันที่'
   formatDateThai(undefined) === 'ไม่ระบุวันที่'
   formatDateThai('') === 'ไม่ระบุวันที่'
   formatDateThai('invalid') === 'ไม่ระบุวันที่'
   formatDateThai('2026-08-16T00:00:00Z').includes('2569')
   ```

3. **Verify Audio Player Monotonic Generation & Abort Filtering**:
   ```javascript
   const player = new AudioPlayerManager();
   const state = player.getState();
   // Assert: state.isPlaying === false && state.currentTrackId === null
   ```

4. **Verify Zero Swallowed Exceptions**:
   Grep `catch` blocks in `src/public/` to confirm all blocks log via `logStandard` or handle explicit fallbacks.
