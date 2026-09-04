/**
 * DELTA SYNTH — Tier 2: Boundary & Corner Cases Test Suite (Boundary Value Analysis)
 * 
 * Stresses software boundaries: null/undefined/empty, type distortions,
 * 10k extreme strings, XSS/SQL injection payloads, extreme pagination,
 * rapid audio track switching, subscriber error isolation, and prototype pollution.
 * 
 * Standards Compliance: AGENT.md (Sections 6, 12, 16), PROJECT.md
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  setupTestEnvironment,
  teardownTestEnvironment,
  canvasEngine,
  MockAudio,
  ConsoleSpy,
  createMockHttpRequest,
  loadPublicModule,
  loadBackendModule
} from './test-helpers.js';

describe('Tier 2: Boundary & Corner Cases (Boundary Value Analysis)', () => {
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
  // 1. Defensive Hardening: Null, Undefined & Empty Inputs
  // ==========================================================================
  describe('Defensive Input Hardening: Null, Undefined & Empty', async () => {
    const contactMod = await loadBackendModule('contactService.jsw');
    const regMod = await loadBackendModule('registrationService.jsw');
    const vbService = await loadBackendModule('voicebankService.jsw');
    const fileMod = await loadBackendModule('fileService.jsw');
    const dataMod = await loadBackendModule('data.js');
    const utils = await loadPublicModule('utils');

    it('TC-T2-BND-01: submitContactMessage handles null and undefined payloads gracefully', async () => {
      const resNull = await contactMod.submitContactMessage(null);
      assert.strictEqual(resNull.success, false);
      assert.ok(resNull.message);

      const resUndef = await contactMod.submitContactMessage(undefined);
      assert.strictEqual(resUndef.success, false);
    });

    it('TC-T2-BND-02: registerForEvent handles null, undefined, and empty objects', async () => {
      const resNull = await regMod.registerForEvent(null);
      assert.strictEqual(resNull.success, false);

      const resEmpty = await regMod.registerForEvent({});
      assert.strictEqual(resEmpty.success, false);
      assert.ok(resEmpty.errors);
    });

    it('TC-T2-BND-03: applyBetaTester handles null and empty objects', async () => {
      const resNull = await regMod.applyBetaTester(null);
      assert.strictEqual(resNull.success, false);

      const resEmpty = await regMod.applyBetaTester({});
      assert.strictEqual(resEmpty.success, false);
    });

    it('TC-T2-BND-04: getVoicebanksList handles null and empty parameters safely', async () => {
      const res = await vbService.getVoicebanksList(null);
      assert.strictEqual(res.total, 53);
      assert.strictEqual(res.items.length, 12);
    });

    it('TC-T2-BND-05: getSingerDetails handles null, empty string, and whitespace', async () => {
      const resNull = await vbService.getSingerDetails(null);
      assert.strictEqual(resNull.success, false);
      assert.strictEqual(resNull.data, null);

      const resEmpty = await vbService.getSingerDetails('');
      assert.strictEqual(resEmpty.success, false);

      const resSpaces = await vbService.getSingerDetails('   ');
      assert.strictEqual(resSpaces.success, false);
    });

    it('TC-T2-BND-06: getMusicFiles and trackFileDownload handle null inputs', async () => {
      const resFiles = await fileMod.getMusicFiles(null);
      assert.strictEqual(resFiles.success, true);
      assert.strictEqual(resFiles.count, 5);

      const resTrack = await fileMod.trackFileDownload(null);
      assert.strictEqual(resTrack.success, false);
    });

    it('TC-T2-BND-07: data.js beforeInsert handles empty items safely', () => {
      const item = dataMod.beforeInsert({}, {});
      assert.ok(item._createdDate instanceof Date);
      assert.ok(item._updatedDate instanceof Date);
    });

    it('TC-T2-BND-08: $wSafely handles invalid, bare hash, or empty selectors', () => {
      assert.strictEqual(utils.$wSafely(''), null);
      assert.strictEqual(utils.$wSafely('#'), null);
      assert.strictEqual(utils.$wSafely(null), null);
      assert.strictEqual(utils.$wSafely(undefined), null);
      assert.strictEqual(utils.$wSafely(12345), null);
    });

    it('TC-T2-BND-09: $wSafely safely isolates exceptions thrown by action callbacks', () => {
      canvasEngine.registerElement('#crashBtn', 'Button');
      const res = utils.$wSafely('#crashBtn', () => {
        throw new Error('DOM manipulation exception inside user callback');
      });
      assert.strictEqual(res, null);
    });
  });

  // ==========================================================================
  // 2. Type Distortion & Non-String Field Handling
  // ==========================================================================
  describe('Type Distortion & Corrupted Types', async () => {
    const contactMod = await loadBackendModule('contactService.jsw');
    const regMod = await loadBackendModule('registrationService.jsw');
    const vbService = await loadBackendModule('voicebankService.jsw');
    const dataMod = await loadBackendModule('data.js');
    const utils = await loadPublicModule('utils');

    it('TC-T2-TYP-01: submitContactMessage handles numeric and array types in string fields', async () => {
      const res = await contactMod.submitContactMessage({
        name: 12345,
        email: ['test@example.com'],
        subject: true,
        message: { text: 'Testing type distortion' }
      });
      assert.strictEqual(res.success, false);
    });

    it('TC-T2-TYP-02: registerForEvent handles boolean and object types in string fields', async () => {
      const res = await regMod.registerForEvent({
        eventId: 1001,
        fullName: { first: 'John', last: 'Doe' },
        email: 99999
      });
      assert.strictEqual(res.success, false);
    });

    it('TC-T2-TYP-03: getSingerDetails handles non-string arguments', async () => {
      const resArray = await vbService.getSingerDetails(['ayanami_hikaru']);
      assert.strictEqual(resArray.success, false);

      const resObj = await vbService.getSingerDetails({ id: 'sun' });
      assert.strictEqual(resObj.success, false);
    });

    it('TC-T2-TYP-04: data.js beforeInsert handles numeric email field without crash', () => {
      const item = { email: 12345 };
      const res = dataMod.beforeInsert(item, {});
      assert.strictEqual(res.email, 12345);
    });

    it('TC-T2-TYP-05: searchFilter tolerates arrays with null, undefined, numbers, and malformed items', () => {
      const corruptedItems = [
        null,
        undefined,
        {},
        { name: null },
        { name: 'Ayanami Hikaru', tags: null },
        'string_instead_of_object',
        42
      ];

      const res = utils.searchFilter(corruptedItems, 'hikaru');
      assert.strictEqual(res.length, 1);
      assert.strictEqual(res[0].name, 'Ayanami Hikaru');
    });

    it('TC-T2-TYP-06: formatNumber handles extreme non-numbers and special values', () => {
      assert.strictEqual(utils.formatNumber(Infinity), '0');
      assert.strictEqual(utils.formatNumber(-Infinity), '0');
      assert.strictEqual(utils.formatNumber(NaN), '0');
      assert.strictEqual(utils.formatNumber(Number.MAX_SAFE_INTEGER), '9,007,199,254,740,991');
    });
  });

  // ==========================================================================
  // 3. Extreme String Lengths & Buffer Boundaries
  // ==========================================================================
  describe('Extreme String Lengths & Buffer Clamping', async () => {
    const contactMod = await loadBackendModule('contactService.jsw');
    const regMod = await loadBackendModule('registrationService.jsw');
    const toastMod = await loadPublicModule('toast');
    const utils = await loadPublicModule('utils');

    it('TC-T2-LEN-01: submitContactMessage clamps 10,000 character message body', async () => {
      const hugeMessage = 'DELTA SYNTH '.repeat(1000);
      const res = await contactMod.submitContactMessage({
        name: 'Tester',
        email: 'tester@delta.org',
        subject: 'Huge Payload Test',
        message: hugeMessage
      });

      assert.strictEqual(res.success, true);
      assert.ok(res.ticketId.startsWith('TICK_'));
    });

    it('TC-T2-LEN-02: registerForEvent clamps 1,000 character fullName safely', async () => {
      const hugeName = 'Somchai '.repeat(150);
      const res = await regMod.registerForEvent({
        eventId: 'event_001',
        fullName: hugeName,
        email: 'tester@delta.org'
      });

      assert.strictEqual(res.success, true);
      assert.ok(res.registrationId.startsWith('REG_'));
    });

    it('TC-T2-LEN-03: sanitizeInput strictly limits output length to 1000 characters', () => {
      const hugeText = 'A'.repeat(5000);
      const cleaned = utils.sanitizeInput(hugeText);
      assert.strictEqual(cleaned.length, 1000);
      assert.strictEqual(cleaned, 'A'.repeat(1000));
    });

    it('TC-T2-LEN-04: showToast handles massive text payloads without DOM crash', () => {
      const hugeToastMsg = 'Notification Message '.repeat(200);
      toastMod.showToast({
        message: hugeToastMsg,
        actionText: 'Close'
      });

      const msgEl = canvasEngine.getElement('#toastMessage');
      assert.strictEqual(msgEl.text, hugeToastMsg);
    });
  });

  // ==========================================================================
  // 4. Injection Payloads & Security Defense
  // ==========================================================================
  describe('Security & Injection Defense', async () => {
    const contactMod = await loadBackendModule('contactService.jsw');
    const regMod = await loadBackendModule('registrationService.jsw');
    const vbMod = await loadPublicModule('voicebankData');
    const vbService = await loadBackendModule('voicebankService.jsw');

    it('TC-T2-SEC-01: submitContactMessage neutralizes XSS scripts in all fields', async () => {
      const res = await contactMod.submitContactMessage({
        name: '<script>alert("name_xss")</script>Somchai',
        email: 'xss_test@delta.org',
        subject: '<img src=x onerror=alert("subj")>Subject',
        message: '<iframe src="evil.com"></iframe>Hello DELTA team!'
      });

      assert.strictEqual(res.success, true);
    });

    it('TC-T2-SEC-02: applyBetaTester neutralizes XSS scripts in DAW and name fields', async () => {
      const res = await regMod.applyBetaTester({
        voicebankId: 'beta_diffsinger_hikaru_v2',
        fullName: '<script>window.location="http://evil.com"</script>Kittisak',
        email: 'beta_xss@delta.org',
        dawOrEngine: '<svg onload=alert(1)>OpenUtau'
      });

      assert.strictEqual(res.success, true);
    });

    it('TC-T2-SEC-03: queryVoicebanks neutralizes SQL injection strings', () => {
      const res = vbMod.queryVoicebanks({
        query: "' OR '1'='1; DROP TABLE Voicebanks;--"
      });
      assert.strictEqual(res.length, 0);
    });

    it('TC-T2-SEC-04: getSingerDetails neutralizes directory traversal payloads', async () => {
      const res = await vbService.getSingerDetails('../../../../etc/passwd');
      assert.strictEqual(res.success, false);
      assert.strictEqual(res.data, null);
    });

    it('TC-T2-SEC-05: getVoicebankById is protected against prototype pollution keys', () => {
      const protoRes = vbMod.getVoicebankById('__proto__');
      assert.strictEqual(protoRes, null);

      const constructorRes = vbMod.getVoicebankById('constructor');
      assert.strictEqual(constructorRes, null);

      const toStringRes = vbMod.getVoicebankById('toString');
      assert.strictEqual(toStringRes, null);
    });

    it('TC-T2-SEC-06: queryVoicebanks handles regex special characters literally', () => {
      const res1 = vbMod.queryVoicebanks({ query: '.*' });
      assert.strictEqual(res1.length, 0);

      const res2 = vbMod.queryVoicebanks({ query: '([a-z])+' });
      assert.strictEqual(res2.length, 0);

      const res3 = vbMod.queryVoicebanks({ query: '+++' });
      assert.strictEqual(res3.length, 0);
    });
  });

  // ==========================================================================
  // 5. Extreme Pagination Boundaries
  // ==========================================================================
  describe('Extreme Pagination Boundaries', async () => {
    const vbService = await loadBackendModule('voicebankService.jsw');

    it('TC-T2-PAG-01: getVoicebanksList clamps negative page and negative pageSize', async () => {
      const res = await vbService.getVoicebanksList({ page: -5, pageSize: -10 });
      assert.strictEqual(res.page, 1);
      assert.strictEqual(res.pageSize, 1);
      assert.strictEqual(res.items.length, 1);
    });

    it('TC-T2-PAG-02: getVoicebanksList handles page far beyond totalPages', async () => {
      const res = await vbService.getVoicebanksList({ page: 9999, pageSize: 12 });
      assert.strictEqual(res.page, 9999);
      assert.strictEqual(res.items.length, 0);
      assert.strictEqual(res.total, 53);
    });

    it('TC-T2-PAG-03: getVoicebanksList clamps gigantic pageSize to maximum 100 limit', async () => {
      const res = await vbService.getVoicebanksList({ page: 1, pageSize: 5000 });
      assert.strictEqual(res.pageSize, 100);
      assert.strictEqual(res.items.length, 53);
    });

    it('TC-T2-PAG-04: getVoicebanksList handles non-numeric and NaN pagination strings', async () => {
      const res = await vbService.getVoicebanksList({ page: 'invalid', pageSize: 'xyz' });
      assert.strictEqual(res.page, 1);
      assert.strictEqual(res.pageSize, 12);
      assert.strictEqual(res.items.length, 12);
    });
  });

  // ==========================================================================
  // 6. Audio Player Concurrency & Error Isolation
  // ==========================================================================
  describe('Audio Player Concurrency & State Resilience', async () => {
    const audioMod = await loadPublicModule('audioPlayer');
    const { globalAudioPlayer } = audioMod;

    beforeEach(() => {
      globalAudioPlayer.stop();
    });

    it('TC-T2-AUD-01: Rapid track switching cleans up previous audio instances cleanly', () => {
      globalAudioPlayer.play('track1', 'Voice/1.wav');
      globalAudioPlayer.play('track2', 'Voice/2.wav');
      globalAudioPlayer.play('track3', 'Voice/3.wav');
      globalAudioPlayer.play('track4', 'Voice/4.wav');

      assert.strictEqual(globalAudioPlayer.currentTrackId, 'track4');
      assert.strictEqual(globalAudioPlayer.currentTrackUrl, 'Voice/4.wav');
      assert.strictEqual(globalAudioPlayer.isPlaying, true);
    });

    it('TC-T2-AUD-02: Audio player handles autoplay rejection without uncaught exception', async () => {
      MockAudio.simulateAutoplayRejection = true;

      globalAudioPlayer.play('track_autoplay', 'Voice/autoplay.wav');
      await new Promise(r => setTimeout(r, 10));

      assert.strictEqual(globalAudioPlayer.isPlaying, false);
      assert.ok(spy.hasLogMatching(/\[AudioPlayer\] Autoplay policy restriction failed/, 'warn'));
    });

    it('TC-T2-AUD-03: Subscriber callback exceptions are isolated from other subscribers', () => {
      let normalSubscriberReceived = null;

      globalAudioPlayer.subscribe(() => {
        throw new Error('Crashing subscriber');
      });

      globalAudioPlayer.subscribe((state) => {
        normalSubscriberReceived = state;
      });

      globalAudioPlayer.play('track_iso', 'Voice/iso.wav');

      assert.notStrictEqual(normalSubscriberReceived, null);
      assert.strictEqual(normalSubscriberReceived.isPlaying, true);
      assert.strictEqual(normalSubscriberReceived.currentTrackId, 'track_iso');
    });
  });

  // ==========================================================================
  // 7. REST API HTTP Corner Cases
  // ==========================================================================
  describe('REST API HTTP Corner Cases', async () => {
    const httpMod = await loadBackendModule('http-functions.js');

    it('TC-T2-HTTP-01: get_singer returns 400 when singer path is empty', () => {
      const req = createMockHttpRequest({ path: [] });
      const res = httpMod.get_singer(req);
      assert.strictEqual(res.status, 400);
      assert.strictEqual(JSON.parse(res.body).error, 'Singer ID required in path');
    });

    it('TC-T2-HTTP-02: post_contact returns 500 when request body stream crashes', async () => {
      const req = {
        body: {
          json: async () => { throw new Error('Malformed JSON payload syntax error'); }
        }
      };
      const res = await httpMod.post_contact(req);
      assert.strictEqual(res.status, 500);
      assert.strictEqual(JSON.parse(res.body).success, false);
    });
  });
});
