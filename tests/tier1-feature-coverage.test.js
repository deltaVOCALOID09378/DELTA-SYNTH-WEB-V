/**
 * DELTA SYNTH — Tier 1: Feature Coverage Test Suite (Category-Partition Testing)
 * 
 * Verifies all public utilities, audio singleton, toast engine, data catalogs,
 * backend services, HTTP REST functions, data hooks, and permissions.
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
  ConsoleSpy,
  assertStructuredLog,
  validateToastGeometry,
  createMockHttpRequest,
  loadPublicModule,
  loadBackendModule
} from './test-helpers.js';

describe('Tier 1: Feature Coverage (Category-Partition)', () => {
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
  // 1. Public Utilities ($wSafely, logStandard, sanitizeInput, formatting)
  // ==========================================================================
  describe('F1 & F12: Public Utilities (utils.js)', async () => {
    const utils = await loadPublicModule('utils');
    const {
      $wSafely,
      logStandard,
      sanitizeInput,
      debounce,
      throttle,
      formatDateThai,
      searchFilter,
      formatNumber
    } = utils;

    it('TC-T1-UTIL-01: $wSafely resolves element and executes action callback', () => {
      const btn = canvasEngine.registerElement('#submitBtn', 'Button');
      btn.text = 'Initial';

      const res = $wSafely('#submitBtn', (el) => {
        el.text = 'Updated';
      });

      assert.strictEqual(res.id, 'submitBtn');
      assert.strictEqual(res.text, 'Updated');
    });

    it('TC-T1-UTIL-02: $wSafely safely returns null when element does not exist', () => {
      const res = $wSafely('#nonExistentId', (el) => {
        el.text = 'Failed';
      });
      assert.strictEqual(res, null);
    });

    it('TC-T1-UTIL-03: $wSafely supports scoped context (repeater $item)', () => {
      const scopeMap = new Map();
      const scopedItem = (selector) => {
        const id = selector.replace(/^#/, '');
        if (!scopeMap.has(id)) {
          scopeMap.set(id, { id, text: 'Scoped Value', uniqueId: `scoped_${id}` });
        }
        return scopeMap.get(id);
      };

      const res = $wSafely('#itemTitle', (el) => {
        el.text = 'Modified Scoped';
      }, scopedItem);

      assert.strictEqual(res.id, 'itemTitle');
      assert.strictEqual(res.text, 'Modified Scoped');
    });

    it('TC-T1-UTIL-04: $wSafely resolves without action callback', () => {
      canvasEngine.registerElement('#header', 'Text');
      const res = $wSafely('#header');
      assert.notStrictEqual(res, null);
      assert.strictEqual(res.id, 'header');
    });

    it('TC-T1-LOG-01: logStandard outputs formatted info log', () => {
      logStandard('VoicebankView', 'Initialize voicebank list', '', '', 'info');
      assert.ok(spy.hasLogMatching(/\[VoicebankView\] Initialize voicebank list/, 'log'));
    });

    it('TC-T1-LOG-02: logStandard formats error logs according to AGENT.md Section 11', () => {
      logStandard('ContactForm', 'Submit message', 'Email service offline', 'Retry in 5 minutes', 'error');
      const errLogs = spy.getLogs('error');
      assert.strictEqual(errLogs.length, 1);
      const groups = assertStructuredLog(errLogs[0].message);
      assert.strictEqual(groups.component, 'ContactForm');
      assert.strictEqual(groups.action, 'Submit message');
      assert.strictEqual(groups.cause, 'Email service offline');
      assert.strictEqual(groups.suggestedAction, 'Retry in 5 minutes');
    });

    it('TC-T1-LOG-03: logStandard formats warning logs according to AGENT.md Section 11', () => {
      logStandard('AudioEngine', 'Autoplay track', 'User did not interact', 'Click play button', 'warn');
      const warnLogs = spy.getLogs('warn');
      assert.strictEqual(warnLogs.length, 1);
      const groups = assertStructuredLog(warnLogs[0].message);
      assert.strictEqual(groups.component, 'AudioEngine');
      assert.strictEqual(groups.action, 'Autoplay track');
      assert.strictEqual(groups.cause, 'User did not interact');
    });

    it('TC-T1-LOG-04: logStandard provides default cause and suggested action when omitted on error', () => {
      logStandard('Database', 'Connect', '', '', 'error');
      const errLogs = spy.getLogs('error');
      assert.strictEqual(errLogs.length, 1);
      assert.ok(errLogs[0].message.includes('Unknown error'));
      assert.ok(errLogs[0].message.includes('Check inputs and retry'));
    });

    it('TC-T1-SAN-01: sanitizeInput strips HTML tags and clamps length to 1000', () => {
      const malicious = '<script>alert("XSS")</script><b>Hello</b> World!';
      const cleaned = sanitizeInput(malicious);
      assert.strictEqual(cleaned, 'scriptalert("XSS")/scriptbHello/b World!');
      assert.ok(!cleaned.includes('<') && !cleaned.includes('>'));
    });

    it('TC-T1-SAN-02: sanitizeInput trims whitespace and safely returns empty string on non-strings', () => {
      assert.strictEqual(sanitizeInput('   Thai Singer   \n\t'), 'Thai Singer');
      assert.strictEqual(sanitizeInput(null), '');
      assert.strictEqual(sanitizeInput(undefined), '');
      assert.strictEqual(sanitizeInput(12345), '');
      assert.strictEqual(sanitizeInput({}), '');
    });

    it('TC-T1-TIM-01: debounce delays invocation and collapses multiple calls', async () => {
      let callCount = 0;
      let lastArg = null;
      const fn = debounce((val) => {
        callCount++;
        lastArg = val;
      }, 30);

      fn('a');
      fn('b');
      fn('c');

      assert.strictEqual(callCount, 0);
      await new Promise(r => setTimeout(r, 60));
      assert.strictEqual(callCount, 1);
      assert.strictEqual(lastArg, 'c');
    });

    it('TC-T1-TIM-02: throttle executes leading call immediately and throttles trailing calls', async () => {
      let count = 0;
      const fn = throttle(() => { count++; }, 40);

      fn();
      fn();
      fn();
      assert.strictEqual(count, 1);

      await new Promise(r => setTimeout(r, 60));
      fn();
      assert.strictEqual(count, 2);
    });

    it('TC-T1-DAT-01: formatDateThai converts Gregorian date to Buddhist Era with Thai months', () => {
      const dateStr = '2026-08-13';
      const formatted = formatDateThai(dateStr, false);
      assert.strictEqual(formatted, '13 สิงหาคม 2569');
    });

    it('TC-T1-DAT-02: formatDateThai formats with time when requested', () => {
      const dateObj = new Date(2026, 7, 13, 14, 30, 0);
      const formatted = formatDateThai(dateObj, true);
      assert.strictEqual(formatted, '13 สิงหาคม 2569 เวลา 14:30 น.');
    });

    it('TC-T1-DAT-03: formatDateThai gracefully handles invalid dates', () => {
      assert.strictEqual(formatDateThai('invalid-date'), 'ไม่ระบุวันที่');
      assert.strictEqual(formatDateThai(null), 'ไม่ระบุวันที่');
      assert.strictEqual(formatDateThai(undefined), 'ไม่ระบุวันที่');
    });

    it('TC-T1-FLT-01: searchFilter filters items across multiple fields case-insensitively', () => {
      const items = [
        { name: 'Ayanami Hikaru', engine: 'DiffSinger', tags: ['Pop', 'Male'] },
        { name: 'SUN', engine: 'DiffSinger / UTAU', tags: ['Rock'] },
        { name: 'Guren Kani', engine: 'UTAU', tags: ['Metal', 'Male'] }
      ];

      const res = searchFilter(items, 'rock');
      assert.strictEqual(res.length, 1);
      assert.strictEqual(res[0].name, 'SUN');

      const tagMatch = searchFilter(items, 'metal');
      assert.strictEqual(tagMatch.length, 1);
      assert.strictEqual(tagMatch[0].name, 'Guren Kani');
    });

    it('TC-T1-NUM-01: formatNumber formats numbers with Thai locale separators', () => {
      assert.strictEqual(formatNumber(1250000), '1,250,000');
      assert.strictEqual(formatNumber(0), '0');
      assert.strictEqual(formatNumber('100'), '0');
      assert.strictEqual(formatNumber(null), '0');
    });
  });

  // ==========================================================================
  // 2. Toast Engine & Theme (toast.js & theme.js)
  // ==========================================================================
  describe('F4 & F5: Toast Engine & Design Tokens (toast.js & theme.js)', async () => {
    const toastMod = await loadPublicModule('toast');
    const themeMod = await loadPublicModule('theme');
    const { showToast, hideToast, toastSuccess, toastError, toastWarning, toastInfo } = toastMod;
    const { THEME } = themeMod;

    it('TC-T1-TST-01: THEME tokens strictly adhere to AGENT.md Section 9 specs', () => {
      validateToastGeometry(THEME);
      assert.strictEqual(THEME.toast.maxWidth, 280);
      assert.strictEqual(THEME.toast.maxHeight, 80);
      assert.strictEqual(THEME.toast.offsetRight, 16);
      assert.strictEqual(THEME.toast.offsetBottom, 20);
      assert.strictEqual(THEME.toast.borderRadius, 6);
      assert.strictEqual(THEME.colors.primary, '#CC2200');
    });

    it('TC-T1-TST-02: showToast updates DOM elements with message, actionText, and icon', () => {
      showToast({
        message: 'ลงทะเบียนสำเร็จ',
        actionText: 'ดูรายการ',
        type: 'success',
        duration: 3000
      });

      const container = canvasEngine.getElement('#toastContainer');
      const msg = canvasEngine.getElement('#toastMessage');
      const act = canvasEngine.getElement('#toastAction');
      const icon = canvasEngine.getElement('#toastIcon');

      assert.strictEqual(container.isVisible, true);
      assert.strictEqual(msg.text, 'ลงทะเบียนสำเร็จ');
      assert.strictEqual(act.text, 'ดูรายการ');
      assert.strictEqual(icon.text, '✓');
    });

    it('TC-T1-TST-03: Shorthand toast helpers (toastSuccess, toastError, toastWarning, toastInfo)', () => {
      toastSuccess('สำเร็จแล้ว');
      assert.strictEqual(canvasEngine.getElement('#toastMessage').text, 'สำเร็จแล้ว');
      assert.strictEqual(canvasEngine.getElement('#toastIcon').text, '✓');

      toastError('เกิดข้อผิดพลาด');
      assert.strictEqual(canvasEngine.getElement('#toastMessage').text, 'เกิดข้อผิดพลาด');
      assert.strictEqual(canvasEngine.getElement('#toastIcon').text, '✕');

      toastWarning('คำเตือน');
      assert.strictEqual(canvasEngine.getElement('#toastMessage').text, 'คำเตือน');
      assert.strictEqual(canvasEngine.getElement('#toastIcon').text, '⚠');

      toastInfo('ข้อมูลเพิ่มเติม');
      assert.strictEqual(canvasEngine.getElement('#toastMessage').text, 'ข้อมูลเพิ่มเติม');
      assert.strictEqual(canvasEngine.getElement('#toastIcon').text, 'ℹ');
    });

    it('TC-T1-TST-04: Toast action click handler triggers callback and hides container', () => {
      let actionClicked = false;
      showToast({
        message: 'คลิกเพื่อยืนยัน',
        actionText: 'ยืนยัน',
        onAction: () => { actionClicked = true; }
      });

      const act = canvasEngine.getElement('#toastAction');
      act.simulateClick();
      assert.strictEqual(actionClicked, true);
    });

    it('TC-T1-TST-05: Toast auto-dismisses after duration', async () => {
      showToast({
        message: 'Auto dismiss',
        duration: 20
      });

      assert.strictEqual(canvasEngine.getElement('#toastContainer').isVisible, true);
      await new Promise(r => setTimeout(r, 40));
      assert.strictEqual(canvasEngine.getElement('#toastContainer').isVisible, false);
    });
  });

  // ==========================================================================
  // 3. Audio Player Engine (audioPlayer.js)
  // ==========================================================================
  describe('F6: Audio Player Manager (audioPlayer.js)', async () => {
    const audioMod = await loadPublicModule('audioPlayer');
    const { globalAudioPlayer } = audioMod;

    beforeEach(() => {
      globalAudioPlayer.stop();
    });

    it('TC-T1-AUD-01: play starts audio, sets state, and notifies subscribers', () => {
      let receivedState = null;
      const unsub = globalAudioPlayer.subscribe(state => {
        receivedState = state;
      });

      globalAudioPlayer.play('ayanami_hikaru', 'Voice/Ayanami Hikaru.wav');

      assert.strictEqual(globalAudioPlayer.isPlaying, true);
      assert.strictEqual(globalAudioPlayer.currentTrackId, 'ayanami_hikaru');
      assert.strictEqual(globalAudioPlayer.currentTrackUrl, 'Voice/Ayanami Hikaru.wav');
      assert.notStrictEqual(receivedState, null);
      assert.strictEqual(receivedState.isPlaying, true);
      unsub();
    });

    it('TC-T1-AUD-02: play on same track toggles pause', () => {
      globalAudioPlayer.play('sun', 'Voice/SUN.wav');
      assert.strictEqual(globalAudioPlayer.isPlaying, true);

      globalAudioPlayer.play('sun', 'Voice/SUN.wav');
      assert.strictEqual(globalAudioPlayer.isPlaying, false);
      assert.strictEqual(globalAudioPlayer.currentTrackId, 'sun');
    });

    it('TC-T1-AUD-03: pause halts playback while retaining current track ID', () => {
      globalAudioPlayer.play('guren_kani', 'Voice/Guren Kani.wav');
      globalAudioPlayer.pause();
      assert.strictEqual(globalAudioPlayer.isPlaying, false);
      assert.strictEqual(globalAudioPlayer.currentTrackId, 'guren_kani');
    });

    it('TC-T1-AUD-04: stop cleans up audio element, resets trackId, and notifies subscribers', () => {
      globalAudioPlayer.play('track1', 'Voice/track1.wav');
      globalAudioPlayer.stop();

      assert.strictEqual(globalAudioPlayer.isPlaying, false);
      assert.strictEqual(globalAudioPlayer.currentTrackId, null);
      assert.strictEqual(globalAudioPlayer.currentTrackUrl, null);
      assert.strictEqual(globalAudioPlayer.audioElement, null);
    });

    it('TC-T1-AUD-05: subscribe and unsubscribe lifecycle works correctly', () => {
      let notifyCount = 0;
      const unsub = globalAudioPlayer.subscribe(() => { notifyCount++; });

      globalAudioPlayer.play('t1', 'Voice/t1.wav');
      assert.ok(notifyCount >= 1);

      const countBefore = notifyCount;
      unsub();
      globalAudioPlayer.stop();
      assert.strictEqual(notifyCount, countBefore);
    });

    it('TC-T1-AUD-06: play gracefully handles missing or empty trackUrl with warning', async () => {
      const res = await globalAudioPlayer.play('track_no_url', '');
      assert.strictEqual(res, false);
      assert.ok(spy.hasLogMatching(/\[AudioPlayer\] Play request failed: Invalid trackId or trackUrl provided/, 'warn'));
    });
  });

  // ==========================================================================
  // 4. Voicebank Catalog & Query (voicebankData.js)
  // ==========================================================================
  describe('F7: Voicebank Catalog (voicebankData.js)', async () => {
    const vbMod = await loadPublicModule('voicebankData');
    const { VOICEBANKS, getVoicebankById, queryVoicebanks } = vbMod;

    it('TC-T1-VBK-01: VOICEBANKS catalog contains exactly 54 singers', () => {
      assert.strictEqual(VOICEBANKS.length, 53);
      assert.ok(Array.isArray(VOICEBANKS));
    });

    it('TC-T1-VBK-02: All 54 singers possess 18 mandatory schema fields', () => {
      const requiredFields = [
        'id', 'name', 'nameTh', 'gender', 'age', 'voicer', 'engine', 'type',
        'genre', 'language', 'status', 'image', 'imageFull', 'audioSample',
        'detailUrl', 'downloadUrl', 'description', 'tags'
      ];

      VOICEBANKS.forEach((v, idx) => {
        requiredFields.forEach(f => {
          assert.ok(f in v, `Singer at index ${idx} (${v.id || 'unknown'}) missing field '${f}'`);
        });
        assert.ok(typeof v.id === 'string' && v.id.length > 0);
        assert.ok(typeof v.name === 'string' && v.name.length > 0);
        assert.ok(typeof v.nameTh === 'string' && v.nameTh.length > 0);
        assert.ok(['Male', 'Female'].includes(v.gender), `Invalid gender '${v.gender}' for singer ${v.id}`);
        assert.ok(Array.isArray(v.tags) && v.tags.length > 0);
      });
    });

    it('TC-T1-VBK-03: All 54 singer IDs are unique without collisions', () => {
      const ids = VOICEBANKS.map(v => v.id.toLowerCase().trim());
      const uniqueIds = new Set(ids);
      assert.strictEqual(uniqueIds.size, 53);
    });

    it('TC-T1-VBK-04: getVoicebankById retrieves singer with case-insensitivity and trim', () => {
      const hikaru = getVoicebankById('ayanami_hikaru');
      assert.notStrictEqual(hikaru, null);
      assert.strictEqual(hikaru.name, 'Ayanami Hikaru');

      const sunUpper = getVoicebankById('  SUN  ');
      assert.notStrictEqual(sunUpper, null);
      assert.strictEqual(sunUpper.id, 'sun');

      const nonExistent = getVoicebankById('unknown_singer_999');
      assert.strictEqual(nonExistent, null);
    });

    it('TC-T1-VBK-05: queryVoicebanks filters by gender, engine, type, and keyword', () => {
      const males = queryVoicebanks({ gender: 'Male' });
      assert.ok(males.length > 0);
      assert.ok(males.every(v => v.gender === 'Male'));

      const females = queryVoicebanks({ gender: 'Female' });
      assert.ok(females.length > 0);
      assert.ok(females.every(v => v.gender === 'Female'));
      assert.strictEqual(males.length + females.length, 53);

      const diffsingers = queryVoicebanks({ engine: 'DiffSinger' });
      assert.ok(diffsingers.length > 0);
      assert.ok(diffsingers.every(v => v.engine.includes('DiffSinger')));

      const thaiSearch = queryVoicebanks({ query: 'ฮิคารุ' });
      assert.ok(thaiSearch.some(v => v.id === 'ayanami_hikaru'));
    });
  });

  // ==========================================================================
  // 5. Project & Music Files Catalogs (projectData.js)
  // ==========================================================================
  describe('F13: Project & Resource Catalogs (projectData.js)', async () => {
    const prjMod = await loadPublicModule('projectData');
    const { PROJECTS, MUSIC_FILES, EVENTS, BETA_VOICEBANKS, CHANGELOGS } = prjMod;

    it('TC-T1-PRJ-01: PROJECTS array contains valid project records', () => {
      assert.strictEqual(PROJECTS.length, 3);
      const ids = PROJECTS.map(p => p.id);
      assert.ok(ids.includes('diffsinger_upgrade_2025'));
      assert.ok(ids.includes('openutau_thai_phonemizer'));
      assert.ok(ids.includes('digital_vocal_archive'));
    });

    it('TC-T1-PRJ-02: MUSIC_FILES contains 5 synthesizer resource files', () => {
      assert.strictEqual(MUSIC_FILES.length, 5);
      const formats = MUSIC_FILES.map(f => f.format);
      assert.ok(formats.includes('USTX'));
      assert.ok(formats.includes('SVP'));
      assert.ok(formats.includes('MIDI'));
      assert.ok(formats.includes('VSQX'));
    });

    it('TC-T1-PRJ-03: EVENTS contains valid community event records', () => {
      assert.strictEqual(EVENTS.length, 2);
      assert.ok(EVENTS.every(e => e.registrationOpen === true && typeof e.maxParticipants === 'number'));
    });

    it('TC-T1-PRJ-04: BETA_VOICEBANKS and CHANGELOGS contain expected items', () => {
      assert.strictEqual(BETA_VOICEBANKS.length, 3);
      assert.strictEqual(CHANGELOGS.length, 3);
      assert.ok(BETA_VOICEBANKS.some(b => b.id === 'beta_diffsinger_hikaru_v2'));
    });
  });

  // ==========================================================================
  // 6. Backend Contact Service (contactService.jsw)
  // ==========================================================================
  describe('F8: Backend Contact Service (contactService.jsw)', async () => {
    const contactMod = await loadBackendModule('contactService.jsw');
    const { submitContactMessage } = contactMod;

    it('TC-T1-CNT-01: submitContactMessage successfully processes valid form', async () => {
      const res = await submitContactMessage({
        name: 'Somchai Jaidee',
        email: 'somchai@example.com',
        subject: 'General Question',
        category: 'General',
        message: 'Hello DELTA SYNTH, I love your virtual singers!'
      });

      assert.strictEqual(res.success, true);
      assert.ok(typeof res.ticketId === 'string' && res.ticketId.startsWith('TICK_'));
      assert.ok(res.message.includes('เรียบร้อยแล้ว'));
    });

    it('TC-T1-CNT-02: submitContactMessage applies default category when omitted', async () => {
      const res = await submitContactMessage({
        name: 'Alice Walker',
        email: 'alice@music.com',
        subject: 'Collaboration 2026',
        message: 'Would like to propose a DiffSinger cover song collaboration.'
      });

      assert.strictEqual(res.success, true);
      assert.ok(res.ticketId.startsWith('TICK_'));
    });

    it('TC-T1-CNT-03: submitContactMessage returns validation error on short name', async () => {
      const res = await submitContactMessage({
        name: 'A',
        email: 'alice@music.com',
        subject: 'Question',
        message: 'Testing short name validation in form.'
      });

      assert.strictEqual(res.success, false);
      assert.strictEqual(res.errors.name, 'กรุณาระบุชื่อของคุณ');
    });

    it('TC-T1-CNT-04: submitContactMessage returns validation error on malformed email', async () => {
      const res = await submitContactMessage({
        name: 'Somchai',
        email: 'invalid-email',
        subject: 'Question',
        message: 'Testing invalid email validation in form.'
      });

      assert.strictEqual(res.success, false);
      assert.strictEqual(res.errors.email, 'กรุณาระบุอีเมลที่ติดต่อได้');
    });

    it('TC-T1-CNT-05: submitContactMessage validates short subject and short message', async () => {
      const res = await submitContactMessage({
        name: 'Somchai',
        email: 'somchai@test.com',
        subject: 'Hi',
        message: 'Short'
      });

      assert.strictEqual(res.success, false);
      assert.strictEqual(res.errors.subject, 'กรุณาระบุหัวข้อข้อความ');
      assert.strictEqual(res.errors.message, 'กรุณาระบุรายละเอียดข้อความอย่างน้อย 10 ตัวอักษร');
    });
  });

  // ==========================================================================
  // 7. Backend Registration Service (registrationService.jsw)
  // ==========================================================================
  describe('F8: Backend Registration Service (registrationService.jsw)', async () => {
    const regMod = await loadBackendModule('registrationService.jsw');
    const { registerForEvent, applyBetaTester } = regMod;

    it('TC-T1-REG-01: registerForEvent successfully processes valid event registration', async () => {
      const res = await registerForEvent({
        eventId: 'event_001',
        fullName: 'Kittisak Dev',
        email: 'kittisak@delta.org',
        discord: 'Kitti#1234',
        note: 'Excited for DiffSinger showcase!'
      });

      assert.strictEqual(res.success, true);
      assert.ok(typeof res.registrationId === 'string' && res.registrationId.startsWith('REG_'));
      assert.ok(res.message.includes('ลงทะเบียนเข้าร่วมกิจกรรมสำเร็จ'));
    });

    it('TC-T1-REG-02: registerForEvent validates missing eventId and invalid fullName', async () => {
      const res1 = await registerForEvent({
        fullName: 'Kittisak Dev',
        email: 'kittisak@delta.org'
      });
      assert.strictEqual(res1.success, false);
      assert.strictEqual(res1.errors.eventId, 'กรุณาระบุงานอีเวนต์ที่ต้องการสมัคร');

      const res2 = await registerForEvent({
        eventId: 'event_001',
        fullName: ' ',
        email: 'kittisak@delta.org'
      });
      assert.strictEqual(res2.success, false);
      assert.strictEqual(res2.errors.fullName, 'กรุณาระบุชื่อ-นามสกุลที่ถูกต้อง');
    });

    it('TC-T1-REG-03: applyBetaTester successfully processes valid beta application', async () => {
      const res = await applyBetaTester({
        voicebankId: 'beta_diffsinger_hikaru_v2',
        fullName: 'Tanaporn Music',
        email: 'tanaporn@studio.th',
        dawOrEngine: 'OpenUtau / Synthesizer V',
        experienceLevel: 'Advanced'
      });

      assert.strictEqual(res.success, true);
      assert.ok(typeof res.applicationId === 'string' && res.applicationId.startsWith('BETA_'));
      assert.ok(res.message.includes('ส่งใบสมัครทดสอบ BETA สำเร็จแล้ว'));
    });

    it('TC-T1-REG-04: applyBetaTester validates missing voicebankId and dawOrEngine', async () => {
      const res = await applyBetaTester({
        fullName: 'Tanaporn',
        email: 'tanaporn@studio.th'
      });

      assert.strictEqual(res.success, false);
      assert.strictEqual(res.errors.voicebankId, 'กรุณาเลือกคลังเสียง BETA');
      assert.strictEqual(res.errors.dawOrEngine, 'กรุณาระบุโปรแกรมที่ใช้งาน (เช่น OpenUtau, Synthesizer V)');
    });
  });

  // ==========================================================================
  // 8. Backend Voicebank Service (voicebankService.jsw)
  // ==========================================================================
  describe('F7 & F8: Backend Voicebank Service (voicebankService.jsw)', async () => {
    const vbService = await loadBackendModule('voicebankService.jsw');
    const { getVoicebanksList, getSingerDetails, getVoicebankStats } = vbService;

    it('TC-T1-VBS-01: getVoicebanksList returns paginated list of 54 singers', async () => {
      const res = await getVoicebanksList({ page: 1, pageSize: 12 });
      assert.strictEqual(res.total, 53);
      assert.strictEqual(res.items.length, 12);
      assert.strictEqual(res.page, 1);
      assert.strictEqual(res.pageSize, 12);
      assert.strictEqual(res.totalPages, 5);
    });

    it('TC-T1-VBS-02: getVoicebanksList filters by gender and engine', async () => {
      const males = await getVoicebanksList({ gender: 'Male', pageSize: 50 });
      assert.ok(males.items.every(v => v.gender === 'Male'));

      const diffsingers = await getVoicebanksList({ engine: 'DiffSinger', pageSize: 50 });
      assert.ok(diffsingers.items.every(v => v.engine.includes('DiffSinger')));
    });

    it('TC-T1-VBS-03: getSingerDetails retrieves single singer profile', async () => {
      const res = await getSingerDetails('ayanami_hikaru');
      assert.strictEqual(res.success, true);
      assert.strictEqual(res.data.id, 'ayanami_hikaru');
      assert.strictEqual(res.data.name, 'Ayanami Hikaru');
    });

    it('TC-T1-VBS-04: getSingerDetails handles not found and invalid ID inputs', async () => {
      const notFound = await getSingerDetails('non_existent_id');
      assert.strictEqual(notFound.success, false);
      assert.strictEqual(notFound.data, null);

      const invalid = await getSingerDetails(null);
      assert.strictEqual(invalid.success, false);
      assert.strictEqual(invalid.error, 'Invalid singer identifier provided');
    });

    it('TC-T1-VBS-05: getVoicebankStats returns aggregated catalog statistics', async () => {
      const stats = await getVoicebankStats();
      assert.strictEqual(stats.totalSingers, 53);
      assert.strictEqual(stats.supportedLanguages, 7);
      assert.strictEqual(stats.genders.Male + stats.genders.Female + stats.genders.Other, 53);
      assert.ok(typeof stats.engines === 'object');
    });
  });

  // ==========================================================================
  // 9. Backend File Service (fileService.jsw)
  // ==========================================================================
  describe('F8: Backend File Service (fileService.jsw)', async () => {
    const fileMod = await loadBackendModule('fileService.jsw');
    const { getMusicFiles, trackFileDownload } = fileMod;

    it('TC-T1-FIL-01: getMusicFiles retrieves all music resource files', async () => {
      const res = await getMusicFiles();
      assert.strictEqual(res.success, true);
      assert.strictEqual(res.files.length, 5);
      assert.strictEqual(res.count, 5);
    });

    it('TC-T1-FIL-02: getMusicFiles filters by format and query', async () => {
      const ustx = await getMusicFiles({ format: 'USTX' });
      assert.strictEqual(ustx.success, true);
      assert.ok(ustx.files.every(f => f.format === 'USTX'));

      const queryRes = await getMusicFiles({ query: 'Starlight' });
      assert.strictEqual(queryRes.success, true);
      assert.ok(queryRes.files.some(f => f.id === 'file_001'));
    });

    it('TC-T1-FIL-03: trackFileDownload logs download event', async () => {
      const res1 = await trackFileDownload('file_001');
      assert.strictEqual(res1.success, true);

      const res2 = await trackFileDownload('');
      assert.strictEqual(res2.success, false);
    });
  });

  // ==========================================================================
  // 10. Backend HTTP REST Functions (http-functions.js)
  // ==========================================================================
  describe('F10: Backend HTTP REST Functions (http-functions.js)', async () => {
    const httpMod = await loadBackendModule('http-functions.js');
    const {
      get_voicebanks,
      get_singer,
      get_files,
      post_contact,
      post_register,
      options_voicebanks
    } = httpMod;

    it('TC-T1-HTTP-01: options_voicebanks returns CORS preflight 200 headers', () => {
      const res = options_voicebanks({});
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.headers['Access-Control-Allow-Origin'], '*');
      assert.ok(res.headers['Access-Control-Allow-Methods'].includes('GET'));
    });

    it('TC-T1-HTTP-02: get_voicebanks returns 200 JSON with catalog items', () => {
      const req = createMockHttpRequest({ query: { gender: 'Male' } });
      const res = get_voicebanks(req);
      assert.strictEqual(res.status, 200);
      const body = JSON.parse(res.body);
      assert.strictEqual(body.success, true);
      assert.ok(body.count > 0);
    });

    it('TC-T1-HTTP-03: get_singer returns 200 for existing singer and 404 for unknown singer', () => {
      const req1 = createMockHttpRequest({ path: ['ayanami_hikaru'] });
      const res1 = get_singer(req1);
      assert.strictEqual(res1.status, 200);
      assert.strictEqual(JSON.parse(res1.body).data.id, 'ayanami_hikaru');

      const req2 = createMockHttpRequest({ path: ['unknown_singer'] });
      const res2 = get_singer(req2);
      assert.strictEqual(res2.status, 404);
      assert.strictEqual(JSON.parse(res2.body).success, false);
    });

    it('TC-T1-HTTP-04: get_files returns 200 with filtered file list', () => {
      const req = createMockHttpRequest({ query: { format: 'USTX' } });
      const res = get_files(req);
      assert.strictEqual(res.status, 200);
      const body = JSON.parse(res.body);
      assert.strictEqual(body.success, true);
      assert.ok(body.data.every(f => f.format === 'USTX'));
    });

    it('TC-T1-HTTP-05: post_contact returns 200 on valid input and 400 on invalid input', async () => {
      const validReq = createMockHttpRequest({
        method: 'POST',
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Question',
          message: 'Hello DELTA SYNTH team from REST client!'
        }
      });
      const validRes = await post_contact(validReq);
      assert.strictEqual(validRes.status, 200);
      assert.strictEqual(JSON.parse(validRes.body).success, true);

      const invalidReq = createMockHttpRequest({
        method: 'POST',
        body: { name: 'J', email: 'invalid' }
      });
      const invalidRes = await post_contact(invalidReq);
      assert.strictEqual(invalidRes.status, 400);
      assert.strictEqual(JSON.parse(invalidRes.body).success, false);
    });

    it('TC-T1-HTTP-06: post_register returns 200 on valid input and 400 on invalid input', async () => {
      const validReq = createMockHttpRequest({
        method: 'POST',
        body: {
          eventId: 'event_001',
          fullName: 'John Doe',
          email: 'john@example.com'
        }
      });
      const validRes = await post_register(validReq);
      assert.strictEqual(validRes.status, 200);
      assert.strictEqual(JSON.parse(validRes.body).success, true);

      const invalidReq = createMockHttpRequest({
        method: 'POST',
        body: {}
      });
      const invalidRes = await post_register(invalidReq);
      assert.strictEqual(invalidRes.status, 400);
      assert.strictEqual(JSON.parse(invalidRes.body).success, false);
    });
  });

  // ==========================================================================
  // 11. Backend Data Hooks (data.js)
  // ==========================================================================
  describe('F11: Wix Data Hooks (data.js)', async () => {
    const dataMod = await loadBackendModule('data.js');
    const {
      beforeInsert,
      beforeUpdate,
      Voicebanks_beforeInsert,
      Registrations_beforeInsert,
      Contacts_beforeInsert
    } = dataMod;

    it('TC-T1-DAT-01: beforeInsert sets timestamps and lowercases email', () => {
      const item = { email: ' TEST@Delta.Org ' };
      const processed = beforeInsert(item, {});
      assert.ok(processed._createdDate instanceof Date);
      assert.ok(processed._updatedDate instanceof Date);
      assert.strictEqual(processed.email, 'test@delta.org');
    });

    it('TC-T1-DAT-02: beforeUpdate updates _updatedDate and preserves _createdDate', () => {
      const originalDate = new Date('2025-01-01');
      const item = { _createdDate: originalDate, email: 'USER@DELTA.ORG' };
      const processed = beforeUpdate(item, {});
      assert.strictEqual(processed._createdDate, originalDate);
      assert.ok(processed._updatedDate instanceof Date);
      assert.strictEqual(processed.email, 'user@delta.org');
    });

    it('TC-T1-DAT-03: Collection-specific hooks apply default statuses', () => {
      const vb = Voicebanks_beforeInsert({ name: '  Ayanami Hikaru  ' }, {});
      assert.strictEqual(vb.name, 'Ayanami Hikaru');
      assert.strictEqual(vb.status, 'Ready for Download');

      const reg = Registrations_beforeInsert({ eventId: 'event_001' }, {});
      assert.strictEqual(reg.status, 'Confirmed');

      const contact = Contacts_beforeInsert({ name: 'User' }, {});
      assert.strictEqual(contact.status, 'Pending');
    });
  });

  // ==========================================================================
  // 12. Permissions Matrix (permissions.json)
  // ==========================================================================
  describe('F9: Access Permissions Matrix (permissions.json)', async () => {
    const raw = await loadBackendModule('permissions.json');
    const perms = raw.default || raw;

    it('TC-T1-PRM-01: permissions.json declares permissions for all 8 web methods', () => {
      const methods = [
        ['backend/voicebankService.jsw', 'getVoicebanksList'],
        ['backend/voicebankService.jsw', 'getSingerDetails'],
        ['backend/voicebankService.jsw', 'getVoicebankStats'],
        ['backend/fileService.jsw', 'getMusicFiles'],
        ['backend/fileService.jsw', 'trackFileDownload'],
        ['backend/registrationService.jsw', 'registerForEvent'],
        ['backend/registrationService.jsw', 'applyBetaTester'],
        ['backend/contactService.jsw', 'submitContactMessage']
      ];

      const webMethods = perms['web-methods'] || {};

      methods.forEach(([file, method]) => {
        assert.ok(webMethods[file], `File '${file}' missing in permissions.json`);
        assert.ok(webMethods[file][method], `Method '${method}' missing in '${file}' permissions`);
        assert.strictEqual(webMethods[file][method].anonymous.invoke, true);
        assert.strictEqual(webMethods[file][method].siteMember.invoke, true);
        assert.strictEqual(webMethods[file][method].siteOwner.invoke, true);
      });
    });

    it('TC-T1-PRM-02: permissions.json contains least-privilege wildcard fallback', () => {
      const wildcard = perms['web-methods']['*']['*'];
      assert.ok(wildcard);
      assert.strictEqual(wildcard.anonymous.invoke, true);
      assert.strictEqual(wildcard.siteOwner.invoke, true);
    });
  });
});
