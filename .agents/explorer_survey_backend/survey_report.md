# DELTA SYNTH — Backend & Security Comprehensive Survey Report

> **Auditor**: Explorer 2 (Backend & Security)  
> **Date**: 2026-08-16  
> **Scope**: `src/backend/` (`*.jsw`, `http-functions.js`, `data.js`, `permissions.json`, backend assets)  
> **Standards Reference**: AGENT.md (Sections 2, 3, 4, 5, 6, 11, 12, 16, 17) & ORIGINAL_REQUEST.md (R1, R3)

---

## 1. Executive Summary

This survey provides a comprehensive architectural and security audit of all backend web modules, REST endpoints, data hooks, and access control configurations within `src/backend/` of the DELTA SYNTH codebase.

### Overall Health Assessment
- **Architecture & Structure**: Clean modular separation into dedicated domain services (`contactService.jsw`, `registrationService.jsw`, `voicebankService.jsw`, `fileService.jsw`), REST interface (`http-functions.js`), and data hooks (`data.js`).
- **Permissions Coverage**: 100% of all 8 exported web methods across `.jsw` modules are explicitly declared in `permissions.json`.
- **Logging Compliance**: High compliance across `.jsw` services with AGENT.md Section 11 structure (`[Component] Action failed: <cause>. Suggested action: <next step>.`); **critical gap** identified in `http-functions.js` where all catch blocks lack logging.
- **Defensive Design & Type Safety**: Core business validations exist, but top-level defensive guards for non-object/null inputs and non-string field types are missing in several functions, causing runtime `TypeError` on malformed payloads.
- **Security & Least Privilege**: The wildcard fallback in `permissions.json` is set to `anonymous: true`, violating the principle of least privilege.

---

## 2. Complete Inventory of Backend Files

| File Path | Type | Lines / Size | Primary Responsibility & Exports |
|---|---|---|---|
| `src/backend/permissions.json` | JSON Config | 65 lines / 1.76 KB | Web module method access control configuration. |
| `src/backend/contactService.jsw` | Web Module | 67 lines / 3.02 KB | Contact & support message validation, sanitization, and ticket generation.<br>• `submitContactMessage(formData)` |
| `src/backend/registrationService.jsw` | Web Module | 120 lines / 5.50 KB | Event registration and Beta tester application services.<br>• `registerForEvent(formData)`<br>• `applyBetaTester(formData)` |
| `src/backend/voicebankService.jsw` | Web Module | 113 lines / 3.71 KB | Voicebank catalog filtering, pagination, singer detail lookup, and statistical aggregation.<br>• `getVoicebanksList(params)`<br>• `getSingerDetails(singerId)`<br>• `getVoicebankStats()` |
| `src/backend/fileService.jsw` | Web Module | 70 lines / 2.13 KB | Music resources query (USTX, MIDI, SVP, VSQX) and download telemetry recording.<br>• `getMusicFiles(options)`<br>• `trackFileDownload(fileId)` |
| `src/backend/http-functions.js` | REST Module | 104 lines / 3.18 KB | Public HTTP REST API endpoints & CORS handling.<br>• `options_voicebanks(request)`<br>• `get_voicebanks(request)`<br>• `get_singer(request)`<br>• `get_files(request)`<br>• `post_contact(request)`<br>• `post_register(request)` |
| `src/backend/data.js` | Data Hooks | 66 lines / 1.58 KB | Wix Data collection lifecycle hooks for automated timestamps, normalization, and defaults.<br>• `beforeInsert`, `beforeUpdate`<br>• `Voicebanks_beforeInsert`<br>• `Registrations_beforeInsert`<br>• `Contacts_beforeInsert` |
| `src/backend/README.md` | Documentation | 116 lines / 4.98 KB | Velo backend architecture guide and permissions.json reference. |
| `src/backend/assets/data/content.json` | Data Asset | 362 lines / 23.72 KB | Extracted text and content mapping from static pages. |
| `src/backend/assets/images/voicebanks/` | Asset Dir | Directory | Voicebank imagery and avatar directory. |

---

## 3. Deep-Dive Security & Code Quality Audit

### 3.1 `contactService.jsw`

