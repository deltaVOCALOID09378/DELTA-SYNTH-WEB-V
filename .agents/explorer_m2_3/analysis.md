# Milestone M2 Comprehensive Security & Cross-Cutting Architecture Analysis

> **Author**: Explorer 3 (Security Permissions & Cross-Cutting Architecture)  
> **Date**: 2026-08-16  
> **Scope**: `src/backend/permissions.json`, `src/backend/*.jsw`, `src/backend/http-functions.js`, `src/backend/data.js`, `tests/`  
> **Standard**: DELTA SYNTH AGENT.md (Preserve → Strengthen → Optimize → Verify)

---

## 1. Executive Summary

Milestone M2 focuses on backend security hardening, input validation boundaries, access control configuration, and cross-cutting architectural stability for DELTA SYNTH.

### Key Audit Findings:
1. **`permissions.json` Access Control**:
   - **8 out of 8** exported web methods across the 4 `.jsw` modules are explicitly declared.
   - **Critical Vulnerability**: The global wildcard fallback `"*": { "*": { "anonymous": true } }` allows any unlisted or future backend method to be publicly callable by anonymous users, violating the Principle of Least Privilege.
2. **Top-Level Type Coercion & Defensive Null Guards**:
   - Functions in `contactService.jsw`, `registrationService.jsw`, `voicebankService.jsw`, and `fileService.jsw` crash with unhandled `TypeError` when called with `null`, `undefined`, or non-object arguments, or when string methods (`.trim()`, `.toUpperCase()`, `.toLowerCase()`) are called on non-string property values.
3. **Domain Whitelisting & Input Boundaries**:
   - `contactService.jsw` allows arbitrary strings in `category` instead of restricting to defined categories.
   - `registrationService.jsw` allows arbitrary strings in `experienceLevel` instead of validating against `['Beginner', 'Intermediate', 'Advanced', 'Professional']`.
4. **CORS & HTTP Error Handling in `http-functions.js`**:
   - Missing CORS `OPTIONS` preflight handlers: `options_singer`, `options_files`, `options_contact`, `options_register`.
   - Malformed JSON payloads return `HTTP 500 Internal Server Error` instead of `HTTP 400 Bad Request`.
   - Catch blocks have **zero** console logging, violating AGENT.md Section 11.
5. **Data Hooks in `data.js`**:
   - Collection hooks lack defensive guards for `null` items and non-string `.trim()` invocations.

---

## 2. Detailed Audit of `permissions.json`

### 2.1 Web Method Inventory vs `permissions.json`

| Web Module | Exported Web Method | Line in Source | Declared in `permissions.json` | Configured Permissions (Owner / Member / Anon) | Risk Evaluation |
|---|---|:---:|:---:|:---:|---|
| `backend/voicebankService.jsw` | `getVoicebanksList` | Line 25 | Yes (Line 17) | `true` / `true` / `true` | Low risk. Public catalog read. |
| `backend/voicebankService.jsw` | `getSingerDetails` | Line 61 | Yes (Line 22) | `true` / `true` / `true` | Low risk. Public profile read. |
| `backend/voicebankService.jsw` | `getVoicebankStats` | Line 84 | Yes (Line 27) | `true` / `true` / `true` | Low risk. Public aggregated statistics. |
| `backend/fileService.jsw` | `getMusicFiles` | Line 21 | Yes (Line 34) | `true` / `true` / `true` | Low risk. Public resource catalog read. |
| `backend/fileService.jsw` | `trackFileDownload` | Line 60 | Yes (Line 39) | `true` / `true` / `true` | Low risk. Public download telemetry. |
| `backend/registrationService.jsw` | `registerForEvent` | Line 24 | Yes (Line 46) | `true` / `true` / `true` | Medium risk. Public submission with validation. |
| `backend/registrationService.jsw` | `applyBetaTester` | Line 77 | Yes (Line 51) | `true` / `true` / `true` | Medium risk. Public submission with validation. |
| `backend/contactService.jsw` | `submitContactMessage` | Line 24 | Yes (Line 58) | `true` / `true` / `true` | Medium risk. Public submission with validation. |

**Total Exported Methods**: 8  
**Explicitly Registered in `permissions.json`**: 8 (100% coverage)

### 2.2 Least Privilege Wildcard Hardening

**Current Vulnerability** (`permissions.json` lines 3-15):
```json
{
  "web-methods": {
    "*": {
      "*": {
        "siteOwner": { "invoke": true },
        "siteMember": { "invoke": true },
        "anonymous": { "invoke": true }
      }
    }
  }
}
```
If an internal maintenance function (e.g. database clearing, admin configuration) is added in any `.jsw` file, it is immediately exposed to unauthenticated anonymous visitors.

