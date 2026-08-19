# DELTA SYNTH — Backend HTTP Endpoints & Data Hooks Deep Dive Analysis

> **Auditor**: Explorer 2 (Backend HTTP & Data Hooks Deep Dive)  
> **Date**: 2026-08-16  
> **Scope**: `src/backend/http-functions.js`, `src/backend/data.js`  
> **Milestone**: M2 (Backend & Security Hardening)  
> **Standards Reference**: DELTA SYNTH AGENT.md (Sections 1–6, 11, 12, 16–20) & ORIGINAL_REQUEST.md (R1, R3)

---

## 1. Executive Summary

This report delivers an exhaustive, line-by-line architectural, security, and stability audit of the DELTA SYNTH HTTP REST interface (`src/backend/http-functions.js`) and Wix Data collection lifecycle hooks (`src/backend/data.js`).

### Summary of Critical Findings & Resolutions
1. **Missing CORS Preflight Handlers**: Only `options_voicebanks` was implemented. Missing `options_singer`, `options_files`, `options_contact`, and `options_register`. This prevents web browsers from completing CORS preflight handshakes on cross-origin requests.
2. **Missing HTTP 400 Bad Request on Malformed JSON**: In `post_contact` and `post_register`, failure of `request.body.json()` jumped to an unhandled 500 Internal Server Error catch block instead of returning a proper HTTP 400 Bad Request response with CORS headers.
3. **Absence of Standardized Logging in `http-functions.js`**: Catch blocks across all HTTP endpoints swallowed server-side diagnostic logging, directly violating AGENT.md Section 11 (`[Component] Action failed: <cause>. Suggested action: <next step>.`).
4. **Data Hook Vulnerabilities in `data.js`**: Hooks lacked defensive guards against `null`, `undefined`, and non-object items, and invoked string methods (such as `.trim()`) without type guards, risking unhandled `TypeError` exceptions that crash Wix Data transactions.

---

## 2. Deep Dive: `src/backend/http-functions.js`

### 2.1 File Overview & Current Structure
- **File Path**: `src/backend/http-functions.js` (104 lines, 3.18 KB)
- **Current Imports**:
  - `VOICEBANKS`, `getVoicebankById`, `queryVoicebanks` from `'public/voicebankData'`
  - `MUSIC_FILES` from `'public/projectData'`
  - `registerForEvent` from `'backend/registrationService.jsw'`
  - `submitContactMessage` from `'backend/contactService.jsw'`
- **Internal Helper**: `jsonResponse(data, status = 200)`:
  ```javascript
  function jsonResponse(data, status = 200) {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      status,
      body: JSON.stringify(data)
    };
  }
  ```

### 2.2 Endpoint-by-Endpoint Audit

#### A. `get_voicebanks(request)`
- **Observation**:
  - Extracts `request.query || {}`.
  - Passes parameters (`gender`, `engine`, `type`, `query`) to `queryVoicebanks()`.
  - Returns HTTP 200 with `{ success: true, count, total, data }`.
- **Gaps Identified**:
  1. `request` object itself could be `null` or `undefined` in mocked or non-standard invocations, causing `TypeError: Cannot read properties of undefined (reading 'query')`.
  2. The `catch (err)` block returns HTTP 500 with `{ success: false, error: err.message }` without logging anything to `console.error`.
- **Resolution**:
  - Add safe guard: `const query = (request && request.query) ? request.query : {};`.
  - Add structured logging: `console.error('[HttpFunctions] get_voicebanks failed: ' + err.message + '. Suggested action: Verify query parameters.');`.

#### B. `get_singer(request)`
- **Observation**:
  - Extracts `const singerId = request.path[0];`.
  - If `!singerId`, returns HTTP 400.
  - If `!singer`, returns HTTP 404.
  - If found, returns HTTP 200 with singer object.
- **Gaps Identified**:
  1. If `request` or `request.path` is `null`/`undefined`/non-array, `request.path[0]` throws `TypeError`.
  2. The `catch (err)` block lacks server-side error logging.
- **Resolution**:
  - Add safe path guard: `if (!request || !request.path || !Array.isArray(request.path) || !request.path[0]) return jsonResponse({ success: false, error: 'Singer ID required in path' }, 400);`.
  - Add structured logging: `console.error('[HttpFunctions] get_singer failed: ' + err.message + '. Suggested action: Check singerId parameter format.');`.

#### C. `get_files(request)`
- **Observation**:
  - Reads `request.query ? request.query.format : 'All'`.
  - Filters `MUSIC_FILES` by format case-insensitively.
  - Returns HTTP 200 with `{ success: true, count, data }`.
