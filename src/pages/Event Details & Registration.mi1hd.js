/**
 * DELTA SYNTH — Event Details & Registration Script (Event Details & Registration.mi1hd.js)
 * 
 * Synchronized with Wix Canvas & mi1hd.d.ts:
 * - Native Wix Event Registration App: #events1 ($w.IFrame)
 * - Dynamic form fallback & backend registration web module
 * 
 * Complies with AGENT.md:
 * - Red (#CC2200), Black (#1A1A1A), White (#F0F0F0) branding
 * - Defensive design with $wSafely
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { registerForEvent } from 'backend/registrationService.jsw';
import { EVENTS } from 'public/projectData';
import { showToast, toastSuccess, toastError } from 'public/toast';
import { $wSafely, logStandard } from 'public/utils';

$w.onReady(function () {
  logStandard('EventRegistrationPage', 'Registration page initializing', '', '', 'info');

  initWixEventsApp();
  initEventSelector();
  initRegistrationForm();

  logStandard('EventRegistrationPage', 'Registration page ready', '', '', 'info');
});

function initWixEventsApp() {
  $wSafely('#events1', (app) => {
    // Native Wix Event Registration App integration
  });
}

function initEventSelector() {
  $wSafely('#eventSelectDropdown', (dropdown) => {
    dropdown.options = EVENTS.map(e => ({
      label: `${e.titleTh || e.title} (${e.date})`,
      value: e.id
    }));
  });
}

function initRegistrationForm() {
  let isSubmitting = false;

  $wSafely('#submitRegistrationBtn', (btn) => {
    btn.onClick(async () => {
      if (isSubmitting) return;

      let eventId = '';
      let fullName = '';
      let email = '';
      let discord = '';
      let note = '';

      $wSafely('#eventSelectDropdown', el => { eventId = el.value || (EVENTS[0] && EVENTS[0].id); });
      $wSafely('#regFullNameInput', el => { fullName = (el.value || '').trim(); });
      $wSafely('#regEmailInput', el => { email = (el.value || '').trim(); });
      $wSafely('#regDiscordInput', el => { discord = (el.value || '').trim(); });
      $wSafely('#regNoteInput', el => { note = (el.value || '').trim(); });

      if (!fullName || fullName.length < 2) {
        toastError('กรุณากรอกชื่อ-นามสกุล', 'ระบุชื่ออย่างน้อย 2 ตัวอักษร');
        return;
      }
      if (!email || !email.includes('@')) {
        toastError('กรุณากรอกอีเมลที่ถูกต้อง', 'เช่น user@example.com');
        return;
      }

      isSubmitting = true;
      btn.label = 'กำลังบันทึกข้อมูล...';

      try {
        const response = await registerForEvent({
          eventId,
          fullName,
          email,
          discord,
          note
        });

        if (response.success) {
          toastSuccess(response.message, `รหัสลงทะเบียน: ${response.registrationId}`);
          $wSafely('#regFullNameInput', el => { el.value = ''; });
          $wSafely('#regEmailInput', el => { el.value = ''; });
          $wSafely('#regDiscordInput', el => { el.value = ''; });
          $wSafely('#regNoteInput', el => { el.value = ''; });
        } else {
          toastError(response.message);
        }
      } catch (err) {
        logStandard('EventRegistrationPage', 'Submit registration', err.message, 'Check network', 'error');
        toastError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
      } finally {
        isSubmitting = false;
        btn.label = 'ยืนยันการลงทะเบียน (Register)';
      }
    });
  });
}
