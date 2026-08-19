# Milestone M2 — Backend Services (.jsw) Deep Dive Analysis

> **Author**: Explorer M2.1 (Backend Services Deep Dive)  
> **Date**: 2026-08-16  
> **Target Scope**: `src/backend/contactService.jsw`, `src/backend/registrationService.jsw`, `src/backend/voicebankService.jsw`, `src/backend/fileService.jsw`, `src/backend/permissions.json`, `src/backend/http-functions.js`, `src/backend/data.js`  
> **Standard**: DELTA SYNTH AGENT.md (Preserve → Strengthen → Optimize → Verify)

---

## 1. Executive Summary & Function Mapping

A comprehensive security, resilience, and architectural deep dive was conducted on all backend web modules (`.jsw`) in the DELTA SYNTH repository. 

### Exported Function Inventory & Mapping

| Service Module | Exported Function in Codebase | Survey / Request Alias | Status |
|---|---|---|---|
| `contactService.jsw` | `submitContactMessage(formData)` | `submitContactForm` | Active |
| `registrationService.jsw` | `registerForEvent(formData)` | `registerForEvent` | Active |
| `registrationService.jsw` | `applyBetaTester(formData)` | `getRegistrations` (Application API) | Active |
| `voicebankService.jsw` | `getVoicebanksList(params)` | `queryVoicebanks` (Backend Web Method) | Active |
| `voicebankService.jsw` | `getSingerDetails(singerId)` | `getVoicebankById` (Backend Web Method) | Active |
| `voicebankService.jsw` | `getVoicebankStats()` | `getVoicebankStats` | Active |
| `fileService.jsw` | `getMusicFiles(options)` | `getDownloadUrl` / Catalog query | Active |
| `fileService.jsw` | `trackFileDownload(fileId)` | Telemetry / Download tracker | Active |

All 8 web methods are explicitly declared in `src/backend/permissions.json`.

---

## 2. Comprehensive Parameter & Type Safety Audit

### Vulnerability Pattern Matrix

| File | Function | Null/Undefined Crash | Non-Object Input Crash | Non-String `.trim()` Crash | Domain Whitelisting Missing | Swallowed Error / Weak Return |
|---|---|:---:|:---:|:---:|:---:|:---:|
| `contactService.jsw` | `submitContactMessage` | ⚠️ Yes | ⚠️ Yes | ⚠️ Yes | ⚠️ Yes | Clean (propagates err) |
| `registrationService.jsw` | `registerForEvent` | ⚠️ Yes | ⚠️ Yes | ⚠️ Yes | ⚠️ Yes | Clean (propagates err) |
| `registrationService.jsw` | `applyBetaTester` | ⚠️ Yes | ⚠️ Yes | ⚠️ Yes | ⚠️ Yes | Clean (propagates err) |
| `voicebankService.jsw` | `getVoicebanksList` | ⚠️ Yes (`params=null`) | ⚠️ Yes | Clean | Clean | Clean (propagates err) |
| `voicebankService.jsw` | `getSingerDetails` | Clean | Clean | Clean | Clean | Clean |
| `voicebankService.jsw` | `getVoicebankStats` | Clean | Clean | Clean | Clean | ⚠️ Lacks `success: false` / `error` on catch |
| `fileService.jsw` | `getMusicFiles` | ⚠️ Yes (`options=null`) | ⚠️ Yes | ⚠️ Yes (`format.toUpperCase`) | ⚠️ Yes | Clean |
| `fileService.jsw` | `trackFileDownload` | Clean | Clean | Clean | ⚠️ Checks existence | Clean |

---

## 3. Deep Dive per Backend Service

### 3.1 `src/backend/contactService.jsw`

#### Direct Observations
1. **Top-Level Null/Non-Object Vulnerability**:
   - Line 28: `if (!formData.name || formData.name.trim().length < 2)`
   - Calling `submitContactMessage(null)` or `submitContactMessage(undefined)` throws an uncaught `TypeError: Cannot read properties of null (reading 'name')` which drops into the catch block, but returns a generic system error instead of an informative validation error payload `{ success: false, errors: { system: '...' } }`.
2. **Type Coercion & Non-String `.trim()`**:
   - If `formData.name` is passed as a number (e.g. `{ name: 12345 }`), `!formData.name` evaluates to `false`, and `formData.name.trim()` throws `TypeError: formData.name.trim is not a function`.
   - The same vulnerability exists on `formData.subject` and `formData.message`.
