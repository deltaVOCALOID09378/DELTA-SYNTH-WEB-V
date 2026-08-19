# E2E Test Suite Specification — Track 3: Public Core & Data Modules

**Author:** Explorer 3 (Public Core & Data Track)  
**Date:** 2026-08-16  
**Target Repository:** DELTA SYNTH (`src/public/`)  
**Adherence Standard:** DELTA SYNTH `AGENT.md` & `PROJECT.md`

---

## 1. Executive Summary & Architecture Overview

The Public Core Layer of DELTA SYNTH serves as the foundational client-side architecture for all 14 Wix Velo pages, static asset viewers, and interactive components. It encapsulates:
1. **Universal Defensive Utilities (`utils.js`)**: `$wSafely` (element getter with root and scoped repeater `$item` support), `logStandard` (AGENT.md Section 11 structured logging), `sanitizeInput` (XSS prevention & length clamping), `debounce`/`throttle` (submission and event pacing), `formatDateThai` (Buddhist Era conversion), `searchFilter`, and `formatNumber`.
2. **Audio State Engine (`audioPlayer.js`)**: Global audio singleton managing reactive playback state, volume attenuation (0.85), autoplay catch barriers, event listener lifecycle, subscriber isolation, and toggle/stop controls.
3. **Toast Notification Engine (`toast.js` & `theme.js`)**: Strict geometric constraints (max 280x80px, bottom-right offset 16, 20, 6px border radius), type-driven styling (`#CC2200` Primary/Error, `#FFD600` Warning, `#00C853` Success, `#00B0FF` Info), and SSR/missing DOM fallback logging.
4. **Data Catalogs (`voicebankData.js` & `projectData.js`)**: Static in-memory database of all 54 DELTA SYNTH virtual singers with bilingual metadata, search/filtering helper functions (`getVoicebankById`, `queryVoicebanks`), and project/resource catalogs (`PROJECTS`, `MUSIC_FILES`, `EVENTS`, `BETA_VOICEBANKS`, `CHANGELOGS`).
5. **Standard Page Template (`wixPageTemplate.js`)**: Standardized structure for Velo page lifecycle and event binding.

This document specifies a complete **4-Tier Test Suite** with **exact inputs**, **mock configurations**, and **strict assertions** for Node.js native testing (`node:test`, `node:assert`).

---

## 2. Module Contract & API Matrix

| Module | Exported Symbol | Contract Signature | Key Behavioral Requirements |
|---|---|---|---|
| `utils.js` | `$wSafely` | `(selector: string, action?: Function, scope?: Function) => Element \| null` | Returns element or `null`; suppresses unhandled lookup exceptions; executes `action(el)` if function; supports optional `scope` (`$w` or `$item`). |
| `utils.js` | `logStandard` | `(component: string, action: string, cause?: string, suggestedAction?: string, level?: 'info'\|'warn'\|'error') => void` | Adheres to `[Component] Action failed: <cause>. Suggested action: <next step>.`; routes to `console.error`, `console.warn`, or `console.log`. |
| `utils.js` | `sanitizeInput` | `(text: string) => string` | Strips `<>` tags, trims whitespace, clamps to 1000 chars; returns `''` on non-string inputs. |
| `utils.js` | `debounce` | `(func: Function, waitMs?: number) => Function` | Delays execution; cancels previous timer on successive invocations; preserves arguments and `this`. |
| `utils.js` | `throttle` | `(func: Function, limitMs?: number) => Function` | Executes immediately; suppresses calls during active interval `limitMs`. |
| `utils.js` | `formatDateThai` | `(dateInput: any, includeTime?: boolean) => string` | Converts Gregorian year to BE (`year + 543`); formats Thai months; returns `'ไม่ระบุวันที่'` on invalid dates. |
| `utils.js` | `searchFilter` | `(items: Array, query: string, keys?: string[]) => Array` | Case-insensitive multi-field search supporting strings and string arrays (`tags`); returns original items on empty query. |
| `utils.js` | `formatNumber` | `(num: number) => string` | Returns Thai locale formatted string; returns `'0'` for non-numbers or `NaN`. |
| `toast.js` | `showToast` | `(options: { message: string, actionText?: string, type?: string, duration?: number, onAction?: Function }) => void` | Updates `#toastContainer`, `#toastMessage`, `#toastAction`, `#toastIcon`; manages auto-hide timers; supports SSR console fallback. |
| `toast.js` | `toastSuccess` / `Error` / `Warning` / `Info` | `(message: string, actionText?: string) => void` | Convenience shorthands with predefined types and action labels. |
| `theme.js` | `THEME` | `Object` | Constant design tokens (`colors`, `fonts`, `toast`, `animation`). |
| `audioPlayer.js` | `globalAudioPlayer` | `AudioPlayerManager` singleton | Reactive audio manager: `play(trackId, trackUrl)`, `pause()`, `stop()`, `subscribe(cb)`, `notifyState()`. |
| `voicebankData.js` | `VOICEBANKS` | `Array<Voicebank>` (Length 54) | Complete 54-singer catalog with 18 mandatory schema fields. |
| `voicebankData.js` | `getVoicebankById` | `(id: string) => Object \| null` | Case-insensitive trimmed lookup by singer ID. |
| `voicebankData.js` | `queryVoicebanks` | `(filterOptions?: Object) => Array<Object>` | Multi-criteria filtering by gender, engine, type, and keyword search. |
| `projectData.js` | `PROJECTS`, `MUSIC_FILES`, `EVENTS`, `BETA_VOICEBANKS`, `CHANGELOGS` | `Array<Object>` | Static resource catalogs matching DELTA SYNTH specifications. |

---

## 3. Tier 1: Feature Coverage Test Cases

### 3.1. Module: `$wSafely` (Root & Scoped Access)

#### Test Case T1-UTIL-01: Root Element Resolution and Action Execution
- **Target:** `src/public/utils.js` -> `$wSafely`
- **Input:**
  - Mock Environment: Global `$w` function where `$w('#submitBtn')` returns `{ id: 'submitBtn', uniqueId: 'submitBtn-1', type: 'Button', text: 'Submit' }`.
  - Selector: `'#submitBtn'`
  - Action: `(el) => { el.text = 'Processing...'; }`
- **Execution:** `const res = $wSafely('#submitBtn', (el) => { el.text = 'Processing...'; });`
- **Expected Assertions:**
  - `assert.strictEqual(res.id, 'submitBtn')`
  - `assert.strictEqual(res.text, 'Processing...')`
  - `assert.strictEqual(typeof res, 'object')`