**Hardened Least-Privilege Specification**:
```json
{
  "web-methods": {
    "*": {
      "*": {
        "siteOwner": { "invoke": true },
        "siteMember": { "invoke": false },
        "anonymous": { "invoke": false }
      }
    }
  }
}
```
Because all 8 public web methods are explicitly declared with `"anonymous": { "invoke": true }`, tightening the wildcard fallback introduces **zero regressions** to existing user journeys while enforcing secure defaults.

---

## 3. Cross-Cutting Security Vectors Deep Dive

### 3.1 Input Validation & Parameter Coercion Defense

#### Vulnerabilities Identified:
1. **Destructuring `null` parameter**:
   In `voicebankService.jsw` line 25:
   `export async function getVoicebanksList({ gender = 'All', ... } = {})`
   In JavaScript, `getVoicebanksList(null)` bypasses default parameter assignment, throwing `TypeError: Cannot destructure property 'gender' of 'null'`.
   Same issue in `fileService.jsw` line 21: `getMusicFiles({ format = 'All', ... } = {})`.
2. **Missing Top-Level Object Guard**:
   In `contactService.jsw` line 28:
   If `formData` is `null` or a primitive (`123`), `!formData.name` throws `TypeError: Cannot read properties of null (reading 'name')`.
   Same issue in `registrationService.jsw` lines 28 and 81.
3. **Unsafe `.trim()` on Non-String Values**:
   If an API caller or malicious client passes `{ name: 12345 }`, `formData.name.trim()` throws `TypeError: formData.name.trim is not a function`.

#### Universal Defensive Pattern:
```javascript
// Universal guard pattern for form submissions
if (!formData || typeof formData !== 'object' || Array.isArray(formData)) {
  return {
    success: false,
    message: 'กรุณาตรวจสอบข้อมูลที่กรอก',
    errors: { form: 'ข้อมูลที่ส่งมาไม่ถูกต้อง (Invalid payload format)' }
  };
}

// Universal safe string extraction
const safeField = typeof formData.field === 'string' ? formData.field.trim() : '';
```

---

### 3.2 SQL / NoSQL / Wix Data Query Injection Prevention

1. **In-Memory Query Safety**:
   - `queryVoicebanks` and `searchFilter` perform safe JavaScript string operations (`.toLowerCase()`, `.includes()`).
   - By ensuring `query` is coerced to a string before `.toLowerCase()`, prototype pollution and injection via special object queries (e.g. `{ query: { "$ne": null } }`) are completely neutralized.
2. **Wix Data Hooks Hygiene (`data.js`)**:
   - Ensure hooks never crash on `null` item objects.
   - Sanitize and lowercase email fields before insertion/update.
   - Guarantee `_createdDate` and `_updatedDate` are immutable system timestamps.

---

### 3.3 Cross-Site Scripting (XSS) & Stored Content Sanitization

1. **Sanitization Pipeline**:
   - User inputs (`name`, `fullName`, `subject`, `category`, `message`, `discord`, `note`, `dawOrEngine`) pass through `sanitizeInput(text)` in `src/public/utils.js`.
   - `sanitizeInput` strips `<` and `>` tags, trims whitespace, and truncates text to a maximum of 1,000 characters.
2. **Length Boundary Defense**:
   - `contactService.jsw`: name (2-100 chars), email (5-150 chars), subject (3-200 chars), message (10-2000 chars).
   - `registrationService.jsw`: fullName (2-100 chars), email (5-150 chars), discord (<= 100 chars), note (<= 1000 chars), dawOrEngine (2-100 chars).

---

### 3.4 Domain Whitelisting

1. **`contactService.jsw`**:
   - Allowed Categories: `['General', 'Collaboration', 'Voicebank Issue', 'License']`
   - Fallback: `'General'`
2. **`registrationService.jsw`**:
   - Allowed Experience Levels: `['Beginner', 'Intermediate', 'Advanced', 'Professional']`
   - Fallback: `'Intermediate'`
   - Event ID validation: Ensure `eventId` is a non-empty string matching standard ID pattern `event_[0-9]+` or sanitized slug.
   - Voicebank ID validation: Ensure `voicebankId` is a non-empty string matching standard ID pattern `beta_[0-9]+` or sanitized slug.

---

### 3.5 REST API & CORS Security (`http-functions.js`)

