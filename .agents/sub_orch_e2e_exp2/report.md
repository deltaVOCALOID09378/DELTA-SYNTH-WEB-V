# DELTA SYNTH — Backend E2E Testing Specification Report (4-Tier Suite)

> **Author**: Explorer 2 (Backend QA & Systems Architect)  
> **Date**: 2026-08-16  
> **Scope**: `src/backend/` (`contactService.jsw`, `registrationService.jsw`, `voicebankService.jsw`, `fileService.jsw`, `http-functions.js`, `data.js`, `permissions.json`)  
> **Standards Compliance**: AGENT.md (Sections 1, 2, 3, 4, 5, 6, 7, 11, 12, 16, 17, 18, 19, 20) & ORIGINAL_REQUEST.md (R1, R2, R3)

---

## 1. Executive Summary & Architecture Overview

The DELTA SYNTH backend layer is implemented as Wix Velo backend web modules (`.jsw`), REST API routes (`http-functions.js`), Wix Data collection lifecycle hooks (`data.js`), and a declarative access control matrix (`permissions.json`).

This report establishes the complete specification for the **4-Tier Opaque-Box E2E Backend Test Suite**, designed to be executed via Node.js native test runner (`node:test`, `node:assert/strict`).

```
                              ┌──────────────────────────────────┐
                              │     External Client / Browser    │
                              └─────────────────┬────────────────┘
                                                │
                 ┌──────────────────────────────┴──────────────────────────────┐
                 ▼ (REST / HTTP)                                               ▼ (Velo RPC / Frontend UI)
   ┌───────────────────────────┐                                 ┌───────────────────────────┐
   │    http-functions.js      │                                 │      permissions.json     │
   │  - get_voicebanks         │                                 │  - Access Control Check   │
   │  - get_singer             │                                 └─────────────┬─────────────┘
   │  - get_files              │                                               │
   │  - post_contact           │                                               ▼
   │  - post_register          │                                 ┌───────────────────────────┐
   │  - options_* (CORS)       │                                 │     Backend JSW Modules   │
   └─────────────┬─────────────┘                                 │  - contactService.jsw     │
                 │                                               │  - registrationService.jsw│
                 └───────────────────────┬───────────────────────┤  - voicebankService.jsw   │
                                         │                       │  - fileService.jsw        │
                                         ▼                       └─────────────┬─────────────┘
                          ┌─────────────────────────────┐                      │
                          │   public/ Shared Utilities  │                      │
                          │  - utils.js (sanitizeInput) │                      ▼
                          │  - voicebankData.js (54 VBs)│        ┌───────────────────────────┐
                          │  - projectData.js (Files/Ev)│        │          data.js          │
                          └─────────────────────────────┘        │  - Collection Hooks       │
                                                                 │  - Normalization/Defaults │
                                                                 └───────────────────────────┘
```

---

## 2. Backend Module & Method Contract Inventory

| Module | Method / Function | Input Contract | Output / Return Contract | Permissions (`permissions.json`) |
|---|---|---|---|:---:|
| `contactService.jsw` | `submitContactMessage(formData)` | `formData: { name, email, subject, category?, message }` | `Promise<{ success: boolean, message: string, ticketId?: string, errors?: object }>` | `anonymous: true` |
| `registrationService.jsw` | `registerForEvent(formData)` | `formData: { eventId, fullName, email, discord?, note? }` | `Promise<{ success: boolean, message: string, registrationId?: string, errors?: object }>` | `anonymous: true` |
| `registrationService.jsw` | `applyBetaTester(formData)` | `formData: { voicebankId, fullName, email, dawOrEngine, experienceLevel? }` | `Promise<{ success: boolean, message: string, applicationId?: string, errors?: object }>` | `anonymous: true` |
| `voicebankService.jsw` | `getVoicebanksList(params)` | `params?: { gender?, engine?, type?, query?, page?, pageSize? }` | `Promise<{ items: Array, total: number, page: number, pageSize: number, totalPages: number, error?: string }>` | `anonymous: true` |
| `voicebankService.jsw` | `getSingerDetails(singerId)` | `singerId: string` | `Promise<{ success: boolean, data: object\|null, error?: string }>` | `anonymous: true` |
| `voicebankService.jsw` | `getVoicebankStats()` | `none` | `Promise<{ totalSingers: number, engines: object, genders: object, supportedLanguages: number }>` | `anonymous: true` |
| `fileService.jsw` | `getMusicFiles(options)` | `options?: { format?, query? }` | `Promise<{ success: boolean, files: Array, count: number, error?: string }>` | `anonymous: true` |
| `fileService.jsw` | `trackFileDownload(fileId)` | `fileId: string` | `Promise<{ success: boolean }>` | `anonymous: true` |
| `http-functions.js` | `get_voicebanks(request)` | `request: { query?: { gender?, engine?, type?, search? } }` | `jsonResponse({ success: true, count, total, data }, 200)` | Public REST |
| `http-functions.js` | `get_singer(request)` | `request: { path: [singerId] }` | `jsonResponse({ success: true, data }, 200)` \| `400` \| `404` | Public REST |
| `http-functions.js` | `get_files(request)` | `request: { query?: { format? } }` | `jsonResponse({ success: true, count, data }, 200)` | Public REST |
| `http-functions.js` | `post_contact(request)` | `request: { body: { json: () => Promise<formData> } }` | `jsonResponse(result, 200\|400\|500)` | Public REST |
| `http-functions.js` | `post_register(request)` | `request: { body: { json: () => Promise<formData> } }` | `jsonResponse(result, 200\|400\|500)` | Public REST |
| `http-functions.js` | `options_voicebanks(request)` | `request: object` | `jsonResponse({}, 200)` (CORS headers) | Public REST |
| `data.js` | `beforeInsert(item, context)` | `item: object, context?: object` | `item` with `_createdDate`, `_updatedDate`, normalized `email` | Wix Internal |
| `data.js` | `beforeUpdate(item, context)` | `item: object, context?: object` | `item` with updated `_updatedDate`, normalized `email` | Wix Internal |
| `data.js` | `Voicebanks_beforeInsert(item)` | `item: object, context?: object` | `item` with trimmed `name`, default `status: 'Ready for Download'` | Wix Internal |
| `data.js` | `Registrations_beforeInsert(item)` | `item: object, context?: object` | `item` with default `status: 'Confirmed'` | Wix Internal |
| `data.js` | `Contacts_beforeInsert(item)` | `item: object, context?: object` | `item` with default `status: 'Pending'` | Wix Internal |