- **Exported Function**: `submitContactMessage(formData)`
- **Observations**:
  - **Input Validation**:
    - Validates `formData.name` (length >= 2).
    - Validates `formData.email` via regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
    - Validates `formData.subject` (length >= 3).
    - Validates `formData.message` (length >= 10).
  - **Sanitization**: Calls `sanitizeInput()` on `name`, `email`, `subject`, `category`, and `message`.
  - **Identified Gaps**:
    1. **Null/Type Safety**: If `formData` is `null`, `undefined`, or a non-object, `!formData.name` throws an uncaught `TypeError: Cannot read properties of null (reading 'name')`.
    2. **String Method Invocation**: If `formData.name`, `subject`, or `message` is passed as a non-string (e.g. number/boolean/object), `.trim()` throws `TypeError: formData.name.trim is not a function`.
    3. **Enum/Whitelist Validation**: `formData.category` allows arbitrary strings instead of restricting to defined categories (`['General', 'Collaboration', 'Voicebank Issue', 'License']`).
    4. **Payload Size**: No maximum character validation in `errors` map before `sanitizeInput()` truncates to 1000 characters.
  - **Logging**:
    - Conforms to AGENT.md Section 11: `[ContactService] submitContactMessage failed: ${err.message}. Suggested action: Verify input fields.`

---

### 3.2 `registrationService.jsw`

- **Exported Functions**: `registerForEvent(formData)`, `applyBetaTester(formData)`
- **Observations**:
  - **`registerForEvent(formData)`**:
    - Validates `eventId`, `fullName` (length >= 2), and `email`.
    - Generates unique ID `REG_<timestamp>_<rand>`.
    - **Identified Gaps**:
      1. Throws `TypeError` if `formData` is null or non-object.
      2. `formData.fullName.trim()` throws `TypeError` if `fullName` is not a string.
      3. `eventId` is not validated against active IDs in `EVENTS` (`event_001`, `event_002` in `projectData.js`).
      4. `discord` and `note` accept unconstrained input before slicing.
  - **`applyBetaTester(formData)`**:
    - Validates `voicebankId`, `fullName`, `email`, and `dawOrEngine`.
    - Generates unique ID `BETA_<timestamp>_<rand>`.
    - **Identified Gaps**:
      1. Throws `TypeError` if `formData` is null or non-object.
      2. `voicebankId` is not validated against active items in `BETA_VOICEBANKS` (`projectData.js`).
      3. `experienceLevel` defaults to `'Intermediate'`, but accepts arbitrary unvalidated strings if passed.
      4. `dawOrEngine` lacks minimum/maximum length constraints.
  - **Logging**:
    - Conforms to AGENT.md:
      - `[RegistrationService] registerForEvent failed: ${err.message}. Suggested action: Verify form parameters.`
      - `[RegistrationService] applyBetaTester failed: ${err.message}. Suggested action: Check application payload.`

---

### 3.3 `voicebankService.jsw`

- **Exported Functions**: `getVoicebanksList(params)`, `getSingerDetails(singerId)`, `getVoicebankStats()`
- **Observations**:
  - **`getVoicebanksList(params)`**:
    - Implements safe boundary clamping for pagination:
      - `safePage = Math.max(1, parseInt(page, 10) || 1)`
      - `safePageSize = Math.max(1, Math.min(100, parseInt(pageSize, 10) || 12))`
      - `totalPages = Math.ceil(total / safePageSize) || 1`
    - Prevents pagination DoS / excessive memory consumption.
    - **Identified Gap**: If called explicitly with `null` (`getVoicebanksList(null)`), default parameter destructuring `= {}` does not trigger, causing `TypeError: Cannot destructure property 'gender' of 'null' as it is null`.
  - **`getSingerDetails(singerId)`**:
    - Validates `if (!singerId || typeof singerId !== 'string')`.
    - Returns structured error `{ success: false, data: null, error: ... }`.
    - Highly defensive and robust.
  - **`getVoicebankStats()`**:
    - Computes distribution across genders and engines from `VOICEBANKS`.
    - **Identified Gap**: Catch block returns `{ totalSingers: 0, engines: {}, genders: {}, supportedLanguages: 0 }` without an `error` or `success: false` field, preventing callers from detecting failures.
  - **Logging**:
    - Conforms to AGENT.md across all 3 methods.

---

### 3.4 `fileService.jsw`