#### Test Case T1-UTIL-02: Missing Element Resolution (Safe Null Return)
- **Target:** `src/public/utils.js` -> `$wSafely`
- **Input:**
  - Mock Environment: Global `$w` function where `$w('#nonExistent')` throws `Error('Element #nonExistent not found on page canvas')`.
  - Selector: `'#nonExistent'`
  - Action: `(el) => { el.clicked = true; }`
- **Execution:** `const res = $wSafely('#nonExistent', (el) => { el.clicked = true; });`
- **Expected Assertions:**
  - `assert.strictEqual(res, null)`
  - No uncaught exception thrown during invocation.

#### Test Case T1-UTIL-03: Scoped Resolution within Repeater `$item` Context
- **Target:** `src/public/utils.js` -> `$wSafely`
- **Input:**
  - Mock Scope: `$item` scoped mock function where `$item('#itemSingerName')` returns `{ uniqueId: 'item-3-singerName', text: 'Ayanami Hikaru' }`.
  - Selector: `'#itemSingerName'`
  - Action: `(el) => { el.style = { color: '#CC2200' }; }`
- **Execution:** `const res = $wSafely('#itemSingerName', (el) => { el.style = { color: '#CC2200' }; }, $item);`
- **Expected Assertions:**
  - `assert.strictEqual(res.uniqueId, 'item-3-singerName')`
  - `assert.deepStrictEqual(res.style, { color: '#CC2200' })`

#### Test Case T1-UTIL-04: Lookup without Action Callback
- **Target:** `src/public/utils.js` -> `$wSafely`
- **Input:**
  - Mock Environment: Global `$w('#headerTitle')` returns `{ id: 'headerTitle', text: 'DELTA SYNTH' }`.
  - Selector: `'#headerTitle'`
  - Action: `undefined` (or omitted)
- **Execution:** `const res = $wSafely('#headerTitle');`
- **Expected Assertions:**
  - `assert.notStrictEqual(res, null)`
  - `assert.strictEqual(res.id, 'headerTitle')`
  - `assert.strictEqual(res.text, 'DELTA SYNTH')`

#### Test Case T1-UTIL-05: Missing Global `$w` Environment (SSR / Unit Test Isolation)
- **Target:** `src/public/utils.js` -> `$wSafely`
- **Input:**
  - Global `$w` is `undefined`.
  - Selector: `'#anyElement'`
  - Action: `() => {}`
- **Execution:** `const res = $wSafely('#anyElement');`
- **Expected Assertions:**
  - `assert.strictEqual(res, null)`
  - Safe execution without ReferenceError.

---

### 3.2. Module: `logStandard` (Structured Logging)

#### Test Case T1-LOG-01: Standard Info Logging Format
- **Target:** `src/public/utils.js` -> `logStandard`
- **Input:** `component = 'MasterPage'`, `action = 'Page initialized'`, `cause = ''`, `suggestedAction = ''`, `level = 'info'`
- **Execution:** Intercept `console.log`; invoke `logStandard('MasterPage', 'Page initialized', '', '', 'info')`.
- **Expected Assertions:**
  - `console.log` is called exactly 1 time.
  - Formatted message string equals `"[MasterPage] Page initialized"`.

#### Test Case T1-LOG-02: Standard Error Logging Format with Cause & Next Step
- **Target:** `src/public/utils.js` -> `logStandard`
- **Input:** `component = 'VoicebankService'`, `action = 'Fetch singer details'`, `cause = 'Singer ID not found in database'`, `suggestedAction = 'Check voicebank ID catalog and retry'`, `level = 'error'`
- **Execution:** Intercept `console.error`; invoke `logStandard('VoicebankService', 'Fetch singer details', 'Singer ID not found in database', 'Check voicebank ID catalog and retry', 'error')`.
- **Expected Assertions:**
  - `console.error` is called exactly 1 time.
  - Formatted message string equals `"[VoicebankService] Fetch singer details failed: Singer ID not found in database. Suggested action: Check voicebank ID catalog and retry."`.

#### Test Case T1-LOG-03: Standard Warning Logging Format
- **Target:** `src/public/utils.js` -> `logStandard`
- **Input:** `component = 'AudioPlayer'`, `action = 'Autoplay request'`, `cause = 'Browser autoplay blocked'`, `suggestedAction = 'User must click play button'`, `level = 'warn'`
- **Execution:** Intercept `console.warn`; invoke `logStandard('AudioPlayer', 'Autoplay request', 'Browser autoplay blocked', 'User must click play button', 'warn')`.
- **Expected Assertions:**
  - `console.warn` is called exactly 1 time.
  - Formatted message string equals `"[AudioPlayer] Autoplay request failed: Browser autoplay blocked. Suggested action: User must click play button."`.

#### Test Case T1-LOG-04: Default Fallback Text when Cause / SuggestedAction Omitted on Error
- **Target:** `src/public/utils.js` -> `logStandard`
- **Input:** `component = 'ContactForm'`, `action = 'Form submission'`, `cause = ''`, `suggestedAction = ''`, `level = 'error'`
- **Execution:** Intercept `console.error`; invoke `logStandard('ContactForm', 'Form submission', '', '', 'error')`.
- **Expected Assertions:**
  - Formatted message equals `"[ContactForm] Form submission failed: Unknown error. Suggested action: Check inputs and retry."`.

#### Test Case T1-LOG-05: Level Routing (Warn vs Error vs Log)
- **Target:** `src/public/utils.js` -> `logStandard`
- **Input:** Three calls with levels `'info'`, `'warn'`, `'error'`.
- **Execution:** Verify respective `console` methods are routed accurately without cross-talk.
- **Expected Assertions:**
  - `console.log` invoked for info.
  - `console.warn` invoked for warn with failure message.
  - `console.error` invoked for error with failure message.

---

### 3.3. Module: `sanitizeInput` (XSS Stripping & Clamping)

#### Test Case T1-SAN-01: HTML Tag Stripping
- **Target:** `src/public/utils.js` -> `sanitizeInput`
- **Input:** `"<script>alert('xss')</script>Hello World"`
- **Execution:** `const res = sanitizeInput("<script>alert('xss')</script>Hello World");`
- **Expected Assertions:**
  - `assert.strictEqual(res, "scriptalert('xss')/scriptHello World")`
  - All `<` and `>` characters removed.

#### Test Case T1-SAN-02: Whitespace Trimming
- **Target:** `src/public/utils.js` -> `sanitizeInput`
- **Input:** `"   DELTA SYNTH Voicebanks \n\t  "`
- **Execution:** `const res = sanitizeInput("   DELTA SYNTH Voicebanks \n\t  ");`
- **Expected Assertions:**
  - `assert.strictEqual(res, "DELTA SYNTH Voicebanks")`

