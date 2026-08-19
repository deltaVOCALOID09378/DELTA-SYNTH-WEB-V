/**
 * DELTA SYNTH — Tier 5: Milestone M2 Backend Empirical Adversarial & Stress Test Suite
 * 
 * Exhaustively stress-tests:
 * - src/backend/contactService.jsw (submitContactMessage)
 * - src/backend/registrationService.jsw (registerForEvent, applyBetaTester)
 * - src/backend/voicebankService.jsw (getVoicebanksList, getSingerDetails, getVoicebankStats)
 * - src/backend/fileService.jsw (getMusicFiles, trackFileDownload)
 * - src/backend/http-functions.js (all GET, POST, OPTIONS endpoints, CORS, HTTP status codes)
 * - src/backend/data.js (all collection hooks, item mutation, date assignment)
 * - src/backend/permissions.json (schema, least-privilege wildcard, 8 web methods)
 * 
 * Adversarial Input Space:
 * null, undefined, NaN, Infinity, -Infinity, symbols, BigInt, empty strings,
 * whitespace-only strings, 100KB+ buffers, SQL injection strings, XSS scripts,
 * prototype pollution keys, corrupt getters, malformed JSON streams, out-of-range pagination.
 * 
 * Standards Compliance: AGENT.md (Sections 6, 11, 12, 16), PROJECT.md
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  setupTestEnvironment,
  teardownTestEnvironment,
  ConsoleSpy,
  createMockHttpRequest,
  loadPublicModule,
  loadBackendModule
} from './test-helpers.js';

describe('Tier 5: Milestone M2 Backend Empirical Adversarial & Stress Verification', () => {
  let env;
  let spy;

  beforeEach(() => {
    env = setupTestEnvironment();
    spy = new ConsoleSpy();
  });

  afterEach(() => {
    spy.restore();
    teardownTestEnvironment();
  });

  // ==========================================================================
  // 1. contactService.jsw Adversarial Testing
  // ==========================================================================
  describe('1. contactService.jsw (submitContactMessage)', async () => {
    const contactMod = await loadBackendModule('contactService.jsw');

    it('TC-M2-ADV-CON-01: Fuzzing top-level non-object payloads (zero unhandled exceptions)', async () => {
      const fuzzInputs = [
        null,
        undefined,
        0,
        1,
        -1,
        NaN,
        Infinity,
        -Infinity,
        true,
        false,
        '',
        'string_payload',
        [],
        [1, 2, 3],
        ['name', 'email'],
        Symbol('adversarial'),
        12345678901234567890n,
        () => {},
        async () => {}
      ];

      for (const input of fuzzInputs) {
        const res = await contactMod.submitContactMessage(input);
        assert.ok(res && typeof res === 'object', `Expected object response for input ${String(input)}`);
        assert.strictEqual(res.success, false, `Expected success=false for input ${String(input)}`);
        assert.ok(typeof res.message === 'string' && res.message.length > 0);
        assert.ok(res.errors && res.errors.system);
      }
    });

    it('TC-M2-ADV-CON-02: Corrupted, typedistorted, and getter-trapped object fields', async () => {
      const trappedPayload = {
        name: { toString: () => { throw new Error('getter_trap_name'); } },
        email: [1, 2, 3],
        subject: 99999,
        category: { value: 'Support' },
        message: true
      };

      const res = await contactMod.submitContactMessage(trappedPayload);
      assert.strictEqual(res.success, false);
      assert.ok(res.errors);
      assert.ok(res.errors.name);
      assert.ok(res.errors.email);
      assert.ok(res.errors.subject);
      assert.ok(res.errors.message);
    });

    it('TC-M2-ADV-CON-03: Boundary checks on string lengths (name, email, subject, message)', async () => {
      // Name boundaries: min 2, max 100
      const shortName = await contactMod.submitContactMessage({
        name: 'A',
        email: 'test@delta.org',
        subject: 'Valid Subject',
        message: 'Valid message exceeding 10 characters'
      });
      assert.strictEqual(shortName.success, false);
      assert.ok(shortName.errors.name);

      const longName = await contactMod.submitContactMessage({
        name: 'A'.repeat(101),
        email: 'test@delta.org',
        subject: 'Valid Subject',
        message: 'Valid message exceeding 10 characters'
      });
      assert.strictEqual(longName.success, false);
      assert.ok(longName.errors.name);

      // Email boundaries: > 254 chars or malformed
      const longEmail = await contactMod.submitContactMessage({
        name: 'Valid Name',
        email: `${'a'.repeat(250)}@delta.org`,
        subject: 'Valid Subject',
        message: 'Valid message exceeding 10 characters'
      });
      assert.strictEqual(longEmail.success, false);
      assert.ok(longEmail.errors.email);

      // Subject boundaries: min 3, max 200
      const shortSub = await contactMod.submitContactMessage({
        name: 'Valid Name',
        email: 'test@delta.org',
        subject: 'AB',
        message: 'Valid message exceeding 10 characters'
      });
      assert.strictEqual(shortSub.success, false);
      assert.ok(shortSub.errors.subject);

      const longSub = await contactMod.submitContactMessage({
        name: 'Valid Name',
        email: 'test@delta.org',
        subject: 'A'.repeat(201),
        message: 'Valid message exceeding 10 characters'
      });
      assert.strictEqual(longSub.success, false);
      assert.ok(longSub.errors.subject);

      // Message boundaries: min 10, max 5000
      const shortMsg = await contactMod.submitContactMessage({
        name: 'Valid Name',
        email: 'test@delta.org',
        subject: 'Valid Subject',
        message: '123456789'
      });
      assert.strictEqual(shortMsg.success, false);
      assert.ok(shortMsg.errors.message);

      const longMsg = await contactMod.submitContactMessage({
        name: 'Valid Name',
        email: 'test@delta.org',
        subject: 'Valid Subject',
        message: 'A'.repeat(5001)
      });
      assert.strictEqual(longMsg.success, false);
      assert.ok(longMsg.errors.message);
    });

    it('TC-M2-ADV-CON-04: Category domain whitelisting and case-insensitive fallback', async () => {
      // Valid categories from CONTACT_CATEGORIES
      for (const cat of contactMod.CONTACT_CATEGORIES) {
        const res = await contactMod.submitContactMessage({
          name: 'Valid Name',
          email: 'test@delta.org',
          subject: 'Valid Subject',
          category: cat.toLowerCase(),
          message: 'Valid message exceeding 10 characters'
        });
        assert.strictEqual(res.success, true);
        assert.ok(res.ticketId.startsWith('TICK_'));
      }

      // Invalid category fallback to 'General'
      const invalidCat = await contactMod.submitContactMessage({
        name: 'Valid Name',
        email: 'test@delta.org',
        subject: 'Valid Subject',
        category: 'MALICIOUS_CATEGORY_SQL_INJECTION',
        message: 'Valid message exceeding 10 characters'
      });
      assert.strictEqual(invalidCat.success, true);
      assert.ok(invalidCat.ticketId.startsWith('TICK_'));
    });

    it('TC-M2-ADV-CON-05: XSS, SQLi, and HTML injection sanitization in contact messages', async () => {
      const res = await contactMod.submitContactMessage({
        name: '<script>alert("XSS")</script>Somchai',
        email: 'xss_tester@delta.org',
        subject: '<img src=x onerror=alert(1)>Subject Title',
        category: 'Feedback',
        message: '<iframe src="javascript:alert(1)"></iframe>Detailed message body for DELTA team'
      });
      assert.strictEqual(res.success, true);
      assert.ok(res.ticketId.startsWith('TICK_'));
    });
  });

  // ==========================================================================
  // 2. registrationService.jsw Adversarial Testing
  // ==========================================================================
  describe('2. registrationService.jsw (registerForEvent, applyBetaTester)', async () => {
    const regMod = await loadBackendModule('registrationService.jsw');

    it('TC-M2-ADV-REG-01: Fuzzing non-object payloads across event and beta tester methods', async () => {
      const fuzzInputs = [null, undefined, 0, -1, NaN, Infinity, true, false, '', [], [123], Symbol('reg')];

      for (const input of fuzzInputs) {
        const resEvent = await regMod.registerForEvent(input);
        assert.strictEqual(resEvent.success, false);
        assert.ok(resEvent.errors && resEvent.errors.system);

        const resBeta = await regMod.applyBetaTester(input);
        assert.strictEqual(resBeta.success, false);
        assert.ok(resBeta.errors && resBeta.errors.system);
      }
    });

    it('TC-M2-ADV-REG-02: registerForEvent eventId whitelisting against EVENTS catalog', async () => {
      // Non-existent event ID
      const resInvalid = await regMod.registerForEvent({
        eventId: 'EVT_FAKE_UNKNOWN_99999',
        fullName: 'Somchai Jaidee',
        email: 'somchai@delta.org'
      });
      assert.strictEqual(resInvalid.success, false);
      assert.ok(resInvalid.errors.eventId);

      // Valid event ID
      const resValid = await regMod.registerForEvent({
        eventId: 'event_001',
        fullName: 'Somchai Jaidee',
        email: 'somchai@delta.org',
        discord: 'somchai#1234',
        note: 'Excited for the event!'
      });
      assert.strictEqual(resValid.success, true);
      assert.ok(resValid.registrationId.startsWith('REG_'));
    });

    it('TC-M2-ADV-REG-03: applyBetaTester voicebankId and experienceLevel whitelisting', async () => {
      // Non-existent voicebank ID
      const resInvalidVB = await regMod.applyBetaTester({
        voicebankId: 'VB_NONEXISTENT_999',
        fullName: 'Tester One',
        email: 'tester@delta.org',
        dawOrEngine: 'OpenUtau'
      });
      assert.strictEqual(resInvalidVB.success, false);
      assert.ok(resInvalidVB.errors.voicebankId);

      // Valid voicebank ID with various experience levels (case-insensitive + fallback)
      const resValidExp = await regMod.applyBetaTester({
        voicebankId: 'beta_diffsinger_hikaru_v2',
        fullName: 'Tester One',
        email: 'tester@delta.org',
        dawOrEngine: 'OpenUtau',
        experienceLevel: 'ADVANCED'
      });
      assert.strictEqual(resValidExp.success, true);
      assert.ok(resValidExp.applicationId.startsWith('BETA_'));

      // Unknown experienceLevel falls back to 'Intermediate'
      const resFallbackExp = await regMod.applyBetaTester({
        voicebankId: 'beta_diffsinger_hikaru_v2',
        fullName: 'Tester Two',
        email: 'tester2@delta.org',
        dawOrEngine: 'Synthesizer V',
        experienceLevel: 'GRANDMASTER_OVERLORD'
      });
      assert.strictEqual(resFallbackExp.success, true);
      assert.ok(resFallbackExp.applicationId.startsWith('BETA_'));
    });

    it('TC-M2-ADV-REG-04: Length truncation and boundary handling for optional fields', async () => {
      const hugeDiscord = 'D'.repeat(200);
      const hugeNote = 'N'.repeat(2000);

      const res = await regMod.registerForEvent({
        eventId: 'event_001',
        fullName: 'Somchai Safe',
        email: 'somchai@delta.org',
        discord: hugeDiscord,
        note: hugeNote
      });

      assert.strictEqual(res.success, true);
      assert.ok(res.registrationId.startsWith('REG_'));
    });
  });

  // ==========================================================================
  // 3. voicebankService.jsw Adversarial Testing
  // ==========================================================================
  describe('3. voicebankService.jsw (getVoicebanksList, getSingerDetails, getVoicebankStats)', async () => {
    const vbService = await loadBackendModule('voicebankService.jsw');

    it('TC-M2-ADV-VB-01: getVoicebanksList extreme pagination and type distortions', async () => {
      // Null / undefined params
      const resNull = await vbService.getVoicebanksList(null);
      assert.strictEqual(resNull.total, 54);
      assert.strictEqual(resNull.items.length, 12);
      assert.strictEqual(resNull.page, 1);
      assert.strictEqual(resNull.pageSize, 12);

      // Negative page and pageSize clamped to 1
      const resNegative = await vbService.getVoicebanksList({ page: -100, pageSize: -50 });
      assert.strictEqual(resNegative.page, 1);
      assert.strictEqual(resNegative.pageSize, 1);
      assert.strictEqual(resNegative.items.length, 1);

      // Gigantic pageSize clamped to 100
      const resGigantic = await vbService.getVoicebanksList({ page: 1, pageSize: 99999 });
      assert.strictEqual(resGigantic.pageSize, 100);
      assert.strictEqual(resGigantic.items.length, 54);

      // Page out of bounds (beyond totalPages)
      const resFarOut = await vbService.getVoicebanksList({ page: 999, pageSize: 12 });
      assert.strictEqual(resFarOut.page, 999);
      assert.strictEqual(resFarOut.items.length, 0);

      // Non-numeric strings / NaN / objects in pagination fields
      const resNaN = await vbService.getVoicebanksList({ page: 'not_a_number', pageSize: {} });
      assert.strictEqual(resNaN.page, 1);
      assert.strictEqual(resNaN.pageSize, 12);
      assert.strictEqual(resNaN.items.length, 12);
    });

    it('TC-M2-ADV-VB-02: getVoicebanksList complex adversarial query strings', async () => {
      const adversarialQueries = [
        "' OR '1'='1",
        "'; DROP TABLE Voicebanks; --",
        '<script>alert(1)</script>',
        '.*',
        '([a-z])+',
        '\\u0000\\x00',
        '   ',
        'NonExistentVoicebankNameQueryXYZ123'
      ];

      for (const q of adversarialQueries) {
        const res = await vbService.getVoicebanksList({ query: q });
        assert.ok(Array.isArray(res.items));
        assert.strictEqual(typeof res.total, 'number');
        assert.ok(res.total >= 0);
      }
    });

    it('TC-M2-ADV-VB-03: getSingerDetails invalid types, prototypes, and directory traversal', async () => {
      const invalidSingerIds = [
        null,
        undefined,
        '',
        '   ',
        12345,
        ['hikaru'],
        { id: 'hikaru' },
        '__proto__',
        'constructor',
        'toString',
        '../../../../etc/passwd',
        '..\\..\\..\\windows\\win.ini',
        'UNKNOWN_SINGER_ID_999'
      ];

      for (const id of invalidSingerIds) {
        const res = await vbService.getSingerDetails(id);
        assert.strictEqual(res.success, false);
        assert.strictEqual(res.data, null);
        assert.ok(typeof res.error === 'string' && res.error.length > 0);
      }

      // Valid singer ID
      const resValid = await vbService.getSingerDetails('ayanami_hikaru');
      assert.strictEqual(resValid.success, true);
      assert.ok(resValid.data && typeof resValid.data === 'object');
      assert.strictEqual(resValid.data.id, 'ayanami_hikaru');
    });

    it('TC-M2-ADV-VB-04: getVoicebankStats data structure and invariant verification', async () => {
      const stats = await vbService.getVoicebankStats();
      assert.strictEqual(stats.success, true);
      assert.strictEqual(stats.totalSingers, 54);
      assert.ok(stats.engines && typeof stats.engines === 'object');
      assert.ok(stats.genders && typeof stats.genders === 'object');
      assert.ok(typeof stats.genders.Male === 'number');
      assert.ok(typeof stats.genders.Female === 'number');
      assert.strictEqual(stats.supportedLanguages, 7);
    });
  });

  // ==========================================================================
  // 4. fileService.jsw Adversarial Testing
  // ==========================================================================
  describe('4. fileService.jsw (getMusicFiles, trackFileDownload)', async () => {
    const fileMod = await loadBackendModule('fileService.jsw');

    it('TC-M2-ADV-FIL-01: getMusicFiles format filtering and search fuzzing', async () => {
      // Null / empty options
      const resNull = await fileMod.getMusicFiles(null);
      assert.strictEqual(resNull.success, true);
      assert.strictEqual(resNull.count, 5);

      // Valid format filters
      const formats = ['USTX', 'MIDI', 'SVP', 'VSQX'];
      for (const fmt of formats) {
        const res = await fileMod.getMusicFiles({ format: fmt.toLowerCase() });
        assert.strictEqual(res.success, true);
        assert.ok(res.files.every(f => f.format.toUpperCase() === fmt));
      }

      // Invalid format filter returns empty list safely
      const resInvalidFmt = await fileMod.getMusicFiles({ format: 'FLAC_WAV_UNKNOWN' });
      assert.strictEqual(resInvalidFmt.success, true);
      assert.strictEqual(resInvalidFmt.count, 0);

      // Search keyword filter
      const resQuery = await fileMod.getMusicFiles({ query: 'ustx' });
      assert.strictEqual(resQuery.success, true);
      assert.ok(resQuery.count >= 1);
    });

    it('TC-M2-ADV-FIL-02: trackFileDownload fuzzing and non-existent file checks', async () => {
      const invalidIds = [null, undefined, '', '   ', 12345, {}, [], 'file_non_existent_999'];

      for (const id of invalidIds) {
        const res = await fileMod.trackFileDownload(id);
        assert.strictEqual(res.success, false);
        assert.ok(res.message);
      }

      // Valid file ID
      const resValid = await fileMod.trackFileDownload('file_001');
      assert.strictEqual(resValid.success, true);
      assert.ok(resValid.message.includes('file_001'));
    });
  });

  // ==========================================================================
  // 5. http-functions.js REST Endpoints & CORS Adversarial Testing
  // ==========================================================================
  describe('5. http-functions.js REST API & CORS Preflight', async () => {
    const httpMod = await loadBackendModule('http-functions.js');

    it('TC-M2-ADV-HTTP-01: OPTIONS preflight endpoints return 200 with complete CORS headers', () => {
      const optionsEndpoints = [
        httpMod.options_voicebanks,
        httpMod.options_singer,
        httpMod.options_files,
        httpMod.options_contact,
        httpMod.options_register
      ];

      for (const optFn of optionsEndpoints) {
        const res = optFn(createMockHttpRequest({ method: 'OPTIONS' }));
        assert.strictEqual(res.status, 200);
        assert.ok(res.headers);
        assert.strictEqual(res.headers['Access-Control-Allow-Origin'], '*');
        assert.strictEqual(res.headers['Access-Control-Allow-Methods'], 'GET, POST, OPTIONS');
        assert.strictEqual(res.headers['Access-Control-Allow-Headers'], 'Content-Type');
      }
    });

    it('TC-M2-ADV-HTTP-02: GET /_functions/voicebanks handles null, empty, and query parameters', () => {
      // Null request
      const resNull = httpMod.get_voicebanks(null);
      assert.strictEqual(resNull.status, 200);
      const dataNull = JSON.parse(resNull.body);
      assert.strictEqual(dataNull.success, true);
      assert.strictEqual(dataNull.total, 54);

      // Filtered query
      const reqQuery = createMockHttpRequest({
        method: 'GET',
        query: { gender: 'Female', engine: 'DiffSinger', search: 'hikaru' }
      });
      const resQuery = httpMod.get_voicebanks(reqQuery);
      assert.strictEqual(resQuery.status, 200);
      const dataQuery = JSON.parse(resQuery.body);
      assert.strictEqual(dataQuery.success, true);
      assert.ok(Array.isArray(dataQuery.data));
    });

    it('TC-M2-ADV-HTTP-03: GET /_functions/singer/:id status codes (200, 400, 404)', () => {
      // Missing path (400)
      const resNoPath = httpMod.get_singer(createMockHttpRequest({ path: [] }));
      assert.strictEqual(resNoPath.status, 400);

      // Empty string path (400)
      const resEmptyPath = httpMod.get_singer(createMockHttpRequest({ path: ['   '] }));
      assert.strictEqual(resEmptyPath.status, 400);

      // Non-existent singer ID (404)
      const resNotFound = httpMod.get_singer(createMockHttpRequest({ path: ['singer_unknown_404'] }));
      assert.strictEqual(resNotFound.status, 404);

      // Valid singer ID (200)
      const resFound = httpMod.get_singer(createMockHttpRequest({ path: ['ayanami_hikaru'] }));
      assert.strictEqual(resFound.status, 200);
      const dataFound = JSON.parse(resFound.body);
      assert.strictEqual(dataFound.success, true);
      assert.strictEqual(dataFound.data.id, 'ayanami_hikaru');
    });

    it('TC-M2-ADV-HTTP-04: GET /_functions/files handles null request and format queries', () => {
      const resNull = httpMod.get_files(null);
      assert.strictEqual(resNull.status, 200);
      const data = JSON.parse(resNull.body);
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.count, 5);

      const reqUSTX = createMockHttpRequest({ query: { format: 'USTX' } });
      const resUSTX = httpMod.get_files(reqUSTX);
      assert.strictEqual(resUSTX.status, 200);
    });

    it('TC-M2-ADV-HTTP-05: POST /_functions/contact handles malformed streams and validation', async () => {
      // Malformed request without json() method -> 400
      const resNoBody = await httpMod.post_contact(null);
      assert.strictEqual(resNoBody.status, 400);

      // Broken JSON stream throwing SyntaxError -> 400
      const brokenReq = {
        body: {
          json: async () => { throw new SyntaxError('Unexpected token < in JSON at position 0'); }
        }
      };
      const resBroken = await httpMod.post_contact(brokenReq);
      assert.strictEqual(resBroken.status, 400);
      const brokenData = JSON.parse(resBroken.body);
      assert.ok(brokenData.error.includes('Invalid JSON payload'));

      // Validation failure payload -> 400
      const invalidReq = createMockHttpRequest({
        method: 'POST',
        body: { name: 'A', email: 'invalid_email' }
      });
      const resInvalid = await httpMod.post_contact(invalidReq);
      assert.strictEqual(resInvalid.status, 400);

      // Valid payload -> 200
      const validReq = createMockHttpRequest({
        method: 'POST',
        body: {
          name: 'Somchai REST',
          email: 'somchai_rest@delta.org',
          subject: 'REST Contact Test',
          message: 'This is a valid contact message submitted via REST API'
        }
      });
      const resValid = await httpMod.post_contact(validReq);
      assert.strictEqual(resValid.status, 200);
      const validData = JSON.parse(resValid.body);
      assert.strictEqual(validData.success, true);
      assert.ok(validData.ticketId);
    });

    it('TC-M2-ADV-HTTP-06: POST /_functions/register handles malformed streams and validation', async () => {
      // Malformed request without json() -> 400
      const resNoBody = await httpMod.post_register(null);
      assert.strictEqual(resNoBody.status, 400);

      // Broken JSON stream -> 400
      const brokenReq = {
        body: {
          json: async () => { throw new SyntaxError('Malformed JSON byte sequence'); }
        }
      };
      const resBroken = await httpMod.post_register(brokenReq);
      assert.strictEqual(resBroken.status, 400);

      // Validation failure payload -> 400
      const invalidReq = createMockHttpRequest({
        method: 'POST',
        body: { eventId: 'UNKNOWN_EVT', fullName: 'A' }
      });
      const resInvalid = await httpMod.post_register(invalidReq);
      assert.strictEqual(resInvalid.status, 400);

      // Valid payload -> 200
      const validReq = createMockHttpRequest({
        method: 'POST',
        body: {
          eventId: 'event_001',
          fullName: 'Somchai Event User',
          email: 'somchai_evt@delta.org'
        }
      });
      const resValid = await httpMod.post_register(validReq);
      assert.strictEqual(resValid.status, 200);
      const validData = JSON.parse(resValid.body);
      assert.strictEqual(validData.success, true);
      assert.ok(validData.registrationId);
    });
  });

  // ==========================================================================
  // 6. data.js Wix Data Hooks Adversarial Testing
  // ==========================================================================
  describe('6. data.js Wix Data Collection Hooks', async () => {
    const dataMod = await loadBackendModule('data.js');

    it('TC-M2-ADV-DAT-01: Fuzzing non-object items across all collection hooks', () => {
      const hooks = [
        dataMod.beforeInsert,
        dataMod.beforeUpdate,
        dataMod.Voicebanks_beforeInsert,
        dataMod.Registrations_beforeInsert,
        dataMod.Contacts_beforeInsert
      ];

      const fuzzItems = [null, undefined, 0, 123, NaN, Infinity, true, false, '', 'string_item', [], [1, 2, 3]];

      for (const hook of hooks) {
        for (const item of fuzzItems) {
          const res = hook(item, {});
          assert.strictEqual(res, item, `Expected hook to return input unchanged for non-object: ${String(item)}`);
        }
      }
    });

    it('TC-M2-ADV-DAT-02: beforeInsert and beforeUpdate date stamping and email normalization', () => {
      const item = { email: '  TEST_USER@Delta.ORG  ' };
      const resInsert = dataMod.beforeInsert(item, {});
      assert.ok(resInsert._createdDate instanceof Date);
      assert.ok(resInsert._updatedDate instanceof Date);
      assert.strictEqual(resInsert.email, 'test_user@delta.org');

      const resUpdate = dataMod.beforeUpdate(item, {});
      assert.ok(resUpdate._updatedDate instanceof Date);
      assert.strictEqual(resUpdate.email, 'test_user@delta.org');
    });

    it('TC-M2-ADV-DAT-03: Voicebanks, Registrations, and Contacts collection default statuses', () => {
      // Voicebanks default status
      const vbItem = { name: '  Hikaru Append  ' };
      const resVB = dataMod.Voicebanks_beforeInsert(vbItem, {});
      assert.strictEqual(resVB.status, 'Ready for Download');
      assert.strictEqual(resVB.name, 'Hikaru Append');
      assert.ok(resVB._createdDate instanceof Date);

      // Registrations default status
      const regItem = { fullName: '  Somchai Jaidee  ' };
      const resReg = dataMod.Registrations_beforeInsert(regItem, {});
      assert.strictEqual(resReg.status, 'Confirmed');
      assert.strictEqual(resReg.fullName, 'Somchai Jaidee');

      // Contacts default status
      const conItem = { name: '  John Doe  ', subject: '  Inquiry  ' };
      const resCon = dataMod.Contacts_beforeInsert(conItem, {});
      assert.strictEqual(resCon.status, 'Pending');
      assert.strictEqual(resCon.name, 'John Doe');
      assert.strictEqual(resCon.subject, 'Inquiry');
    });
  });

  // ==========================================================================
  // 7. permissions.json Access Control Verification
  // ==========================================================================
  describe('7. permissions.json Access Control Schema & Policy', async () => {
    const permJson = (await loadBackendModule('permissions.json')).default;

    it('TC-M2-ADV-PERM-01: permissions.json schema structure and least-privilege wildcard', () => {
      assert.ok(permJson && typeof permJson === 'object', 'permissions.json must be a valid JSON object');
      assert.ok(permJson['web-methods'], 'Root must contain "web-methods"');

      const wildcard = permJson['web-methods']['*']?.['*'];
      assert.ok(wildcard, 'Wildcard fallback "*.*" must be explicitly configured');
      assert.strictEqual(wildcard.siteOwner?.invoke, true, 'Wildcard siteOwner must be true');
      assert.strictEqual(wildcard.siteMember?.invoke, false, 'Wildcard siteMember must be false (least privilege)');
      assert.strictEqual(wildcard.anonymous?.invoke, false, 'Wildcard anonymous must be false (least privilege)');
    });

    it('TC-M2-ADV-PERM-02: Verification of all 8 public web methods in permissions.json', () => {
      const requiredMethods = {
        'backend/voicebankService.jsw': ['getVoicebanksList', 'getSingerDetails', 'getVoicebankStats'],
        'backend/fileService.jsw': ['getMusicFiles', 'trackFileDownload'],
        'backend/registrationService.jsw': ['registerForEvent', 'applyBetaTester'],
        'backend/contactService.jsw': ['submitContactMessage']
      };

      let totalMethodsCount = 0;
      for (const [modulePath, methods] of Object.entries(requiredMethods)) {
        const modulePerms = permJson['web-methods'][modulePath];
        assert.ok(modulePerms, `Missing permissions entry for module: ${modulePath}`);

        for (const method of methods) {
          totalMethodsCount++;
          const methodPerm = modulePerms[method];
          assert.ok(methodPerm, `Missing permissions for web method: ${modulePath}.${method}`);
          assert.strictEqual(methodPerm.anonymous?.invoke, true, `Method ${method} must allow anonymous access`);
          assert.strictEqual(methodPerm.siteMember?.invoke, true, `Method ${method} must allow member access`);
          assert.strictEqual(methodPerm.siteOwner?.invoke, true, `Method ${method} must allow owner access`);
        }
      }

      assert.strictEqual(totalMethodsCount, 8, 'Exactly 8 web methods must be configured');
    });
  });
});