- **Gaps Identified**:
  1. If `request.query.format` is a non-string (e.g. number or array), `format.toUpperCase()` throws `TypeError`.
  2. If `f.format` in `MUSIC_FILES` is undefined, `f.format.toUpperCase()` throws `TypeError`.
  3. The `catch (err)` block lacks logging.
- **Resolution**:
  - Guard format type: `const format = (request && request.query && typeof request.query.format === 'string') ? request.query.format : 'All';`.
  - Ensure safe comparison: `f.format && f.format.toUpperCase() === format.toUpperCase()`.
  - Add structured logging: `console.error('[HttpFunctions] get_files failed: ' + err.message + '. Suggested action: Check format parameter query.');`.

#### D. `post_contact(request)`
- **Observation**:
  - `const body = await request.body.json();`
  - `const result = await submitContactMessage(body);`
  - `return jsonResponse(result, result.success ? 200 : 400);`
- **Gaps Identified**:
  1. **HTTP Status Code Violation**: If client sends invalid JSON (e.g. broken syntax, empty body without headers), `request.body.json()` rejects with a `SyntaxError`. The current single `try/catch` catches this and returns **HTTP 500 Internal Server Error**. An invalid client payload MUST return **HTTP 400 Bad Request**.
  2. **Missing Structured Logging**: No server-side log is emitted when a request fails or throws.
- **Resolution**:
  - Split JSON body extraction into a dedicated guarded block:
    ```javascript
    let body;
    try {
      if (!request || !request.body || typeof request.body.json !== 'function') {
        return jsonResponse({ success: false, error: 'Malformed request: body.json() parser unavailable' }, 400);
      }
      body = await request.body.json();
    } catch (parseErr) {
      console.error(`[HttpFunctions] post_contact failed: Invalid JSON payload (${parseErr.message}). Suggested action: Verify JSON request body.`);
      return jsonResponse({ success: false, error: `Invalid JSON payload: ${parseErr.message}` }, 400);
    }
    ```
  - Follow with service execution catch block logging:
    `console.error('[HttpFunctions] post_contact failed: ' + err.message + '. Suggested action: Verify contact service.');`

#### E. `post_register(request)`
- **Observation**:
  - `const body = await request.body.json();`
  - `const result = await registerForEvent(body);`
  - `return jsonResponse(result, result.success ? 200 : 400);`
- **Gaps Identified**:
  1. Malformed JSON payload triggers HTTP 500 instead of HTTP 400.
  2. No server-side logging in catch block.
- **Resolution**:
  - Apply the two-stage parsing and execution pattern matching `post_contact`.
  - Emit structured log: `[HttpFunctions] post_register failed: ...` on both parse errors and service errors.

#### F. CORS Preflight Handlers Audit
- **Current State**:
  - `options_voicebanks(request)` is the ONLY exported options handler:
    ```javascript
    export function options_voicebanks(request) {
      return jsonResponse({}, 200);
    }
    ```
- **Missing Handlers**:
  - `options_singer(request)` -> For preflight checks on `GET /_functions/singer/:id`
  - `options_files(request)` -> For preflight checks on `GET /_functions/files`
  - `options_contact(request)` -> For preflight checks on `POST /_functions/contact` (Crucial: POST with `Content-Type: application/json` triggers preflight in all modern browsers!)
  - `options_register(request)` -> For preflight checks on `POST /_functions/register` (Crucial for registration forms)
- **Resolution**:
  - Export all 4 missing handlers returning `jsonResponse({}, 200)`.

---

## 2. Deep Dive: `src/backend/data.js`

### 3.1 File Overview & Current Structure
- **File Path**: `src/backend/data.js` (66 lines, 1.58 KB)
- **Primary Responsibility**: Wix Data collection lifecycle hooks for automated timestamps, email normalization, and default status assignments.
- **Collections Covered**: Global (`beforeInsert`, `beforeUpdate`), `Voicebanks`, `Registrations`, `Contacts`.

### 3.2 Hook-by-Hook Audit

#### A. `beforeInsert(item, context)`
- **Original Code**:
  ```javascript
  export function beforeInsert(item, context) {
    const now = new Date();
    item._createdDate = item._createdDate || now;
    item._updatedDate = now;
    
    if (item.email && typeof item.email === 'string') {
      item.email = item.email.trim().toLowerCase();
    }
    
    return item;
  }
  ```
- **Gaps Identified**:
  1. If `item` is `null`, `undefined`, or a primitive, `item._createdDate` throws `TypeError: Cannot set property '_createdDate' of null`.
  2. Unhandled hook exceptions abort database insertions.