#### Test Case T1-SAN-03: Length Clamping at 1000 Characters
- **Target:** `src/public/utils.js` -> `sanitizeInput`
- **Input:** String of 1500 repeated `'A'` characters (`'A'.repeat(1500)`).
- **Execution:** `const res = sanitizeInput('A'.repeat(1500));`
- **Expected Assertions:**
  - `assert.strictEqual(res.length, 1000)`
  - `assert.strictEqual(res, 'A'.repeat(1000))`

#### Test Case T1-SAN-04: Non-String Input Defensive Handling
- **Target:** `src/public/utils.js` -> `sanitizeInput`
- **Input:** `null`, `undefined`, `12345`, `{ name: 'Hikaru' }`, `['test']`
- **Execution:** Call `sanitizeInput` with each non-string type.
- **Expected Assertions:**
  - `assert.strictEqual(sanitizeInput(null), '')`
  - `assert.strictEqual(sanitizeInput(undefined), '')`
  - `assert.strictEqual(sanitizeInput(12345), '')`
  - `assert.strictEqual(sanitizeInput({}), '')`
  - `assert.strictEqual(sanitizeInput([]), '')`

#### Test Case T1-SAN-05: Preserves Safe Thai & Unicode Characters
- **Target:** `src/public/utils.js` -> `sanitizeInput`
- **Input:** `"นักร้องเสมือนจริง DELTA SYNTH — อายานามิ ฮิคารุ (Pop / Rock)"`
- **Execution:** `const res = sanitizeInput("นักร้องเสมือนจริง DELTA SYNTH — อายานามิ ฮิคารุ (Pop / Rock)");`
- **Expected Assertions:**
  - `assert.strictEqual(res, "นักร้องเสมือนจริง DELTA SYNTH — อายานามิ ฮิคารุ (Pop / Rock)")`

---

### 3.4. Module: `debounce` & `throttle` (Timing Control)

#### Test Case T1-TIM-01: Debounce Invokes Function After Delay
- **Target:** `src/public/utils.js` -> `debounce`
- **Input:** `waitMs = 50`, callback tracking calls `(val) => callHistory.push(val)`.
- **Execution:** Call debounced function once with `'run1'`, advance timer by 55ms.
- **Expected Assertions:**
  - Function is called exactly 1 time with `'run1'`.

#### Test Case T1-TIM-02: Debounce Collapses Rapid Successive Calls
- **Target:** `src/public/utils.js` -> `debounce`
- **Input:** 5 rapid calls at `0ms`, `10ms`, `20ms`, `30ms`, `40ms` with args `1, 2, 3, 4, 5`, `waitMs = 50`.
- **Execution:** Fire 5 calls, advance timer to `100ms`.
- **Expected Assertions:**
  - Underlying function is called exactly 1 time.
  - Argument passed to function is `5` (the latest call).

#### Test Case T1-TIM-03: Throttle Executes Leading Call Immediately
- **Target:** `src/public/utils.js` -> `throttle`
- **Input:** `limitMs = 100`, callback tracking execution timestamp.
- **Execution:** Invoke throttled function at `t = 0ms`.
- **Expected Assertions:**
  - Function executes synchronously on the first invocation at `t = 0ms`.

#### Test Case T1-TIM-04: Throttle Suppresses Invocations Within Window
- **Target:** `src/public/utils.js` -> `throttle`
- **Input:** `limitMs = 100`, invocations at `0ms`, `20ms`, `50ms`, `80ms`.
- **Execution:** Fire 4 calls within 80ms window.
- **Expected Assertions:**
  - Function executes exactly 1 time (at `0ms`).

#### Test Case T1-TIM-05: Throttle Re-Enables Execution After Expiry
- **Target:** `src/public/utils.js` -> `throttle`
- **Input:** `limitMs = 100`, call at `0ms`, wait `110ms`, call at `120ms`.
- **Execution:** Fire first call, advance timer by 110ms, fire second call.
- **Expected Assertions:**
  - Function is executed total of 2 times.

---

### 3.5. Module: `formatDateThai` (Buddhist Era Parsing)

#### Test Case T1-DAT-01: Valid Gregorian Date String to Thai BE Date
- **Target:** `src/public/utils.js` -> `formatDateThai`
- **Input:** `dateInput = '2026-08-13'`, `includeTime = false`
- **Execution:** `const res = formatDateThai('2026-08-13', false);`
- **Expected Assertions:**
  - Year: `2026 + 543 = 2569`
  - Month: `8 -> สิงหาคม`
  - Day: `13`
  - `assert.strictEqual(res, '13 สิงหาคม 2569')`

#### Test Case T1-DAT-02: Date Formatting with Time Inclusion
- **Target:** `src/public/utils.js` -> `formatDateThai`
- **Input:** `dateInput = new Date(2026, 7, 13, 15, 45, 0)`, `includeTime = true` (Note: month 7 is August)
- **Execution:** `const res = formatDateThai(dateInput, true);`
- **Expected Assertions:**
  - `assert.strictEqual(res, '13 สิงหาคม 2569 เวลา 15:45 น.')`

#### Test Case T1-DAT-03: All 12 Thai Month Names Verification
- **Target:** `src/public/utils.js` -> `formatDateThai`
- **Input:** 12 dates covering months 0 through 11 in year 2025.
- **Execution:** Map over dates 2025-01-01 to 2025-12-01 through `formatDateThai`.
- **Expected Assertions:**
  - `['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']` match corresponding output strings.

#### Test Case T1-DAT-04: Numeric Epoch Timestamp Input
- **Target:** `src/public/utils.js` -> `formatDateThai`
- **Input:** `dateInput = Date.UTC(2025, 0, 15)` (Epoch ms)
- **Execution:** `const res = formatDateThai(dateInput);`
- **Expected Assertions:**
  - Contains `'มกราคม 2568'` (or local day/month matching epoch).

#### Test Case T1-DAT-05: Invalid Date Input Graceful Fallback
- **Target:** `src/public/utils.js` -> `formatDateThai`
- **Input:** `'not-a-valid-date'`, `NaN`, `null`, `undefined`, `{}`
- **Execution:** Call `formatDateThai` with each invalid input.
- **Expected Assertions:**
  - All return `'ไม่ระบุวันที่'`.

---

### 3.6. Module: `searchFilter` & `formatNumber`

#### Test Case T1-FLT-01: Multi-Key Case-Insensitive Search Match
- **Target:** `src/public/utils.js` -> `searchFilter`
- **Input:**
  - `items = [{ name: 'Ayanami Hikaru', genre: 'Pop / Rock' }, { name: 'SUN', genre: 'Rock' }]`
  - `query = 'hikaru'`
- **Execution:** `const res = searchFilter(items, 'hikaru', ['name', 'genre']);`
- **Expected Assertions:**
  - `assert.strictEqual(res.length, 1)`
  - `assert.strictEqual(res[0].name, 'Ayanami Hikaru')`