---

## 3. Tier 1: Feature Coverage Test Cases (≥5 per Component)

### 3.1 `contactService.jsw` — `submitContactMessage`
| Test ID | Test Scenario | Exact Input | Expected Assertions |
|---|---|---|---|
| **TC-T1-01** | Happy Path: General inquiry submission | `{ name: 'Somchai Jaidee', email: 'somchai@example.com', subject: 'General Question', category: 'General', message: 'Hello DELTA SYNTH, I love your singers!' }` | `res.success === true`<br>`typeof res.ticketId === 'string'`<br>`res.ticketId.startsWith('TICK_')`<br>`res.message.includes('เรียบร้อยแล้ว')` |
| **TC-T1-02** | Happy Path: Collaboration request with default category omitted | `{ name: 'Alice Walker', email: 'alice@music.com', subject: 'Collab 2026', message: 'Would like to propose a DiffSinger cover song collaboration.' }` | `res.success === true`<br>`res.ticketId.startsWith('TICK_')`<br>`res.errors === undefined` |
| **TC-T1-03** | Validation Failure: Missing or short name (<2 chars) | `{ name: 'A', email: 'alice@music.com', subject: 'Question', message: 'Testing short name validation in form.' }` | `res.success === false`<br>`res.errors.name === 'กรุณาระบุชื่อของคุณ'` |
| **TC-T1-04** | Validation Failure: Malformed email address | `{ name: 'Somchai', email: 'somchai-no-at-sign', subject: 'Voicebank Issue', message: 'The voicebank cannot be unzipped.' }` | `res.success === false`<br>`res.errors.email === 'กรุณาระบุอีเมลที่ติดต่อได้'` |
| **TC-T1-05** | Validation Failure: Short subject (<3 chars) and short message (<10 chars) | `{ name: 'Somchai', email: 'somchai@test.com', subject: 'Hi', message: 'Help' }` | `res.success === false`<br>`res.errors.subject === 'กรุณาระบุหัวข้อข้อความ'`<br>`res.errors.message === 'กรุณาระบุรายละเอียดข้อความอย่างน้อย 10 ตัวอักษร'` |

### 3.2 `registrationService.jsw` — `registerForEvent`
| Test ID | Test Scenario | Exact Input | Expected Assertions |
|---|---|---|---|
| **TC-T1-06** | Happy Path: Full event registration with Discord & Note | `{ eventId: 'event_001', fullName: 'Kittisak Dev', email: 'kittisak@delta.org', discord: 'Kitti#1234', note: 'Interested in DiffSinger Gen 2 showcase.' }` | `res.success === true`<br>`res.registrationId.startsWith('REG_')`<br>`res.message.includes('ลงทะเบียนเข้าร่วมกิจกรรมสำเร็จ')` |
| **TC-T1-07** | Happy Path: Minimal valid event registration | `{ eventId: 'event_002', fullName: 'Nopporn Sound', email: 'nopporn@sound.net' }` | `res.success === true`<br>`res.registrationId.startsWith('REG_')`<br>`res.errors === undefined` |
| **TC-T1-08** | Validation Failure: Missing `eventId` | `{ fullName: 'Kittisak Dev', email: 'kittisak@delta.org' }` | `res.success === false`<br>`res.errors.eventId === 'กรุณาระบุงานอีเวนต์ที่ต้องการสมัคร'` |
| **TC-T1-09** | Validation Failure: Invalid `fullName` (<2 chars or whitespace) | `{ eventId: 'event_001', fullName: ' ', email: 'valid@delta.org' }` | `res.success === false`<br>`res.errors.fullName === 'กรุณาระบุชื่อ-นามสกุลที่ถูกต้อง'` |
| **TC-T1-10** | Validation Failure: Invalid `email` format | `{ eventId: 'event_001', fullName: 'Valid Name', email: 'invalid_email@' }` | `res.success === false`<br>`res.errors.email === 'กรุณาระบุอีเมลที่ถูกต้อง'` |

