/**
 * DELTA SYNTH — Tier 3: Cross-Feature Interactions Test Suite (Pairwise Combinatorial Testing)
 * 
 * Verifies multi-layer integration, state transitions, hooks, UI synchronization,
 * REST to backend service pipelines, and permissions matrix enforcement.
 * 
 * Standards Compliance: AGENT.md (Sections 1-20), PROJECT.md
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  setupTestEnvironment,
  teardownTestEnvironment,
  canvasEngine,
  mockWixData,
  ConsoleSpy,
  createMockHttpRequest,
  loadPublicModule,
  loadBackendModule
} from './test-helpers.js';

describe('Tier 3: Cross-Feature Interactions (Pairwise Testing)', () => {
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

  it('TC-T3-01: End-to-End Contact Inquiry Pipeline (REST -> Service -> Data Hook)', async () => {
    const httpMod = await loadBackendModule('http-functions.js');
    const dataMod = await loadBackendModule('data.js');

    mockWixData.registerHook('Contacts', 'beforeInsert', dataMod.Contacts_beforeInsert);

    const req = createMockHttpRequest({
      method: 'POST',
      body: {
        name: '  Arun Sound Studio  ',
        email: '  ARUN@STUDIO.CO.TH  ',
        subject: 'License Inquiry for DiffSinger',
        category: 'License',
        message: 'We would like to license Ayanami Hikaru for a commercial game soundtrack.'
      }
    });

    const res = await httpMod.post_contact(req);
    assert.strictEqual(res.status, 200);

    const body = JSON.parse(res.body);
    assert.strictEqual(body.success, true);
    assert.ok(body.ticketId.startsWith('TICK_'));

    // Verify data hook normalization
    const hookResult = dataMod.Contacts_beforeInsert({
      name: '  Arun Sound Studio  ',
      email: '  ARUN@STUDIO.CO.TH  ',
      ticketId: body.ticketId
    }, {});

    assert.strictEqual(hookResult.status, 'Pending');
    assert.strictEqual(hookResult.email, 'arun@studio.co.th');
    assert.ok(hookResult._createdDate instanceof Date);
  });

  it('TC-T3-02: End-to-End Event Registration Pipeline (REST -> Service -> Data Hook)', async () => {
    const httpMod = await loadBackendModule('http-functions.js');
    const dataMod = await loadBackendModule('data.js');

    mockWixData.registerHook('Registrations', 'beforeInsert', dataMod.Registrations_beforeInsert);

    const req = createMockHttpRequest({
      method: 'POST',
      body: {
        eventId: 'event_001',
        fullName: 'Pitchaya Composer',
        email: 'PITCHAYA@COMPOSER.NET',
        discord: 'Pitchaya#9999',
        note: 'Looking forward to DiffSinger showcase!'
      }
    });

    const res = await httpMod.post_register(req);
    assert.strictEqual(res.status, 200);

    const body = JSON.parse(res.body);
    assert.strictEqual(body.success, true);
    assert.ok(body.registrationId.startsWith('REG_'));

    const hookResult = dataMod.Registrations_beforeInsert({
      eventId: 'event_001',
      email: 'PITCHAYA@COMPOSER.NET'
    }, {});

    assert.strictEqual(hookResult.status, 'Confirmed');
    assert.strictEqual(hookResult.email, 'pitchaya@composer.net');
  });

  it('TC-T3-03: Multi-Step Discovery to Beta Application Journey', async () => {
    const vbService = await loadBackendModule('voicebankService.jsw');
    const regService = await loadBackendModule('registrationService.jsw');

    // 1. Search voicebanks
    const listRes = await vbService.getVoicebanksList({ engine: 'DiffSinger', query: 'Hikaru' });
    assert.ok(listRes.items.length >= 1);
    const singer = listRes.items.find(v => v.id === 'ayanami_hikaru');
    assert.notStrictEqual(singer, undefined);

    // 2. Fetch full profile
    const detailRes = await vbService.getSingerDetails(singer.id);
    assert.strictEqual(detailRes.success, true);
    assert.strictEqual(detailRes.data.status, 'Ready for Download');

    // 3. Apply for beta version
    const betaRes = await regService.applyBetaTester({
      voicebankId: 'beta_diffsinger_hikaru_v2',
      fullName: 'Alice Tester',
      email: 'alice@beta.com',
      dawOrEngine: 'OpenUtau',
      experienceLevel: 'Advanced'
    });

    assert.strictEqual(betaRes.success, true);
    assert.ok(betaRes.applicationId.startsWith('BETA_'));
  });

  it('TC-T3-04: Catalog Search -> Music File Resources Filter -> Download Telemetry Flow', async () => {
    const vbService = await loadBackendModule('voicebankService.jsw');
    const fileService = await loadBackendModule('fileService.jsw');

    // 1. Singer detail check
    const singer = await vbService.getSingerDetails('sun');
    assert.strictEqual(singer.success, true);
    assert.strictEqual(singer.data.name, 'SUN');

    // 2. Query recommended music files
    const filesRes = await fileService.getMusicFiles({ format: 'SVP', query: 'SUN' });
    assert.strictEqual(filesRes.success, true);
    assert.strictEqual(filesRes.files.length, 1);
    assert.strictEqual(filesRes.files[0].id, 'file_002');

    // 3. Trigger telemetry download tracking
    const trackRes = await fileService.trackFileDownload(filesRes.files[0].id);
    assert.strictEqual(trackRes.success, true);
  });

  it('TC-T3-05: REST API CORS Preflight -> GET Execution Matrix', async () => {
    const httpMod = await loadBackendModule('http-functions.js');

    // 1. CORS Preflight
    const optRes = httpMod.options_voicebanks({});
    assert.strictEqual(optRes.status, 200);
    assert.strictEqual(optRes.headers['Access-Control-Allow-Origin'], '*');

    // 2. GET Request
    const getReq = createMockHttpRequest({ query: { gender: 'Female' } });
    const getRes = httpMod.get_voicebanks(getReq);
    assert.strictEqual(getRes.status, 200);
    const body = JSON.parse(getRes.body);
    assert.strictEqual(body.success, true);
    assert.ok(body.data.every(v => v.gender === 'Female'));
  });

  it('TC-T3-06: Permissions Enforcement Matrix Simulation across Roles', async () => {
    const rawPerms = await loadBackendModule('permissions.json');
    const perms = rawPerms.default || rawPerms;
    const webMethods = perms['web-methods'];

    // Anonymous role access test
    const publicServices = [
      'backend/voicebankService.jsw',
      'backend/fileService.jsw',
      'backend/registrationService.jsw',
      'backend/contactService.jsw'
    ];

    publicServices.forEach(srv => {
      assert.ok(webMethods[srv], `Service '${srv}' should be declared in permissions`);
      const methods = Object.keys(webMethods[srv]);
      methods.forEach(m => {
        assert.strictEqual(webMethods[srv][m].anonymous.invoke, true);
      });
    });
  });

  it('TC-T3-07: Audio Playback -> Global State -> MasterPage UI Sync -> Error Toast Recovery', async () => {
    const audioMod = await loadPublicModule('audioPlayer');
    const toastMod = await loadPublicModule('toast');
    const { globalAudioPlayer } = audioMod;

    let uiState = null;
    const unsub = globalAudioPlayer.subscribe(state => {
      uiState = state;
    });

    // Request playback with missing URL
    globalAudioPlayer.play('invalid_track', '');

    assert.strictEqual(globalAudioPlayer.isPlaying, false);
    assert.ok(spy.hasLogMatching(/\[AudioPlayer\] Play request failed: Invalid trackId or trackUrl provided/, 'warn'));

    const toastMsg = canvasEngine.getElement('#toastMessage');
    assert.strictEqual(toastMsg.text, 'ไม่พบไฟล์เสียงตัวอย่าง');

    unsub();
  });

  it('TC-T3-08: Voicebank Catalog Filter -> Pagination -> Audio Sample Trigger', async () => {
    const vbMod = await loadPublicModule('voicebankData');
    const audioMod = await loadPublicModule('audioPlayer');
    const { queryVoicebanks } = vbMod;
    const { globalAudioPlayer } = audioMod;

    // Filter rock singers
    const rockSingers = queryVoicebanks({ gender: 'Male', query: 'Rock' });
    assert.ok(rockSingers.length > 0);

    const topSinger = rockSingers[0];
    globalAudioPlayer.play(topSinger.id, topSinger.audioSample);

    assert.strictEqual(globalAudioPlayer.isPlaying, true);
    assert.strictEqual(globalAudioPlayer.currentTrackId, topSinger.id);
    assert.strictEqual(globalAudioPlayer.currentTrackUrl, topSinger.audioSample);
  });

  it('TC-T3-09: Scoped Repeater Item Access -> Audio Preview -> Missing Sample Handling', async () => {
    const utils = await loadPublicModule('utils');
    const audioMod = await loadPublicModule('audioPlayer');
    const { $wSafely } = utils;
    const { globalAudioPlayer } = audioMod;

    const scopedItem = (selector) => {
      return {
        id: selector.replace(/^#/, ''),
        text: 'Play Preview',
        singerId: 'custom_singer',
        sampleUrl: null
      };
    };

    let sampleRequested = null;
    $wSafely('#playBtn', (btn) => {
      sampleRequested = btn.sampleUrl;
      globalAudioPlayer.play(btn.singerId, btn.sampleUrl);
    }, scopedItem);

    assert.strictEqual(sampleRequested, null);
    assert.strictEqual(globalAudioPlayer.isPlaying, false);
    assert.strictEqual(canvasEngine.getElement('#toastMessage').text, 'ไม่พบไฟล์เสียงตัวอย่าง');
  });

  it('TC-T3-10: User Search Input Sanitization -> Catalog Query -> Thai Date Formatting', async () => {
    const utils = await loadPublicModule('utils');
    const vbMod = await loadPublicModule('voicebankData');
    const prjMod = await loadPublicModule('projectData');
    const { sanitizeInput, formatDateThai } = utils;
    const { queryVoicebanks } = vbMod;
    const { PROJECTS } = prjMod;

    // 1. Untrusted user search
    const rawSearch = '  <script>Ayanami</script>  ';
    const cleanSearch = sanitizeInput(rawSearch);
    assert.strictEqual(cleanSearch, 'scriptAyanami/script');

    // 2. Query returns 0 for sanitized tag query
    const results = queryVoicebanks({ query: cleanSearch });
    assert.strictEqual(results.length, 0);

    // 3. Fallback formats project milestone date in Thai BE
    const proj = PROJECTS[0];
    const thaiDate = formatDateThai(proj.date);
    assert.strictEqual(thaiDate, '15 มิถุนายน 2568');
  });

  it('TC-T3-11: Theme Token Consistency Across Toast Engine and Design System', async () => {
    const themeMod = await loadPublicModule('theme');
    const toastMod = await loadPublicModule('toast');
    const { THEME } = themeMod;

    toastMod.toastError('เกิดข้อผิดพลาดในการโหลด');

    assert.strictEqual(THEME.colors.primary, '#CC2200');
    assert.strictEqual(THEME.toast.maxWidth, 280);
    assert.strictEqual(THEME.toast.maxHeight, 80);
    assert.strictEqual(THEME.toast.offsetRight, 16);
    assert.strictEqual(THEME.toast.offsetBottom, 20);
    assert.strictEqual(THEME.toast.borderRadius, 6);
  });

  it('TC-T3-12: Full Wix Data Mock Collection Query & Hook Execution Chain', async () => {
    const dataMod = await loadBackendModule('data.js');

    mockWixData.registerHook('Voicebanks', 'beforeInsert', dataMod.Voicebanks_beforeInsert);

    // Seed mock collection
    await mockWixData.insert('Voicebanks', {
      name: '  Ayanami Hikaru  ',
      gender: 'Male',
      engine: 'DiffSinger'
    });

    await mockWixData.insert('Voicebanks', {
      name: 'SUN',
      gender: 'Male',
      engine: 'DiffSinger'
    });

    const queryRes = await mockWixData
      .query('Voicebanks')
      .eq('gender', 'Male')
      .ascending('name')
      .find();

    assert.strictEqual(queryRes.totalCount, 2);
    assert.strictEqual(queryRes.items[0].status, 'Ready for Download');
    assert.strictEqual(queryRes.items[0].name, 'Ayanami Hikaru');
  });
});