#### Test Case T1-FLT-02: Array Tag Field Match
- **Target:** `src/public/utils.js` -> `searchFilter`
- **Input:**
  - `items = [{ name: 'Kochujang', tags: ['UTAU', 'DiffSinger', 'K-Pop'] }, { name: 'Yamada', tags: ['UTAU', 'Enka'] }]`
  - `query = 'k-pop'`
- **Execution:** `const res = searchFilter(items, 'k-pop', ['tags']);`
- **Expected Assertions:**
  - `assert.strictEqual(res.length, 1)`
  - `assert.strictEqual(res[0].name, 'Kochujang')`

#### Test Case T1-FLT-03: Empty / Whitespace Query Returns Full Dataset
- **Target:** `src/public/utils.js` -> `searchFilter`
- **Input:** `items = [{ id: 1 }, { id: 2 }]`, `query = '   '`
- **Execution:** `const res = searchFilter(items, '   ');`
- **Expected Assertions:**
  - `assert.deepStrictEqual(res, items)`

#### Test Case T1-NUM-01: Format Integer with Thai Locale Separators
- **Target:** `src/public/utils.js` -> `formatNumber`
- **Input:** `1250000`
- **Execution:** `const res = formatNumber(1250000);`
- **Expected Assertions:**
  - `assert.strictEqual(res, '1,250,000')`

#### Test Case T1-NUM-02: Format Invalid / Non-Number Input
- **Target:** `src/public/utils.js` -> `formatNumber`
- **Input:** `'1000'`, `null`, `undefined`, `NaN`, `{}`
- **Execution:** Call `formatNumber` with each invalid input.
- **Expected Assertions:**
  - `assert.strictEqual(formatNumber('1000'), '0')`
  - `assert.strictEqual(formatNumber(null), '0')`
  - `assert.strictEqual(formatNumber(NaN), '0')`

---

### 3.7. Module: `toast.js` & `theme.js` (Design Tokens & Notifications)

#### Test Case T1-TST-01: Toast DOM Binding & Text Injection
- **Target:** `src/public/toast.js` -> `showToast`
- **Input:**
  - Mock Elements: `#toastContainer` (with `.show()`, `.hide()`), `#toastMessage`, `#toastAction`, `#toastIcon`.
  - Options: `{ message: 'บันทึกสำเร็จ', actionText: 'ดูรายการ', type: 'success' }`
- **Execution:** `showToast({ message: 'บันทึกสำเร็จ', actionText: 'ดูรายการ', type: 'success' });`
- **Expected Assertions:**
  - `toastMessage.text` === `'บันทึกสำเร็จ'`
  - `toastAction.text` === `'ดูรายการ'`
  - `toastIcon.text` === `'✓'`
  - `toastContainer.show` called with `'fade'`.

#### Test Case T1-TST-02: Toast Types and Icons Mapping
- **Target:** `src/public/toast.js` -> `showToast`
- **Input:** Types `'success'`, `'warning'`, `'error'`, `'info'`.
- **Execution:** Trigger toast for each type.
- **Expected Assertions:**
  - Icons match: `'success' -> '✓'`, `'warning' -> '⚠'`, `'error' -> '✕'`, `'info' -> 'ℹ'`.

#### Test Case T1-TST-03: Shorthand Helpers Invocation
- **Target:** `src/public/toast.js` -> `toastSuccess`, `toastError`, `toastWarning`, `toastInfo`
- **Input:** Call each shorthand with test string.
- **Execution:** `toastSuccess('OK')`, `toastError('Fail')`, `toastWarning('Warn')`, `toastInfo('Info')`.
- **Expected Assertions:**
  - `toastError` passes default `actionText = 'ลองใหม่อีกครั้ง'` and `duration = 4500`.
  - `toastSuccess` passes default `actionText = 'เรียบร้อย'`.

#### Test Case T1-TST-04: Theme Constants & Geometry Strict Adherence
- **Target:** `src/public/theme.js` -> `THEME`
- **Input:** `THEME` object.
- **Execution:** Inspect `THEME.toast` and `THEME.colors`.
- **Expected Assertions:**
  - `assert.strictEqual(THEME.toast.maxWidth, 280)` (AGENT.md Section 9)
  - `assert.strictEqual(THEME.toast.maxHeight, 80)` (AGENT.md Section 9)
  - `assert.strictEqual(THEME.toast.offsetRight, 16)`
  - `assert.strictEqual(THEME.toast.offsetBottom, 20)`
  - `assert.strictEqual(THEME.toast.borderRadius, 6)`
  - `assert.strictEqual(THEME.colors.primary, '#CC2200')`
  - `assert.strictEqual(THEME.colors.bgDark, '#1A1A1A')`
  - `assert.strictEqual(THEME.colors.textLight, '#F0F0F0')`

#### Test Case T1-TST-05: Toast Auto-Dismiss Timer
- **Target:** `src/public/toast.js` -> `showToast`
- **Input:** `duration = 100`, mock timer environment.
- **Execution:** Call `showToast({ message: 'Auto fade', duration: 100 })`, advance timer by 105ms.
- **Expected Assertions:**
  - `toastContainer.hide` is called.

#### Test Case T1-TST-06: Action Callback Click Trigger
- **Target:** `src/public/toast.js` -> `showToast`
- **Input:** `onAction = () => { actionClicked = true; }`
- **Execution:** Call `showToast({ message: 'Click', onAction })`, trigger `toastAction.simulateClick()`.
- **Expected Assertions:**
  - `actionClicked` is `true`.
  - `toastContainer.hide` is called immediately following click.

---

### 3.8. Module: `audioPlayer.js` (Singleton Audio Engine)

#### Test Case T1-AUD-01: Play Initiates Playback & Notifies Subscribers
- **Target:** `src/public/audioPlayer.js` -> `globalAudioPlayer`
- **Input:** `trackId = 'hikaru_sample'`, `trackUrl = 'Voice/Ayanami Hikaru.wav'`
- **Execution:**
  - Subscribe listener callback.
  - `globalAudioPlayer.play('hikaru_sample', 'Voice/Ayanami Hikaru.wav')`
- **Expected Assertions:**
  - `globalAudioPlayer.currentTrackId` === `'hikaru_sample'`
  - `globalAudioPlayer.currentTrackUrl` === `'Voice/Ayanami Hikaru.wav'`
  - `globalAudioPlayer.isPlaying` === `true`
  - Listener received `{ isPlaying: true, currentTrackId: 'hikaru_sample', currentTrackUrl: 'Voice/Ayanami Hikaru.wav' }`.

