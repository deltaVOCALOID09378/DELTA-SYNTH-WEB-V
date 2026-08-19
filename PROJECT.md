# Project: DELTA SYNTH Velo Hardening & Optimization

## Architecture
DELTA SYNTH is a bilingual (Thai/English) virtual singer ecosystem and catalog platform built on Wix Velo architecture, backed by custom JSW backend web modules and static web assets.
- **Frontend Page Layer (`src/pages/`)**: 14 Velo page scripts managing UI interactions, repeaters, forms, and audio controls across the master layout and dedicated views.
- **Public Core Layer (`src/public/`)**: Shared utilities (`utils.js`), toast notification engine (`toast.js`), design tokens (`theme.js`), global audio singleton (`audioPlayer.js`), static 54-voicebank catalog (`voicebankData.js`), and project catalogs (`projectData.js`).
- **Backend Service Layer (`src/backend/`)**: Web modules (`contactService.jsw`, `registrationService.jsw`, `voicebankService.jsw`, `fileService.jsw`), REST API (`http-functions.js`), data hooks (`data.js`), and access control (`permissions.json`).
- **Testing Layer (`tests/`)**: 4-Tier Opaque-box E2E test harness and unit test suites running under Node test environment.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Scoped Safe Element Access | Enhanced `$wSafely(selector, action, scope)` supporting canvas and repeater `$item` contexts | M1, M3 | Survey Explorer 1 & 3 |
| F2 | Zero Swallowed Exceptions | Elimination of empty catch blocks (`catch (_) {}`) across all public, backend, and page scripts | M1, M2, M3 | Survey Explorer 1 & 2 |
| F3 | Structured Logging Format | Standardization to `[Component] Action failed: <cause>. Suggested action: <next step>.` | M1, M2, M3 | Survey Explorer 1, 2, 3 |
| F4 | Toast Engine & Geometry | Validation of max 280x80px, bottom-right (16,20), 6px radius, and Leelawadee UI theme | M1 | Survey Explorer 1 & 3 |
| F5 | Toast Signature Fix | Correction of string argument signatures in `wixPageTemplate.js` | M1 | Survey Explorer 1 |
| F6 | Audio Player Stability | Play promise token tracking, event listener detachment on stop, and clean disposal | M1 | Survey Explorer 3 |
| F7 | 54-Voicebank Catalog Caching | O(1) in-memory Map lookup and efficient filtering for all 54 singers | M1 | Survey Explorer 3 |
| F8 | Backend Input Defense & Whitelisting | Top-level object/string validation and domain whitelisting across all `.jsw` services | M2 | Survey Explorer 2 |
| F9 | Permissions Access Control | Verification of all 8 web methods and least-privilege wildcard fallback in `permissions.json` | M2 | Survey Explorer 2 |
| F10 | REST API CORS & HTTP Codes | CORS preflight OPTIONS handlers and accurate 400 Bad Request error status in `http-functions.js` | M2 | Survey Explorer 2 |
| F11 | Wix Data Hooks Defense | Safe item validation and defensive normalization in `data.js` | M2 | Survey Explorer 2 |
| F12 | ESLint & Unused Import Cleanup | Clean all unused imports across 11 page scripts for 100% clean ESLint checks | M3 | Survey Explorer 1 |
| F13 | Repeater Error Boundaries | Scoped element lookups and try/catch boundaries across all 9 repeater pages | M3 | Survey Explorer 1 |
| F14 | Form Submission & Array Bounds | `isSubmitting` debounce guards on forms and `array.length > 0` checks before modulo access | M3 | Survey Explorer 1 |
| F15 | E2E 4-Tier Test Suite | Comprehensive opaque-box test runner covering Tiers 1-4 (>100 test cases) | E2E Track, M4 | Survey Explorer 3 |
| F16 | Adversarial Hardening | White-box edge case testing and gap closure (Tier 5) | M4 | AGENT.md & Dual Track |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Track | Test harness (`tests/`) covering Tiers 1-4, `TEST_INFRA.md` & `TEST_READY.md` | Survey | IN_PROGRESS |
| M1 | Public Core & Audio Hardening | `src/public/utils.js`, `audioPlayer.js`, `voicebankData.js`, `toast.js`, `theme.js`, `wixPageTemplate.js` | Survey | IN_PROGRESS |
| M2 | Backend & Security Hardening | `src/backend/*.jsw`, `http-functions.js`, `data.js`, `permissions.json` | M1 contracts | IN_PROGRESS |
| M3 | Page Scripts Quality & Defensiveness | All 14 page scripts in `src/pages/*.js` | M1, M2 | PLANNED |
| M4 | Final E2E Pass & Adversarial Hardening | 100% E2E test pass (Tiers 1-4) and Tier 5 adversarial verification | E2E, M1, M2, M3 | PLANNED |