1. **Missing CORS Preflight Handlers**:
   - Standard browser CORS workflow requires an `OPTIONS` request prior to `POST` or cross-origin `GET` requests with headers.
   - Currently, only `options_voicebanks` exists.
   - **Required Handlers**:
     - `export function options_singer(request) { return jsonResponse({}, 200); }`
     - `export function options_files(request) { return jsonResponse({}, 200); }`
     - `export function options_contact(request) { return jsonResponse({}, 200); }`
     - `export function options_register(request) { return jsonResponse({}, 200); }`
2. **HTTP Status Code Precision**:
   - When `await request.body.json()` fails (e.g. malformed JSON payload), return `HTTP 400 Bad Request` with structured error message, rather than bubbling to `catch` and returning `HTTP 500 Internal Server Error`.
3. **Structured Logging Compliance**:
   - All endpoints in `http-functions.js` must implement structured error logging adhering to AGENT.md Section 11:
     `console.error('[HttpFunctions] <endpoint> failed: <cause>. Suggested action: <next step>.');`

---

## 4. Exact Implementation Specifications

### 4.1 `src/backend/permissions.json`
```json
{
  "web-methods": {
    "*": {
      "*": {
        "siteOwner": {
          "invoke": true
        },
        "siteMember": {
          "invoke": false
        },
        "anonymous": {
          "invoke": false
        }
      }
    },
    "backend/voicebankService.jsw": {
      "getVoicebanksList": {
        "siteOwner": { "invoke": true },
        "siteMember": { "invoke": true },
        "anonymous": { "invoke": true }
      },
      "getSingerDetails": {
        "siteOwner": { "invoke": true },
        "siteMember": { "invoke": true },
        "anonymous": { "invoke": true }
      },
      "getVoicebankStats": {
        "siteOwner": { "invoke": true },
        "siteMember": { "invoke": true },
        "anonymous": { "invoke": true }
      }
    },
    "backend/fileService.jsw": {
      "getMusicFiles": {
        "siteOwner": { "invoke": true },
        "siteMember": { "invoke": true },
        "anonymous": { "invoke": true }
      },
      "trackFileDownload": {
        "siteOwner": { "invoke": true },
        "siteMember": { "invoke": true },
        "anonymous": { "invoke": true }
      }
    },
    "backend/registrationService.jsw": {
      "registerForEvent": {
        "siteOwner": { "invoke": true },
        "siteMember": { "invoke": true },
        "anonymous": { "invoke": true }
      },
      "applyBetaTester": {
        "siteOwner": { "invoke": true },
        "siteMember": { "invoke": true },
        "anonymous": { "invoke": true }
      }
    },
    "backend/contactService.jsw": {
      "submitContactMessage": {
        "siteOwner": { "invoke": true },
        "siteMember": { "invoke": true },
        "anonymous": { "invoke": true }
      }
    }
  }
}
```

---