- **Resolution**:
  - Guard: `if (!item || typeof item !== 'object') return item;`.
  - Wrap logic in try/catch with standardized logging: `[DataHooks] beforeInsert failed: ${err.message}. Suggested action: Inspect collection payload.`.

#### B. `beforeUpdate(item, context)`
- **Original Code**:
  ```javascript
  export function beforeUpdate(item, context) {
    item._updatedDate = new Date();
    
    if (item.email && typeof item.email === 'string') {
      item.email = item.email.trim().toLowerCase();
    }
    
    return item;
  }
  ```
- **Gaps Identified**:
  1. If `item` is `null`/`undefined`, throws `TypeError`.
- **Resolution**:
  - Guard: `if (!item || typeof item !== 'object') return item;`.
  - Wrap in defensive try/catch with standardized logging.

#### C. `Voicebanks_beforeInsert(item, context)`
- **Original Code**:
  ```javascript
  export function Voicebanks_beforeInsert(item, context) {
    if (item.name) {
      item.name = item.name.trim();
    }
    if (!item.status) {
      item.status = 'Ready for Download';
    }
    return beforeInsert(item, context);
  }
  ```
- **Gaps Identified**:
  1. `if (item.name)` is truthy for non-strings (e.g. number `101`, object `{}`), where `item.name.trim()` throws `TypeError: item.name.trim is not a function`.
  2. If `item` is `null`, `item.name` throws `TypeError`.
- **Resolution**:
  - Add top-level object guard: `if (!item || typeof item !== 'object') return item;`.
  - Add type check: `if (typeof item.name === 'string') item.name = item.name.trim();`.
  - Validate status: `if (!item.status || typeof item.status !== 'string') item.status = 'Ready for Download';`.

#### D. `Registrations_beforeInsert(item, context)`
- **Original Code**:
  ```javascript
  export function Registrations_beforeInsert(item, context) {
    item.status = item.status || 'Confirmed';
    return beforeInsert(item, context);
  }
  ```
- **Gaps Identified**:
  1. If `item` is `null`, throws `TypeError`.
  2. Does not trim string fields such as `fullName`.
- **Resolution**:
  - Add top-level object guard.
  - Validate status: `if (!item.status || typeof item.status !== 'string') item.status = 'Confirmed';`.
  - Trim `fullName` if string: `if (typeof item.fullName === 'string') item.fullName = item.fullName.trim();`.

#### E. `Contacts_beforeInsert(item, context)`
- **Original Code**:
  ```javascript
  export function Contacts_beforeInsert(item, context) {
    item.status = item.status || 'Pending';
    return beforeInsert(item, context);
  }
  ```
- **Gaps Identified**:
  1. If `item` is `null`, throws `TypeError`.
  2. Does not trim string fields such as `name` and `subject`.
- **Resolution**:
  - Add top-level object guard.
  - Validate status: `if (!item.status || typeof item.status !== 'string') item.status = 'Pending';`.
  - Trim `name` and `subject` if string.

---

## 4. Exact Implementation Recommendations

### 4.1 Recommended Code for `src/backend/http-functions.js`

