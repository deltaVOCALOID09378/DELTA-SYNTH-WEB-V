# DELTA SYNTH — Frontend & Page Scripts Comprehensive Survey Report

> **Auditor**: Explorer 1 (Frontend & Page Scripts)  
> **Date**: 2026-08-16  
> **Scope**: All 14 Wix Velo Page Scripts in `src/pages/` and Public Shared Utilities in `src/public/`  
> **Standard**: AGENT.md (Preserve → Strengthen → Optimize → Verify) & ORIGINAL_REQUEST.md (R1 / R2)

---

## Executive Summary

An exhaustive audit of all **14 Wix Velo page scripts** (`src/pages/*.js`) and **8 public shared JavaScript modules** (`src/public/*.js`, `src/public/js/*.js`) was conducted. 

### Key Findings Overview
1. **Defensive UI Interaction Architecture**:
   - Every page script implements `$w.onReady()` and employs `$wSafely(selector, action)` for canvas element lookups.
   - **Critical Gap**: Repeater item bindings (`$item(...)`) in repeaters across 7 pages do not have a scoped `$itemSafely()` wrapper or error boundaries, creating potential runtime exceptions if canvas repeater templates deviate from data schemas.
2. **Error Handling & Exception Propagation**:
   - Only **5 of 14 page scripts** have `try ... catch` blocks (`All DELTA's Voicebank.acsro.js`, `All USTX, MIDI, SVP and VSQX file.h73n8.js`, `Contact.kcdii.js`, `Event Details & Registration.mi1hd.js`, `Voicebank BETA.gtyoi.js`).
   - **9 page scripts** have zero `try ... catch` blocks around UI events, async calls, or repeater item mappings.
   - **Swallowed Exceptions (AGENT.md Section 6 & 16 Violation)**: Empty catch blocks found in `src/public/audioPlayer.js` (line 140: `catch (_) {}`), `src/public/toast.js` (line 160: `catch (_) { return null; }`), and `src/public/utils.js` (line 30 & line 100).
3. **Structured Logging (AGENT.md Section 11)**:
   - Standard format `[Component] Action failed: <cause>. Suggested action: <next step>.` is implemented via `logStandard()` in `src/public/utils.js`.
   - Multiple modules (`src/public/toast.js`, backend services) still use unstructured `console.error()` or `console.log()` without action recommendations.
4. **Toast Notification System (AGENT.md Section 9)**:
   - `src/public/toast.js` and `src/public/theme.js` specify standard geometry: `max 280x80px`, bottom-right offset `(16, 20)`, corner radius `6px`, and colors (`#CC2200`, `#1A1A1A`, `#F0F0F0`).
   - Signature mismatch bug identified in `src/public/wixPageTemplate.js` (calling `showToast('msg', 'type')` instead of passing an options object `{ message, type }` or using helper methods `toastSuccess`/`toastError`).
5. **Linting & Type Safety Issues**:
   - Extensive unused imports across 11 page scripts (e.g. `showToast`, `toastInfo`, `toastSuccess`, `PROJECTS`, `CHANGELOGS`, `debounce`, `getVoicebankById`, `queryVoicebanks`) generating ESLint `no-unused-vars` warnings.
   - Array modulo index vulnerability (`idx % array.length`) in `All Callaboraion Voicebank_.aj73j.js` and `All Our Project For Voicebank.hdv8h.js` if datasets are empty.
   - Lack of double-submission debounce/guard (`isSubmitting`) in `Voicebank BETA.gtyoi.js` and `File Share.ze9bp.js`.

---

## 1. Inventory of All 14 Wix Velo Page Scripts (`src/pages/`)