### 4.2 `src/backend/contactService.jsw`
```javascript
/**
 * DELTA SYNTH — Contact & Inquiries Backend Service (.jsw)
 * 
 * Standards from AGENT.md:
 * - Validate input at boundary
 * - Safe sanitization & domain whitelisting
 * - Descriptive error logging: [Component] Action failed: <cause>. Suggested action: <next step>.
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { sanitizeInput } from 'public/utils';

const VALID_CATEGORIES = ['General', 'Collaboration', 'Voicebank Issue', 'License'];

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
        message: 'กรุณาตรวจสอบข้อมูลที่กรอก',
        errors: { form: 'ข้อมูลที่ส่งมาไม่ถูกต้อง (Invalid payload format)' }
      };
    }

    const errors = {};

    const name = typeof formData.name === 'string' ? formData.name.trim() : '';
    const email = typeof formData.email === 'string' ? formData.email.trim() : '';
    const subject = typeof formData.subject === 'string' ? formData.subject.trim() : '';
    const message = typeof formData.message === 'string' ? formData.message.trim() : '';
    const rawCategory = typeof formData.category === 'string' ? formData.category.trim() : 'General';

    if (!name || name.length < 2) {
      errors.name = 'กรุณาระบุชื่อของคุณ (อย่างน้อย 2 ตัวอักษร)';
    } else if (name.length > 100) {
      errors.name = 'ชื่อต้องมีความยาวไม่เกิน 100 ตัวอักษร';
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'กรุณาระบุอีเมลที่ติดต่อได้';
    } else if (email.length > 150) {
      errors.email = 'อีเมลต้องมีความยาวไม่เกิน 150 ตัวอักษร';
    }

    if (!subject || subject.length < 3) {
      errors.subject = 'กรุณาระบุหัวข้อข้อความ (อย่างน้อย 3 ตัวอักษร)';
    } else if (subject.length > 200) {
      errors.subject = 'หัวข้อต้องมีความยาวไม่เกิน 200 ตัวอักษร';
    }

    if (!message || message.length < 10) {
      errors.message = 'กรุณาระบุรายละเอียดข้อความอย่างน้อย 10 ตัวอักษร';
    } else if (message.length > 2000) {
      errors.message = 'ข้อความต้องมีความยาวไม่เกิน 2,000 ตัวอักษร';
    }

    const category = VALID_CATEGORIES.includes(rawCategory) ? rawCategory : 'General';

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'กรุณาตรวจสอบข้อมูลที่กรอก',
        errors
      };
    }

    const ticket = {
      ticketId: `TICK_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name: sanitizeInput(name),
      email: sanitizeInput(email).toLowerCase(),
      subject: sanitizeInput(subject),
      category: sanitizeInput(category),
      message: sanitizeInput(message),
      submittedAt: new Date().toISOString()
    };

    console.log(`[ContactService] Ticket created: ${ticket.ticketId} from ${ticket.email} [Category: ${ticket.category}]`);

    return {
      success: true,
      message: 'ส่งข้อความถึงทีมงาน DELTA SYNTH เรียบร้อยแล้ว! พวกเราจะติดต่อกลับโดยเร็วที่สุด',
      ticketId: ticket.ticketId
    };
  } catch (err) {
    console.error(`[ContactService] submitContactMessage failed: ${err.message}. Suggested action: Verify input fields.`);
    return {
      success: false,
      message: 'ไม่สามารถส่งข้อความได้ในขณะนี้ โปรดส่งอีเมลโดยตรงมาที่ delta.vocaloid09378@gmail.com',
      errors: { system: err.message }
    };
  }
}
```

---

### 4.3 `src/backend/registrationService.jsw`
```javascript
/**
 * DELTA SYNTH — Event Registration & Beta Tester Service (.jsw)
 * 
 * Standards from AGENT.md:
 * - Validate input at boundary (Section 12 Security)
 * - Defensive error handling & feedback
 * - Descriptive error logging: [Component] Action failed: <cause>. Suggested action: <next step>.
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { sanitizeInput } from 'public/utils';

const VALID_EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];

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
        message: 'ข้อมูลการลงทะเบียนไม่ครบถ้วน',
        errors: { form: 'ข้อมูลที่ส่งมาไม่ถูกต้อง (Invalid payload format)' }
      };
    }

    const errors = {};

    const eventId = typeof formData.eventId === 'string' ? formData.eventId.trim() : '';
    const fullName = typeof formData.fullName === 'string' ? formData.fullName.trim() : '';
    const email = typeof formData.email === 'string' ? formData.email.trim() : '';
    const discord = typeof formData.discord === 'string' ? formData.discord.trim() : '';
    const note = typeof formData.note === 'string' ? formData.note.trim() : '';

    if (!eventId) {
      errors.eventId = 'กรุณาระบุงานอีเวนต์ที่ต้องการสมัคร';
    }

    if (!fullName || fullName.length < 2) {
      errors.fullName = 'กรุณาระบุชื่อ-นามสกุลที่ถูกต้อง (อย่างน้อย 2 ตัวอักษร)';
    } else if (fullName.length > 100) {
      errors.fullName = 'ชื่อ-นามสกุลต้องมีความยาวไม่เกิน 100 ตัวอักษร';
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'กรุณาระบุอีเมลที่ถูกต้อง';
    } else if (email.length > 150) {
      errors.email = 'อีเมลต้องมีความยาวไม่เกิน 150 ตัวอักษร';
    }

    if (discord.length > 100) {
      errors.discord = 'Discord handle ต้องมีความยาวไม่เกิน 100 ตัวอักษร';
    }

    if (note.length > 1000) {
      errors.note = 'หมายเหตุต้องมีความยาวไม่เกิน 1,000 ตัวอักษร';
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'ข้อมูลการลงทะเบียนไม่ครบถ้วน',
        errors
      };
    }

    const registration = {
      id: `REG_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      eventId: sanitizeInput(eventId),
      fullName: sanitizeInput(fullName),
      email: sanitizeInput(email).toLowerCase(),
      discord: sanitizeInput(discord),
      note: sanitizeInput(note),
      registeredAt: new Date().toISOString()
    };

    console.log(`[RegistrationService] New event registration: ${registration.id} for event ${registration.eventId} (${registration.email})`);

    return {
      success: true,
      message: 'ลงทะเบียนเข้าร่วมกิจกรรมสำเร็จ! โปรดตรวจสอบรายละเอียดทางอีเมล',
      registrationId: registration.id
    };
  } catch (err) {
    console.error(`[RegistrationService] registerForEvent failed: ${err.message}. Suggested action: Verify form parameters.`);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดของระบบในการบันทึกข้อมูล โปรดลองใหม่อีกครั้ง',
      errors: { system: err.message }
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
        message: 'กรุณากรอกข้อมูลการสมัครทดสอบให้ครบถ้วน',
        errors: { form: 'ข้อมูลที่ส่งมาไม่ถูกต้อง (Invalid payload format)' }
      };
    }

    const errors = {};

    const voicebankId = typeof formData.voicebankId === 'string' ? formData.voicebankId.trim() : '';
    const fullName = typeof formData.fullName === 'string' ? formData.fullName.trim() : '';
    const email = typeof formData.email === 'string' ? formData.email.trim() : '';
    const dawOrEngine = typeof formData.dawOrEngine === 'string' ? formData.dawOrEngine.trim() : '';
    const rawExperience = typeof formData.experienceLevel === 'string' ? formData.experienceLevel.trim() : 'Intermediate';

    if (!voicebankId) {
      errors.voicebankId = 'กรุณาเลือกคลังเสียง BETA';
    }

    if (!fullName || fullName.length < 2) {
      errors.fullName = 'กรุณาระบุชื่อผู้สมัคร (อย่างน้อย 2 ตัวอักษร)';
    } else if (fullName.length > 100) {
      errors.fullName = 'ชื่อผู้สมัครต้องมีความยาวไม่เกิน 100 ตัวอักษร';
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'กรุณาระบุอีเมลติดต่อที่ถูกต้อง';
    } else if (email.length > 150) {
      errors.email = 'อีเมลต้องมีความยาวไม่เกิน 150 ตัวอักษร';
    }

    if (!dawOrEngine || dawOrEngine.length < 2) {
      errors.dawOrEngine = 'กรุณาระบุโปรแกรมที่ใช้งาน (เช่น OpenUtau, Synthesizer V)';
    } else if (dawOrEngine.length > 100) {
      errors.dawOrEngine = 'ชื่อโปรแกรมต้องมีความยาวไม่เกิน 100 ตัวอักษร';
    }

    const experienceLevel = VALID_EXPERIENCE_LEVELS.includes(rawExperience) ? rawExperience : 'Intermediate';

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: 'กรุณากรอกข้อมูลการสมัครทดสอบให้ครบถ้วน',
        errors
      };
    }

    const application = {
      id: `BETA_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      voicebankId: sanitizeInput(voicebankId),
      fullName: sanitizeInput(fullName),
      email: sanitizeInput(email).toLowerCase(),
      dawOrEngine: sanitizeInput(dawOrEngine),
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
    console.error(`[RegistrationService] applyBetaTester failed: ${err.message}. Suggested action: Check application payload.`);
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการส่งใบสมัคร โปรดลองอีกครั้ง',
      errors: { system: err.message }
    };
  }
}
```

---

### 4.4 `src/backend/voicebankService.jsw`
```javascript
/**
 * DELTA SYNTH — Voicebank Backend Service (.jsw)
 * 
 * Standards from AGENT.md:
 * - Resource-aware backend querying with caching and pagination
 * - Input validation & security checks
 * - Descriptive error logging: [Component] Action failed: <cause>. Suggested action: <next step>.
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
 * @returns {Promise<{ items: Array<object>, total: number, page: number, totalPages: number, error?: string }>}
 */