### 3.3 `registrationService.jsw` — `applyBetaTester`
| Test ID | Test Scenario | Exact Input | Expected Assertions |
|---|---|---|---|
| **TC-T1-11** | Happy Path: Beta application with all fields specified | `{ voicebankId: 'beta_diffsinger_hikaru_v2', fullName: 'Tanaporn Music', email: 'tanaporn@studio.th', dawOrEngine: 'OpenUtau / Synthesizer V', experienceLevel: 'Advanced' }` | `res.success === true`<br>`res.applicationId.startsWith('BETA_')`<br>`res.message.includes('ส่งใบสมัครทดสอบ BETA สำเร็จแล้ว')` |
| **TC-T1-12** | Happy Path: Beta application with default experience level | `{ voicebankId: 'beta_diffsinger_sun_v2', fullName: 'Piyawat Producer', email: 'piyawat@producer.com', dawOrEngine: 'Cubase Pro 13' }` | `res.success === true`<br>`res.applicationId.startsWith('BETA_')` |
| **TC-T1-13** | Validation Failure: Missing `voicebankId` | `{ fullName: 'Tanaporn', email: 'tanaporn@studio.th', dawOrEngine: 'OpenUtau' }` | `res.success === false`<br>`res.errors.voicebankId === 'กรุณาเลือกคลังเสียง BETA'` |
| **TC-T1-14** | Validation Failure: Missing `dawOrEngine` | `{ voicebankId: 'beta_diffsinger_hikaru_v2', fullName: 'Tanaporn', email: 'tanaporn@studio.th' }` | `res.success === false`<br>`res.errors.dawOrEngine === 'กรุณาระบุโปรแกรมที่ใช้งาน (เช่น OpenUtau, Synthesizer V)'` |
| **TC-T1-15** | Validation Failure: Invalid `email` and empty `fullName` | `{ voicebankId: 'beta_diffsinger_hikaru_v2', fullName: '', email: 'notanemail', dawOrEngine: 'UTAU' }` | `res.success === false`<br>`res.errors.fullName === 'กรุณาระบุชื่อผู้สมัคร'`<br>`res.errors.email === 'กรุณาระบุอีเมลติดต่อ'` |

### 3.4 `voicebankService.jsw` — `getVoicebanksList`
| Test ID | Test Scenario | Exact Input | Expected Assertions |
|---|---|---|---|
| **TC-T1-16** | Default Query: Retrieve first page of all 54 singers | `{}` or `undefined` | `res.items.length === 12`<br>`res.total === 54`<br>`res.page === 1`<br>`res.pageSize === 12`<br>`res.totalPages === 5` |
| **TC-T1-17** | Gender Filtering: Retrieve only Male voicebanks | `{ gender: 'Male', page: 1, pageSize: 20 }` | `res.items.every(v => v.gender === 'Male')`<br>`res.total > 0`<br>`res.items.length <= 20` |
| **TC-T1-18** | Engine Filtering: Retrieve DiffSinger voicebanks | `{ engine: 'DiffSinger', page: 1, pageSize: 50 }` | `res.items.every(v => v.engine.includes('DiffSinger'))`<br>`res.total > 0` |
| **TC-T1-19** | Keyword Query Search: Query by name substring | `{ query: 'Hikaru' }` | `res.items.some(v => v.id === 'ayanami_hikaru')`<br>`res.total >= 1` |
| **TC-T1-20** | Pagination Bounds: Access page 5 of catalog | `{ page: 5, pageSize: 12 }` | `res.page === 5`<br>`res.items.length === 6` (54 - 48 = 6 remaining)<br>`res.totalPages === 5` |

### 3.5 `voicebankService.jsw` — `getSingerDetails`
| Test ID | Test Scenario | Exact Input | Expected Assertions |
|---|---|---|---|
| **TC-T1-21** | Valid Singer Lookup: Official flagship singer `ayanami_hikaru` | `'ayanami_hikaru'` | `res.success === true`<br>`res.data.id === 'ayanami_hikaru'`<br>`res.data.name === 'Ayanami Hikaru'`<br>`res.data.gender === 'Male'` |
| **TC-T1-22** | Valid Singer Lookup: Case-insensitivity check `SUN` | `'sun'` / `'SUN'` | `res.success === true`<br>`res.data.id === 'sun'`<br>`res.data.name === 'SUN'` |
| **TC-T1-23** | Valid Singer Lookup: Thai dual-engine singer `guren_kani` | `'guren_kani'` | `res.success === true`<br>`res.data.nameTh === 'กุเร็น คานิ'`<br>`res.data.engine.includes('UTAU')` |
| **TC-T1-24** | Non-existent Singer ID | `'non_existent_singer_id_999'` | `res.success === false`<br>`res.data === null`<br>`res.error.includes("not found in catalog")` |
| **TC-T1-25** | Invalid Input Type: Non-string integer or null | `12345` / `null` | `res.success === false`<br>`res.data === null`<br>`res.error === 'Invalid singer identifier provided'` |

### 3.6 `voicebankService.jsw` — `getVoicebankStats`
| Test ID | Test Scenario | Exact Input | Expected Assertions |
|---|---|---|---|
| **TC-T1-26** | Total Singers Count Verification | `none` | `res.totalSingers === 54` |
| **TC-T1-27** | Gender Aggregation Totals | `none` | `typeof res.genders.Male === 'number'`<br>`typeof res.genders.Female === 'number'`<br>`res.genders.Male + res.genders.Female + res.genders.Other === 54` |
| **TC-T1-28** | Engine Distribution Map | `none` | `typeof res.engines === 'object'`<br>`Object.values(res.engines).reduce((a,b)=>a+b, 0) === 54` |
| **TC-T1-29** | Supported Languages Constant | `none` | `res.supportedLanguages === 7` |
| **TC-T1-30** | Data Consistency Integrity Check | `none` | `res.totalSingers === VOICEBANKS.length` |