3. **Category Domain Whitelisting Gap**:
   - Line 46: `category: sanitizeInput(formData.category || 'General')`
   - Any arbitrary string payload is accepted (e.g. `category: '<script>evil</script>'` or `category: 'UNREGISTERED_CAT'`).
   - Defined valid categories according to DELTA SYNTH design:
     `['General', 'Collaboration', 'Voicebank Issue', 'License', 'Support', 'Feedback', 'Inquiry', 'Bug Report', 'Partnership']`
4. **Length Clamping & Boundary Validation**:
   - `name`: Min 2, Max 100 characters.
   - `email`: RFC 5321 length <= 254 chars, Regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
   - `subject`: Min 3, Max 200 characters.
   - `message`: Min 10, Max 5000 characters.

---

### 3.2 `src/backend/registrationService.jsw`

#### Direct Observations
1. **`registerForEvent(formData)`**:
   - **Parameter Check**: If `!formData || typeof formData !== 'object'`, throws `TypeError`.
   - **`fullName`**: If non-string, `formData.fullName.trim()` throws `TypeError`.
   - **`eventId` Whitelisting**:
     - Line 28: `if (!formData.eventId) errors.eventId = 'กรุณาระบุงานอีเวนต์ที่ต้องการสมัคร';`
     - Does not validate whether `eventId` actually exists in `EVENTS` catalog (`src/public/projectData.js`).
     - Valid event IDs: `EVENTS.map(e => e.id)` (`'event_001'`, `'event_002'`).
   - **`discord` and `note`**: Should safely handle non-strings with trimming and max length (discord <= 50, note <= 500).
2. **`applyBetaTester(formData)`**:
   - **Parameter Check**: If `!formData || typeof formData !== 'object'`, throws `TypeError`.
   - **`voicebankId` Whitelisting**:
     - Line 81: `if (!formData.voicebankId) errors.voicebankId = 'กรุณาเลือกคลังเสียง BETA';`
     - Does not validate against active beta items in `BETA_VOICEBANKS` (`src/public/projectData.js`).
     - Valid beta voicebank IDs: `BETA_VOICEBANKS.map(b => b.id)` (`'beta_diffsinger_hikaru_v2'`, `'beta_diffsinger_sun_v2'`, `'beta_thitiya_vccv'`).
   - **`experienceLevel` Whitelisting**:
     - Line 100: `experienceLevel: sanitizeInput(formData.experienceLevel || 'Intermediate')`
     - Allows arbitrary strings.
     - Whitelist: `['Beginner', 'Intermediate', 'Advanced', 'Professional']` (case-insensitive normalization, default `'Intermediate'`).
   - **`dawOrEngine`**: Min 2, Max 100 characters.

---

### 3.3 `src/backend/voicebankService.jsw`

#### Direct Observations
1. **`getVoicebanksList(params)`**:
   - Line 25: `export async function getVoicebanksList({ gender = 'All', engine = 'All', type = 'All', query = '', page = 1, pageSize = 12 } = {})`
   - If invoked as `getVoicebanksList(null)`, JavaScript default parameter `= {}` does **not** trigger (because `null` is a value), resulting in:
     `TypeError: Cannot destructure property 'gender' of 'null' as it is null.`
   - Non-string parameters for `gender`, `engine`, `type`, `query` can cause issues when passed to `queryVoicebanks`.
   - Solution: Normalize `const safeParams = (params && typeof params === 'object') ? params : {};` and validate string types.
2. **`getSingerDetails(singerId)`**:
   - Line 63: `if (!singerId || typeof singerId !== 'string')`
   - Well guarded. Add `.trim()` check to avoid empty spaces `'   '`.
3. **`getVoicebankStats()`**:
   - Line 110: Catch block returns `{ totalSingers: 0, engines: {}, genders: {}, supportedLanguages: 0 }`.
   - Lacks `success: false` and `error: err.message`, preventing callers from detecting underlying failures.

---

### 3.4 `src/backend/fileService.jsw`

#### Direct Observations
1. **`getMusicFiles(options)`**:
   - Line 21: `export async function getMusicFiles({ format = 'All', query = '' } = {})`
   - If invoked as `getMusicFiles(null)`, throws `TypeError` on destructuring.
   - If `options.format` is a non-string (e.g. `{ format: 123 }`), `format.toUpperCase()` throws `TypeError`.
   - If `options.query` is a non-string (e.g. `{ query: {} }`), `query.toLowerCase()` throws `TypeError`.
   - Format Whitelisting: `['All', 'USTX', 'MIDI', 'SVP', 'VSQX']`.