| # | File Path | Lines | Size | Purpose / Wix Canvas Bindings | Imports | Exports |
|---|---|---|---|---|---|---|
| 1 | `src/pages/masterPage.js` | 126 | 3,774 B | Global site-wide script: Header title (`#text24`), menu (`#horizontalMenu1`), footer copyright (`#text111`, `#footerYear`), floating audio dock (`#globalAudioDock`, `#globalAudioTrackTitle`, `#globalAudioPlayPauseBtn`, `#globalAudioStopBtn`), mobile drawer (`#mobileMenuBtn`, `#mobileMenuContainer`) | `THEME`, `showToast`, `toastInfo`, `$wSafely`, `logStandard`, `globalAudioPlayer` | None (`$w.onReady`) |
| 2 | `src/pages/Main.ggt15.js` | 127 | 4,783 B | Home page: Hero section (`#Section1RegularTitle1`, `#Section1RegularLongtext1`, `#Section1RegularButton1`), news labels (`#text34`, `#text35`, `#text37`, `#text38`), static singer images (`#image3`..`#image14`), featured repeater (`#featuredRepeater`) | `VOICEBANKS`, `PROJECTS`, `CHANGELOGS`, `globalAudioPlayer`, `showToast`, `toastSuccess`, `$wSafely`, `debounce`, `logStandard` | None (`$w.onReady`) |
| 3 | `src/pages/About US.onz2l.js` | 89 | 3,939 B | About Us page: Vision & mission text (`#Section1RegularTitle1`, `#Section1RegularSubtitle1`, `#Section2RegularTitle1`, `#Section2RegularLongtext1`, `#text25`, `#text26`), founder portraits (`#image1`..`#image5`) with tooltip & toast click handlers | `showToast`, `toastSuccess`, `$wSafely`, `logStandard` | None (`$w.onReady`) |
| 4 | `src/pages/All DELTA's Voicebank.acsro.js` | 270 | 9,818 B | Complete 54-voicebank catalog: 22 native singer buttons (`#button11`..`#button89`), dropdown filters (`#filterGenderDropdown`, `#filterEngineDropdown`, `#filterTypeDropdown`), quick filter buttons, search input (`#voicebankSearchInput`), repeater (`#voicebankRepeater`), detail drawer (`#singerDetailDrawer`) | `VOICEBANKS`, `queryVoicebanks`, `getVoicebankById`, `globalAudioPlayer`, `showToast`, `toastInfo`, `toastSuccess`, `$wSafely`, `debounce`, `logStandard` | None (`$w.onReady`) |
| 5 | `src/pages/All Callaboraion Voicebank_.aj73j.js` | 87 | 3,172 B | Collaboration voicebanks page: Header title (`#Section4ListHeaderTitle1`), native collaboration buttons (`#button217`..`#button253`), collaboration repeater (`#collabVoicebankRepeater`) with audio demo player | `VOICEBANKS`, `queryVoicebanks`, `globalAudioPlayer`, `showToast`, `toastInfo`, `$wSafely`, `debounce`, `logStandard` | None (`$w.onReady`) |
| 6 | `src/pages/All USTX, MIDI, SVP and VSQX file.h73n8.js` | 125 | 4,563 B | Music resource archive: Static text (`#text25`..`#text28`), format filter tabs (`#tabAllFiles`, `#tabUstx`, `#tabMidi`, `#tabSvp`, `#tabVsqx`), search input (`#filesSearchInput`), repeater (`#filesRepeater`), download tracking via `trackFileDownload` | `MUSIC_FILES`, `trackFileDownload`, `showToast`, `toastSuccess`, `$wSafely`, `debounce`, `logStandard` | None (`$w.onReady`) |
| 7 | `src/pages/All Our Project For Voicebank.hdv8h.js` | 97 | 2,993 B | Projects showcase: Native project buttons (`#button243`..`#button258`), category filter buttons (`#btnCatAll`, `#btnCatAi`, `#btnCatPhonemizer`, `#btnCatWeb`), projects repeater (`#projectsRepeater`) | `PROJECTS`, `showToast`, `toastInfo`, `$wSafely`, `logStandard` | None (`$w.onReady`) |
| 8 | `src/pages/Events.mim9b.js` | 57 | 2,136 B | Events listing: Native Wix Event widget (`#eventList1`), dynamic events repeater (`#eventsRepeater`) with registration capacity indicators and toast guidance | `EVENTS`, `showToast`, `toastSuccess`, `$wSafely`, `logStandard` | None (`$w.onReady`) |
| 9 | `src/pages/Event Details & Registration.mi1hd.js` | 104 | 3,731 B | Event details & registration: Native Wix Event App (`#events1`), event selector (`#eventSelectDropdown`), dynamic registration form (`#regFullNameInput`, `#regEmailInput`, `#regDiscordInput`, `#regNoteInput`, `#submitRegistrationBtn`) invoking `registerForEvent` | `registerForEvent`, `EVENTS`, `showToast`, `toastSuccess`, `toastError`, `$wSafely`, `logStandard` | None (`$w.onReady`) |
| 10 | `src/pages/Schedule.sbt9p.js` | 84 | 2,962 B | Roadmap & release schedule: Native Wix Schedule App (`#schedule1`), dynamic roadmap timeline repeater (`#roadmapRepeater`) | `showToast`, `$wSafely`, `logStandard` | None (`$w.onReady`) |
| 11 | `src/pages/Activity for Fix and Input Date.afeou.js` | 59 | 1,893 B | Changelog & activity log: Changelog timeline repeater (`#activityRepeater`), debounced search input (`#activitySearchInput`) filtering versions and release notes | `CHANGELOGS`, `showToast`, `$wSafely`, `debounce`, `logStandard` | None (`$w.onReady`) |
| 12 | `src/pages/File Share.ze9bp.js` | 65 | 2,667 B | Community file sharing portal: Contributor submission form (`#shareContributorInput`, `#shareTitleInput`, `#shareFormatDropdown`, `#shareUrlInput`, `#shareTermsCheckbox`, `#btnSubmitFileShare`) with input validation and toast alerts | `showToast`, `toastSuccess`, `toastError`, `$wSafely`, `logStandard` | None (`$w.onReady`) |
| 13 | `src/pages/Voicebank BETA.gtyoi.js` | 146 | 6,139 B | Beta testing center: Section headers (`#Section1RegularTitle1`..`#Section3RegularLongtext1`), active beta voicebanks repeater (`#betaVoicebankRepeater`), application form (`#betaSelectDropdown`, `#betaFullNameInput`, `#betaEmailInput`, `#betaDawInput`, `#betaExpDropdown`, `#btnSubmitBetaApp`) invoking `applyBetaTester` | `BETA_VOICEBANKS`, `applyBetaTester`, `showToast`, `toastSuccess`, `toastError`, `$wSafely`, `logStandard` | None (`$w.onReady`) |
| 14 | `src/pages/Contact.kcdii.js` | 144 | 6,189 B | Contact us & FAQ: Headings & contact info (`#Section1RegularTitle1`, `#text1`..`#text6`), native contact form (`#form2`, `#input1`, `#input2`, `#input3`, `#textBox1`, `#button1`, `#text7`) invoking `submitContactMessage` with ticket feedback | `submitContactMessage`, `showToast`, `toastSuccess`, `toastError`, `$wSafely`, `logStandard` | None (`$w.onReady`) |