### 3.7 `fileService.jsw` — `getMusicFiles`
| Test ID | Test Scenario | Exact Input | Expected Assertions |
|---|---|---|---|
| **TC-T1-31** | Default Retrieval: Fetch all music files | `{}` or `undefined` | `res.success === true`<br>`res.files.length === 5`<br>`res.count === 5` |
| **TC-T1-32** | Format Filter: Filter by `USTX` format | `{ format: 'USTX' }` | `res.success === true`<br>`res.files.every(f => f.format === 'USTX')`<br>`res.count === 2` |
| **TC-T1-33** | Format Filter: Filter by `MIDI` format | `{ format: 'MIDI' }` | `res.success === true`<br>`res.files.every(f => f.format === 'MIDI')`<br>`res.count === 1` |
| **TC-T1-34** | Keyword Search: Search by title `Starlight` | `{ query: 'Starlight' }` | `res.success === true`<br>`res.files.some(f => f.id === 'file_001')`<br>`res.count >= 1` |
| **TC-T1-35** | Combined Filter: Format `SVP` + query `Highway` | `{ format: 'SVP', query: 'Highway' }` | `res.success === true`<br>`res.files.length === 1`<br>`res.files[0].id === 'file_002'` |

### 3.8 `fileService.jsw` — `trackFileDownload`
| Test ID | Test Scenario | Exact Input | Expected Assertions |
|---|---|---|---|
| **TC-T1-36** | Valid file download telemetry recording | `'file_001'` | `res.success === true` |
| **TC-T1-37** | Valid file download telemetry for MIDI file | `'file_003'` | `res.success === true` |
| **TC-T1-38** | Empty string fileId | `''` | `res.success === false` |
| **TC-T1-39** | Null / undefined fileId | `null` / `undefined` | `res.success === false` |
| **TC-T1-40** | Multiple sequential file download tracks | `['file_001', 'file_002', 'file_004']` | Each track returns `{ success: true }` |

### 3.9 `http-functions.js` — GET Endpoints
| Test ID | Test Scenario | Exact Input | Expected Assertions |
|---|---|---|---|
| **TC-T1-41** | `get_voicebanks`: Default query | `request = { query: {} }` | `res.status === 200`<br>`JSON.parse(res.body).success === true`<br>`JSON.parse(res.body).total === 54`<br>`res.headers['Content-Type'] === 'application/json'` |
| **TC-T1-42** | `get_voicebanks`: Search filter param | `request = { query: { search: 'Hikaru' } }` | `res.status === 200`<br>`JSON.parse(res.body).data.length >= 1` |
| **TC-T1-43** | `get_singer`: Existing singer ID in path | `request = { path: ['ayanami_hikaru'] }` | `res.status === 200`<br>`JSON.parse(res.body).success === true`<br>`JSON.parse(res.body).data.id === 'ayanami_hikaru'` |
| **TC-T1-44** | `get_singer`: Non-existent singer ID | `request = { path: ['unknown_singer'] }` | `res.status === 404`<br>`JSON.parse(res.body).success === false`<br>`JSON.parse(res.body).error === 'Singer not found'` |
| **TC-T1-45** | `get_files`: Filter by format `USTX` | `request = { query: { format: 'USTX' } }` | `res.status === 200`<br>`JSON.parse(res.body).success === true`<br>`JSON.parse(res.body).count === 2` |

### 3.10 `http-functions.js` — POST & OPTIONS Endpoints
| Test ID | Test Scenario | Exact Input | Expected Assertions |
|---|---|---|---|
| **TC-T1-46** | `options_voicebanks`: CORS Preflight Verification | `request = {}` | `res.status === 200`<br>`res.headers['Access-Control-Allow-Origin'] === '*'`<br>`res.headers['Access-Control-Allow-Methods'] === 'GET, POST, OPTIONS'` |
| **TC-T1-47** | `post_contact`: Valid contact form submission | `request = { body: { json: async () => ({ name: 'John Doe', email: 'john@example.com', subject: 'Collab', message: 'Hello from REST client!' }) } }` | `res.status === 200`<br>`JSON.parse(res.body).success === true`<br>`typeof JSON.parse(res.body).ticketId === 'string'` |
| **TC-T1-48** | `post_contact`: Invalid form data returning 400 Bad Request | `request = { body: { json: async () => ({ name: 'J', email: 'bademail' }) } }` | `res.status === 400`<br>`JSON.parse(res.body).success === false`<br>`typeof JSON.parse(res.body).errors === 'object'` |
| **TC-T1-49** | `post_register`: Valid event registration | `request = { body: { json: async () => ({ eventId: 'event_001', fullName: 'John Doe', email: 'john@example.com' }) } }` | `res.status === 200`<br>`JSON.parse(res.body).success === true`<br>`typeof JSON.parse(res.body).registrationId === 'string'` |
| **TC-T1-50** | `post_register`: Missing fields returning 400 Bad Request | `request = { body: { json: async () => ({}) } }` | `res.status === 400`<br>`JSON.parse(res.body).success === false` |