2. **`trackFileDownload(fileId)`**:
   - Line 62: `if (!fileId) return { success: false };`
   - Does not verify `typeof fileId === 'string'`.
   - Does not verify whether `fileId` exists in `MUSIC_FILES` catalog.
   - Should return `{ success: false, message: ... }` on invalid or non-existent file ID.

---

## 4. Structured Logging Standardization (AGENT.md Section 11)

All log messages must conform to:
```text
[Component] Action failed: <cause>. Suggested action: <next step>.
```

### Logging Audit Summary

| File | Component Tag | Current Log Format | Compliant? | Required Action |
|---|---|---|:---:|---|
| `contactService.jsw` | `[ContactService]` | `[ContactService] submitContactMessage failed: ${err.message}. Suggested action: Verify input fields.` | ✅ YES | Ensure safe error message formatting (`err?.message \|\| String(err)`). |
| `registrationService.jsw` | `[RegistrationService]` | `[RegistrationService] registerForEvent failed: ...`<br>`[RegistrationService] applyBetaTester failed: ...` | ✅ YES | Ensure safe error message formatting. |
| `voicebankService.jsw` | `[VoicebankService]` | `[VoicebankService] getVoicebanksList failed: ...`<br>`[VoicebankService] getSingerDetails failed: ...`<br>`[VoicebankService] getVoicebankStats failed: ...` | ✅ YES | Ensure safe error message formatting. |
| `fileService.jsw` | `[FileService]` | `[FileService] getMusicFiles failed: ...`<br>`[FileService] trackFileDownload failed: ...` | ✅ YES | Add warning log when non-existent file ID is tracked. |
| `http-functions.js` | `[HttpFunctions]` | **NO LOGGING IN CATCH BLOCKS** | ❌ NO | Implement structured error logging across all 5 HTTP endpoints. |
| `data.js` | `[DataHooks]` | No logging in hooks | ⚠️ N/A | Add defensive item validation. |

---

## 5. Security & Access Control (`permissions.json`)

### Least-Privilege Wildcard Audit
In `src/backend/permissions.json`:
```json
// CURRENT (HIGH RISK):
"*" : {
  "*": {
    "siteOwner": { "invoke": true },
    "siteMember": { "invoke": true },
    "anonymous": { "invoke": true }
  }
}
```
**Risk**: Any newly added or unlisted backend `.jsw` method automatically inherits public anonymous execution rights.

**Hardened Recommendation (Principle of Least Privilege)**:
```json
"*" : {
  "*": {
    "siteOwner": { "invoke": true },
    "siteMember": { "invoke": false },
    "anonymous": { "invoke": false }
  }
}
```
All 8 intentional public web methods are explicitly declared with `"anonymous": { "invoke": true }` under their respective module sections in `permissions.json`.

---

## 6. Concrete Implementation Recommendations (AGENT.md Compliant)

### Recommendation 1: `src/backend/contactService.jsw`