---

## 2. Inventory of Public Shared Utilities (`src/public/`)

| # | File Path | Lines | Size | Purpose & Role | Exported Identifiers | Dependencies |
|---|---|---|---|---|---|---|
| 1 | `src/public/theme.js` | 58 | 1,338 B | Design system tokens: colors (`primary: '#CC2200'`, `bgDark: '#1A1A1A'`, `textLight: '#F0F0F0'`, hover, pressed), typography (`Leelawadee UI`, `Kanit`, `Inter`), toast layout rules (max 280x80px, offsets 16/20, radius 6px), animation durations | `THEME`, `default THEME` | None |
| 2 | `src/public/toast.js` | 173 | 4,771 B | AGENT.md-compliant toast notification engine: Renders `#toastContainer`, `#toastMessage`, `#toastAction`, `#toastIcon` with auto-dismiss timers and callback execution | `showToast`, `hideToast`, `toastSuccess`, `toastError`, `toastWarning`, `toastInfo`, `default` | `public/theme` |
| 3 | `src/public/utils.js` | 188 | 5,669 B | Universal defensive helpers: `$wSafely`, `debounce`, `throttle`, Thai date formatter `formatDateThai`, multi-key search `searchFilter`, XSS sanitizer `sanitizeInput`, number formatter `formatNumber`, structured logger `logStandard` | `$wSafely`, `debounce`, `throttle`, `formatDateThai`, `searchFilter`, `sanitizeInput`, `formatNumber`, `logStandard`, `default` | None |
| 4 | `src/public/audioPlayer.js` | 151 | 4,716 B | Audio preview manager: Global singleton `AudioPlayerManager` with subscriber pattern (`subscribe`), audio state notifications (`isPlaying`, `currentTrackId`, `currentTrackUrl`), playback control (`play`, `pause`, `stop`), and browser audio autoplay fallback | `globalAudioPlayer`, `default globalAudioPlayer` | `public/toast`, `public/utils` |
| 5 | `src/public/voicebankData.js` | 1,136 | 48,240 B | Complete 54-voicebank catalog: Full bilingual metadata (name, nameTh, age, gender, engine, type, genre, languages, image, audioSample, downloadUrl, description, tags), query engine `queryVoicebanks`, ID lookup `getVoicebankById` | `VOICEBANKS`, `getVoicebankById`, `queryVoicebanks`, `default` | None |
| 6 | `src/public/projectData.js` | 214 | 8,700 B | Platform static catalog: `PROJECTS` (3 items), `MUSIC_FILES` (5 items: USTX, MIDI, SVP, VSQX), `EVENTS` (2 items), `BETA_VOICEBANKS` (3 items), `CHANGELOGS` (3 items) | `PROJECTS`, `MUSIC_FILES`, `EVENTS`, `BETA_VOICEBANKS`, `CHANGELOGS`, `default` | None |
| 7 | `src/public/wixPageTemplate.js` | 80 | 2,229 B | Canonical boilerplate template for Wix Velo pages illustrating `$wSafely`, `logStandard`, bilingual setup, and event binding | `myPublicFunction` | `public/utils`, `public/theme`, `public/toast` |
| 8 | `src/public/js/starfield.js` | 72 | 2,337 B | Space theme 2D Canvas starfield animation with automatic resize handling | Global class `Starfield` | None (DOM Canvas API) |