### 3.11 `permissions.json` Access Control Matrix
| Test ID | Test Scenario | Exact Input | Expected Assertions |
|---|---|---|---|
| **TC-T1-51** | `voicebankService` Methods Access Check | `backend/voicebankService.jsw` | `getVoicebanksList`, `getSingerDetails`, `getVoicebankStats` all have `anonymous.invoke === true` |
| **TC-T1-52** | `fileService` Methods Access Check | `backend/fileService.jsw` | `getMusicFiles`, `trackFileDownload` both have `anonymous.invoke === true` |
| **TC-T1-53** | `registrationService` Methods Access Check | `backend/registrationService.jsw` | `registerForEvent`, `applyBetaTester` both have `anonymous.invoke === true` |
| **TC-T1-54** | `contactService` Methods Access Check | `backend/contactService.jsw` | `submitContactMessage` has `anonymous.invoke === true` |
| **TC-T1-55** | Wildcard Fallback Principle of Least Privilege Evaluation | Top-level `*` -> `*` | Verify wildcard structure in `permissions.json` (`web-methods.*.*`) |

### 3.12 `data.js` Wix Data Collection Hooks
| Test ID | Test Scenario | Exact Input | Expected Assertions |
|---|---|---|---|
| **TC-T1-56** | `beforeInsert`: Assign timestamps and lowercase email | `item = { email: ' TEST@Delta.Org ' }` | `item._createdDate instanceof Date`<br>`item._updatedDate instanceof Date`<br>`item.email === 'test@delta.org'` |
| **TC-T1-57** | `beforeUpdate`: Update `_updatedDate` and preserve `_createdDate` | `item = { _createdDate: new Date('2025-01-01'), email: 'NEW@Delta.Org' }` | `item._createdDate.getFullYear() === 2025`<br>`item._updatedDate instanceof Date`<br>`item.email === 'new@delta.org'` |
| **TC-T1-58** | `Voicebanks_beforeInsert`: Trim name and set default status | `item = { name: '  Ayanami Hikaru  ' }` | `item.name === 'Ayanami Hikaru'`<br>`item.status === 'Ready for Download'`<br>`item._createdDate instanceof Date` |
| **TC-T1-59** | `Registrations_beforeInsert`: Set default status `Confirmed` | `item = { eventId: 'event_001', email: 'reg@test.com' }` | `item.status === 'Confirmed'`<br>`item.email === 'reg@test.com'` |
| **TC-T1-60** | `Contacts_beforeInsert`: Set default status `Pending` | `item = { name: 'User', message: 'Hello' }` | `item.status === 'Pending'`<br>`item._createdDate instanceof Date` |

---

## 4. Tier 2: Boundary & Corner Cases Test Cases

### 4.1 Null, Undefined & Non-Object Inputs (Defensive Hardening)
| Test ID | Test Scenario | Exact Input Payload | Expected Assertion & Safe Behavior |
|---|---|---|---|
| **TC-T2-01** | `submitContactMessage` called with `null` | `null` | Returns `{ success: false, errors: { system: ... } }` or standard error without unhandled crash. |
| **TC-T2-02** | `submitContactMessage` called with `undefined` | `undefined` | Returns `{ success: false }` with system error description. |
| **TC-T2-03** | `registerForEvent` called with `null` | `null` | Returns `{ success: false }` with system error description. |
| **TC-T2-04** | `applyBetaTester` called with `null` | `null` | Returns `{ success: false }` with system error description. |
| **TC-T2-05** | `getVoicebanksList` called with `null` | `null` | Returns `{ items: [], total: 0, page: 1, ... }` without unhandled crash. |
| **TC-T2-06** | `getMusicFiles` called with `null` | `null` | Returns `{ success: false, files: [], count: 0, error: ... }`. |
| **TC-T2-07** | `data.js` `beforeInsert` called with empty item | `{}` | Sets `_createdDate`, `_updatedDate`, returns object without error. |

### 4.2 Type Distortion & Non-String Fields
| Test ID | Test Scenario | Exact Input Payload | Expected Assertion & Safe Behavior |
|---|---|---|---|
| **TC-T2-08** | `submitContactMessage` with numbers/arrays for string fields | `{ name: 12345, email: ['test@test.com'], subject: true, message: { text: 'hello' } }` | Handled gracefully without unhandled `TypeError: .trim is not a function`. Returns `{ success: false }`. |
| **TC-T2-09** | `registerForEvent` with boolean/object fields | `{ eventId: 1001, fullName: { first: 'John' }, email: 9999 }` | Returns `{ success: false }`. |
| **TC-T2-10** | `getSingerDetails` with array/object argument | `['ayanami_hikaru']` / `{ id: 'sun' }` | Returns `{ success: false, data: null, error: 'Invalid singer identifier provided' }`. |
| **TC-T2-11** | `getMusicFiles` with numeric `format` and boolean `query` | `{ format: 123, query: true }` | Handled defensively without throwing unhandled `TypeError`. |
| **TC-T2-12** | `data.js` `beforeInsert` with non-string email | `{ email: 12345 }` | Does not crash `email.trim()`. `item.email === 12345`. |

### 4.3 Extreme String Lengths & Buffer Boundaries
| Test ID | Test Scenario | Exact Input Payload | Expected Assertion & Safe Behavior |
|---|---|---|---|
| **TC-T2-13** | Massive Message Body (10,000 characters) in Contact Form | `{ name: 'Tester', email: 'test@delta.org', subject: 'Huge Payload', message: 'A'.repeat(10000) }` | `res.success === true`; sanitized output is safely clamped to 1000 characters via `sanitizeInput`. |
| **TC-T2-14** | Extremely Long Subject (5,000 characters) | `{ name: 'Tester', email: 'test@delta.org', subject: 'S'.repeat(5000), message: 'Valid message body content.' }` | Sanitized to 1000 chars without buffer overflow. |
| **TC-T2-15** | Extremely Long FullName (1,000 characters) in Registration | `{ eventId: 'event_001', fullName: 'N'.repeat(1000), email: 'test@delta.org' }` | Clamped safely without DB crash. |

