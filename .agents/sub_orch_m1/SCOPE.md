# Scope: Milestone M1 (Public Core & Audio Hardening)

## Architecture & Target Modules
Milestone M1 hardens and optimizes the public shared core layer of DELTA SYNTH in `src/public/`:
- `src/public/utils.js`: Universal defensive helpers (`$wSafely`, `debounce`, `throttle`, `formatDateThai`, `searchFilter`, `sanitizeInput`, `formatNumber`, `logStandard`).
- `src/public/audioPlayer.js`: Global singleton `AudioPlayerManager` / `globalAudioPlayer` with subscriber pattern.
- `src/public/voicebankData.js`: Authoritative in-memory catalog of 54 virtual vocalists, `getVoicebankById`, and `queryVoicebanks`.
- `src/public/toast.js`: Toast notification controller compliant with AGENT.md Section 9.
- `src/public/theme.js`: Design system tokens (colors, typography, toast geometry, animations).
- `src/public/wixPageTemplate.js`: Canonical page template demonstrating `$wSafely`, `logStandard`, and toast usage.

## Feature Inventory for M1
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Scoped Safe Element Access | Enhance `$wSafely(selector, action, scope)` supporting canvas and repeater `$item` contexts | M1 | Survey Explorer 1 & 3 |
| F2 | Zero Swallowed Exceptions | Eliminate empty catch blocks (`catch (_) {}`) in `utils.js`, `audioPlayer.js`, `toast.js` | M1 | Survey Explorer 1 & 2 |
| F3 | Structured Logging Format | Standardize structured logging across public modules using `logStandard` | M1 | Survey Explorer 1, 2, 3 |
| F4 | Toast Engine & Geometry | Validate and verify max 280x80px, bottom-right (16,20), 6px radius, and Leelawadee UI | M1 | Survey Explorer 1 & 3 |
| F5 | Toast Signature Fix | Fix toast invocation signature in `wixPageTemplate.js` | M1 | Survey Explorer 1 |
| F6 | Audio Player Stability | Play token tracking, event listener detachment on stop, safe disposal, and race condition prevention | M1 | Survey Explorer 3 |
| F7 | 54-Voicebank Catalog Caching | O(1) in-memory Map lookup for `getVoicebankById` and optimized query filtering | M1 | Survey Explorer 3 |

## Interface Contracts & Requirements
1. **`$wSafely(selector, action = null, scope = null)`**:
   - `selector`: string
   - `action`: optional function `(el) => void`
   - `scope`: optional function or object (e.g. `$item` in repeaters or custom context, defaults to `$w` if function, or global context)
   - Must safely return element or null without throwing exceptions.
2. **`logStandard(component, action, cause, suggestedAction, level = 'error')`**:
   - Format: `[Component] Action failed: <cause>. Suggested action: <next step>.`
3. **`globalAudioPlayer`**:
   - `play(trackId, trackUrl)`: Returns `Promise<boolean>`, uses play token tracking so stale aborted plays don't overwrite active playback state.
   - `stop()`: Detaches all event handlers (`onplay`, `onpause`, `onended`, `onerror`), pauses, clears `.src`, logs cleanup safely.
   - `subscribe(listener)`: Returns unsubscribe function.
4. **`voicebankData.js`**:
   - `VOICEBANKS`: Array of 54 voicebank items (must preserve all 54 items verbatim).
   - `getVoicebankById(id)`: O(1) lookup via `Map` index.
   - `queryVoicebanks(options)`: Efficient filtering by query, gender, engine, type.
5. **`toast.js` & `theme.js`**:
   - Max dimensions: 280x80px, bottom-right offset: (16, 20), border radius: 6px, fonts: Leelawadee UI / Kanit / Inter.
   - Helper functions: `showToast(options)`, `toastSuccess(msg, actionText)`, `toastError(msg, actionText)`, `toastWarning(msg, actionText)`, `toastInfo(msg, actionText)`.
6. **`wixPageTemplate.js`**:
   - Correct invocations: `toastSuccess('...')`, `toastError('...')`, or `showToast({ message: '...', type: '...' })`.