#### Test Case T1-AUD-02: Play on Same Track Toggles Pause
- **Target:** `src/public/audioPlayer.js` -> `globalAudioPlayer`
- **Input:** Track currently playing (`'hikaru_sample'`).
- **Execution:** Call `globalAudioPlayer.play('hikaru_sample', 'Voice/Ayanami Hikaru.wav')` a second time.
- **Expected Assertions:**
  - `globalAudioPlayer.isPlaying` === `false`
  - `globalAudioPlayer.currentTrackId` === `'hikaru_sample'` (retained during pause)

#### Test Case T1-AUD-03: Pause State Transition
- **Target:** `src/public/audioPlayer.js` -> `globalAudioPlayer`
- **Input:** Track currently playing (`'sun_sample'`).
- **Execution:** `globalAudioPlayer.pause()`
- **Expected Assertions:**
  - `globalAudioPlayer.isPlaying` === `false`
  - Subscriber notified with `isPlaying: false`.

#### Test Case T1-AUD-04: Stop Cleans Up State & Track References
- **Target:** `src/public/audioPlayer.js` -> `globalAudioPlayer`
- **Input:** Track playing (`'sun_sample'`).
- **Execution:** `globalAudioPlayer.stop()`
- **Expected Assertions:**
  - `globalAudioPlayer.isPlaying` === `false`
  - `globalAudioPlayer.currentTrackId` === `null`
  - `globalAudioPlayer.currentTrackUrl` === `null`
  - Audio element src is cleared.

#### Test Case T1-AUD-05: Subscribe and Unsubscribe Lifecycle
- **Target:** `src/public/audioPlayer.js` -> `globalAudioPlayer`
- **Input:** Subscriber callback function.
- **Execution:**
  - `const unsubscribe = globalAudioPlayer.subscribe(cb)`
  - Trigger `play(...)` -> callback fires.
  - `unsubscribe()`
  - Trigger `stop()` -> callback does NOT fire.
- **Expected Assertions:**
  - Callback fired only during active subscription.

#### Test Case T1-AUD-06: Missing Track URL Guard
- **Target:** `src/public/audioPlayer.js` -> `globalAudioPlayer`
- **Input:** `trackId = 'track_without_url'`, `trackUrl = ''` (or `null`)
- **Execution:** `globalAudioPlayer.play('track_without_url', null)`
- **Expected Assertions:**
  - Playback does NOT start (`isPlaying` remains `false`).
  - Warning toast triggered (`'ไม่พบไฟล์เสียงตัวอย่าง'`).

---

### 3.9. Module: `voicebankData.js` (54 Voicebanks Catalog & Query)

#### Test Case T1-VBK-01: Catalog Completeness (Exact 54 Voicebanks)
- **Target:** `src/public/voicebankData.js` -> `VOICEBANKS`
- **Input:** `VOICEBANKS` array.
- **Execution:** `const count = VOICEBANKS.length;`
- **Expected Assertions:**
  - `assert.strictEqual(count, 54)`
  - All 54 voicebank items are non-null objects.

#### Test Case T1-VBK-02: Mandatory Schema Validation on All 54 Records
- **Target:** `src/public/voicebankData.js` -> `VOICEBANKS`
- **Input:** All 54 items in `VOICEBANKS`.
- **Execution:** Check presence of 18 required fields on every record:
  `['id', 'name', 'nameTh', 'gender', 'age', 'voicer', 'engine', 'type', 'genre', 'language', 'status', 'image', 'imageFull', 'audioSample', 'detailUrl', 'downloadUrl', 'description', 'tags']`
- **Expected Assertions:**
  - Every singer has non-empty string `id`, `name`, `nameTh`, `audioSample`, `detailUrl`.
  - `gender` is either `'Male'` or `'Female'`.
  - `age` is a valid positive number.
  - `tags` is a non-empty array of strings.

#### Test Case T1-VBK-03: ID Uniqueness Across Entire Catalog
- **Target:** `src/public/voicebankData.js` -> `VOICEBANKS`
- **Input:** `VOICEBANKS.map(v => v.id)`
- **Execution:** Check for duplicate IDs using a `Set`.
- **Expected Assertions:**
  - `assert.strictEqual(new Set(VOICEBANKS.map(v => v.id)).size, 54)`
  - Zero duplicate identifiers.

#### Test Case T1-VBK-04: `getVoicebankById` Exact & Case-Insensitive Lookup
- **Target:** `src/public/voicebankData.js` -> `getVoicebankById`
- **Input:** `'ayanami_hikaru'`, `'AYANAMI_HIKARU'`, `'  sun  '`
- **Execution:**
  - `getVoicebankById('ayanami_hikaru')`
  - `getVoicebankById('AYANAMI_HIKARU')`
  - `getVoicebankById('  sun  ')`
- **Expected Assertions:**
  - Matches correct record: `name === 'Ayanami Hikaru'`, `name === 'SUN'`.

#### Test Case T1-VBK-05: `queryVoicebanks` by Gender & Engine
- **Target:** `src/public/voicebankData.js` -> `queryVoicebanks`
- **Input:** `{ gender: 'Female', engine: 'DiffSinger' }`
- **Execution:** `const res = queryVoicebanks({ gender: 'Female', engine: 'DiffSinger' });`
- **Expected Assertions:**
  - Every returned item has `gender === 'Female'` and `engine.includes('DiffSinger')`.
  - Returns non-empty array (e.g. Kochujang, Thitiya Anantanetr).

#### Test Case T1-VBK-06: `queryVoicebanks` by Bilingual Text Query
- **Target:** `src/public/voicebankData.js` -> `queryVoicebanks`
- **Input:** `query = 'ฮิคารุ'` (Thai) and `query = 'Rock'` (English genre/tag)
- **Execution:**
  - `queryVoicebanks({ query: 'ฮิคารุ' })`
  - `queryVoicebanks({ query: 'Rock' })`
- **Expected Assertions:**
  - Thai query returns Ayanami Hikaru.
  - Rock query returns all rock singers (SUN, Guren Kani, Yamada Kimada, etc.).

---

### 3.10. Module: `projectData.js` (Project, Music Files, Events, Beta Catalogs)

#### Test Case T1-PRJ-01: `PROJECTS` Array Structure & Fields
- **Target:** `src/public/projectData.js` -> `PROJECTS`
- **Input:** `PROJECTS` array.
- **Execution:** Inspect array contents and schema.
- **Expected Assertions:**
  - `assert.strictEqual(PROJECTS.length, 3)`
  - IDs include: `'diffsinger_upgrade_2025'`, `'openutau_thai_phonemizer'`, `'digital_vocal_archive'`.
  - Required fields present: `id`, `title`, `titleTh`, `category`, `status`, `date`, `description`, `languages`, `singers`, `collaborators`, `link`.