### 4.4 Injection Payloads (XSS, HTML, Script Tags, SQL Strings)
| Test ID | Test Scenario | Exact Input Payload | Expected Assertion & Safe Behavior |
|---|---|---|---|
| **TC-T2-16** | XSS `<script>` tag injection in Contact Message | `{ name: '<script>alert(1)</script>', email: 'xss@test.com', subject: '<script>src=evil.js</script>', message: '<img src=x onerror=alert(1)>' }` | Tags `<>` stripped by `sanitizeInput`. Output contains no `<` or `>` characters. |
| **TC-T2-17** | SQL Injection Strings in Voicebank Query | `{ query: "' OR '1'='1; DROP TABLE Voicebanks;--" }` | Returns 0 items safely; does not execute or crash memory lookup. |
| **TC-T2-18** | Path Traversal in Singer Details ID | `'../../../../etc/passwd'` | Lookup returns `{ success: false, data: null, error: ... }`. |
| **TC-T2-19** | Unicode Control Characters & Zero-Width Space | `{ name: 'Somchai\u200B\u0000Jaidee', email: 'somchai@test.com', subject: 'Test\r\nHeader Injection', message: 'Valid message payload' }` | Processed safely without header injection or memory corruption. |

### 4.5 Extreme Pagination Boundaries
| Test ID | Test Scenario | Exact Input Payload | Expected Assertion & Safe Behavior |
|---|---|---|---|
| **TC-T2-20** | Negative Page and Negative PageSize | `{ page: -5, pageSize: -10 }` | Clamped to `safePage = 1`, `safePageSize = 1`. Returns `items.length === 1`. |
| **TC-T2-21** | Page Out of Range Beyond Total Pages | `{ page: 9999, pageSize: 12 }` | Returns `items: []`, `page: 9999`, `total: 54`, `totalPages: 5`. |
| **TC-T2-22** | Gigantic PageSize (>1000) Clamping | `{ page: 1, pageSize: 5000 }` | Clamped to `safePageSize = 100` (max limit). Prevents memory exhaustion DoS. |
| **TC-T2-23** | NaN and Non-Numeric Strings for Pagination | `{ page: 'invalid', pageSize: 'xyz' }` | Clamped to `safePage = 1`, `safePageSize = 12`. |

### 4.6 REST & HTTP Function Corner Cases
| Test ID | Test Scenario | Exact Input Payload | Expected Assertion & Safe Behavior |
|---|---|---|---|
| **TC-T2-24** | `get_singer` with empty path array | `request = { path: [] }` | `res.status === 400`<br>`JSON.parse(res.body).error === 'Singer ID required in path'` |
| **TC-T2-25** | `post_contact` with malformed JSON body stream | `request = { body: { json: async () => { throw new Error('SyntaxError: Unexpected token'); } } }` | `res.status === 500` (or 400 in hardened mode)<br>`JSON.parse(res.body).success === false` |

---

## 5. Tier 3: Cross-Feature Combinations & State Transitions

```
+----------------------------------------------------------------------------------------------------+
|                                    TIER 3 COMBINATORIAL FLOWS                                     |
+------------------------------------+----------------------------------+----------------------------+
| 1. HTTP -> Service -> Data Hook    | 2. Multi-Step User Journey       | 3. CORS Preflight -> POST  |
|    POST /_functions/contact        |    getVoicebanksList             |    OPTIONS /_functions/... |
|    -> submitContactMessage         |    -> getSingerDetails           |    -> POST /_functions/... |
|    -> Contacts_beforeInsert        |    -> applyBetaTester            |    -> 200 OK / CORS Check  |
+------------------------------------+----------------------------------+----------------------------+
```

### TC-T3-01: End-to-End Contact Inquiry Pipeline
- **Flow**: REST Request -> `http-functions.js:post_contact` -> `contactService.jsw:submitContactMessage` -> `data.js:Contacts_beforeInsert`
- **Input**:
  ```json
  {
    "name": "  Arun Sound Studio  ",
    "email": "  ARUN@STUDIO.CO.TH  ",
    "subject": "License Inquiry for DiffSinger",
    "category": "License",
    "message": "We would like to license Ayanami Hikaru for a commercial game soundtrack."
  }
  ```
- **Execution & Assertions**:
  1. `submitContactMessage` validates fields, sanitizes HTML, and generates `ticketId` starting with `TICK_`.
  2. `Contacts_beforeInsert` hook receives ticket object, attaches `_createdDate`, `_updatedDate`, trims and lowercases email (`arun@studio.co.th`), sets default `status: 'Pending'`.
  3. `post_contact` receives success response and serializes HTTP 200 JSON with `{ success: true, ticketId: '...', message: '...' }`.

### TC-T3-02: End-to-End Event Registration Pipeline
- **Flow**: REST Request -> `http-functions.js:post_register` -> `registrationService.jsw:registerForEvent` -> `data.js:Registrations_beforeInsert`
- **Input**:
  ```json
  {
    "eventId": "event_001",
    "fullName": "Pitchaya Composer",
    "email": "PITCHAYA@COMPOSER.NET",
    "discord": "Pitchaya#9999",
    "note": "Looking forward to DiffSinger showcase!"
  }
  ```