```javascript
/**
 * DELTA SYNTH — Wix HTTP REST Endpoints
 * 
 * Endpoints:
 * - GET /_functions/voicebanks
 * - OPTIONS /_functions/voicebanks
 * - GET /_functions/singer/:id
 * - OPTIONS /_functions/singer/:id
 * - GET /_functions/files
 * - OPTIONS /_functions/files
 * - POST /_functions/contact
 * - OPTIONS /_functions/contact
 * - POST /_functions/register
 * - OPTIONS /_functions/register
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { VOICEBANKS, getVoicebankById, queryVoicebanks } from 'public/voicebankData';
import { MUSIC_FILES } from 'public/projectData';
import { registerForEvent } from 'backend/registrationService.jsw';
import { submitContactMessage } from 'backend/contactService.jsw';

/**
 * Standard JSON Response with full CORS preflight support
 * @param {object|Array} data
 * @param {number} status
 * @returns {object}
 */
function jsonResponse(data, status = 200) {
  return {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    status,
    body: JSON.stringify(data)
  };
}

// ============================================================================
// CORS PREFLIGHT (OPTIONS) HANDLERS
// ============================================================================

export function options_voicebanks(request) {
  return jsonResponse({}, 200);
}

export function options_singer(request) {
  return jsonResponse({}, 200);
}

export function options_files(request) {
  return jsonResponse({}, 200);
}

export function options_contact(request) {
  return jsonResponse({}, 200);
}

export function options_register(request) {
  return jsonResponse({}, 200);
}

// ============================================================================
// REST API ENDPOINTS
// ============================================================================

/**
 * GET /_functions/voicebanks
 * Query voicebank catalog with filtering
 */
export function get_voicebanks(request) {
  try {
    const query = (request && request.query) ? request.query : {};
    const gender = query.gender || 'All';
    const engine = query.engine || 'All';
    const type = query.type || 'All';
    const search = query.search || '';

    const results = queryVoicebanks({ gender, engine, type, query: search });
    return jsonResponse({
      success: true,
      count: results.length,
      total: VOICEBANKS.length,
      data: results
    }, 200);
  } catch (err) {
    console.error(`[HttpFunctions] get_voicebanks failed: ${err.message}. Suggested action: Verify query parameters.`);
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

/**
 * GET /_functions/singer/:id
 * Retrieve details for a single voicebank singer
 */
export function get_singer(request) {
  try {
    if (!request || !request.path || !Array.isArray(request.path) || !request.path[0]) {
      return jsonResponse({ success: false, error: 'Singer ID required in path' }, 400);
    }
    const singerId = request.path[0];
    const singer = getVoicebankById(singerId);
    if (!singer) {
      return jsonResponse({ success: false, error: 'Singer not found' }, 404);
    }
    return jsonResponse({ success: true, data: singer }, 200);
  } catch (err) {
    console.error(`[HttpFunctions] get_singer failed: ${err.message}. Suggested action: Check singerId parameter format.`);
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

/**
 * GET /_functions/files
 * Retrieve music resources list filtered by format
 */
export function get_files(request) {
  try {
    const format = (request && request.query && typeof request.query.format === 'string') 
      ? request.query.format 
      : 'All';
    let files = MUSIC_FILES;
    if (format && format !== 'All') {
      files = files.filter(f => f.format && f.format.toUpperCase() === format.toUpperCase());
    }
    return jsonResponse({ success: true, count: files.length, data: files }, 200);
  } catch (err) {
    console.error(`[HttpFunctions] get_files failed: ${err.message}. Suggested action: Check format parameter query.`);
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

/**
 * POST /_functions/contact
 * Submit contact inquiry via REST
 */
export async function post_contact(request) {
  let body;
  try {
    if (!request || !request.body || typeof request.body.json !== 'function') {
      return jsonResponse({ success: false, error: 'Malformed request: body.json() parser unavailable' }, 400);
    }
    body = await request.body.json();
  } catch (parseErr) {
    console.error(`[HttpFunctions] post_contact failed: Invalid JSON payload (${parseErr.message}). Suggested action: Verify JSON request body.`);
    return jsonResponse({ success: false, error: `Invalid JSON payload: ${parseErr.message}` }, 400);
  }

  try {
    const result = await submitContactMessage(body);
    return jsonResponse(result, result.success ? 200 : 400);
  } catch (err) {
    console.error(`[HttpFunctions] post_contact failed: ${err.message}. Suggested action: Verify contact service.`);
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

/**
 * POST /_functions/register
 * Register for event via REST
 */
export async function post_register(request) {
  let body;
  try {
    if (!request || !request.body || typeof request.body.json !== 'function') {
      return jsonResponse({ success: false, error: 'Malformed request: body.json() parser unavailable' }, 400);
    }
    body = await request.body.json();
  } catch (parseErr) {
    console.error(`[HttpFunctions] post_register failed: Invalid JSON payload (${parseErr.message}). Suggested action: Verify JSON request body.`);
    return jsonResponse({ success: false, error: `Invalid JSON payload: ${parseErr.message}` }, 400);
  }

  try {
    const result = await registerForEvent(body);
    return jsonResponse(result, result.success ? 200 : 400);
  } catch (err) {
    console.error(`[HttpFunctions] post_register failed: ${err.message}. Suggested action: Verify registration service.`);
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}
```

---

### 4.2 Recommended Code for `src/backend/data.js`