#### Test Case T1-PRJ-02: `MUSIC_FILES` Array Structure & Supported Formats
- **Target:** `src/public/projectData.js` -> `MUSIC_FILES`
- **Input:** `MUSIC_FILES` array.
- **Execution:** Inspect format and compatibility metadata.
- **Expected Assertions:**
  - `assert.strictEqual(MUSIC_FILES.length, 5)`
  - Formats include standard synthesizer formats: `'USTX'`, `'SVP'`, `'MIDI'`, `'VSQX'`.
  - Each file specifies `bpm`, `key`, `compatibleEngine`, `recommendedSinger`, `downloadUrl`, `fileSize`.

#### Test Case T1-PRJ-03: `EVENTS` Array Registration States
- **Target:** `src/public/projectData.js` -> `EVENTS`
- **Input:** `EVENTS` array.
- **Execution:** Inspect event records.
- **Expected Assertions:**
  - `assert.strictEqual(EVENTS.length, 2)`
  - `event_001` and `event_002` have `registrationOpen === true`, valid `maxParticipants`, `currentRegistered`.

#### Test Case T1-PRJ-04: `BETA_VOICEBANKS` Versioning & Engine Schema
- **Target:** `src/public/projectData.js` -> `BETA_VOICEBANKS`
- **Input:** `BETA_VOICEBANKS` array.
- **Execution:** Inspect beta items.
- **Expected Assertions:**
  - `assert.strictEqual(BETA_VOICEBANKS.length, 3)`
  - Each item contains `id`, `name`, `version`, `engine`, `status`, `updateDate`, `changelog`, `downloadUrl`.

#### Test Case T1-PRJ-05: `CHANGELOGS` Chronological Order & Metadata
- **Target:** `src/public/projectData.js` -> `CHANGELOGS`
- **Input:** `CHANGELOGS` array.
- **Execution:** Inspect changelog entries.
- **Expected Assertions:**
  - `assert.strictEqual(CHANGELOGS.length, 3)`
  - Entries contain `date`, `version`, `title`, `category`, `details`.

---

## 4. Tier 2: Boundary & Corner Cases

### Test Case T2-BND-01: `$wSafely` with Invalid / Empty / Malformed Selectors
- **Target:** `src/public/utils.js` -> `$wSafely`
- **Inputs:** `''` (empty string), `'#'` (bare hash), `null`, `undefined`, `12345`, `{}`, `[]`
- **Execution:** Invoke `$wSafely(input, (el) => {})` for each input.
- **Expected Assertions:**
  - Returns `null` in all cases.
  - Zero unhandled exceptions thrown.

### Test Case T2-BND-02: `$wSafely` when `action` Callback Throws an Exception
- **Target:** `src/public/utils.js` -> `$wSafely`
- **Input:** Valid selector `#btn`, action callback: `() => { throw new Error('DOM manipulation crashed'); }`
- **Execution:** `const res = $wSafely('#btn', () => { throw new Error('DOM manipulation crashed'); });`
- **Expected Assertions:**
  - Exception is caught internally by defensive try/catch boundary.
  - Returns `null` without crashing the caller page.

### Test Case T2-BND-03: `$wSafely` with Non-Function `action` Arguments
- **Target:** `src/public/utils.js` -> `$wSafely`
- **Inputs:** `action = 'not-a-function'`, `action = 123`, `action = {}`, `action = []`
- **Execution:** Invoke `$wSafely('#btn', action)`.
- **Expected Assertions:**
  - Resolves element successfully without throwing `TypeError: action is not a function`.
  - Returns element object.

### Test Case T2-BND-04: `sanitizeInput` with Malicious XSS Vectors & Extreme Payloads
- **Target:** `src/public/utils.js` -> `sanitizeInput`
- **Inputs:**
  1. `<script src="http://evil.com/xss.js"></script><img src=x onerror=alert(1)>`
  2. `"<<<<<script>>>>>>"`
  3. 10,000 characters of unicode characters and tags.
- **Execution:** Call `sanitizeInput` on each payload.
- **Expected Assertions:**
  1. Result has zero `<` or `>` characters: `script src="http://evil.com/xss.js"/scriptimg src=x onerror=alert(1)`
  2. Result is `"script"`
  3. Result length is strictly clamped to `1000`.

### Test Case T2-BND-05: `formatDateThai` Boundary Values (Epoch 0, Negative Years, Leap Years)
- **Target:** `src/public/utils.js` -> `formatDateThai`
- **Inputs:**
  1. `dateInput = 0` (1970-01-01 -> 2513 BE)
  2. `dateInput = '2000-02-29'` (Leap Day -> 29 กุมภาพันธ์ 2543)
  3. `dateInput = '9999-12-31'` (Far future -> 31 ธันวาคม 10542)
  4. `dateInput = -100000000000` (Pre-1970)
- **Execution:** Call `formatDateThai(dateInput)` for each.
- **Expected Assertions:**
  - Accurate conversion without `NaN` or runtime crashes.
  - Leap day formats as `'29 กุมภาพันธ์ 2543'`.

### Test Case T2-BND-06: `searchFilter` with Corrupted / Malformed Array Items
- **Target:** `src/public/utils.js` -> `searchFilter`
- **Input:**
  - `items = [null, undefined, {}, { name: null }, { name: 'Valid Singer', tags: null }, 'invalid_item', 42]`
  - `query = 'valid'`
- **Execution:** `const res = searchFilter(items, 'valid', ['name', 'tags']);`
- **Expected Assertions:**
  - Does not throw `TypeError: Cannot read properties of null/undefined`.
  - Correctly extracts `{ name: 'Valid Singer', tags: null }`.

### Test Case T2-BND-07: `formatNumber` Extreme Boundary Values
- **Target:** `src/public/utils.js` -> `formatNumber`
- **Inputs:** `0`, `-0`, `Infinity`, `-Infinity`, `Number.MAX_SAFE_INTEGER`, `0.000001`, `NaN`
- **Execution:** Call `formatNumber` for each input.
- **Expected Assertions:**
  - `formatNumber(0)` === `'0'`
  - `formatNumber(Infinity)` === `'0'` (or locale infinity)
  - `formatNumber(NaN)` === `'0'`
  - `formatNumber(Number.MAX_SAFE_INTEGER)` formats properly with commas.

### Test Case T2-BND-08: Toast with Massive Text Payload (Overflow Safety)
- **Target:** `src/public/toast.js` -> `showToast`
- **Input:** `message = 'A'.repeat(5000)`, `actionText = 'B'.repeat(500)`
- **Execution:** Invoke `showToast({ message, actionText })`.
- **Expected Assertions:**
  - Does not crash DOM or layout calculation.
  - Text property assigned to elements safely.