- **Execution & Assertions**:
  1. `registerForEvent` checks `eventId`, `fullName`, `email`, generates `registrationId` starting with `REG_`.
  2. `Registrations_beforeInsert` sets `status: 'Confirmed'`, normalizes email to `pitchaya@composer.net`, sets timestamp.
  3. `post_register` returns HTTP 200 with `registrationId`.

### TC-T3-03: Multi-Step Discovery to Beta Application Journey
- **Flow**: `voicebankService.jsw:getVoicebanksList` -> `voicebankService.jsw:getSingerDetails` -> `registrationService.jsw:applyBetaTester`
- **Steps & Assertions**:
  1. User searches for DiffSinger voicebanks: `getVoicebanksList({ engine: 'DiffSinger', query: 'Hikaru' })`. Result includes `ayanami_hikaru`.
  2. User views singer profile: `getSingerDetails('ayanami_hikaru')`. Result returns complete singer object with `status: 'Ready for Download'`.
  3. User applies for beta version: `applyBetaTester({ voicebankId: 'beta_diffsinger_hikaru_v2', fullName: 'Alice Tester', email: 'alice@beta.com', dawOrEngine: 'OpenUtau' })`. Result returns `success: true` with `applicationId` starting with `BETA_`.

### TC-T3-04: Catalog Search -> File Resources Filter -> Download Telemetry Flow
- **Flow**: `voicebankService.jsw:getSingerDetails` -> `fileService.jsw:getMusicFiles` -> `fileService.jsw:trackFileDownload`
- **Steps & Assertions**:
  1. Retrieve singer details: `getSingerDetails('sun')` -> confirms singer name `'SUN'`.
  2. Query music files matching recommended singer or format: `getMusicFiles({ format: 'SVP', query: 'SUN' })` -> returns `file_002` (`Midnight Highway`).
  3. User triggers download: `trackFileDownload('file_002')` -> returns `{ success: true }`.

### TC-T3-05: REST API Preflight & Method Execution Matrix
- **Flow**: `http-functions.js:options_voicebanks` -> `http-functions.js:get_voicebanks`
- **Steps & Assertions**:
  1. Browser sends `OPTIONS` preflight request: `options_voicebanks({})`.
  2. Verify headers: `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Methods: GET, POST, OPTIONS`.
  3. Browser follows up with `GET` request: `get_voicebanks({ query: { gender: 'Female' } })`.
  4. Returns HTTP 200 with filtered female voicebanks list.

### TC-T3-06: Permissions Enforcement & Method Access Simulation
- **Flow**: Evaluate `permissions.json` against mock caller contexts (`anonymous`, `siteMember`, `siteOwner`).
- **Steps & Assertions**:
  1. Check public endpoints (`submitContactMessage`, `getVoicebanksList`, `registerForEvent`): Allowed for `anonymous`, `siteMember`, `siteOwner`.
  2. Check non-existent / private method `backend/adminService.jsw:purgeDatabase`: Default wildcard fallback evaluates to restricted access in hardened security model.

---

## 6. Tier 4: Real-World Scenarios & Workload Simulations

### TC-T4-01: High-Volume Concurrent Contact Submissions (100 Burst Inquiries)
- **Scenario**: A major campaign launch generates 100 simultaneous contact submissions within 500ms.
- **Test Logic**:
  ```javascript
  const promises = Array.from({ length: 100 }, (_, i) => 
    submitContactMessage({
      name: `User ${i}`,
      email: `user_${i}@loadtest.com`,
      subject: `Inquiry #${i}`,
      category: 'General',
      message: `Load testing automated submission message number ${i}.`
    })
  );
  const results = await Promise.all(promises);
  ```
- **Expected Assertions**:
  - `results.every(r => r.success === true)`
  - Unique Ticket IDs: `new Set(results.map(r => r.ticketId)).size === 100` (Zero ID collisions).
  - All executions complete in < 200ms without memory leaks or unhandled promise rejections.

### TC-T4-02: Rapid Multi-Filter Voicebank Search Bursts (200 Filter Swaps)
- **Scenario**: User rapidly changes search filters on the catalog page across genders ('Male', 'Female', 'All'), engines ('DiffSinger', 'UTAU', 'All'), and various queries.
- **Test Logic**:
  - Run 200 asynchronous queries with randomized permutations:
    `queryVoicebanks({ gender: randomGender, engine: randomEngine, query: randomQuery })` and `getVoicebanksList(...)`.
- **Expected Assertions**:
  - 100% queries return structured results `{ items, total, page, pageSize, totalPages }`.
  - Zero crashes or corrupted array state in `VOICEBANKS` singleton.

### TC-T4-03: Batch Event Registration & Capacity Pipeline Simulation
- **Scenario**: 50 attendees concurrently register for `event_001` (`Online Creator Fest 2026`).
- **Test Logic**:
  - Execute 50 concurrent `registerForEvent` calls.
  - Pipe each registration into `Registrations_beforeInsert` hook.
- **Expected Assertions**:
  - 50 unique `registrationId` values generated (`REG_*`).
  - All 50 records receive `status: 'Confirmed'` and valid ISO timestamps.

### TC-T4-04: Unauthenticated Adversarial Penetration Simulation
- **Scenario**: An automated scanner attempts a series of malicious requests across all backend endpoints:
  1. Submitting SQL injection strings in contact form (`' OR '1'='1'`).
  2. Submitting persistent XSS script payloads (`<script>window.location='http://attacker.com'</script>`) in beta application DAW field.
  3. Attempting path traversal in `getSingerDetails` (`'../../package.json'`).
  4. Sending 100KB large payloads to `post_contact`.