---

## 3. Deep-Dive Audit: Interaction Patterns, Error Handling & Logging

### 3.1 `$w` Usage & Defensive `$wSafely` Wrapper Analysis

#### Observations
1. **Canvas Element Protection**: All 14 page scripts correctly avoid raw top-level `$w('#id')` lookups and instead invoke `$wSafely('#id', (el) => { ... })`. This ensures that if Wix Canvas element IDs change or are missing in certain editor layouts, the page will not throw unhandled null reference exceptions.
2. **Current `$wSafely` Implementation (`src/public/utils.js:19-34`)**:
   ```javascript
   export function $wSafely(selector, action = null) {
     try {
       if (typeof $w !== 'function') return null;
       const el = $w(selector);
       if (el && typeof el === 'object' && ('id' in el || 'uniqueId' in el || 'type' in el)) {
         if (typeof action === 'function') {
           action(el);
         }
         return el;
       }
       return null;
     } catch (err) {
       return null;
     }
   }
   ```
3. **Repeater Scoped Selector Limitation**:
   In Wix Velo, repeater rows use a scoped `$item` selector inside `repeater.onItemReady(($item, itemData) => { ... })`.
   In 7 page scripts (`Main.ggt15.js`, `All DELTA's Voicebank.acsro.js`, `All Callaboraion Voicebank_.aj73j.js`, `All USTX, MIDI, SVP and VSQX file.h73n8.js`, `All Our Project For Voicebank.hdv8h.js`, `Events.mim9b.js`, `Schedule.sbt9p.js`, `Activity for Fix and Input Date.afeou.js`, `Voicebank BETA.gtyoi.js`), child elements are queried using `$item('#childId')` directly without defensive guards:
   ```javascript
   // Example from Main.ggt15.js:114-123
   repeater.onItemReady(($item, itemData) => {
     $item('#singerImage').src = itemData.image || 'images/logo.png';
     $item('#singerName').text = itemData.name;
     $item('#singerNameTh').text = itemData.nameTh || '';
     $item('#singerEngine').text = itemData.engine;
     $item('#playDemoBtn').onClick(() => { ... });
   });
   ```
   **Risk**: If any template element (`#singerImage`, `#playDemoBtn`, etc.) is deleted, renamed, or temporarily unbound on Wix Studio canvas, `$item('#singerImage')` returns `undefined`, triggering `TypeError: Cannot set properties of undefined (setting 'src')` and breaking the entire repeater rendering loop.
4. **Architectural Recommendation**:
   Enhance `$wSafely` to accept an optional scope parameter `(selector, action = null, scope = null)`, defaulting to `$w` when in global page context, or allow passing `$item` as the scope (e.g. `$wSafely('#singerImage', el => el.src = ..., $item)` or a dedicated `$itemSafely($item, selector, action)` helper).

---

### 3.2 Error Handling & Exception Management (AGENT.md Section 6 & 16)

