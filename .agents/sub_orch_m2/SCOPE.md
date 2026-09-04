# Scope: Milestone M2 (Backend & Security Hardening)

## Architecture & Code Layout
- `src/backend/contactService.jsw`: Backend contact submission handling, validation, db storage, email notification.
- `src/backend/registrationService.jsw`: Backend event/voicebank registration handling, validation, db storage, confirmation email.
- `src/backend/voicebankService.jsw`: Backend voicebank querying, filtering, search, metadata.
- `src/backend/fileService.jsw`: Backend file/asset management, secure upload URLs, downloads.
- `src/backend/http-functions.js`: HTTP endpoints (`get_singer`, `get_files`, `post_contact`, `post_register`, `options_*`), CORS headers, error status codes.
- `src/backend/data.js`: Wix Data collection hooks (`beforeInsert`, `beforeUpdate`, etc.) with validation and data hygiene.
- `src/backend/permissions.json`: Wix web method access control configuration.

## Feature Inventory & Tasks
| # | Feature | Scope / Requirements | Owned File | Status |
|---|---|---|---|---|
| 1 | Top-level Defensive Guards | Guard all `.jsw` exported functions against null/undefined/non-object inputs and unsafe `.trim()` calls | `src/backend/*.jsw` | DONE |
| 2 | Input Sanitization & Whitelisting | Whitelist category in `contactService.jsw`; whitelist eventId, voicebankId, experienceLevel in `registrationService.jsw` | `contactService.jsw`, `registrationService.jsw` | DONE |
| 3 | Standardized Structured Logging | Convert all catch blocks in `.jsw` and `http-functions.js` to `[Component] Action failed: <cause>. Suggested action: <next step>.` | `src/backend/*` | DONE |
| 4 | CORS Preflight & HTTP 400 Handling | Implement `options_singer`, `options_files`, `options_contact`, `options_register` in `http-functions.js`; return 400 on malformed JSON payload | `src/backend/http-functions.js` | DONE |
| 5 | Data Hook Object Validation | Add defensive object validation in `src/backend/data.js` hooks | `src/backend/data.js` | DONE |
| 6 | Permissions Audit & Hardening | Verify all 8 web methods in `permissions.json` and set wildcard `*` to least privilege (`siteOwner: true, siteMember: false, anonymous: false`) | `src/backend/permissions.json` | DONE |

## Interface Contracts
- All exported `.jsw` functions return structured promises resolving to `{ success: boolean, ... }` or throw/reject with standardized Error messages.
- HTTP functions return `response({ status, headers, body })` with consistent CORS headers (`Access-Control-Allow-Origin: *`, `Access-Control-Allow-Methods: GET, POST, OPTIONS`, `Access-Control-Allow-Headers: Content-Type`).
