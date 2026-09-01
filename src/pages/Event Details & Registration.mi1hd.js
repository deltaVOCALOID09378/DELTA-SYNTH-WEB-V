/**
 * DELTA SYNTH — Event Details & Registration Script (Event Details & Registration.mi1hd.js)
 * 
 * Synchronized with Wix Canvas & mi1hd.d.ts:
 * - Native Event App: #events1 ($w.IFrame)
 * - Event Selection & Live Card: #eventSelectDropdown, #selectedEventCard
 * - Registration Form: #regFullNameInput, #regEmailInput, #regDiscordInput, #regNoteInput, #submitRegistrationBtn
 * 
 * Standards from AGENT.md:
 * - Red (#CC2200), Black (#1A1A1A), White (#F0F0F0) branding
 * - Defensive design with $wSafely
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { registerForEvent } from 'backend/registrationService.jsw';
import { EVENTS } from 'public/projectData';
import { showToast, toastSuccess, toastError, toastInfo } from 'public/toast';
import { $wSafely, logStandard } from 'public/utils';

$w.onReady(function () {
  logStandard('EventRegistrationPage', 'Event registration page initializing', '', '', 'info');

  initWixEventsApp();
  initEventSelector();
  initRegistrationForm();

  logStandard('EventRegistrationPage', 'Event registration page ready', '', '', 'info');
});

function initWixEventsApp() {
  $wSafely('#events1', (app) => {
    // ซิงโครไนซ์กับ Native Wix Event App
  });
}

function initEventSelector() {
  $wSafely('#eventSelectDropdown', (dropdown) => {
    dropdown.options = EVENTS.map(e => ({
      label: `${e.titleTh || e.title} (${e.date})`,
      value: e.id
    }));

    // อัปเดตรายละเอียดกิจกรรมเมื่อเลือก Dropdown
    dropdown.onChange(() => {
      const selected = EVENTS.find(e => e.id === dropdown.value);
      updateSelectedEventCard(selected);
    });

    // กำหนดค่าเริ่มต้น
    if (EVENTS.length > 0) {
      dropdown.value = EVENTS[0].id;
      updateSelectedEventCard(EVENTS[0]);
    }
  });
}

function updateSelectedEventCard(eventItem) {
  if (!eventItem) return;

  $wSafely('#eventDetailTitle', el => { el.text = eventItem.titleTh || eventItem.title; });
  $wSafely('#eventDetailDate', el => { el.text = `📅 วันที่: ${eventItem.date} เวลา ${eventItem.time}`; });
  $wSafely('#eventDetailLocation', el => { el.text = `📍 สถานที่: ${eventItem.location}`; });
  $wSafely('#eventDetailDesc', el => { el.text = eventItem.description; });
  $wSafely('#eventDetailSeats', el => {
    el.text = `ที่นั่งว่าง: ${eventItem.maxParticipants - eventItem.currentRegistered} / ${eventItem.maxParticipants} ที่นั่ง`;
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
        toastError('กรุณากรอกอีเมลที่ถูกต้อง', 'สำหรับรับลิงก์เข้าร่วมกิจกรรม');
        return;
      }

      isSubmitting = true;
      btn.disable();
      btn.label = 'กำลังลงทะเบียน...';

      try {
        const response = await registerForEvent({
          eventId,
          fullName,
          email,
          discord,
          note
        });

        if (response && response.success) {
          toastSuccess(response.message || 'ลงทะเบียนเข้าร่วมกิจกรรมสำเร็จ!', `รหัสลงทะเบียน: ${response.registrationId}`);
          
          // ล้างข้อมูลในฟอร์ม
          $wSafely('#regFullNameInput', el => { el.value = ''; });
          $wSafely('#regEmailInput', el => { el.value = ''; });
          $wSafely('#regDiscordInput', el => { el.value = ''; });
          $wSafely('#regNoteInput', el => { el.value = ''; });
        } else {
          toastError(response?.message || 'ไม่สามารถลงทะเบียนได้ในขณะนี้');
        }
      } catch (err) {
        logStandard('EventRegistrationPage', 'Submit registration error', err.message, '', 'error');
        toastError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
      } finally {
        isSubmitting = false;
        btn.enable();
        btn.label = 'ยืนยันการลงทะเบียน (Register)';
      }
    });
  });
}