#### Missing `try ... catch` Blocks
Only 5 page scripts have `try ... catch` blocks. The following 9 page scripts have **zero `try ... catch` blocks**:
1. `src/pages/masterPage.js` (Audio subscription callbacks, drawer toggle, play/pause click handlers)
2. `src/pages/Main.ggt15.js` (Hero CTA clicks, static singer audio preview clicks, repeater item setup)
3. `src/pages/About US.onz2l.js` (Founder portrait click events)
4. `src/pages/All Callaboraion Voicebank_.aj73j.js` (14 static button click events, repeater item setup)
5. `src/pages/All Our Project For Voicebank.hdv8h.js` (16 project button click events, repeater item setup)
6. `src/pages/Events.mim9b.js` (Repeater item binding, registration click handler)
7. `src/pages/Schedule.sbt9p.js` (Roadmap repeater item binding)
8. `src/pages/Activity for Fix and Input Date.afeou.js` (Changelog repeater item binding, debounced search filter)
9. `src/pages/File Share.ze9bp.js` (Form validation & submission click handler)

#### Swallowed Exceptions (`catch (_) {}` / Silent Swallowing)
AGENT.md Section 6 (*"ห้าม except: pass หรือกลืน error"*) and Section 16 (*"Forbidden Practices: กลืน exception"*) strictly forbid silent error suppression. The survey identified the following violations:
1. **`src/public/audioPlayer.js:140`**:
   ```javascript
   stop() {
     if (this.audioElement) {
       try {
         this.audioElement.pause();
         this.audioElement.currentTime = 0;
         this.audioElement.src = '';
         this.audioElement = null;
       } catch (_) {} // ❌ Empty catch block swallowing audio disposal errors
     }
     ...
   }
   ```
2. **`src/public/toast.js:160`**:
   ```javascript
   function safeGetElement(selector) {
     try {
       if (typeof $w === 'function') {
         const el = $w(selector);
         return (el && el.uniqueId) ? el : null;
       }
       return null;
     } catch (_) { // ❌ Empty catch block
       return null;
     }
   }
   ```
3. **`src/public/utils.js:30-33`**:
   ```javascript
   export function $wSafely(selector, action = null) {
     try {
       ...
     } catch (err) {
       // Element not found on this page canvas, silently return null
       return null; // ❌ Swallows without debug logging
     }
   }
   ```
4. **`src/public/utils.js:100-102`**:
   ```javascript
   export function formatDateThai(dateInput, includeTime = false) {
     try {
       ...
     } catch (_) { // ❌ Empty catch block
       return 'ไม่ระบุวันที่';
     }
   }
   ```

---

### 3.3 Structured Logging Format Audit (AGENT.md Section 11)

AGENT.md Section 11 specifies the required logging format:
`[Component] Action failed: <cause>. Suggested action: <next step>.`

#### Observations
1. **Compliant Logger**: `src/public/utils.js:164-176` defines `logStandard(component, action, cause, suggestedAction, level)` which adheres directly to the specification.
2. **Non-Compliant Logs Found in Public Utilities**:
   - `src/public/toast.js:89`: `console.error('[Toast] Action callback error:', err);` (Missing cause & suggested action structure)
   - `src/public/toast.js:102`: `console.error('[Toast] Failed to render toast:', err);`
   - `src/public/toast.js:121`: `console.error('[Toast] Error hiding toast:', err);`
3. **Backend Services Discrepancies**:
   - `src/backend/contactService.jsw:59`, `src/backend/registrationService.jsw:58`, `src/backend/fileService.jsw:45`, `src/backend/voicebankService.jsw:44` use manual string interpolation `console.error('[Service] action failed: ...')` instead of sharing a standardized logging helper.

---

### 3.4 Toast Notifications & UI Styling Standards (AGENT.md Section 9)

#### AGENT.md Section 9 Specification Checklist