### Test Case T2-BND-09: Audio Player Rapid Track Switching (Concurrency & Race Conditions)
- **Target:** `src/public/audioPlayer.js` -> `globalAudioPlayer`
- **Input:** Rapid successive invocations:
  - `play('track1', 'Voice/1.wav')`
  - `play('track2', 'Voice/2.wav')`
  - `play('track3', 'Voice/3.wav')`
  - `play('track4', 'Voice/4.wav')`
  - all within 5ms.
- **Execution:** Fire 4 play commands sequentially.
- **Expected Assertions:**
  - Previous audio instances stopped and disposed cleanly.
  - Final state is `currentTrackId === 'track4'` and `currentTrackUrl === 'Voice/4.wav'`.
  - No zombie audio streams left playing concurrently.

### Test Case T2-BND-10: Audio Player Exception Isolation in Subscriber Callbacks
- **Target:** `src/public/audioPlayer.js` -> `globalAudioPlayer`
- **Input:**
  - Subscriber 1: `() => { throw new Error('Rogue subscriber failure'); }`
  - Subscriber 2: `(state) => { normalSubscriberReceived = state; }`
- **Execution:** Register both subscribers, invoke `globalAudioPlayer.play('track_iso', 'Voice/test.wav')`.
- **Expected Assertions:**
  - Subscriber 1's exception is caught and logged via `logStandard`.
  - Subscriber 2 receives state notification without interruption.

### Test Case T2-BND-11: `getVoicebankById` Non-Existent & Edge-Case IDs
- **Target:** `src/public/voicebankData.js` -> `getVoicebankById`
- **Inputs:** `'non_existent_id'`, `''`, `null`, `undefined`, `123`, `toString`, `__proto__`
- **Execution:** Call `getVoicebankById` with each input.
- **Expected Assertions:**
  - Returns `null` for all invalid/prototype-injection keys.
  - Prototype pollution attacks neutralized.

### Test Case T2-BND-12: `queryVoicebanks` with Regex Special Characters in Query
- **Target:** `src/public/voicebankData.js` -> `queryVoicebanks`
- **Inputs:** `query = '.*'`, `query = '([a-z])+'`, `query = '\\'`, `query = '+++'`
- **Execution:** Call `queryVoicebanks({ query: '.*' })`.
- **Expected Assertions:**
  - Handled as literal substring query via `includes()`.
  - Does not throw `SyntaxError: Invalid regular expression`.

---

## 5. Tier 3: Cross-Feature Combinations

### Test Case T3-XFT-01: Audio Playback -> Global State -> MasterPage UI Sync -> Error Toast Recovery
- **Components:** `audioPlayer.js` + `toast.js` + `utils.js` (`logStandard`)
- **Scenario:**
  1. `masterPage.js` subscribes to `globalAudioPlayer.subscribe(...)`.
  2. Page calls `globalAudioPlayer.play('invalid_track', '')` with empty URL.
  3. Audio player logs warning via `logStandard('AudioPlayer', 'Play request', 'No audio URL provided', ...)` and triggers warning toast.
  4. Subscriber verifies state remains idle (`isPlaying: false`).
- **Assertions:**
  - `console.warn` contains `"[AudioPlayer] Play request failed: No audio URL provided."`
  - `#toastMessage.text` contains `'ไม่พบไฟล์เสียงตัวอย่าง'`
  - State emitted to subscriber: `isPlaying: false`.

### Test Case T3-XFT-02: Voicebank Catalog Filter -> Pagination -> Audio Sample Trigger
- **Components:** `voicebankData.js` (`queryVoicebanks`) + `audioPlayer.js` (`globalAudioPlayer`)
- **Scenario:**
  1. User selects `gender = 'Male'`, `engine = 'UTAU'`, `query = 'Rock'`.
  2. Results filtered via `queryVoicebanks`.
  3. Pagination slices top item (`Guren Kani`).
  4. UI triggers `globalAudioPlayer.play(item.id, item.audioSample)`.
- **Assertions:**
  - Filtered results contain only male UTAU rock singers (e.g., Guren Kani, Yamada Kimada).
  - `globalAudioPlayer.currentTrackId === 'guren_kani'`
  - `globalAudioPlayer.currentTrackUrl === 'Voice/Guren Kani.wav'`
  - `globalAudioPlayer.isPlaying === true`

### Test Case T3-XFT-03: Theme Token Consistency Across Toast Engine and CSS Rules
- **Components:** `theme.js` + `toast.js`
- **Scenario:**
  1. Inspect `THEME.colors` vs Toast type colors.
  2. Trigger `toastError('ข้อผิดพลาด')` and verify applied primary color token.
  3. Verify `THEME.toast` dimensions match AGENT.md Section 9 specs.
- **Assertions:**
  - `THEME.colors.primary === '#CC2200'`
  - `THEME.toast.maxWidth === 280`
  - `THEME.toast.maxHeight === 80`
  - `THEME.toast.offsetRight === 16`
  - `THEME.toast.offsetBottom === 20`
  - `THEME.toast.borderRadius === 6`

### Test Case T3-XFT-04: Scoped Repeater Item Access -> Audio Preview -> Missing Sample Handling
- **Components:** `utils.js` (`$wSafely` with scope) + `audioPlayer.js` + `toast.js`
- **Scenario:**
  1. Repeater item renders singer card with missing `audioSample`.
  2. Button click handler uses scoped `$wSafely('#playBtn', action, $item)`.
  3. Scoped action triggers `globalAudioPlayer.play(singer.id, singer.audioSample)`.
  4. Audio player detects null sample, suppresses crash, triggers warning toast.
- **Assertions:**
  - Scoped `$wSafely` resolves within repeater `$item`.
  - `globalAudioPlayer.isPlaying` remains `false`.
  - Warning toast displayed to user.

### Test Case T3-XFT-05: User Search Input Sanitization -> Catalog Query -> Thai Date Formatting
- **Components:** `utils.js` (`sanitizeInput`, `formatDateThai`) + `voicebankData.js` (`queryVoicebanks`) + `projectData.js` (`PROJECTS`)
- **Scenario:**
  1. Untrusted search query received: `"<script>Ayanami</script> "`.
  2. Query sanitized via `sanitizeInput` -> `"scriptAyanami/script"`.
  3. Catalog queried; if no singers match, system queries `PROJECTS` and formats project date in Thai Buddhist Era (`formatDateThai('2025-06-15')` -> `'15 มิถุนายน 2568'`).
- **Assertions:**
  - Sanitized query does not execute or inject.
  - Date converted to BE year `2568` and Thai month `'มิถุนายน'`.

---

## 6. Tier 4: Real-World Scenarios