export async function getVoicebanksList(params = {}) {
  try {
    const safeParams = (params && typeof params === 'object' && !Array.isArray(params)) ? params : {};
    const gender = typeof safeParams.gender === 'string' ? safeParams.gender : 'All';
    const engine = typeof safeParams.engine === 'string' ? safeParams.engine : 'All';
    const type = typeof safeParams.type === 'string' ? safeParams.type : 'All';
    const query = typeof safeParams.query === 'string' ? safeParams.query : '';
    const page = safeParams.page !== undefined ? safeParams.page : 1;
    const pageSize = safeParams.pageSize !== undefined ? safeParams.pageSize : 12;

    const filtered = queryVoicebanks({ gender, engine, type, query });
    const total = filtered.length;
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safePageSize = Math.max(1, Math.min(100, parseInt(pageSize, 10) || 12));
    const totalPages = Math.ceil(total / safePageSize) || 1;
    
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
    console.error(`[VoicebankService] getVoicebanksList failed: ${err.message}. Suggested action: Verify filter parameters.`);
    return {
      items: [],
      total: 0,
      page: 1,
      pageSize: 12,
      totalPages: 1,
      error: err.message
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
    if (!singerId || typeof singerId !== 'string') {
      return { success: false, data: null, error: 'Invalid singer identifier provided' };
    }
    
    const singer = getVoicebankById(singerId.trim());
    if (!singer) {
      return { success: false, data: null, error: `Singer '${singerId}' not found in catalog` };
    }

    return { success: true, data: singer };
  } catch (err) {
    console.error(`[VoicebankService] getSingerDetails failed: ${err.message}. Suggested action: Check singerId format.`);
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Get statistical summary of all voicebanks
 * @returns {Promise<{ totalSingers: number, engines: object, genders: object, supportedLanguages: number, error?: string }>}
 */
export async function getVoicebankStats() {
  try {
    const total = VOICEBANKS.length;
    const engines = {};
    const genders = { Male: 0, Female: 0, Other: 0 };

    VOICEBANKS.forEach(v => {
      if (!v) return;
      // Count genders
      if (v.gender && v.gender in genders) {
        genders[v.gender]++;
      } else {
        genders.Other++;
      }

      // Count engines
      const eng = (typeof v.engine === 'string' && v.engine) ? v.engine : 'Other';
      engines[eng] = (engines[eng] || 0) + 1;
    });

    return {
      totalSingers: total,
      engines,
      genders,
      supportedLanguages: 7
    };
  } catch (err) {
    console.error(`[VoicebankService] getVoicebankStats failed: ${err.message}. Suggested action: Check VOICEBANKS data integrity.`);
    return {
      totalSingers: 0,
      engines: {},
      genders: {},
      supportedLanguages: 0,
      error: err.message
    };
  }
}
```

---

### 4.5 `src/backend/fileService.jsw`
```javascript
/**
 * DELTA SYNTH — File Resources Backend Service (.jsw)
 * 
 * Standards from AGENT.md:
 * - Query & filter music files (USTX, MIDI, SVP, VSQX)
 * - Safe download tracking and category search
 * - Descriptive error logging: [Component] Action failed: <cause>. Suggested action: <next step>.
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { MUSIC_FILES } from 'public/projectData';

/**
 * Get music resource files with format and keyword filter
 * @param {object} [options={}]
 * @param {'All'|'USTX'|'MIDI'|'SVP'|'VSQX'} [options.format='All']
 * @param {string} [options.query='']
 * @returns {Promise<{ success: boolean, files: Array<object>, count: number, error?: string }>}
 */
export async function getMusicFiles(options = {}) {
  try {
    const safeOptions = (options && typeof options === 'object' && !Array.isArray(options)) ? options : {};
    const rawFormat = typeof safeOptions.format === 'string' ? safeOptions.format.trim() : 'All';
    const rawQuery = typeof safeOptions.query === 'string' ? safeOptions.query.trim() : '';

    let results = [...MUSIC_FILES];

    if (rawFormat && rawFormat.toUpperCase() !== 'ALL') {
      const targetFormat = rawFormat.toUpperCase();
      results = results.filter(f => f && typeof f.format === 'string' && f.format.toUpperCase() === targetFormat);
    }

    if (rawQuery) {
      const q = rawQuery.toLowerCase();
      results = results.filter(f => {
        if (!f) return false;
        const title = typeof f.title === 'string' ? f.title.toLowerCase() : '';
        const producer = typeof f.producer === 'string' ? f.producer.toLowerCase() : '';
        const rec = typeof f.recommendedSinger === 'string' ? f.recommendedSinger.toLowerCase() : '';
        const fmt = typeof f.format === 'string' ? f.format.toLowerCase() : '';
        return title.includes(q) || producer.includes(q) || rec.includes(q) || fmt.includes(q);
      });
    }

    return {
      success: true,
      files: results,
      count: results.length
    };
  } catch (err) {
    console.error(`[FileService] getMusicFiles failed: ${err.message}. Suggested action: Check format parameter.`);
    return {
      success: false,
      files: [],
      count: 0,
      error: err.message
    };
  }
}

/**
 * Record a file download event (analytics / telemetry)
 * @param {string} fileId 
 * @returns {Promise<{ success: boolean }>}
 */
export async function trackFileDownload(fileId) {
  try {
    if (!fileId || typeof fileId !== 'string' || !fileId.trim()) {
      return { success: false };
    }
    const safeFileId = fileId.trim();
    console.log(`[FileService] Download recorded for file: ${safeFileId} at ${new Date().toISOString()}`);
    return { success: true };
  } catch (err) {
    console.error(`[FileService] trackFileDownload failed: ${err.message}. Suggested action: Retry log write.`);
    return { success: false };
  }
}
```

---

### 4.6 `src/backend/http-functions.js`
```javascript
/**
 * DELTA SYNTH — Wix HTTP REST Endpoints
 * 
 * Endpoints:
 * - GET /_functions/voicebanks
 * - GET /_functions/singer/:id
 * - GET /_functions/files
 * - POST /_functions/contact
 * - POST /_functions/register
 * - OPTIONS /_functions/*
 * 
 * Standards from AGENT.md:
 * - CORS preflight handlers for all endpoints
 * - Accurate HTTP status codes (400 on malformed payload)
 * - Structured error logging: [HttpFunctions] <action> failed: <cause>. Suggested action: <next step>.
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { VOICEBANKS, getVoicebankById, queryVoicebanks } from 'public/voicebankData';
import { MUSIC_FILES } from 'public/projectData';
import { registerForEvent } from 'backend/registrationService.jsw';
import { submitContactMessage } from 'backend/contactService.jsw';

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

// =========================================================================
// CORS OPTIONS PREFLIGHT HANDLERS
// =========================================================================

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

// =========================================================================
// GET ENDPOINTS
// =========================================================================

export function get_voicebanks(request) {
  try {
    const query = (request && request.query && typeof request.query === 'object') ? request.query : {};
    const gender = typeof query.gender === 'string' ? query.gender : 'All';
    const engine = typeof query.engine === 'string' ? query.engine : 'All';
    const type = typeof query.type === 'string' ? query.type : 'All';
    const search = typeof query.search === 'string' ? query.search : '';

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

export function get_singer(request) {
  try {
    const singerId = (request && Array.isArray(request.path)) ? request.path[0] : null;
    if (!singerId || typeof singerId !== 'string') {
      return jsonResponse({ success: false, error: 'Singer ID required in path' }, 400);
    }
    const singer = getVoicebankById(singerId.trim());
    if (!singer) {
      return jsonResponse({ success: false, error: `Singer '${singerId}' not found` }, 404);
    }
    return jsonResponse({ success: true, data: singer }, 200);
  } catch (err) {
    console.error(`[HttpFunctions] get_singer failed: ${err.message}. Suggested action: Check singerId in path.`);
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

export function get_files(request) {
  try {
    const query = (request && request.query && typeof request.query === 'object') ? request.query : {};
    const format = typeof query.format === 'string' ? query.format.trim() : 'All';
    let files = [...MUSIC_FILES];
    if (format && format.toUpperCase() !== 'ALL') {
      const targetFormat = format.toUpperCase();
      files = files.filter(f => f && typeof f.format === 'string' && f.format.toUpperCase() === targetFormat);
    }
    return jsonResponse({ success: true, count: files.length, data: files }, 200);
  } catch (err) {
    console.error(`[HttpFunctions] get_files failed: ${err.message}. Suggested action: Check format parameter.`);
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

// =========================================================================
// POST ENDPOINTS
// =========================================================================

export async function post_contact(request) {
  let body;
  try {
    if (!request || !request.body || typeof request.body.json !== 'function') {
      return jsonResponse({ success: false, error: 'Missing or invalid request body' }, 400);
    }
    body = await request.body.json();
  } catch (parseErr) {
    console.error(`[HttpFunctions] post_contact payload parse failed: ${parseErr.message}. Suggested action: Ensure valid JSON payload.`);
    return jsonResponse({ success: false, error: 'Invalid JSON payload in request body' }, 400);
  }

  try {
    const result = await submitContactMessage(body);
    return jsonResponse(result, result.success ? 200 : 400);
  } catch (err) {
    console.error(`[HttpFunctions] post_contact failed: ${err.message}. Suggested action: Check submitContactMessage service execution.`);
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}

export async function post_register(request) {
  let body;
  try {
    if (!request || !request.body || typeof request.body.json !== 'function') {
      return jsonResponse({ success: false, error: 'Missing or invalid request body' }, 400);
    }
    body = await request.body.json();
  } catch (parseErr) {
    console.error(`[HttpFunctions] post_register payload parse failed: ${parseErr.message}. Suggested action: Ensure valid JSON payload.`);
    return jsonResponse({ success: false, error: 'Invalid JSON payload in request body' }, 400);
  }

  try {
    const result = await registerForEvent(body);
    return jsonResponse(result, result.success ? 200 : 400);
  } catch (err) {
    console.error(`[HttpFunctions] post_register failed: ${err.message}. Suggested action: Check registerForEvent service execution.`);
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}
```

---

### 4.7 `src/backend/data.js`
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
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return item;
  }

  const now = new Date();
  item._createdDate = item._createdDate || now;
  item._updatedDate = now;
  
  if (item.email && typeof item.email === 'string') {
    item.email = item.email.trim().toLowerCase();
  }
  
  return item;
}

/**
 * Hook before updating items in any collection
 */
export function beforeUpdate(item, context) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return item;
  }

  item._updatedDate = new Date();
  
  if (item.email && typeof item.email === 'string') {
    item.email = item.email.trim().toLowerCase();
  }
  
  return item;
}

/**
 * Voicebanks collection specific hook
 */
export function Voicebanks_beforeInsert(item, context) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return item;
  }

  if (item.name && typeof item.name === 'string') {
    item.name = item.name.trim();
  }
  if (!item.status) {
    item.status = 'Ready for Download';
  }
  return beforeInsert(item, context);
}