```javascript
/**
 * DELTA SYNTH — Contact & Inquiries Backend Service (.jsw)
 * 
 * Standards from AGENT.md:
 * - Validate input at boundary (Section 12 Security)
 * - Defensive design & type safety (Section 6)
 * - Structured error logging: [Component] Action failed: <cause>. Suggested action: <next step>.
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { sanitizeInput } from 'public/utils';

export const CONTACT_CATEGORIES = [
  'General',
  'Collaboration',
  'Voicebank Issue',
  'License',
  'Support',
  'Feedback',
  'Inquiry',
  'Bug Report',
  'Partnership'
];

/**
 * Submit a contact or support message
 * @param {object} formData
 * @param {string} formData.name
 * @param {string} formData.email
 * @param {string} formData.subject
 * @param {string} [formData.category='General']
 * @param {string} formData.message
 * @returns {Promise<{ success: boolean, message: string, ticketId?: string, errors?: object }>}
 */
export async function submitContactMessage(formData) {
  try {
    if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
      return {
        success: false,
        message: 'ข้อมูลที่ส่งมาไม่ถูกต้อง',
        errors: { system: 'Invalid request payload: expected an object' }
      };
    }

    const errors = {};

    // Validate name
    const rawName = typeof formData.name === 'string' ? formData.name.trim() : '';
    if (rawName.length < 2) {
      errors.name = 'กรุณาระบุชื่อของคุณ (อย่างน้อย 2 ตัวอักษร)';
    } else if (rawName.length > 100) {
      errors.name = 'ชื่อของคุณยาวเกินไป (ไม่เกิน 100 ตัวอักษร)';
    }

    // Validate email
    const rawEmail = typeof formData.email === 'string' ? formData.email.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!rawEmail || rawEmail.length > 254 || !emailRegex.test(rawEmail)) {
      errors.email = 'กรุณาระบุอีเมลที่ติดต่อได้';
    }

    // Validate subject
    const rawSubject = typeof formData.subject === 'string' ? formData.subject.trim() : '';
    if (rawSubject.length < 3) {
      errors.subject = 'กรุณาระบุหัวข้อข้อความ (อย่างน้อย 3 ตัวอักษร)';
    } else if (rawSubject.length > 200) {
      errors.subject = 'หัวข้อข้อความยาวเกินไป (ไม่เกิน 200 ตัวอักษร)';
    }

    // Validate message
    const rawMessage = typeof formData.message === 'string' ? formData.message.trim() : '';
    if (rawMessage.length < 10) {
      errors.message = 'กรุณาระบุรายละเอียดข้อความอย่างน้อย 10 ตัวอักษร';
    } else if (rawMessage.length > 5000) {
      errors.message = 'ข้อความยาวเกินไป (ไม่เกิน 5000 ตัวอักษร)';
    }

    // Validate and normalize category whitelist
    let category = 'General';
    if (formData.category !== undefined && formData.category !== null) {
      if (typeof formData.category !== 'string') {
        errors.category = 'ประเภทการติดต่อไม่ถูกต้อง';
      } else {
        const trimmedCat = formData.category.trim();
        const matched = CONTACT_CATEGORIES.find(c => c.toLowerCase() === trimmedCat.toLowerCase());
        if (matched) {
          category = matched;
        } else {
          errors.category = `ประเภทการติดต่อต้องเป็นหนึ่งใน: ${CONTACT_CATEGORIES.join(', ')}`;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'กรุณาตรวจสอบข้อมูลที่กรอก',
        errors
      };
    }

    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const ticket = {
      ticketId: `TICK_${Date.now()}_${randomSuffix}`,
      name: sanitizeInput(rawName),
      email: sanitizeInput(rawEmail).toLowerCase(),
      subject: sanitizeInput(rawSubject),
      category: sanitizeInput(category),
      message: sanitizeInput(rawMessage),
      submittedAt: new Date().toISOString()
    };

    console.log(`[ContactService] Ticket created: ${ticket.ticketId} from ${ticket.email} [Category: ${ticket.category}]`);

    return {
      success: true,
      message: 'ส่งข้อความถึงทีมงาน DELTA SYNTH เรียบร้อยแล้ว! พวกเราจะติดต่อกลับโดยเร็วที่สุด',
      ticketId: ticket.ticketId
    };
  } catch (err) {
    const errorMsg = err && err.message ? err.message : String(err);
    console.error(`[ContactService] submitContactMessage failed: ${errorMsg}. Suggested action: Verify input fields.`);
    return {
      success: false,
      message: 'ไม่สามารถส่งข้อความได้ในขณะนี้ โปรดส่งอีเมลโดยตรงมาที่ delta.vocaloid09378@gmail.com',
      errors: { system: errorMsg }
    };
  }
}
```

---

### Recommendation 2: `src/backend/registrationService.jsw`