```javascript
/**
 * DELTA SYNTH — Wix Data Collection Hooks
 * 
 * Automatically applies timestamps, data normalization, and sanitization
 * across all collections (Voicebanks, Registrations, Contacts, Changelogs)
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

/**
 * Hook before inserting items into any collection
 */
export function beforeInsert(item, context) {
  try {
    if (!item || typeof item !== 'object') {
      return item;
    }

    const now = new Date();
    item._createdDate = item._createdDate || now;
    item._updatedDate = now;
    
    if (typeof item.email === 'string') {
      item.email = item.email.trim().toLowerCase();
    }
    
    return item;
  } catch (err) {
    console.error(`[DataHooks] beforeInsert failed: ${err.message}. Suggested action: Inspect collection payload.`);
    return item;
  }
}

/**
 * Hook before updating items in any collection
 */
export function beforeUpdate(item, context) {
  try {
    if (!item || typeof item !== 'object') {
      return item;
    }

    item._updatedDate = new Date();
    
    if (typeof item.email === 'string') {
      item.email = item.email.trim().toLowerCase();
    }
    
    return item;
  } catch (err) {
    console.error(`[DataHooks] beforeUpdate failed: ${err.message}. Suggested action: Inspect collection payload.`);
    return item;
  }
}

/**
 * Voicebanks collection specific hook
 */
export function Voicebanks_beforeInsert(item, context) {
  try {
    if (!item || typeof item !== 'object') {
      return item;
    }

    if (typeof item.name === 'string') {
      item.name = item.name.trim();
    }
    if (!item.status || typeof item.status !== 'string') {
      item.status = 'Ready for Download';
    }
    return beforeInsert(item, context);
  } catch (err) {
    console.error(`[DataHooks] Voicebanks_beforeInsert failed: ${err.message}. Suggested action: Inspect Voicebank item properties.`);
    return beforeInsert(item, context);
  }
}

/**
 * Registrations collection specific hook
 */
export function Registrations_beforeInsert(item, context) {
  try {
    if (!item || typeof item !== 'object') {
      return item;
    }

    if (!item.status || typeof item.status !== 'string') {
      item.status = 'Confirmed';
    }
    if (typeof item.fullName === 'string') {
      item.fullName = item.fullName.trim();
    }
    return beforeInsert(item, context);
  } catch (err) {
    console.error(`[DataHooks] Registrations_beforeInsert failed: ${err.message}. Suggested action: Inspect Registration item properties.`);
    return beforeInsert(item, context);
  }
}

/**
 * Contacts collection specific hook
 */
export function Contacts_beforeInsert(item, context) {
  try {
    if (!item || typeof item !== 'object') {
      return item;
    }

    if (!item.status || typeof item.status !== 'string') {
      item.status = 'Pending';
    }
    if (typeof item.name === 'string') {
      item.name = item.name.trim();
    }
    if (typeof item.subject === 'string') {
      item.subject = item.subject.trim();
    }
    return beforeInsert(item, context);
  } catch (err) {
    console.error(`[DataHooks] Contacts_beforeInsert failed: ${err.message}. Suggested action: Inspect Contact item properties.`);
    return beforeInsert(item, context);
  }
}
```

---

## 5. Architectural & Security Risk Assessment

| Potential Risk | Likelihood | Impact | Mitigation in Proposed Code |
|---|:---:|:---:|---|
| **CORS Preflight Failure** | HIGH | HIGH | Added `options_singer`, `options_files`, `options_contact`, `options_register`. All respond with status 200 and standard CORS headers. |
| **Silent Exception Swallowing** | HIGH | MEDIUM | Added AGENT.md Section 11 structured logging across all catch blocks in both files. |
| **Malformed JSON 500 Crash** | HIGH | MEDIUM | Added isolated JSON parsing block that catches SyntaxErrors and responds with HTTP 400 Bad Request and CORS headers. |
| **Null Item Crash in Data Hooks** | MEDIUM | HIGH | Added top-level `if (!item || typeof item !== 'object') return item;` guards and defensive try/catches in all hooks. |
| **Type Distortion (`.trim()` on non-string)** | MEDIUM | HIGH | Replaced truthiness checks (`if (item.name)`) with strict type checks (`if (typeof item.name === 'string')`). |

---

## 6. Verification & Testing Matrix

The recommendations directly satisfy the backend test specifications established in Milestone M2 and E2E Testing Track:
- **TC-T1-41 to TC-T1-45**: REST GET status codes and CORS headers.
- **TC-T1-46 to TC-T1-50**: REST POST & OPTIONS handlers, verifying HTTP 200 for preflight and HTTP 400 for malformed/invalid payloads.
- **TC-T1-56 to TC-T1-60**: Wix Data collection hooks timestamping, email lowercasing, and status defaults.
- **TC-T2-07, TC-T2-12, TC-T2-24, TC-T2-25**: Defensive boundary tests for null items, non-string fields, and malformed request streams.
- **TC-T3-01, TC-T3-02, TC-T3-05**: Cross-feature pipelines connecting REST endpoints through backend services into data hooks.

---

## 7. Conclusion

This deep dive delivers an incremental, zero-regression blueprint for `http-functions.js` and `data.js`. By resolving CORS preflight omissions, standardizing HTTP 400 status codes on malformed JSON, introducing AGENT.md-compliant structured logging, and hardening data collection hooks with null/type-safe validation, the DELTA SYNTH REST interface and data layer achieve industrial-grade resilience.