- **Expected Assertions**:
  - No script execution; HTML stripped by `sanitizeInput`.
  - Path traversal returns `{ success: false, data: null, error: ... }`.
  - Oversized payloads safely clamped without process crash.
  - Zero unhandled exceptions.

### TC-T4-05: High-Frequency File Download Analytics Stream
- **Scenario**: 150 file download tracking events fired concurrently across various music resource files (`file_001` to `file_005`).
- **Test Logic**:
  - Fire 150 concurrent `trackFileDownload(fileId)` calls.
- **Expected Assertions**:
  - 100% resolve with `{ success: true }`.
  - Non-blocking execution with no console errors.

---

## 7. Mocking Strategies & Node.js Test Harness Design

To execute the 4-tier test suite in a local Node.js environment without requiring live Wix Cloud infrastructure:

### 7.1 Mocking Wix Imports & Module Resolution
The test harness provides mock loaders or path aliases for:
- `'public/utils'` -> resolves to `src/public/utils.js`
- `'public/voicebankData'` -> resolves to `src/public/voicebankData.js`
- `'public/projectData'` -> resolves to `src/public/projectData.js`
- `'backend/contactService.jsw'` -> resolves to `src/backend/contactService.jsw`
- `'backend/registrationService.jsw'` -> resolves to `src/backend/registrationService.jsw`

### 7.2 Mocking HTTP Request Objects
```javascript
function createMockHttpRequest({ method = 'GET', path = [], query = {}, body = null } = {}) {
  return {
    method,
    path,
    query,
    body: {
      json: async () => {
        if (body === null) throw new Error('Empty or invalid JSON body');
        return body;
      },
      text: async () => JSON.stringify(body)
    },
    headers: {
      'content-type': 'application/json'
    }
  };
}
```

### 7.3 Assertions Library
Utilizes standard `node:assert/strict`:
- `assert.strictEqual(actual, expected)`
- `assert.ok(value)`
- `assert.deepStrictEqual(actual, expected)`
- `assert.match(string, regexp)`

---

## 8. Summary Table of Test Cases Across All 4 Tiers

| Tier | Component / Scope | Test Case IDs | Count | Primary Focus |
|---|---|---|:---:|---|
| **Tier 1** | `contactService.jsw` | TC-T1-01 to TC-T1-05 | 5 | Equivalence partitioning, field validation, ticket generation |
| **Tier 1** | `registrationService.jsw` (Events) | TC-T1-06 to TC-T1-10 | 5 | Event registration fields, errors map, unique registration ID |
| **Tier 1** | `registrationService.jsw` (Beta) | TC-T1-11 to TC-T1-15 | 5 | Beta voicebank application, DAW validation, experience defaults |
| **Tier 1** | `voicebankService.jsw` (Catalog) | TC-T1-16 to TC-T1-20 | 5 | 54-voicebank filtering by gender, engine, type, query, pagination |
| **Tier 1** | `voicebankService.jsw` (Details) | TC-T1-21 to TC-T1-25 | 5 | Single singer lookup, case-insensitivity, not found handling |
| **Tier 1** | `voicebankService.jsw` (Stats) | TC-T1-26 to TC-T1-30 | 5 | Statistical aggregation, gender/engine counts, language constant |
| **Tier 1** | `fileService.jsw` (Music Files) | TC-T1-31 to TC-T1-35 | 5 | Format filtering (USTX, MIDI, SVP, VSQX), keyword queries |
| **Tier 1** | `fileService.jsw` (Downloads) | TC-T1-36 to TC-T1-40 | 5 | Download event tracking, empty/invalid ID handling |
| **Tier 1** | `http-functions.js` (GET Routes) | TC-T1-41 to TC-T1-45 | 5 | REST GET status codes, CORS headers, JSON responses |
| **Tier 1** | `http-functions.js` (POST/OPTIONS) | TC-T1-46 to TC-T1-50 | 5 | REST POST dispatch, 400 Bad Request, CORS preflight 200 OK |
| **Tier 1** | `permissions.json` (Access Control) | TC-T1-51 to TC-T1-55 | 5 | Declarative permissions matrix across all 8 web methods |
| **Tier 1** | `data.js` (Wix Data Hooks) | TC-T1-56 to TC-T1-60 | 5 | `beforeInsert`, `beforeUpdate`, collection defaults & timestamps |
| **Tier 2** | Boundary, Corner & Adversarial | TC-T2-01 to TC-T2-25 | 25 | Null/undefined, type distortion, XSS, extreme pagination, buffer bounds |
| **Tier 3** | Cross-Feature Combinations | TC-T3-01 to TC-T3-06 | 6 | Multi-step user journeys, REST-to-service pipelines, data hook chains |
| **Tier 4** | Real-World Workloads | TC-T4-01 to TC-T4-05 | 5 | 100 burst inquiries, 200 search swaps, 50 registrations, penetration tests |
| **Total** | **All Backend Components** | **TC-T1-01 to TC-T4-05** | **96 Tests** | **Comprehensive 100% Backend Verification Matrix** |

---

## 9. Conclusion & Handoff Readiness

All backend services, REST endpoints, data hooks, and permissions have been fully analyzed and specified across the 4-tier testing hierarchy. 

The test cases in this report provide unambiguous input fixtures, execution steps, and assertion criteria ready for implementation in `tests/tier1-feature-coverage.test.js`, `tests/tier2-boundary-corner.test.js`, `tests/tier3-cross-feature.test.js`, and `tests/tier4-real-world-workloads.test.js`.