```javascript
/**
 * DELTA SYNTH — Event Registration & Beta Tester Service (.jsw)
 * 
 * Standards from AGENT.md:
 * - Validate input at boundary (Section 12 Security)
 * - Whitelist domain validation against projectData.js
 * - Descriptive error logging: [Component] Action failed: <cause>. Suggested action: <next step>.
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { sanitizeInput } from 'public/utils';
import { EVENTS, BETA_VOICEBANKS } from 'public/projectData';

export const VALID_EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];

/**
 * Register participant for an event
 * @param {object} formData
 * @param {string} formData.eventId
 * @param {string} formData.fullName
 * @param {string} formData.email
 * @param {string} [formData.discord]
 * @param {string} [formData.note]
 * @returns {Promise<{ success: boolean, message: string, registrationId?: string, errors?: object }>}
 */
export async function registerForEvent(formData) {
  try {
    if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
      return {
        success: false,
        message: 'ข้อมูลการลงทะเบียนไม่ถูกต้อง',
        errors: { system: 'Invalid request payload: expected an object' }
      };
    }

    const errors = {};

    // Validate eventId against EVENTS catalog whitelist
    const rawEventId = typeof formData.eventId === 'string' ? formData.eventId.trim() : '';
    const validEventIds = Array.isArray(EVENTS) ? EVENTS.map(e => e.id) : [];
    if (!rawEventId) {
      errors.eventId = 'กรุณาระบุงานอีเวนต์ที่ต้องการสมัคร';
    } else if (validEventIds.length > 0 && !validEventIds.includes(rawEventId)) {
      errors.eventId = `ไม่พบรหัสกิจกรรม '${rawEventId}' ในระบบ`;
    }

    // Validate fullName
    const rawFullName = typeof formData.fullName === 'string' ? formData.fullName.trim() : '';
    if (rawFullName.length < 2) {
      errors.fullName = 'กรุณาระบุชื่อ-นามสกุลที่ถูกต้อง (อย่างน้อย 2 ตัวอักษร)';
    } else if (rawFullName.length > 100) {
      errors.fullName = 'ชื่อ-นามสกุลยาวเกินไป (ไม่เกิน 100 ตัวอักษร)';
    }

    // Validate email
    const rawEmail = typeof formData.email === 'string' ? formData.email.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!rawEmail || rawEmail.length > 254 || !emailRegex.test(rawEmail)) {
      errors.email = 'กรุณาระบุอีเมลที่ถูกต้อง';
    }

    // Validate optional fields
    const rawDiscord = typeof formData.discord === 'string' ? formData.discord.trim().slice(0, 50) : '';
    const rawNote = typeof formData.note === 'string' ? formData.note.trim().slice(0, 500) : '';

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'ข้อมูลการลงทะเบียนไม่ครบถ้วน',
        errors
      };
    }

    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const registration = {
      id: `REG_${Date.now()}_${randomSuffix}`,
      eventId: sanitizeInput(rawEventId),
      fullName: sanitizeInput(rawFullName),
      email: sanitizeInput(rawEmail).toLowerCase(),
      discord: sanitizeInput(rawDiscord),
      note: sanitizeInput(rawNote),
      registeredAt: new Date().toISOString()
    };

    console.log(`[RegistrationService] New event registration: ${registration.id} for event ${registration.eventId} (${registration.email})`);

    return {
      success: true,
      message: 'ลงทะเบียนเข้าร่วมกิจกรรมสำเร็จ! โปรดตรวจสอบรายละเอียดทางอีเมล',
      registrationId: registration.id
    };
  } catch (err) {
    const errorMsg = err && err.message ? err.message : String(err);
    console.error(`[RegistrationService] registerForEvent failed: ${errorMsg}. Suggested action: Verify form parameters.`);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดของระบบในการบันทึกข้อมูล โปรดลองใหม่อีกครั้ง',
      errors: { system: errorMsg }
    };
  }
}

/**
 * Submit application to become a Beta Voicebank Tester
 * @param {object} formData
 * @param {string} formData.voicebankId
 * @param {string} formData.fullName
 * @param {string} formData.email
 * @param {string} formData.dawOrEngine
 * @param {string} [formData.experienceLevel='Intermediate']
 * @returns {Promise<{ success: boolean, message: string, applicationId?: string, errors?: object }>}
 */
export async function applyBetaTester(formData) {
  try {
    if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
      return {
        success: false,
        message: 'ข้อมูลการสมัครทดสอบไม่ถูกต้อง',
        errors: { system: 'Invalid request payload: expected an object' }
      };
    }

    const errors = {};

    // Validate voicebankId against BETA_VOICEBANKS whitelist
    const rawVoicebankId = typeof formData.voicebankId === 'string' ? formData.voicebankId.trim() : '';
    const validBetaIds = Array.isArray(BETA_VOICEBANKS) ? BETA_VOICEBANKS.map(b => b.id) : [];
    if (!rawVoicebankId) {
      errors.voicebankId = 'กรุณาเลือกคลังเสียง BETA';
    } else if (validBetaIds.length > 0 && !validBetaIds.includes(rawVoicebankId)) {
      errors.voicebankId = `ไม่พบคลังเสียง BETA รหัส '${rawVoicebankId}' ในระบบ`;
    }

    // Validate fullName
    const rawFullName = typeof formData.fullName === 'string' ? formData.fullName.trim() : '';
    if (rawFullName.length < 2) {
      errors.fullName = 'กรุณาระบุชื่อผู้สมัคร (อย่างน้อย 2 ตัวอักษร)';
    } else if (rawFullName.length > 100) {
      errors.fullName = 'ชื่อผู้สมัครยาวเกินไป (ไม่เกิน 100 ตัวอักษร)';
    }

    // Validate email
    const rawEmail = typeof formData.email === 'string' ? formData.email.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!rawEmail || rawEmail.length > 254 || !emailRegex.test(rawEmail)) {
      errors.email = 'กรุณาระบุอีเมลติดต่อ';
    }

    // Validate dawOrEngine
    const rawDaw = typeof formData.dawOrEngine === 'string' ? formData.dawOrEngine.trim() : '';
    if (rawDaw.length < 2) {
      errors.dawOrEngine = 'กรุณาระบุโปรแกรมที่ใช้งาน (เช่น OpenUtau, Synthesizer V)';
    } else if (rawDaw.length > 100) {
      errors.dawOrEngine = 'ชื่อโปรแกรมยาวเกินไป (ไม่เกิน 100 ตัวอักษร)';
    }

    // Validate experienceLevel whitelist
    let experienceLevel = 'Intermediate';
    if (formData.experienceLevel !== undefined && formData.experienceLevel !== null) {
      if (typeof formData.experienceLevel !== 'string') {
        errors.experienceLevel = 'ระดับประสบการณ์ไม่ถูกต้อง';
      } else {
        const trimmedExp = formData.experienceLevel.trim();
        const matched = VALID_EXPERIENCE_LEVELS.find(l => l.toLowerCase() === trimmedExp.toLowerCase());
        if (matched) {
          experienceLevel = matched;
        } else {
          errors.experienceLevel = `ระดับประสบการณ์ต้องเป็นหนึ่งใน: ${VALID_EXPERIENCE_LEVELS.join(', ')}`;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'กรุณากรอกข้อมูลการสมัครทดสอบให้ครบถ้วน',
        errors
      };
    }

    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const application = {
      id: `BETA_${Date.now()}_${randomSuffix}`,
      voicebankId: sanitizeInput(rawVoicebankId),
      fullName: sanitizeInput(rawFullName),
      email: sanitizeInput(rawEmail).toLowerCase(),
      dawOrEngine: sanitizeInput(rawDaw),
      experienceLevel: sanitizeInput(experienceLevel),
      appliedAt: new Date().toISOString()
    };

    console.log(`[RegistrationService] Beta application received: ${application.id} for ${application.voicebankId}`);

    return {
      success: true,
      message: 'ส่งใบสมัครทดสอบ BETA สำเร็จแล้ว! ทีมงานจะติดต่อกลับพร้อมลิงก์ดาวน์โหลดสิทธิ์การทดสอบ',
      applicationId: application.id
    };
  } catch (err) {
    const errorMsg = err && err.message ? err.message : String(err);
    console.error(`[RegistrationService] applyBetaTester failed: ${errorMsg}. Suggested action: Check application payload.`);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการส่งใบสมัคร โปรดลองอีกครั้ง',
      errors: { system: errorMsg }
    };
  }
}
```

