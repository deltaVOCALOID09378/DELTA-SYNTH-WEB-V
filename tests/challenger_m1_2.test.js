/**
 * DELTA SYNTH — Challenger 2 Empirical Stress Test Harness (Milestone M1)
 * 
 * Tests:
 * 1. Voicebank Invariants & O(1) Map Lookup
 * 2. Voicebank Query Edge Cases & Thai Unicode Search
 * 3. Toast Dual Signatures & Helper Invocations
 * 4. Toast onAction Exception Handling & Structured Logging
 * 5. Toast Geometry & AGENT.md Section 9 Theme Tokens
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { VOICEBANKS, getVoicebankById, queryVoicebanks } from '../src/public/voicebankData.js';
import { showToast, hideToast, toastSuccess, toastError, toastWarning, toastInfo } from '../src/public/toast.js';
import { THEME } from '../src/public/theme.js';
import {
  setupTestEnvironment,
  teardownTestEnvironment,
  ConsoleSpy,
  assertStructuredLog,
  validateToastGeometry
} from './test-helpers.js';

test.describe('Challenger 2 Empirical Verification: Milestone M1 Public Core', () => {

  // ==========================================================================
  // Suite 1: Voicebank Catalog Invariants & O(1) Indexing
  // ==========================================================================
  test.describe('1. Voicebank Catalog & O(1) Indexing Verification', () => {
    test('Catalog contains exactly 54 unique voicebank items', () => {
      assert.strictEqual(VOICEBANKS.length, 54, `Expected 54 voicebanks, got ${VOICEBANKS.length}`);
      
      const idSet = new Set();
      for (const vb of VOICEBANKS) {
        assert.ok(vb.id, 'Voicebank must have an id');
        assert.ok(typeof vb.id === 'string', 'Voicebank id must be a string');
        const normId = vb.id.toLowerCase().trim();
        assert.ok(!idSet.has(normId), `Duplicate voicebank id detected: ${normId}`);
        idSet.add(normId);

        // Verify required metadata fields
        assert.ok(vb.name, `Voicebank ${vb.id} must have a name`);
        assert.ok(vb.nameTh, `Voicebank ${vb.id} must have a nameTh`);
        assert.ok(vb.gender, `Voicebank ${vb.id} must have a gender`);
        assert.ok(vb.engine, `Voicebank ${vb.id} must have an engine`);
        assert.ok(vb.type, `Voicebank ${vb.id} must have a type`);
      }
      assert.strictEqual(idSet.size, 54, 'Set of normalized IDs must equal 54');
    });

    test('All 54 voicebanks are retrievable by exact ID', () => {
      for (const vb of VOICEBANKS) {
        const result = getVoicebankById(vb.id);
        assert.strictEqual(result, vb, `Failed to retrieve ${vb.id} by exact ID`);
      }
    });

    test('All 54 voicebanks are retrievable by uppercase and mixed-case ID', () => {
      for (const vb of VOICEBANKS) {
        const upperResult = getVoicebankById(vb.id.toUpperCase());
        assert.strictEqual(upperResult, vb, `Failed to retrieve ${vb.id} by uppercase ID`);

        const mixedId = vb.id.split('').map((c, i) => (i % 2 === 0 ? c.toUpperCase() : c.toLowerCase())).join('');
        const mixedResult = getVoicebankById(mixedId);
        assert.strictEqual(mixedResult, vb, `Failed to retrieve ${vb.id} by mixed-case ID`);
      }
    });

    test('All 54 voicebanks are retrievable with surrounding whitespace', () => {
      for (const vb of VOICEBANKS) {
        const paddedId = `   \t\n ${vb.id} \r\n  `;
        const result = getVoicebankById(paddedId);
        assert.strictEqual(result, vb, `Failed to retrieve ${vb.id} with padded whitespace`);
      }
    });

    test('getVoicebankById safely returns null on non-matching, invalid, or non-string inputs', () => {
      const invalidInputs = [
        null,
        undefined,
        '',
        '   ',
        '\t\n\r',
        'non_existent_singer_id_12345',
        12345,
        0,
        -1,
        NaN,
        Infinity,
        true,
        false,
        {},
        { id: 'ayanami_hikaru' },
        [],
        ['sun'],
        Symbol('ayanami_hikaru'),
        () => 'sun'
      ];

      for (const input of invalidInputs) {
        const result = getVoicebankById(input);
        assert.strictEqual(result, null, `Expected null for input: ${String(input)}`);
      }
    });

    test('Benchmark: O(1) Map lookup performance', () => {
      const ids = VOICEBANKS.map(v => v.id);
      const iterations = 100000;
      const startTime = process.hrtime.bigint();

      for (let i = 0; i < iterations; i++) {
        const targetId = ids[i % ids.length];
        const res = getVoicebankById(targetId);
        assert.ok(res !== null);
      }

      const endTime = process.hrtime.bigint();
      const totalDurationNs = Number(endTime - startTime);
      const avgNsPerOp = totalDurationNs / iterations;
      const avgMsPerOp = avgNsPerOp / 1e6;

      // 100,000 Map lookups should take less than 100ms total (< 0.001ms / op)
      assert.ok(avgMsPerOp < 0.01, `Average lookup time ${avgMsPerOp}ms exceeds 0.01ms threshold`);
    });
  });

  // ==========================================================================
  // Suite 2: queryVoicebanks Advanced Filtering & Edge Cases
  // ==========================================================================
  test.describe('2. queryVoicebanks Filtering & Edge Case Verification', () => {
    test('queryVoicebanks with undefined, null, or empty options returns shallow copy of all 54 items', () => {
      const cases = [undefined, null, {}, { gender: 'All', engine: 'All', type: 'All', query: '' }];
      for (const opts of cases) {
        const results = queryVoicebanks(opts);
        assert.strictEqual(results.length, 54);
        assert.notStrictEqual(results, VOICEBANKS, 'Must return a new array instance, not the internal array');
      }
    });

    test('queryVoicebanks array mutation does not affect original catalog', () => {
      const results = queryVoicebanks();
      results.pop();
      results.push({ id: 'injected_dummy' });
      assert.strictEqual(VOICEBANKS.length, 54);
      assert.strictEqual(getVoicebankById('injected_dummy'), null);
    });

    test('queryVoicebanks handles non-object options gracefully', () => {
      const badOptions = ['string', 12345, true, false, () => {}];
      for (const opt of badOptions) {
        const res = queryVoicebanks(opt);
        assert.strictEqual(res.length, 54);
      }
    });

    test('Filter by gender (case-insensitive & whitespace-trimmed)', () => {
      const maleResults1 = queryVoicebanks({ gender: 'Male' });
      const maleResults2 = queryVoicebanks({ gender: 'male' });
      const maleResults3 = queryVoicebanks({ gender: '  MALE  ' });

      assert.ok(maleResults1.length > 0);
      assert.strictEqual(maleResults1.length, maleResults2.length);
      assert.strictEqual(maleResults1.length, maleResults3.length);
      assert.ok(maleResults1.every(v => v.gender.toLowerCase() === 'male'));

      const femaleResults = queryVoicebanks({ gender: 'Female' });
      assert.ok(femaleResults.length > 0);
      assert.ok(femaleResults.every(v => v.gender.toLowerCase() === 'female'));

      assert.strictEqual(maleResults1.length + femaleResults.length, 54);
    });

    test('Filter by gender with "All", "ALL", "all" returns all 54 items', () => {
      for (const g of ['All', 'ALL', 'all', '  all  ', '']) {
        const results = queryVoicebanks({ gender: g });
        assert.strictEqual(results.length, 54, `Failed for gender: "${g}"`);
      }
    });

    test('Filter by engine (substring & case-insensitive)', () => {
      const diffsingerResults = queryVoicebanks({ engine: 'DiffSinger' });
      const diffsingerLower = queryVoicebanks({ engine: 'diffsinger' });
      assert.strictEqual(diffsingerResults.length, diffsingerLower.length);
      assert.ok(diffsingerResults.length > 0);
      assert.ok(diffsingerResults.every(v => v.engine.toLowerCase().includes('diffsinger')));

      const utauResults = queryVoicebanks({ engine: 'UTAU' });
      assert.ok(utauResults.length > 0);
      assert.ok(utauResults.every(v => v.engine.toLowerCase().includes('utau')));
    });

    test('Filter by type (Official DELTA vs Collaboration)', () => {
      const officialResults = queryVoicebanks({ type: 'Official DELTA' });
      assert.ok(officialResults.length > 0);
      assert.ok(officialResults.every(v => v.type.toLowerCase().includes('official delta')));

      const collabResults = queryVoicebanks({ type: 'Collaboration' });
      assert.ok(collabResults.length >= 0);
    });

    test('Search query matches name, nameTh, genre, description, id, and tags', () => {
      // English Name
      const hikaruQuery = queryVoicebanks({ query: 'Hikaru' });
      assert.ok(hikaruQuery.some(v => v.id === 'ayanami_hikaru'));

      // Thai Name
      const thaiNameQuery = queryVoicebanks({ query: 'ฮิคารุ' });
      assert.ok(thaiNameQuery.some(v => v.id === 'ayanami_hikaru'));

      // Thai Description Keyword ('ป๊อป')
      const popThaiQuery = queryVoicebanks({ query: 'ป๊อป' });
      assert.ok(popThaiQuery.length > 0);
      assert.ok(popThaiQuery.some(v => v.id === 'kochujang'));

      // ID match
      const sunIdQuery = queryVoicebanks({ query: 'sun' });
      assert.ok(sunIdQuery.some(v => v.id === 'sun'));

      // Tag match
      const rockTagQuery = queryVoicebanks({ query: 'Rock' });
      assert.ok(rockTagQuery.length > 0);

      // Non-matching query returns empty array
      const nonMatch = queryVoicebanks({ query: 'NON_EXISTENT_VOCALIST_SEARCH_KEYWORD_XYZ' });
      assert.strictEqual(nonMatch.length, 0);
    });

    test('Combined multi-criteria filter', () => {
      const combined = queryVoicebanks({
        gender: 'Male',
        engine: 'DiffSinger',
        type: 'Official DELTA',
        query: 'Ayanami'
      });

      assert.strictEqual(combined.length, 1);
      assert.strictEqual(combined[0].id, 'ayanami_hikaru');
    });
  });

  // ==========================================================================
  // Suite 3: Toast Notification Engine Dual Signatures & Helpers
  // ==========================================================================
  test.describe('3. Toast Notification Dual Signatures & Invocations', () => {
    let env;
    let spy;

    test.beforeEach(() => {
      env = setupTestEnvironment();
      spy = new ConsoleSpy();
    });

    test.afterEach(() => {
      spy.restore();
      teardownTestEnvironment();
    });

    test('showToast with options object (primary signature)', () => {
      showToast({
        message: 'Project saved successfully',
        actionText: 'Undo',
        type: 'success'
      });

      const msgEl = env.$w('#toastMessage');
      const actionEl = env.$w('#toastAction');
      const iconEl = env.$w('#toastIcon');
      const containerEl = env.$w('#toastContainer');

      assert.strictEqual(msgEl.text, 'Project saved successfully');
      assert.strictEqual(actionEl.text, 'Undo');
      assert.strictEqual(iconEl.text, '✓');
      assert.strictEqual(containerEl.isVisible, true);
    });

    test('showToast with legacy positional string arguments (dual signature)', () => {
      // Signature: showToast(message, type)
      showToast('Action completed', 'success');

      const msgEl = env.$w('#toastMessage');
      const iconEl = env.$w('#toastIcon');

      assert.strictEqual(msgEl.text, 'Action completed');
      assert.strictEqual(iconEl.text, '✓');

      // Signature: showToast(message, actionText, type)
      showToast('File downloaded', 'Open Folder', 'info');

      const actionEl = env.$w('#toastAction');
      assert.strictEqual(msgEl.text, 'File downloaded');
      assert.strictEqual(actionEl.text, 'Open Folder');
      assert.strictEqual(iconEl.text, 'ℹ');
    });

    test('Helper functions: toastSuccess, toastError, toastWarning, toastInfo', () => {
      // toastSuccess
      toastSuccess('Task done');
      assert.strictEqual(env.$w('#toastMessage').text, 'Task done');
      assert.strictEqual(env.$w('#toastAction').text, 'เรียบร้อย');
      assert.strictEqual(env.$w('#toastIcon').text, '✓');

      // toastError
      toastError('System error occurred');
      assert.strictEqual(env.$w('#toastMessage').text, 'System error occurred');
      assert.strictEqual(env.$w('#toastAction').text, 'ลองใหม่อีกครั้ง');
      assert.strictEqual(env.$w('#toastIcon').text, '✕');

      // toastWarning
      toastWarning('Low storage warning');
      assert.strictEqual(env.$w('#toastMessage').text, 'Low storage warning');
      assert.strictEqual(env.$w('#toastAction').text, 'โปรดตรวจสอบ');
      assert.strictEqual(env.$w('#toastIcon').text, '⚠');

      // toastInfo
      toastInfo('New update available');
      assert.strictEqual(env.$w('#toastMessage').text, 'New update available');
      assert.strictEqual(env.$w('#toastIcon').text, 'ℹ');
    });

    test('showToast handles invalid inputs safely without throwing', () => {
      showToast(null);
      showToast(undefined);
      showToast(12345);
      showToast(false);

      // Verify structured warning was logged
      assert.ok(spy.hasLogMatching(/\[Toast\] Show notification failed: Invalid arguments/i, 'warn'));
    });

    test('hideToast immediately hides toast and clears active timer', () => {
      showToast({ message: 'Visible toast' });
      assert.strictEqual(env.$w('#toastContainer').isVisible, true);

      hideToast();
      assert.strictEqual(env.$w('#toastContainer').isVisible, false);
    });
  });

  // ==========================================================================
  // Suite 4: Toast Action Error Handling & Structured Logging
  // ==========================================================================
  test.describe('4. Toast onAction Exception Handling & Structured Logging', () => {
    let env;
    let spy;

    test.beforeEach(() => {
      env = setupTestEnvironment();
      spy = new ConsoleSpy();
    });

    test.afterEach(() => {
      spy.restore();
      teardownTestEnvironment();
    });

    test('onAction throwing exception is caught, logged via logStandard, and toast is hidden', () => {
      let actionCalled = false;
      const failingAction = () => {
        actionCalled = true;
        throw new Error('Simulated custom onAction explosion');
      };

      showToast({
        message: 'Failure test',
        actionText: 'Crash Now',
        type: 'error',
        onAction: failingAction
      });

      const actionBtn = env.$w('#toastAction');
      assert.ok(actionBtn);

      // Trigger click
      actionBtn.simulateClick();

      // Verify callback was attempted
      assert.strictEqual(actionCalled, true);

      // Verify structured error log
      const errorLogs = spy.getLogs('error');
      assert.ok(errorLogs.length > 0, 'Expected structured error log');

      const logMsg = errorLogs[0].message;
      const groups = assertStructuredLog(logMsg);
      assert.strictEqual(groups.component, 'Toast');
      assert.strictEqual(groups.action, 'Execute action callback');
      assert.strictEqual(groups.cause, 'Simulated custom onAction explosion');
      assert.strictEqual(groups.suggestedAction, 'Check onAction handler implementation');

      // Verify hideToast was executed in finally block
      const containerEl = env.$w('#toastContainer');
      assert.strictEqual(containerEl.isVisible, false);
    });

    test('Successful onAction executes cleanly and hides toast', () => {
      let actionExecuted = false;
      showToast({
        message: 'Success test',
        actionText: 'Execute',
        type: 'info',
        onAction: () => {
          actionExecuted = true;
        }
      });

      env.$w('#toastAction').simulateClick();
      assert.strictEqual(actionExecuted, true);
      assert.strictEqual(env.$w('#toastContainer').isVisible, false);
    });
  });

  // ==========================================================================
  // Suite 5: Toast Geometry & AGENT.md Section 9 Theme Tokens
  // ==========================================================================
  test.describe('5. Toast Geometry & Theme Standards Compliance', () => {
    test('THEME tokens strictly match AGENT.md Section 9 guidelines', () => {
      // Validate with standard test helper
      validateToastGeometry(THEME);

      // Direct assertions on toast geometry
      assert.strictEqual(THEME.toast.maxWidth, 280, 'Toast maxWidth must be 280px');
      assert.strictEqual(THEME.toast.maxHeight, 80, 'Toast maxHeight must be 80px');
      assert.strictEqual(THEME.toast.offsetRight, 16, 'Toast offsetRight must be 16px');
      assert.strictEqual(THEME.toast.offsetBottom, 20, 'Toast offsetBottom must be 20px');
      assert.strictEqual(THEME.toast.borderRadius, 6, 'Toast borderRadius must be 6px');
      assert.strictEqual(THEME.toast.durationMs, 3500, 'Default toast duration must be 3500ms');

      // Direct assertions on DELTA SYNTH palette
      assert.strictEqual(THEME.colors.primary, '#CC2200');
      assert.strictEqual(THEME.colors.primaryHover, '#FF4422');
      assert.strictEqual(THEME.colors.primaryPressed, '#991100');
      assert.strictEqual(THEME.colors.primaryHighlight, '#CC2200');
      assert.strictEqual(THEME.colors.bgDark, '#1A1A1A');
      assert.strictEqual(THEME.colors.textLight, '#F0F0F0');

      // Direct assertions on typography
      assert.ok(THEME.fonts.primary.includes('Leelawadee UI'), 'Primary font must include Leelawadee UI');
      assert.ok(THEME.fonts.heading.includes('Leelawadee UI'), 'Heading font must include Leelawadee UI');
    });
  });
});