### Test Case T4-RLW-01: End-to-End Voicebank Catalog Browsing Journey
- **User Journey:**
  1. User lands on Voicebank Catalog page.
  2. User types search query `"DiffSinger"` into search bar (debounced by 300ms).
  3. User applies dropdown filter: `Gender = 'Male'`.
  4. System filters 54 singers down to Male DiffSinger artists (`Ayanami Hikaru`, `SUN`, `Yamada Satoru`, `Yuuya Sato`, etc.).
  5. User clicks audio preview for `Ayanami Hikaru` (`Voice/Ayanami Hikaru.wav`).
  6. Audio player starts playback, updates master audio bar in footer.
  7. User clicks preview on `SUN` (`Voice/SUN.wav`) -> player stops Hikaru, plays SUN smoothly.
  8. User clicks `SUN` again -> toggles pause.
  9. User clicks "View Details" -> retrieves detail URL `'singers/sun.html'`.
- **Exact Verification Points:**
  - Initial catalog length === 54.
  - Search query debounces and filters accurately.
  - Track switching transfers `currentTrackId` from `'ayanami_hikaru'` to `'sun'`.
  - Toggle pause sets `isPlaying: false` without clearing `currentTrackId`.
  - `detailUrl` matches singer specification.

### Test Case T4-RLW-02: Music Resource Download & Thai Metadata Display
- **User Journey:**
  1. User browses Music File Catalog (`src/public/projectData.js` -> `MUSIC_FILES`).
  2. User filters files by format `'USTX'`.
  3. System returns 2 matching files (`Starlight Dreamer` & `Sound of Siam Heritage`).
  4. System formats file upload dates to Thai Buddhist Era (`'2025-05-10'` -> `'10 พฤษภาคม 2568'`).
  5. User triggers download tracking for `file_001` -> system returns download URL `https://drive.google.com/file/d/DELTA_USTX_001`.
  6. Toast notification displays `toastSuccess('เริ่มดาวน์โหลดไฟล์ Starlight Dreamer')`.
- **Exact Verification Points:**
  - `MUSIC_FILES.filter(f => f.format === 'USTX').length === 2`.
  - Dates format cleanly with Thai months and Buddhist Era.
  - Success toast renders with `#00C853` icon `'✓'`.

### Test Case T4-RLW-03: Beta Tester Feedback Submission with Validation, Debounce & Toast
- **User Journey:**
  1. User fills out Beta Tester form for `beta_diffsinger_hikaru_v2`.
  2. Form input contains untrusted HTML comments and trailing whitespace.
  3. `sanitizeInput` cleans the comment.
  4. User double-clicks "Submit" button rapidly (within 50ms).
  5. `debounce` / `throttle` ensures the submission network call executes exactly once.
  6. Backend mock returns success.
  7. UI displays `toastSuccess('ส่งความคิดเห็นเรียบร้อยแล้ว', 'ขอบคุณครับ')`.
- **Exact Verification Points:**
  - Sanitized text is clean.
  - Network submission called exactly 1 time despite multiple clicks.
  - Toast displays success message and action text.

### Test Case T4-RLW-04: Audio Playback Network Failure & Defensive Error Recovery
- **User Journey:**
  1. User clicks audio preview for a track with a corrupted or missing URL.
  2. Audio element triggers `onerror`.
  3. `audioPlayer.js` catches error event.
  4. Structured log generated: `logStandard('AudioPlayer', 'Audio playback', 'Failed to load Voice/missing.wav', 'Verify audio file exists in Voice/ directory', 'error')`.
  5. User-facing error toast rendered: `toastError('ไม่สามารถเล่นไฟล์เสียงได้', 'ตรวจสอบการเชื่อมต่อ')`.
  6. Player state safely resets to idle (`isPlaying: false`).
- **Exact Verification Points:**
  - `console.error` records structured message per AGENT.md Section 11.
  - `toastError` triggers with duration 4500ms and action text `'ตรวจสอบการเชื่อมต่อ'`.
  - Player state remains stable and ready for subsequent play requests.

---

## 7. Traceability Matrix to Requirements & AGENT.md

| Test Case IDs | Feature / Component | AGENT.md Standard | Acceptance Criteria |
|---|---|---|---|
| `T1-UTIL-01` .. `05`, `T2-BND-01` .. `03` | `$wSafely` (Root & Scoped) | Sec 6: Defensive Design | Zero unhandled exceptions on missing DOM elements |
| `T1-LOG-01` .. `05` | `logStandard` | Sec 11: Structured Logging | Exact `[Component] Action failed: <cause>. Suggested action: <next step>.` format |
| `T1-SAN-01` .. `05`, `T2-BND-04` | `sanitizeInput` | Sec 12: Security & Data Integrity | HTML tag stripping, whitespace trimming, 1000-char clamp |
| `T1-TIM-01` .. `05` | `debounce` & `throttle` | Sec 4: Resource Optimization | Pacing of UI events and form submissions |
| `T1-DAT-01` .. `05`, `T2-BND-05` | `formatDateThai` | Sec 9: Thai / English Bilingual | Accurate Buddhist Era (+543) and Thai month names |
| `T1-TST-01` .. `06`, `T3-XFT-03` | `toast.js` & `theme.js` | Sec 9: UI Standard & Geometry | Max 280x80px, (16,20) offset, 6px radius, #CC2200 / #1A1A1A / #F0F0F0 |
| `T1-AUD-01` .. `06`, `T2-BND-09` .. `10`, `T4-RLW-04` | `audioPlayer.js` | Sec 4 & 10: Audio Stability | Safe playback, toggle pause, track switching, subscriber isolation |
| `T1-VBK-01` .. `06`, `T2-BND-11` .. `12` | `voicebankData.js` | Sec 10: Phonemizer & Audio | All 54 singers, 18 mandatory fields, O(1) ID lookup & query |
| `T1-PRJ-01` .. `05` | `projectData.js` | Sec 14: Existing Assets | Complete projects, music files, events, beta catalogs |
| `T3-XFT-01` .. `05`, `T4-RLW-01` .. `04` | Cross-Feature & Real World | Sec 1, 3: Zero Known Defects | End-to-end integration workflows and failure recoveries |

---

## 8. Test Implementation Plan for Test Runner

When implementing the automated test runner in `tests/`:
1. Use Node.js built-in `node:test` (`describe`, `it`) and `node:assert/strict`.
2. Mock Wix Velo globals (`$w`, `$item`) in `tests/test-helpers.js`.
3. Provide mock `Audio` class in Node test environment to test `audioPlayer.js` event lifecycles.
4. Export test runners per tier:
   - `tests/tier1-feature-coverage.test.js`
   - `tests/tier2-boundary-corner.test.js`
   - `tests/tier3-cross-feature.test.js`
   - `tests/tier4-real-world-workloads.test.js`
5. Ensure 100% test pass rate with zero flaky assertions.