---

### Recommendation 3: `src/backend/voicebankService.jsw`

```javascript
/**
 * DELTA SYNTH — Voicebank Backend Service (.jsw)
 * 
 * Standards from AGENT.md:
 * - Resource-aware backend querying with pagination and input safety
 * - Defensive error handling & structured logging
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { VOICEBANKS, getVoicebankById, queryVoicebanks } from 'public/voicebankData';

/**
 * Get all voicebanks with optional pagination and filtering
 * @param {object} [params={}]
 * @param {string} [params.gender='All']
 * @param {string} [params.engine='All']
 * @param {string} [params.type='All']
 * @param {string} [params.query='']
 * @param {number} [params.page=1]
 * @param {number} [params.pageSize=12]
 * @returns {Promise<{ items: Array<object>, total: number, page: number, pageSize: number, totalPages: number, error?: string }>}
 */
export async function getVoicebanksList(params = {}) {
  try {
    const safeParams = (params && typeof params === 'object') ? params : {};
    const gender = typeof safeParams.gender === 'string' ? safeParams.gender.trim() : 'All';
    const engine = typeof safeParams.engine === 'string' ? safeParams.engine.trim() : 'All';
    const type = typeof safeParams.type === 'string' ? safeParams.type.trim() : 'All';
    const query = typeof safeParams.query === 'string' ? safeParams.query.trim() : '';
    const rawPage = safeParams.page !== undefined ? safeParams.page : 1;
    const rawPageSize = safeParams.pageSize !== undefined ? safeParams.pageSize : 12;

    const filtered = queryVoicebanks({ gender, engine, type, query });
    const total = filtered.length;
    const safePage = Math.max(1, parseInt(rawPage, 10) || 1);
    const safePageSize = Math.max(1, Math.min(100, parseInt(rawPageSize, 10) || 12));
    const totalPages = Math.max(1, Math.ceil(total / safePageSize));
    
    const startIndex = (safePage - 1) * safePageSize;
    const items = filtered.slice(startIndex, startIndex + safePageSize);

    return {
      items,
      total,
      page: safePage,
      pageSize: safePageSize,
      totalPages
    };
  } catch (err) {
    const errorMsg = err && err.message ? err.message : String(err);
    console.error(`[VoicebankService] getVoicebanksList failed: ${errorMsg}. Suggested action: Verify filter parameters.`);
    return {
      items: [],
      total: 0,
      page: 1,
      pageSize: 12,
      totalPages: 1,
      error: errorMsg
    };
  }
}

/**
 * Fetch detailed profile of a single singer by ID
 * @param {string} singerId
 * @returns {Promise<{ success: boolean, data: object|null, error?: string }>}
 */
export async function getSingerDetails(singerId) {
  try {
    if (!singerId || typeof singerId !== 'string' || !singerId.trim()) {
      return { success: false, data: null, error: 'Invalid singer identifier provided' };
    }
    
    const safeId = singerId.trim();
    const singer = getVoicebankById(safeId);
    if (!singer) {
      return { success: false, data: null, error: `Singer '${safeId}' not found in catalog` };
    }

    return { success: true, data: singer };
  } catch (err) {
    const errorMsg = err && err.message ? err.message : String(err);
    console.error(`[VoicebankService] getSingerDetails failed: ${errorMsg}. Suggested action: Check singerId format.`);
    return { success: false, data: null, error: errorMsg };
  }
}

/**
 * Get statistical summary of all voicebanks
 * @returns {Promise<{ success: boolean, totalSingers: number, engines: object, genders: object, supportedLanguages: number, error?: string }>}
 */
export async function getVoicebankStats() {
  try {
    const catalog = Array.isArray(VOICEBANKS) ? VOICEBANKS : [];
    const total = catalog.length;
    const engines = {};
    const genders = { Male: 0, Female: 0, Other: 0 };

    catalog.forEach(v => {
      if (!v) return;
      if (v.gender in genders) {
        genders[v.gender]++;
      } else {
        genders.Other++;
      }

      const eng = v.engine || 'Other';
      engines[eng] = (engines[eng] || 0) + 1;
    });

    return {
      success: true,
      totalSingers: total,
      engines,
      genders,
      supportedLanguages: 7
    };
  } catch (err) {
    const errorMsg = err && err.message ? err.message : String(err);
    console.error(`[VoicebankService] getVoicebankStats failed: ${errorMsg}. Suggested action: Check VOICEBANKS data integrity.`);
    return {
      success: false,
      totalSingers: 0,
      engines: {},
      genders: { Male: 0, Female: 0, Other: 0 },
      supportedLanguages: 0,
      error: errorMsg
    };
  }
}
```