## Interface Contracts
### `src/public/utils.js` ↔ Consumers (Pages & Services)
- `$wSafely(selector: string, action?: Function, scope?: Function): Element | null`
  - Safe element lookup with optional `scope` (defaults to `$w` if undefined, or accepts `$item` in repeaters).
  - Returns element or null without throwing exceptions.
- `logStandard(component: string, action: string, cause: string, suggestedAction: string, level?: 'error'|'warn'|'info'): void`
  - Outputs formatted `[Component] Action failed: <cause>. Suggested action: <next step>.`.
- `sanitizeInput(input: string, maxLength?: number): string`
  - Strips HTML tags/entities, trims whitespace, and clamps to maxLength.
- `debounce(func: Function, wait?: number): Function`
- `formatDateThai(dateInput: any, includeTime?: boolean): string`

### `src/public/audioPlayer.js` ↔ Pages (`masterPage.js`, `All DELTA's Voicebank.acsro.js`, etc.)
- `globalAudioPlayer.play(trackId: string, trackUrl: string): Promise<boolean>`
- `globalAudioPlayer.pause(): void`
- `globalAudioPlayer.stop(): void`
- `globalAudioPlayer.subscribe(listener: Function): Function` (returns unsubscribe function)
- `globalAudioPlayer.getState(): { isPlaying: boolean, currentTrackId: string|null, currentTrackUrl: string|null }`

### `src/public/toast.js` ↔ Pages & Components
- `showToast(options: { message: string, actionText?: string, type?: 'success'|'error'|'warning'|'info', duration?: number, onAction?: Function }): void`
- `toastSuccess(message: string, actionText?: string): void`
- `toastError(message: string, actionText?: string): void`
- `toastWarning(message: string, actionText?: string): void`
- `toastInfo(message: string, actionText?: string): void`

### `src/backend/*.jsw` ↔ Pages & HTTP Functions
- `submitContactMessage(formData: Object): Promise<{ success: boolean, message: string, ticketId?: string, errors?: Object }>`
- `registerForEvent(formData: Object): Promise<{ success: boolean, message: string, registrationId?: string, errors?: Object }>`
- `applyBetaTester(formData: Object): Promise<{ success: boolean, message: string, applicationId?: string, errors?: Object }>`
- `getVoicebanksList(params?: Object): Promise<{ success: boolean, data: Array, total: number, page: number, pageSize: number, totalPages: number }>`
- `getSingerDetails(singerId: string): Promise<{ success: boolean, data: Object|null, error?: string }>`
- `getVoicebankStats(): Promise<{ success: boolean, data: Object, error?: string }>`
- `getMusicFiles(options?: Object): Promise<{ success: boolean, data: Array, total: number }>`
- `trackFileDownload(fileId: string): Promise<{ success: boolean, message?: string }>`

## Code Layout
- `src/public/`: Public shared utilities, audio singleton, toast manager, data catalogs, styles, and static HTML portals.
- `src/backend/`: Backend web methods (`.jsw`), REST routes (`http-functions.js`), data hooks (`data.js`), access permissions (`permissions.json`).
- `src/pages/`: 14 Wix Velo page scripts for site views.
- `tests/`: Automated unit & E2E test suites and runner harness.
- `.agents/`: Agent orchestration state, plans, handoffs, and verification logs.