| Property | AGENT.md Standard | Codebase Implementation (`theme.js` / `toast.js`) | Status |
|---|---|---|---|
| **Max Dimensions** | Max `280x80px` | `maxWidth: 280, maxHeight: 80` in `THEME.toast` | ✅ Compliant |
| **Offset** | Bottom-right `(16, 20)` | `offsetRight: 16, offsetBottom: 20` in `THEME.toast` | ✅ Compliant |
| **Corner Radius** | `6px` | `borderRadius: 6` in `THEME.toast` | ✅ Compliant |
| **Colors** | Red `#CC2200`, Dark `#1A1A1A`, Light `#F0F0F0`, Hover `#FF4422`, Pressed `#991100` | Fully defined in `THEME.colors` | ✅ Compliant |
| **Typography** | `Leelawadee UI` (Thai/English fallback: Kanit, Inter) | `fonts.primary = 'Leelawadee UI, Kanit, Inter, sans-serif'` | ✅ Compliant |
| **Toast Helper Methods** | Concise, actionable feedback | `toastSuccess()`, `toastError()`, `toastWarning()`, `toastInfo()` | ✅ Compliant |

#### Specific Toast Implementation Defect
In `src/public/wixPageTemplate.js` (lines 68 & 71):
```javascript
// ❌ Current buggy call in wixPageTemplate.js:
showToast('ดำเนินการสำเร็จ', 'success');
showToast('เกิดข้อผิดพลาด กรุณาลองใหม่', 'error');

// ✅ Correct usage according to toast.js definition:
toastSuccess('ดำเนินการสำเร็จ');
// or
showToast({ message: 'ดำเนินการสำเร็จ', type: 'success' });
```
Because `showToast({ message, actionText, type })` expects a single configuration object, passing two string arguments results in `options.message` being `undefined` or improperly extracted.

---

### 3.5 Type Safety, Input Validation & Defensive Null-Safety

#### 1. Array Modulo Index Vulnerability
In `src/pages/All Callaboraion Voicebank_.aj73j.js:49` and `src/pages/All Our Project For Voicebank.hdv8h.js:42`:
```javascript
const collabSingers = VOICEBANKS.filter(v => v.type === 'Collaboration');
collabButtons.forEach((btnId, idx) => {
  $wSafely(btnId, (btn) => {
    const singer = collabSingers[idx % collabSingers.length]; // ⚠️ If collabSingers is [], idx % 0 = NaN
    ...
  });
});
```
If the array is empty, `idx % 0` produces `NaN`, resulting in `collabSingers[NaN]` being `undefined`. Subsequent access to `singer.audioSample` in click callbacks would fail if not null-guarded.

#### 2. Form Submission Race Conditions & Debounce Protection
- `src/pages/Contact.kcdii.js:60` and `src/pages/Event Details & Registration.mi1hd.js:46` properly implement `isSending` / `isSubmitting` boolean flags to lock the submit button during asynchronous backend operations.
- **Missing Protection**: `src/pages/Voicebank BETA.gtyoi.js:91-144` and `src/pages/File Share.ze9bp.js:24-63` lack `isSubmitting` guards, allowing rapid double-clicks to submit duplicate backend requests.

#### 3. Disconnected Client Form in `File Share.ze9bp.js`
In `src/pages/File Share.ze9bp.js`, submitting the form performs client-side validation and resets inputs, but never calls any backend service (`fileService.jsw` or a submission web method). The contribution data is lost immediately.

---

## 4. ESLint & Static Analysis Warnings (Unused Imports Inventory)

To satisfy **Acceptance Criteria R1** (*"All 14 page scripts in src/pages/ pass ESLint and syntax checks without errors or unhandled warnings"*), the following unused imports across 11 page scripts must be cleaned:

| Page Script | Unused Imported Identifiers | Target Line(s) |
|---|---|---|
| `src/pages/masterPage.js` | `showToast`, `toastInfo` | Line 22 |
| `src/pages/Main.ggt15.js` | `PROJECTS`, `CHANGELOGS`, `debounce` | Lines 20, 23 |
| `src/pages/About US.onz2l.js` | `toastSuccess` | Line 19 |
| `src/pages/All DELTA's Voicebank.acsro.js` | `getVoicebankById` | Line 17 |
| `src/pages/All Callaboraion Voicebank_.aj73j.js` | `queryVoicebanks`, `toastInfo`, `debounce` | Lines 16, 18, 19 |
| `src/pages/All USTX, MIDI, SVP and VSQX file.h73n8.js` | `showToast` | Line 18 |
| `src/pages/All Our Project For Voicebank.hdv8h.js` | `toastInfo` | Line 16 |
| `src/pages/Event Details & Registration.mi1hd.js` | `showToast` | Line 17 |
| `src/pages/Schedule.sbt9p.js` | `showToast` | Line 15 |
| `src/pages/Activity for Fix and Input Date.afeou.js` | `showToast` | Line 13 |
| `src/pages/File Share.ze9bp.js` | `showToast` | Line 12 |
| `src/pages/Contact.kcdii.js` | `showToast` | Line 24 |