---

### Recommendation 4: `src/backend/fileService.jsw`

```javascript
/**
 * DELTA SYNTH — File Resources Backend Service (.jsw)
 * 
 * Standards from AGENT.md:
 * - Query & filter music files (USTX, MIDI, SVP, VSQX)
 * - Safe download tracking and category search
 * - Defensive error handling & structured logging
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { MUSIC_FILES } from 'public/projectData';

export const VALID_FILE_FORMATS = ['All', 'USTX', 'MIDI', 'SVP', 'VSQX'];

/**
 * Get music resource files with format and keyword filter
 * @param {object} [options={}]
 * @param {'All'|'USTX'|'MIDI'|'SVP'|'VSQX'} [options.format='All']
 * @param {string} [options.query='']
 * @returns {Promise<{ success: boolean, files: Array<object>, count: number, error?: string }>}
 */
export async function getMusicFiles(options = {}) {
  try {
    const safeOpts = (options && typeof options === 'object') ? options : {};
    const format = typeof safeOpts.format === 'string' ? safeOpts.format.trim() : 'All';
    const query = typeof safeOpts.query === 'string' ? safeOpts.query.trim() : '';

    let results = Array.isArray(MUSIC_FILES) ? [...MUSIC_FILES] : [];

    if (format && format.toUpperCase() !== 'ALL') {
      const targetFormat = format.toUpperCase();
      results = results.filter(f => f && typeof f.format === 'string' && f.format.toUpperCase() === targetFormat);
    }

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(f => {
        if (!f) return false;
        const title = typeof f.title === 'string' ? f.title.toLowerCase() : '';
        const producer = typeof f.producer === 'string' ? f.producer.toLowerCase() : '';
        const recommendedSinger = typeof f.recommendedSinger === 'string' ? f.recommendedSinger.toLowerCase() : '';
        const fmt = typeof f.format === 'string' ? f.format.toLowerCase() : '';
        return title.includes(q) || producer.includes(q) || recommendedSinger.includes(q) || fmt.includes(q);
      });
    }

    return {
      success: true,
      files: results,
      count: results.length
    };
  } catch (err) {
    const errorMsg = err && err.message ? err.message : String(err);
    console.error(`[FileService] getMusicFiles failed: ${errorMsg}. Suggested action: Check format parameter.`);
    return {
      success: false,
      files: [],
      count: 0,
      error: errorMsg
    };
  }
}

/**
 * Record a file download event (analytics / telemetry)
 * @param {string} fileId 
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export async function trackFileDownload(fileId) {
  try {
    if (!fileId || typeof fileId !== 'string' || !fileId.trim()) {
      return { success: false, message: 'Invalid or missing file identifier' };
    }

    const safeId = fileId.trim();
    const catalog = Array.isArray(MUSIC_FILES) ? MUSIC_FILES : [];
    const fileExists = catalog.some(f => f && f.id === safeId);

    if (!fileExists) {
      console.warn(`[FileService] trackFileDownload warning: File '${safeId}' not found in catalog. Suggested action: Verify file ID.`);
      return { success: false, message: `File '${safeId}' not found in catalog` };
    }

    console.log(`[FileService] Download recorded for file: ${safeId} at ${new Date().toISOString()}`);
    return { success: true, message: `Download tracked for file ${safeId}` };
  } catch (err) {
    const errorMsg = err && err.message ? err.message : String(err);
    console.error(`[FileService] trackFileDownload failed: ${errorMsg}. Suggested action: Retry log write.`);
    return { success: false, message: errorMsg };
  }
}
```