/**
 * Registrations collection specific hook
 */
export function Registrations_beforeInsert(item, context) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return item;
  }

  item.status = item.status || 'Confirmed';
  return beforeInsert(item, context);
}

/**
 * Contacts collection specific hook
 */
export function Contacts_beforeInsert(item, context) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return item;
  }

  item.status = item.status || 'Pending';
  return beforeInsert(item, context);
}
```

---

## 5. Test Strategy & Verification Suite for M2

### 5.1 Required Verification Test Matrix

| Test Suite / Category | Target Area | Description / Cases |
|---|---|---|
| **Suite 1: Permissions Hardening** | `permissions.json` | • Verify all 8 methods are declared.<br>• Verify wildcard `*` has `siteOwner: true, siteMember: false, anonymous: false`.<br>• Verify no unlisted method can be invoked anonymously. |
| **Suite 2: JSW Boundary & Type Safety** | `src/backend/*.jsw` | • Call each method with `null`, `undefined`, numbers, empty objects.<br>• Verify zero uncaught `TypeError` or runtime crashes.<br>• Verify structured return format `{ success: false, errors: { ... } }`. |
| **Suite 3: Domain Whitelisting** | `contactService`, `registrationService` | • Test category with `'InvalidCategory'` -> defaults to `'General'`.<br>• Test experienceLevel with `'Expert'` -> defaults to `'Intermediate'`.<br>• Test valid eventId / voicebankId vs empty/missing values. |
| **Suite 4: HTTP CORS & Status Codes** | `http-functions.js` | • Test all 5 `OPTIONS` handlers (`options_voicebanks`, `options_singer`, `options_files`, `options_contact`, `options_register`) return status 200 with CORS headers.<br>• Test `post_contact` and `post_register` with malformed JSON body -> returns HTTP 400 Bad Request.<br>• Test `get_singer` with missing ID -> 400; non-existent ID -> 404; valid ID -> 200. |
| **Suite 5: Data Hooks Defensive Behavior** | `data.js` | • Test `beforeInsert(null)` and `beforeUpdate(null)` return without crashing.<br>• Test email trimming/lowercasing and timestamp attachment.<br>• Test `Voicebanks_beforeInsert` with non-string name. |
| **Suite 6: AGENT.md Logging Compliance** | All Backend Files | • Trigger errors in all methods and verify console logs match `[Component] Action failed: <cause>. Suggested action: <next step>.`. |

---

## 6. Conclusion & Readiness

The analysis confirms that the proposed changes strictly adhere to DELTA SYNTH AGENT.md:
- **Preserve Before Replace**: Preserves all existing method signatures, interface contracts, Thai/English messages, and return structures.
- **Defensive Design**: Adds comprehensive null guards, type checks, string bounds, and domain whitelisting.
- **Least Privilege**: Hardens the global wildcard in `permissions.json` to deny unlisted anonymous calls while keeping the 8 public web methods accessible.
- **Zero Swallowed Exceptions**: Errors are structured, logged with AGENT.md standard format, and propagated cleanly.