---

## 5. Summary of Gaps Against AGENT.md & Acceptance Criteria R1/R2

| Criterion / Rule | Requirement | Current State | Required Fix / Hardening |
|---|---|---|---|
| **R1 / AGENT.md §6** | Zero unhandled exceptions / Defensive element access | `$wSafely` protects top-level canvas elements, but repeater `$item` calls lack defensive checks | Create `$itemSafely` or add optional scope to `$wSafely(selector, action, scope = $w)` and wrap repeater bindings |
| **R1 / AGENT.md §6 & §16** | Zero empty catch blocks / No swallowed exceptions | 4 instances of `catch (_) {}` or silent returns without debug logs | Replace empty catches with proper error logging via `logStandard()` or safe fallbacks |
| **R1 / AGENT.md §11** | Standard structured logging: `[Component] Action failed: <cause>. Suggested action: <next step>.` | Implemented in `utils.js` as `logStandard`, but `toast.js` and some backend calls use raw `console.error` | Standardize all error logs across `toast.js` and page scripts using `logStandard()` |
| **R1 / AGENT.md §12** | Input sanitization & validation | Contact & Registration services sanitize inputs via `sanitizeInput()` | Ensure boundary checks, length limits, and email format regex on all web methods |
| **R1 / ESLint** | Clean lint checks without warnings | 11 page scripts contain unused imports (`showToast`, `debounce`, etc.) | Prune all unused imports in `src/pages/*.js` |
| **R2 / Stability** | Safe audio playback state & disposal | `audioPlayer.js` manages state via subscriber pattern | Fix swallowed catch in `stop()`, ensure clean audio event listener unbinding |
| **R2 / UI Standard** | Toast geometry: max 280x80px, (16, 20) offset, 6px radius, Leelawadee UI | `theme.js` & `toast.js` match geometry; template call signature was mismatched | Correct template call syntax in `wixPageTemplate.js` and add matching CSS styles |

---

## 6. Recommendations & Roadmap for Planners and Implementers

1. **Prune Unused Imports Across All Page Scripts**:
   Clean up imported symbols (`showToast`, `toastInfo`, `debounce`, `PROJECTS`, etc.) in all 11 affected page scripts.
2. **Enhance `$wSafely` with Scoped Context**:
   Update `src/public/utils.js` so `$wSafely` can take an optional `scope` parameter (e.g. `$item` inside repeaters):
   ```javascript
   export function $wSafely(selector, action = null, scope = null) {
     try {
       const context = (scope && typeof scope === 'function') ? scope : (typeof $w === 'function' ? $w : null);
       if (!context) return null;
       const el = context(selector);
       if (el && typeof el === 'object' && ('id' in el || 'uniqueId' in el || 'type' in el)) {
         if (typeof action === 'function') action(el);
         return el;
       }
       return null;
     } catch (err) {
       return null;
     }
   }
   ```
3. **Wrap All Repeater Item Handlers in `try ... catch` and `$wSafely`**:
   Refactor repeater initialization across all 8 repeaters (`#featuredRepeater`, `#voicebankRepeater`, `#collabVoicebankRepeater`, `#filesRepeater`, `#projectsRepeater`, `#eventsRepeater`, `#roadmapRepeater`, `#activityRepeater`, `#betaVoicebankRepeater`) to use scoped safe getters and defensive click handlers.
4. **Eliminate All Empty Catch Blocks**:
   Replace `catch (_) {}` in `src/public/audioPlayer.js:140`, `src/public/toast.js:160`, `src/public/utils.js:30, 100` with structured logging or explicit fallback values.
5. **Fix `wixPageTemplate.js` Toast Invocation**:
   Update line 68 & 71 to use `toastSuccess('...')` and `toastError('...')`.
6. **Add `isSubmitting` Guards on Beta Testing and File Sharing Forms**:
   Prevent rapid double clicks in `src/pages/Voicebank BETA.gtyoi.js` and `src/pages/File Share.ze9bp.js`.