---

## 7. Verification & Test Plan

### Test Scenarios to Verify:
1. **Tier 1 (Happy Path)**:
   - `submitContactMessage` with valid parameters returns `success: true` and a formatted `ticketId` (`TICK_...`).
   - `registerForEvent` with `'event_001'` returns `success: true` and `registrationId` (`REG_...`).
   - `applyBetaTester` with `'beta_diffsinger_hikaru_v2'` returns `success: true` and `applicationId` (`BETA_...`).
   - `getVoicebanksList` returns paginated 12 items and total 54.
   - `getSingerDetails('ayanami_hikaru')` returns singer details.
   - `getVoicebankStats()` returns `totalSingers: 54, supportedLanguages: 7`.
   - `getMusicFiles({ format: 'USTX' })` returns 2 USTX items.
   - `trackFileDownload('file_001')` returns `success: true`.

2. **Tier 2 (Boundary & Corner Cases)**:
   - `submitContactMessage(null)` → returns `{ success: false, errors: { system: '...' } }` without throwing.
   - `submitContactMessage({ name: 123, email: 'abc', subject: [], message: null })` → validation errors on all fields without throwing.
   - `submitContactMessage({ category: 'invalid_category', ... })` → rejects invalid category.
   - `registerForEvent({ eventId: 'non_existent_event', fullName: 'Test', email: 'test@example.com' })` → rejects invalid `eventId`.
   - `applyBetaTester({ voicebankId: 'fake_beta', experienceLevel: 'Expert', ... })` → rejects invalid `voicebankId` and `experienceLevel`.
   - `getVoicebanksList(null)` → does not throw, returns first page of results with defaults.
   - `getMusicFiles(null)` → does not throw, returns all music files.
   - `getMusicFiles({ format: 123, query: {} })` → does not throw, safely handles non-string format/query.
   - `trackFileDownload(null)` / `trackFileDownload('fake_id')` → returns `{ success: false, message: ... }`.

3. **Tier 3 (Regression & Logging)**:
   - Verify log outputs conform strictly to `[Component] Action failed: <cause>. Suggested action: <next step>.`
   - Verify zero unhandled exceptions crash node runtime.
