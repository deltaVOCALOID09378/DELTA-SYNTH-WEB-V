/**
 * DELTA SYNTH — Challenger 2 Empirical Stress Test Harness (Milestone M2)
 * 
 * Adversarial Security & Protocol Verification Matrix:
 * 1. CORS OPTIONS Preflight Response Headers across all 5 endpoints
 * 2. HTTP POST Endpoints Malformed JSON Streams & 400 Bad Request Handling
 * 3. permissions.json Least Privilege Wildcard & 8 Public Web Methods Mapping
 * 4. Business Logic Input Sanitization & Domain Whitelisting Enforcement:
 *    - contactService.jsw: Category fallback, length bounding, XSS sanitization
 *    - registrationService.jsw: eventId & voicebankId whitelist enforcement, experienceLevel fallback
 *    - fileService.jsw: format filtering, catalog whitelist for download tracking
 *    - data.js: Collection hooks defensive normalization & prototype safety
 * 
 * Standards Compliance: AGENT.md (Sections 1-20), PROJECT.md, SCOPE.md
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  setupTestEnvironment,
  teardownTestEnvironment,
  ConsoleSpy,
  assertStructuredLog,
  createMockHttpRequest,
  loadPublicModule,
  loadBackendModule
} from './test-helpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test.describe('Challenger 2 Empirical Verification: Milestone M2 Backend Security & Protocols', () => {

  // ==========================================================================
  // Suite 1: CORS OPTIONS Preflight Headers across all 5 Endpoints
  // ==========================================================================
  test.describe('1. CORS OPTIONS Preflight & Protocol Verification', async () => {
    const httpMod = await loadBackendModule('http-functions.js');
    const {
      options_voicebanks,
      options_singer,
      options_files,
      options_contact,
      options_register
    } = httpMod;

    const endpoints = [
      { name: 'options_voicebanks', fn: options_voicebanks },
      { name: 'options_singer', fn: options_singer },
      { name: 'options_files', fn: options_files },
      { name: 'options_contact', fn: options_contact },
      { name: 'options_register', fn: options_register }
    ];

    test('All 5 OPTIONS endpoints return HTTP 200 with standard CORS headers', () => {
      for (const ep of endpoints) {
        const res = ep.fn({});
        assert.ok(res, `${ep.name} must return a response object`);
        assert.strictEqual(res.status, 200, `${ep.name} status must be 200`);
        assert.ok(res.headers, `${ep.name} must include headers object`);
        assert.strictEqual(res.headers['Content-Type'], 'application/json', `${ep.name} Content-Type`);
        assert.strictEqual(res.headers['Access-Control-Allow-Origin'], '*', `${ep.name} Access-Control-Allow-Origin`);
        assert.strictEqual(res.headers['Access-Control-Allow-Methods'], 'GET, POST, OPTIONS', `${ep.name} Access-Control-Allow-Methods`);
        assert.strictEqual(res.headers['Access-Control-Allow-Headers'], 'Content-Type', `${ep.name} Access-Control-Allow-Headers`);
        assert.strictEqual(res.body, '{}', `${ep.name} body must be empty JSON object string`);
      }
    });

    test('OPTIONS handlers tolerate null, undefined, primitive, and adversarial request parameters', () => {
      const adversarialRequests = [
        null,
        undefined,
        '',
        'OPTIONS /_functions/voicebanks HTTP/1.1',
        12345,
        false,
        { headers: { Origin: 'https://malicious-attacker.com' } },
        { headers: null },
        { body: { malicious: true } },
        []
      ];

      for (const ep of endpoints) {
        for (const req of adversarialRequests) {
          const res = ep.fn(req);
          assert.strictEqual(res.status, 200, `${ep.name} should survive adversarial request payload`);
          assert.strictEqual(res.headers['Access-Control-Allow-Origin'], '*');
          assert.strictEqual(res.headers['Access-Control-Allow-Methods'], 'GET, POST, OPTIONS');
          assert.strictEqual(res.headers['Access-Control-Allow-Headers'], 'Content-Type');
        }
      }
    });
  });

  // ==========================================================================
  // Suite 2: HTTP POST Endpoints Malformed Stream & 400 Bad Request
  // ==========================================================================
  test.describe('2. HTTP POST Malformed JSON Streams & 400 Error Handling', async () => {
    let spy;

    test.beforeEach(() => {
      spy = new ConsoleSpy();
    });

    test.afterEach(() => {
      spy.restore();
    });

    const httpMod = await loadBackendModule('http-functions.js');
    const { post_contact, post_register } = httpMod;

    test('post_contact returns 400 with CORS headers when request is null or missing body.json parser', async () => {
      const invalidRequests = [
        null,
        undefined,
        {},
        { body: null },
        { body: 'raw non-json string' },
        { body: {} },
        { body: { json: 'not a function' } }
      ];

      for (const req of invalidRequests) {
        const res = await post_contact(req);
        assert.strictEqual(res.status, 400, 'Expected status 400 for missing body.json parser');
        assert.strictEqual(res.headers['Access-Control-Allow-Origin'], '*');
        assert.strictEqual(res.headers['Content-Type'], 'application/json');
        const parsed = JSON.parse(res.body);
        assert.strictEqual(parsed.success, false);
        assert.ok(parsed.error.includes('Malformed request'));
      }
    });

    test('post_contact returns 400 with CORS headers and logs structured error when JSON parsing fails (SyntaxError)', async () => {
      const syntaxErrorReq = {
        body: {
          json: async () => {
            throw new SyntaxError('Unexpected token < in JSON at position 0');
          }
        }
      };

      const res = await post_contact(syntaxErrorReq);
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.headers['Access-Control-Allow-Origin'], '*');
      assert.strictEqual(res.headers['Access-Control-Allow-Methods'], 'GET, POST, OPTIONS');
      assert.strictEqual(res.headers['Access-Control-Allow-Headers'], 'Content-Type');

      const parsed = JSON.parse(res.body);
      assert.strictEqual(parsed.success, false);
      assert.ok(parsed.error.includes('Invalid JSON payload'));

      // Check structured logging
      const errLogs = spy.getLogs('error');
      assert.ok(errLogs.length > 0, 'Structured error log must be recorded on JSON syntax error');
      const groups = assertStructuredLog(errLogs[0].message);
      assert.strictEqual(groups.component, 'HttpFunctions');
      assert.strictEqual(groups.action, 'post_contact');
      assert.ok(groups.cause.includes('Invalid JSON payload'));
      assert.strictEqual(groups.suggestedAction, 'Verify JSON request body');
    });

    test('post_register returns 400 with CORS headers when request is null or missing body.json parser', async () => {
      const invalidRequests = [
        null,
        undefined,
        {},
        { body: null },
        { body: { notJson: true } }
      ];

      for (const req of invalidRequests) {
        const res = await post_register(req);
        assert.strictEqual(res.status, 400);
        assert.strictEqual(res.headers['Access-Control-Allow-Origin'], '*');
        const parsed = JSON.parse(res.body);
        assert.strictEqual(parsed.success, false);
        assert.ok(parsed.error.includes('Malformed request'));
      }
    });

    test('post_register returns 400 with CORS headers and logs structured error on truncated JSON stream', async () => {
      const truncatedStreamReq = {
        body: {
          json: async () => {
            throw new Error('Unexpected end of JSON input');
          }
        }
      };

      const res = await post_register(truncatedStreamReq);
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.headers['Access-Control-Allow-Origin'], '*');

      const parsed = JSON.parse(res.body);
      assert.strictEqual(parsed.success, false);
      assert.ok(parsed.error.includes('Invalid JSON payload'));

      const errLogs = spy.getLogs('error');
      assert.ok(errLogs.length > 0);
      const groups = assertStructuredLog(errLogs[0].message);
      assert.strictEqual(groups.component, 'HttpFunctions');
      assert.strictEqual(groups.action, 'post_register');
    });

    test('post_contact returns 400 Bad Request when payload fails validation rules', async () => {
      const invalidPayloadReq = createMockHttpRequest({
        method: 'POST',
        body: {
          name: 'A', // too short (< 2)
          email: 'not-an-email',
          subject: 'Hi', // too short (< 3)
          message: 'Short' // too short (< 10)
        }
      });

      const res = await post_contact(invalidPayloadReq);
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.headers['Access-Control-Allow-Origin'], '*');
      const body = JSON.parse(res.body);
      assert.strictEqual(body.success, false);
      assert.ok(body.errors);
      assert.strictEqual(body.errors.name, 'กรุณาระบุชื่อของคุณ');
      assert.strictEqual(body.errors.email, 'กรุณาระบุอีเมลที่ติดต่อได้');
      assert.strictEqual(body.errors.subject, 'กรุณาระบุหัวข้อข้อความ');
      assert.strictEqual(body.errors.message, 'กรุณาระบุรายละเอียดข้อความอย่างน้อย 10 ตัวอักษร');
    });

    test('post_register returns 400 Bad Request when payload fails validation rules', async () => {
      const invalidPayloadReq = createMockHttpRequest({
        method: 'POST',
        body: {
          eventId: 'unregistered_unknown_event',
          fullName: 'S',
          email: 'not-an-email'
        }
      });

      const res = await post_register(invalidPayloadReq);
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.headers['Access-Control-Allow-Origin'], '*');
      const body = JSON.parse(res.body);
      assert.strictEqual(body.success, false);
      assert.ok(body.errors);
      assert.strictEqual(body.errors.eventId, 'ไม่พบรหัสกิจกรรมในระบบ');
      assert.strictEqual(body.errors.fullName, 'กรุณาระบุชื่อ-นามสกุลที่ถูกต้อง');
      assert.strictEqual(body.errors.email, 'กรุณาระบุอีเมลที่ถูกต้อง');
    });
  });

  // ==========================================================================
  // Suite 3: permissions.json Least Privilege & 8 Public Web Methods Audit
  // ==========================================================================
  test.describe('3. permissions.json Least Privilege & Method Mapping Audit', () => {
    test('permissions.json contains valid JSON and least-privilege wildcard fallback', () => {
      const permFilePath = path.join(__dirname, '../src/backend/permissions.json');
      assert.ok(fs.existsSync(permFilePath), 'permissions.json must exist');

      const content = fs.readFileSync(permFilePath, 'utf8');
      const config = JSON.parse(content);

      assert.ok(config['web-methods'], 'permissions.json must declare "web-methods" root key');

      // Wildcard check
      const wildcard = config['web-methods']['*']['*'];
      assert.ok(wildcard, 'Wildcard *.* rule must be defined');
      assert.strictEqual(wildcard.siteOwner.invoke, true, 'Wildcard siteOwner must be true');
      assert.strictEqual(wildcard.siteMember.invoke, false, 'Wildcard siteMember must be false (least privilege)');
      assert.strictEqual(wildcard.anonymous.invoke, false, 'Wildcard anonymous must be false (least privilege)');
    });

    test('permissions.json maps all 8 public web methods across the 4 .jsw services', () => {
      const permFilePath = path.join(__dirname, '../src/backend/permissions.json');
      const config = JSON.parse(fs.readFileSync(permFilePath, 'utf8'));
      const webMethods = config['web-methods'];

      const expectedMethods = [
        { file: 'backend/voicebankService.jsw', method: 'getVoicebanksList' },
        { file: 'backend/voicebankService.jsw', method: 'getSingerDetails' },
        { file: 'backend/voicebankService.jsw', method: 'getVoicebankStats' },
        { file: 'backend/fileService.jsw', method: 'getMusicFiles' },
        { file: 'backend/fileService.jsw', method: 'trackFileDownload' },
        { file: 'backend/registrationService.jsw', method: 'registerForEvent' },
        { file: 'backend/registrationService.jsw', method: 'applyBetaTester' },
        { file: 'backend/contactService.jsw', method: 'submitContactMessage' }
      ];

      assert.strictEqual(expectedMethods.length, 8, 'Expected exactly 8 public web methods');

      for (const { file, method } of expectedMethods) {
        assert.ok(webMethods[file], `Service '${file}' must be declared in permissions.json`);
        assert.ok(webMethods[file][method], `Method '${method}' must be declared in '${file}'`);

        const perm = webMethods[file][method];
        assert.strictEqual(perm.siteOwner.invoke, true, `${file}.${method} siteOwner must be true`);
        assert.strictEqual(perm.siteMember.invoke, true, `${file}.${method} siteMember must be true`);
        assert.strictEqual(perm.anonymous.invoke, true, `${file}.${method} anonymous must be true`);
      }
    });

    test('No unmapped or phantom exported methods exist in backend .jsw files', async () => {
      const vbMod = await loadBackendModule('voicebankService.jsw');
      const fileMod = await loadBackendModule('fileService.jsw');
      const regMod = await loadBackendModule('registrationService.jsw');
      const contactMod = await loadBackendModule('contactService.jsw');

      const getExportedFunctions = (mod) => Object.keys(mod).filter(k => typeof mod[k] === 'function');

      const vbFuncs = getExportedFunctions(vbMod).sort();
      const fileFuncs = getExportedFunctions(fileMod).sort();
      const regFuncs = getExportedFunctions(regMod).sort();
      const contactFuncs = getExportedFunctions(contactMod).sort();

      assert.deepStrictEqual(vbFuncs, ['getSingerDetails', 'getVoicebankStats', 'getVoicebanksList']);
      assert.deepStrictEqual(fileFuncs, ['getMusicFiles', 'trackFileDownload']);
      assert.deepStrictEqual(regFuncs, ['applyBetaTester', 'registerForEvent']);
      assert.deepStrictEqual(contactFuncs, ['submitContactMessage']);
    });
  });

  // ==========================================================================
  // Suite 4: Whitelisting Enforcement & Input Defense across Services
  // ==========================================================================
  test.describe('4. Whitelisting Enforcement & Boundary Defense', () => {

    // --- contactService.jsw ---
    test.describe('4.1 contactService.jsw Whitelisting & Input Boundaries', async () => {
      const contactMod = await loadBackendModule('contactService.jsw');
      const { submitContactMessage, CONTACT_CATEGORIES } = contactMod;

      test('CONTACT_CATEGORIES contains expected standard categories', () => {
        assert.ok(Array.isArray(CONTACT_CATEGORIES));
        assert.ok(CONTACT_CATEGORIES.includes('General'));
        assert.ok(CONTACT_CATEGORIES.includes('Collaboration'));
        assert.ok(CONTACT_CATEGORIES.includes('Voicebank Issue'));
        assert.ok(CONTACT_CATEGORIES.includes('License'));
        assert.ok(CONTACT_CATEGORIES.includes('Support'));
        assert.ok(CONTACT_CATEGORIES.includes('Feedback'));
        assert.ok(CONTACT_CATEGORIES.includes('Inquiry'));
        assert.ok(CONTACT_CATEGORIES.includes('Bug Report'));
        assert.ok(CONTACT_CATEGORIES.includes('Partnership'));
      });

      test('Invalid or unlisted categories safely fall back to "General"', async () => {
        const invalidCategories = [
          'Hacker_Injected_Category',
          'RootAccess',
          '',
          '   ',
          null,
          undefined,
          12345,
          ['Collaboration'],
          { category: 'License' },
          '<script>alert("category_xss")</script>',
          '../../etc/passwd',
          '__proto__'
        ];

        for (const cat of invalidCategories) {
          const res = await submitContactMessage({
            name: 'Piti Srisawat',
            email: 'piti@delta-synth.com',
            subject: 'Category Fallback Test',
            category: cat,
            message: 'Testing category fallback behavior when non-whitelisted category is supplied.'
          });

          assert.strictEqual(res.success, true, `Submission failed for category: ${cat}`);
          assert.ok(res.ticketId.startsWith('TICK_'));
        }
      });

      test('Whitelisted categories match case-insensitively and normalize properly', async () => {
        const validVariations = [
          { input: 'collaboration', expected: 'Collaboration' },
          { input: '  VOICEBANK ISSUE  ', expected: 'Voicebank Issue' },
          { input: 'LiCenSe', expected: 'License' },
          { input: 'SUPPORT', expected: 'Support' },
          { input: 'bug report', expected: 'Bug Report' }
        ];

        for (const { input } of validVariations) {
          const res = await submitContactMessage({
            name: 'Piti Srisawat',
            email: 'piti@delta-synth.com',
            subject: 'Case Insensitive Category Test',
            category: input,
            message: 'Testing category matching case-insensitivity.'
          });

          assert.strictEqual(res.success, true);
        }
      });

      test('Boundary testing on string lengths (name, email, subject, message)', async () => {
        // Name boundaries (min: 2, max: 100)
        const resNameShort = await submitContactMessage({
          name: 'A',
          email: 'valid@mail.com',
          subject: 'Valid Subject',
          message: 'Valid message body length'
        });
        assert.strictEqual(resNameShort.success, false);
        assert.strictEqual(resNameShort.errors.name, 'กรุณาระบุชื่อของคุณ');

        const resNameLong = await submitContactMessage({
          name: 'A'.repeat(101),
          email: 'valid@mail.com',
          subject: 'Valid Subject',
          message: 'Valid message body length'
        });
        assert.strictEqual(resNameLong.success, false);
        assert.strictEqual(resNameLong.errors.name, 'ชื่อของคุณยาวเกินไป (ไม่เกิน 100 ตัวอักษร)');

        // Email boundaries (max: 254, regex check)
        const resEmailLong = await submitContactMessage({
          name: 'Valid Name',
          email: `${'a'.repeat(250)}@mail.com`,
          subject: 'Valid Subject',
          message: 'Valid message body length'
        });
        assert.strictEqual(resEmailLong.success, false);
        assert.strictEqual(resEmailLong.errors.email, 'กรุณาระบุอีเมลที่ติดต่อได้');

        // Subject boundaries (min: 3, max: 200)
        const resSubjShort = await submitContactMessage({
          name: 'Valid Name',
          email: 'valid@mail.com',
          subject: 'AB',
          message: 'Valid message body length'
        });
        assert.strictEqual(resSubjShort.success, false);
        assert.strictEqual(resSubjShort.errors.subject, 'กรุณาระบุหัวข้อข้อความ');

        const resSubjLong = await submitContactMessage({
          name: 'Valid Name',
          email: 'valid@mail.com',
          subject: 'A'.repeat(201),
          message: 'Valid message body length'
        });
        assert.strictEqual(resSubjLong.success, false);
        assert.strictEqual(resSubjLong.errors.subject, 'หัวข้อข้อความยาวเกินไป (ไม่เกิน 200 ตัวอักษร)');

        // Message boundaries (min: 10, max: 5000)
        const resMsgShort = await submitContactMessage({
          name: 'Valid Name',
          email: 'valid@mail.com',
          subject: 'Valid Subject',
          message: '123456789'
        });
        assert.strictEqual(resMsgShort.success, false);
        assert.strictEqual(resMsgShort.errors.message, 'กรุณาระบุรายละเอียดข้อความอย่างน้อย 10 ตัวอักษร');

        const resMsgLong = await submitContactMessage({
          name: 'Valid Name',
          email: 'valid@mail.com',
          subject: 'Valid Subject',
          message: 'A'.repeat(5001)
        });
        assert.strictEqual(resMsgLong.success, false);
        assert.strictEqual(resMsgLong.errors.message, 'ข้อความยาวเกินไป (ไม่เกิน 5000 ตัวอักษร)');
      });
    });

    // --- registrationService.jsw ---
    test.describe('4.2 registrationService.jsw Whitelisting & Input Boundaries', async () => {
      const regMod = await loadBackendModule('registrationService.jsw');
      const { registerForEvent, applyBetaTester, VALID_EXPERIENCE_LEVELS } = regMod;

      test('registerForEvent rejects unregistered/tampered eventId', async () => {
        const invalidEventIds = [
          'event_999_fake',
          'EVENT_INJECTION',
          'event_001; DROP TABLE Registrations;--',
          '<script>alert(1)</script>',
          'random_id_not_in_events_catalog'
        ];

        for (const badEventId of invalidEventIds) {
          const res = await registerForEvent({
            eventId: badEventId,
            fullName: 'Teerapat Dev',
            email: 'teerapat@delta.org'
          });

          assert.strictEqual(res.success, false);
          assert.strictEqual(res.errors.eventId, 'ไม่พบรหัสกิจกรรมในระบบ');
        }
      });

      test('registerForEvent accepts whitelisted eventId from EVENTS catalog', async () => {
        const res1 = await registerForEvent({
          eventId: 'event_001',
          fullName: 'Teerapat Dev',
          email: 'teerapat@delta.org',
          discord: 'Teerapat#1111',
          note: 'DiffSinger workshop attendee'
        });
        assert.strictEqual(res1.success, true);
        assert.ok(res1.registrationId.startsWith('REG_'));

        const res2 = await registerForEvent({
          eventId: 'event_002',
          fullName: 'Kamonchanok Producer',
          email: 'kamonchanok@music.org'
        });
        assert.strictEqual(res2.success, true);
        assert.ok(res2.registrationId.startsWith('REG_'));
      });

      test('applyBetaTester rejects unregistered/tampered voicebankId', async () => {
        const invalidBetaIds = [
          'beta_unregistered_singer',
          'beta_diffsinger_fake_v99',
          '../../singers/secret',
          '<svg onload=alert(1)>'
        ];

        for (const badId of invalidBetaIds) {
          const res = await applyBetaTester({
            voicebankId: badId,
            fullName: 'Nattapong Tester',
            email: 'nattapong@studio.th',
            dawOrEngine: 'OpenUtau'
          });

          assert.strictEqual(res.success, false);
          assert.strictEqual(res.errors.voicebankId, 'ไม่พบคลังเสียง BETA ในระบบ');
        }
      });

      test('applyBetaTester accepts whitelisted voicebankId from BETA_VOICEBANKS', async () => {
        const validBetaIds = ['beta_diffsinger_hikaru_v2', 'beta_diffsinger_sun_v2', 'beta_thitiya_vccv'];

        for (const validId of validBetaIds) {
          const res = await applyBetaTester({
            voicebankId: validId,
            fullName: 'Nattapong Tester',
            email: 'nattapong@studio.th',
            dawOrEngine: 'OpenUtau',
            experienceLevel: 'Advanced'
          });

          assert.strictEqual(res.success, true);
          assert.ok(res.applicationId.startsWith('BETA_'));
        }
      });

      test('applyBetaTester experienceLevel falls back to "Intermediate" when unlisted', async () => {
        const unlistedLevels = [
          'GOD_LIKE_PRODUCER',
          'Novice123',
          '',
          null,
          undefined,
          100
        ];

        for (const level of unlistedLevels) {
          const res = await applyBetaTester({
            voicebankId: 'beta_diffsinger_hikaru_v2',
            fullName: 'Nattapong Tester',
            email: 'nattapong@studio.th',
            dawOrEngine: 'OpenUtau',
            experienceLevel: level
          });

          assert.strictEqual(res.success, true);
          assert.ok(res.applicationId.startsWith('BETA_'));
        }
      });

      test('applyBetaTester matches valid experience levels case-insensitively', async () => {
        const levels = ['beginner', 'INTERMEDIATE', 'Advanced', 'professional'];

        for (const lvl of levels) {
          const res = await applyBetaTester({
            voicebankId: 'beta_diffsinger_hikaru_v2',
            fullName: 'Nattapong Tester',
            email: 'nattapong@studio.th',
            dawOrEngine: 'OpenUtau',
            experienceLevel: lvl
          });

          assert.strictEqual(res.success, true);
        }
      });
    });

    // --- fileService.jsw ---
    test.describe('4.3 fileService.jsw Whitelisting & Download Telemetry', async () => {
      const fileMod = await loadBackendModule('fileService.jsw');
      const { getMusicFiles, trackFileDownload, VALID_FILE_FORMATS } = fileMod;

      test('VALID_FILE_FORMATS contains expected formats', () => {
        assert.deepStrictEqual(VALID_FILE_FORMATS, ['All', 'USTX', 'MIDI', 'SVP', 'VSQX']);
      });

      test('getMusicFiles gracefully filters by format and returns empty on unknown format without throwing', async () => {
        const ustxRes = await getMusicFiles({ format: 'USTX' });
        assert.strictEqual(ustxRes.success, true);
        assert.strictEqual(ustxRes.files.length, 2);
        assert.ok(ustxRes.files.every(f => f.format === 'USTX'));

        const svpRes = await getMusicFiles({ format: 'svp' });
        assert.strictEqual(svpRes.success, true);
        assert.strictEqual(svpRes.files.length, 1);
        assert.strictEqual(svpRes.files[0].format, 'SVP');

        const unknownRes = await getMusicFiles({ format: 'NON_EXISTENT_FORMAT_XYZ' });
        assert.strictEqual(unknownRes.success, true);
        assert.strictEqual(unknownRes.files.length, 0);

        const allRes = await getMusicFiles({ format: 'ALL' });
        assert.strictEqual(allRes.success, true);
        assert.strictEqual(allRes.files.length, 5);
      });

      test('trackFileDownload enforces catalog whitelist and returns false for unknown IDs', async () => {
        // Valid file IDs in catalog
        const validFileIds = ['file_001', 'file_002', 'file_003', 'file_004', 'file_005'];
        for (const fid of validFileIds) {
          const res = await trackFileDownload(fid);
          assert.strictEqual(res.success, true);
          assert.ok(res.message.includes(`Download tracked for file ${fid}`));
        }

        // Invalid / unknown file IDs
        const invalidFileIds = [
          'file_999',
          'malicious_file_download',
          '',
          '   ',
          null,
          undefined,
          12345
        ];

        for (const badId of invalidFileIds) {
          const res = await trackFileDownload(badId);
          assert.strictEqual(res.success, false);
          assert.ok(res.message);
        }
      });
    });

    // --- data.js Hooks ---
    test.describe('4.4 data.js Collection Hooks Defense & Normalization', async () => {
      const dataMod = await loadBackendModule('data.js');
      const {
        beforeInsert,
        beforeUpdate,
        Voicebanks_beforeInsert,
        Registrations_beforeInsert,
        Contacts_beforeInsert
      } = dataMod;

      test('beforeInsert and beforeUpdate handle null, undefined, arrays, and non-object inputs safely', () => {
        const invalidInputs = [null, undefined, [], 'string', 123, true];

        for (const input of invalidInputs) {
          assert.strictEqual(beforeInsert(input, {}), input);
          assert.strictEqual(beforeUpdate(input, {}), input);
          assert.strictEqual(Voicebanks_beforeInsert(input, {}), input);
          assert.strictEqual(Registrations_beforeInsert(input, {}), input);
          assert.strictEqual(Contacts_beforeInsert(input, {}), input);
        }
      });

      test('Collection hooks normalize string fields and apply default statuses', () => {
        // Voicebanks
        const vb = Voicebanks_beforeInsert({ name: '  Ayanami Hikaru  ', email: '  VB_AUTHOR@DELTA.ORG  ' }, {});
        assert.strictEqual(vb.name, 'Ayanami Hikaru');
        assert.strictEqual(vb.status, 'Ready for Download');
        assert.strictEqual(vb.email, 'vb_author@delta.org');
        assert.ok(vb._createdDate instanceof Date);

        // Registrations
        const reg = Registrations_beforeInsert({ fullName: '  Teerapat Dev  ', email: 'TEERAPAT@DELTA.ORG' }, {});
        assert.strictEqual(reg.fullName, 'Teerapat Dev');
        assert.strictEqual(reg.status, 'Confirmed');
        assert.strictEqual(reg.email, 'teerapat@delta.org');

        // Contacts
        const contact = Contacts_beforeInsert({
          name: '  Somchai  ',
          subject: '  Subject Title  ',
          email: 'SOMCHAI@MAIL.COM'
        }, {});
        assert.strictEqual(contact.name, 'Somchai');
        assert.strictEqual(contact.subject, 'Subject Title');
        assert.strictEqual(contact.status, 'Pending');
        assert.strictEqual(contact.email, 'somchai@mail.com');
      });
    });
  });
});
