# Milestone M2 Handoff Report — Security Permissions & Cross-Cutting Architecture

> **Agent**: Explorer 3 (Security Permissions & Cross-Cutting Architecture)  
> **Milestone**: M2 (Backend & Security Hardening)  
> **Date**: 2026-08-16  
> **Recipient**: Sub-Orchestrator M2 / Lead Orchestrator

---

## 1. Observation

### 1.1 `src/backend/permissions.json`
- **Lines 3–15**:
  ```json
  "*": {
    "*": {
      "siteOwner": { "invoke": true },
      "siteMember": { "invoke": true },
      "anonymous": { "invoke": true }
    }
  }
  ```
  The wildcard fallback permits anonymous execution of all unlisted backend web methods.
- **Lines 16–63**: Exactly 8 web methods are explicitly declared across 4 `.jsw` modules:
  1. `backend/voicebankService.jsw` -> `getVoicebanksList` (Line 17)
  2. `backend/voicebankService.jsw` -> `getSingerDetails` (Line 22)
  3. `backend/voicebankService.jsw` -> `getVoicebankStats` (Line 27)
  4. `backend/fileService.jsw` -> `getMusicFiles` (Line 34)
  5. `backend/fileService.jsw` -> `trackFileDownload` (Line 39)
  6. `backend/registrationService.jsw` -> `registerForEvent` (Line 46)
  7. `backend/registrationService.jsw` -> `applyBetaTester` (Line 51)
  8. `backend/contactService.jsw` -> `submitContactMessage` (Line 58)

### 1.2 `src/backend/*.jsw`
- `src/backend/contactService.jsw`:
  - Line 28: `!formData.name || formData.name.trim().length < 2` throws `TypeError` when `formData` is `null`, `undefined`, non-object, or `name` is a non-string.
  - Line 46: `formData.category` allows unconstrained strings without whitelist validation.
- `src/backend/registrationService.jsw`:
  - Line 28 & Line 81: Property dereferencing crashes on null/non-object `formData`.
  - Line 29 & Line 82: `fullName.trim()` throws `TypeError` if `fullName` is non-string.
  - Line 100: `experienceLevel` accepts arbitrary strings without whitelist validation.
- `src/backend/voicebankService.jsw`:
  - Line 25: `export async function getVoicebanksList({ gender = 'All', ... } = {})` crashes with `TypeError: Cannot destructure property 'gender' of 'null'` when invoked as `getVoicebanksList(null)`.
  - Line 110: Catch block in `getVoicebankStats` returns `{ totalSingers: 0, engines: {}, genders: {}, supportedLanguages: 0 }` without error indicators.
- `src/backend/fileService.jsw`:
  - Line 21: `export async function getMusicFiles({ format = 'All', ... } = {})` crashes on `getMusicFiles(null)`.
  - Line 26: `format.toUpperCase()` crashes if `format` is a non-string.

### 1.3 `src/backend/http-functions.js`
- Line 32: Only `options_voicebanks` is exported. Missing `options_singer`, `options_files`, `options_contact`, `options_register`.
- Lines 87 & 97: `await request.body.json()` errors are caught in global `catch (err)` and returned as `HTTP 500 Internal Server Error` instead of `HTTP 400 Bad Request`.
- Lines 51, 67, 80, 90, 100: Catch blocks contain zero server-side console logging.

### 1.4 `src/backend/data.js`
- Lines 13, 28, 41, 54, 62: Collection hooks do not verify `if (!item || typeof item !== 'object')` and risk crashing on null items.

---

## 2. Logic Chain

1. **Least Privilege Enforcement**:
   - Observations show that all 8 web methods are explicitly declared with `"anonymous": { "invoke": true }`.
   - Tightening the wildcard `*` to `siteOwner: true, siteMember: false, anonymous: false` guarantees that any newly created or undeclared backend function cannot be executed anonymously by default.
   - Because all 8 legitimate public methods have explicit permissions, tightening the fallback causes zero functional regression.

2. **Defensive Parameter Coercion & Zero Swallowed Exceptions**:
   - In JavaScript, destructuring defaults (`= {}`) do not trigger on `null`.
   - Directly calling `.trim()` on non-string properties throws a runtime `TypeError`.
   - Applying `const safeParams = (params && typeof params === 'object' && !Array.isArray(params)) ? params : {};` and checking `typeof val === 'string'` guarantees robust runtime stability across all inputs.

3. **CORS & HTTP Standard Compliance**:
   - Modern browsers send preflight `OPTIONS` requests before cross-origin POST or custom header GET requests.
   - Without `options_contact` and `options_register`, browser form submissions via REST endpoints fail with CORS network errors.
   - Returning HTTP 400 on invalid JSON payloads correctly informs clients of syntax errors, while structured logging traces the failure for server maintainers.

---

## 3. Caveats

- **Wix Data Engine Runtime**: In production Wix sites, collection hooks run inside the Wix Data engine pipeline. The hooks in `src/backend/data.js` provide defensive normalization and hygiene for collection operations.
- **Node Test Environment**: Direct testing of `.jsw` and `.js` modules in Node.js requires mocking Wix Velo globals (`$w`, `wix-data`, etc.) or invoking pure functions directly via unit tests.
- **No Caveats on Permission Semantics**: The 8 public methods require anonymous access for the public-facing catalog and inquiry forms; administrative functions must remain protected under the hardened wildcard fallback.

---

## 4. Conclusion

1. `permissions.json` must be updated to set `"web-methods"."*"."*"` to `{ "siteOwner": { "invoke": true }, "siteMember": { "invoke": false }, "anonymous": { "invoke": false } }`.
2. All 4 `.jsw` files (`contactService.jsw`, `registrationService.jsw`, `voicebankService.jsw`, `fileService.jsw`) must receive top-level defensive object/type guards and domain whitelisting.
3. `http-functions.js` must export all 4 missing `options_*` handlers, return HTTP 400 on malformed JSON payloads, and implement AGENT.md Section 11 structured logging across all catch blocks.
4. `data.js` collection hooks must defensively check `item` existence before property manipulation.
5. All full code replacement specifications are documented in `analysis.md`.

---

## 5. Verification Method

### 5.1 Verification Checklist & Commands
1. **Static Analysis & Code Inspection**:
   - Inspect `src/backend/permissions.json` to verify wildcard `*` has `anonymous: false` and `siteMember: false`.
   - Inspect `src/backend/*.jsw` to verify all 8 functions guard against `null`, `undefined`, numbers, and non-string types.
   - Inspect `src/backend/http-functions.js` to verify exports `options_voicebanks`, `options_singer`, `options_files`, `options_contact`, `options_register`.
2. **Automated Test Harness Execution**:
   - Run Node test runner: `node tests/run-all-tests.js` (once constructed by E2E track).
   - Test cases must verify:
     - `getVoicebanksList(null)` -> returns empty results without crashing.
     - `submitContactMessage(null)` -> returns `{ success: false, errors: { ... } }`.
     - `registerForEvent(null)` -> returns `{ success: false, errors: { ... } }`.
     - `applyBetaTester(null)` -> returns `{ success: false, errors: { ... } }`.
     - `getMusicFiles(null)` -> returns `{ success: true, files: [...] }`.
     - `options_contact({})` -> returns `{ status: 200, headers: { ... } }`.
     - `post_contact({ body: { json: () => Promise.reject(new Error("bad json")) } })` -> returns status 400.
3. **Invalidation Conditions**:
   - If any `.jsw` function throws an uncaught `TypeError` when passed `null` or `{ name: 123 }`.
   - If `options_contact` or `options_register` returns a non-200 or missing CORS header response.