- **Exported Functions**: `getMusicFiles(options)`, `trackFileDownload(fileId)`
- **Observations**:
  - **`getMusicFiles(options)`**:
    - Filters `MUSIC_FILES` by format (`USTX`, `MIDI`, `SVP`, `VSQX`) and keyword search.
    - **Identified Gaps**:
      1. Calling with `null` (`getMusicFiles(null)`) throws `TypeError` on destructuring.
      2. If `options.format` is a non-string, `format.toUpperCase()` throws `TypeError`.
      3. If `options.query` is a non-string, `query.toLowerCase()` throws `TypeError`.
  - **`trackFileDownload(fileId)`**:
    - Guards `if (!fileId) return { success: false }`.
    - **Identified Gaps**: Does not check `typeof fileId === 'string'` or verify whether `fileId` corresponds to an existing file in `MUSIC_FILES`.
  - **Logging**:
    - Conforms to AGENT.md:
      - `[FileService] getMusicFiles failed: ${err.message}. Suggested action: Check format parameter.`
      - `[FileService] trackFileDownload failed: ${err.message}. Suggested action: Retry log write.`

---

### 3.5 `http-functions.js`

- **Exposed Endpoints**:
  - `GET /_functions/voicebanks` -> `get_voicebanks(request)`
  - `GET /_functions/singer/:id` -> `get_singer(request)`
  - `GET /_functions/files` -> `get_files(request)`
  - `POST /_functions/contact` -> `post_contact(request)`
  - `POST /_functions/register` -> `post_register(request)`
  - `OPTIONS /_functions/voicebanks` -> `options_voicebanks(request)`
- **Identified Gaps & Vulnerabilities**:
  1. **Missing CORS Preflight Handlers**:
     - Only `options_voicebanks` is defined.
     - Missing `options_singer`, `options_files`, `options_contact`, `options_register`.
     - Web browsers issuing CORS preflight `OPTIONS` requests to `POST /_functions/contact` or `POST /_functions/register` will fail.
  2. **HTTP Status Code Accuracy**:
     - In `post_contact` and `post_register`, `await request.body.json()` failure (e.g. malformed JSON) jumps to `catch (err)` and returns status `500 Internal Server Error` instead of status `400 Bad Request`.
  3. **Violation of AGENT.md Section 11 Logging**:
     - **CRITICAL**: None of the catch blocks in `http-functions.js` perform structured console logging. All errors are silently wrapped in HTTP responses without server-side log traces.

---

### 3.6 `data.js`

- **Collection Hooks**: `beforeInsert`, `beforeUpdate`, `Voicebanks_beforeInsert`, `Registrations_beforeInsert`, `Contacts_beforeInsert`
- **Observations**:
  - Sets `_createdDate` and `_updatedDate` timestamps automatically.
  - Trims and lowercases `email` fields.
  - Sets default statuses (`Ready for Download`, `Confirmed`, `Pending`).
  - **Identified Gaps**:
    - Hooks assume `item` is a valid mutable object. If `item` is null/undefined, hooks throw `TypeError`.
    - If `item.name` is non-string in `Voicebanks_beforeInsert`, `item.name.trim()` throws `TypeError`.

---

## 4. Security Access Control Matrix (`permissions.json`)

| Module Path | Method Name | siteOwner | siteMember | anonymous | Risk Evaluation |
|---|---|:---:|:---:|:---:|---|
| `*` (Wildcard Fallback) | `*` | `true` | `true` | `true` | **HIGH RISK**: Violates Least Privilege. Undeclared or new backend methods automatically inherit public anonymous invoke permission. |
| `backend/voicebankService.jsw` | `getVoicebanksList` | `true` | `true` | `true` | **LOW RISK**: Public catalog read operation. Correct. |
| `backend/voicebankService.jsw` | `getSingerDetails` | `true` | `true` | `true` | **LOW RISK**: Public singer profile read operation. Correct. |
| `backend/voicebankService.jsw` | `getVoicebankStats` | `true` | `true` | `true` | **LOW RISK**: Public summary statistics read operation. Correct. |
| `backend/fileService.jsw` | `getMusicFiles` | `true` | `true` | `true` | **LOW RISK**: Public file catalog read operation. Correct. |
| `backend/fileService.jsw` | `trackFileDownload` | `true` | `true` | `true` | **LOW RISK**: Public download telemetry tracking. Correct. |
| `backend/registrationService.jsw` | `registerForEvent` | `true` | `true` | `true` | **MEDIUM RISK**: Public form submission. Input sanitization is required and present. |
| `backend/registrationService.jsw` | `applyBetaTester` | `true` | `true` | `true` | **MEDIUM RISK**: Public form submission. Input sanitization is required and present. |
| `backend/contactService.jsw` | `submitContactMessage` | `true` | `true` | `true` | **MEDIUM RISK**: Public contact form. Input sanitization is required and present. |

---

## 5. Compliance Matrix Against AGENT.md Standards

| AGENT.md Requirement | Status | Verification & Evidence | Action Required |
|---|:---:|---|---|
| **Section 2: Preserve Before Replace** | PASS | All existing contracts, method signatures, return structures, and Thai/English bilingual formats are preserved. | Maintain exact signatures during optimization. |
| **Section 6: Defensive Design (null/empty/malformed)** | PARTIAL | Basic checks present, but parameter destructuring with `null` and non-string methods throw `TypeError`. | Add top-level defensive guards and type validation across all services. |
| **Section 6: Zero Swallowed Exceptions** | PASS | No empty catch blocks found; errors are caught, logged, and propagated via structured result objects. | Add `error` field to `getVoicebankStats` catch return. |
| **Section 11: Structured Logging Format** | PARTIAL | All 4 `.jsw` modules use `[Component] Action failed: <cause>. Suggested action: <next step>.`<br>`http-functions.js` has **ZERO** logging in catch blocks. | Implement AGENT.md structured logging in `http-functions.js`. |
| **Section 12: Boundary Validation & Sanitization** | PASS / PARTIAL | `sanitizeInput()` is applied on all user strings. Whitelists for categories/events/beta voicebanks are missing. | Add whitelist verification for `category`, `eventId`, `voicebankId`, `experienceLevel`. |
| **Section 12: Least Privilege Permissions** | WARNING | Fallback wildcard `*` -> `*` allows `anonymous: true`. | Set wildcard fallback to `anonymous: false, siteMember: false, siteOwner: true`. |

---

## 6. Actionable Hardening Recommendations

### Recommendation 1: Universal Parameter Guard Pattern
Apply top-level defensive guards at the entry of every backend exported function:
```javascript
// Example for contactService.jsw
if (!formData || typeof formData !== 'object') {
  return {
    success: false,
    message: 'ข้อมูลที่ส่งมาไม่ถูกต้อง',
    errors: { system: 'Invalid request payload: expected object' }
  };
}
const safeName = typeof formData.name === 'string' ? formData.name.trim() : '';
```

### Recommendation 2: Least-Privilege `permissions.json`
Update wildcard fallback in `src/backend/permissions.json`:
```json
{
  "web-methods": {
    "*": {
      "*": {
        "siteOwner": { "invoke": true },
        "siteMember": { "invoke": false },
        "anonymous": { "invoke": false }
      }
    },
    "backend/voicebankService.jsw": { ... },
    "backend/fileService.jsw": { ... },
    "backend/registrationService.jsw": { ... },
    "backend/contactService.jsw": { ... }
  }
}
```

### Recommendation 3: Comprehensive CORS & Structured Logging in `http-functions.js`
- Export `options_singer`, `options_files`, `options_contact`, `options_register`.
- Add `console.error('[HttpFunctions] <endpoint> failed: ${err.message}. Suggested action: ...')` to all catch blocks.
- Distinguish 400 Bad Request from 500 Internal Server Error.

### Recommendation 4: Whitelist Domain Validation
- Whitelist `formData.category` in `contactService.jsw` against `['General', 'Collaboration', 'Voicebank Issue', 'License']`.
- Whitelist `formData.eventId` in `registrationService.jsw` against `EVENTS.map(e => e.id)`.
- Whitelist `formData.voicebankId` in `registrationService.jsw` against `BETA_VOICEBANKS.map(b => b.id)`.
- Whitelist `formData.experienceLevel` in `registrationService.jsw` against `['Beginner', 'Intermediate', 'Advanced', 'Professional']`.

---

## 7. Conclusion

The DELTA SYNTH backend codebase is well-structured and functional, with comprehensive web methods and explicit permissions. Addressing the identified defensive null guards, CORS preflights, structured logging in `http-functions.js`, and least-privilege wildcard fallback will bring the backend into 100% compliance with AGENT.md standards and ensure zero runtime defects.
