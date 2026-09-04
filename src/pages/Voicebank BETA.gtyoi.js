/**
 * DELTA SYNTH — Voicebank BETA Testing Center Page Script (Voicebank BETA.gtyoi.js)
 * 
 * Synchronized with Wix Canvas & gtyoi.d.ts:
 * - Native Headers: #Section1RegularTitle1, #Section1RegularLongtext1, #Section2RegularTitle1, #Section3RegularTitle1, #Section3RegularLongtext1, #text1
 * - Beta Testing Repeater: #betaVoicebankRepeater
 * - Beta Application Form: #betaSelectDropdown, #betaFullNameInput, #betaEmailInput, #betaDawInput, #btnSubmitBetaApp
 * 
 * Standards from AGENT.md:
 * - Red (#CC2200), Black (#1A1A1A), White (#F0F0F0) branding
 * - Defensive design with $wSafely & Async Error Handling
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { BETA_VOICEBANKS } from 'public/projectData';
import { applyBetaTester } from 'backend/registrationService.jsw';
import { showToast, toastSuccess, toastError, toastInfo } from 'public/toast';
import { $wSafely, logStandard } from 'public/utils';

$w.onReady(function () {
  logStandard('VoicebankBetaPage', 'Voicebank BETA testing page initializing', '', '', 'info');

  syncWixBetaHeadings();
  initBetaRepeater();
  initBetaApplicationForm();

  logStandard('VoicebankBetaPage', 'Voicebank BETA testing page ready', '', '', 'info');
});

function syncWixBetaHeadings() {
  $wSafely('#Section1RegularTitle1', el => {
    el.text = 'VOICEBANK BETA TESTING HUB';
  });

  $wSafely('#Section1RegularLongtext1', el => {
    el.text = 'ศูนย์ทดสอบคลังเสียงรุ่นทดลอง DiffSinger AI และ UTAU Extended ของ DELTA SYNTH ก่อนเปิดตัวอย่างเป็นทางการ';
  });

  $wSafely('#Section2RegularTitle1', el => {
    el.text = 'Active Beta Voicebanks (คลังเสียงที่กำลังเปิดทดสอบ)';
  });

  $wSafely('#Section3RegularTitle1', el => {
    el.text = 'Apply as Beta Tester (สมัครเข้าร่วมเป็นผู้ทดสอบ)';
  });

  $wSafely('#Section3RegularLongtext1', el => {
    el.text = 'ผู้ผ่านการคัดเลือกจะได้รับสิทธิ์เข้าถึงโมเดลเสียงรุ่นทดสอบก่อนใคร พร้อมสิทธิ์เสนอแนะการปรับปรุงเสียงร้อง';
  });

  $wSafely('#text1', el => {
    el.text = 'ข้อกำหนดการทดสอบ: ห้ามเผยแพร่ไฟล์เสียงดิบหรือโมเดลทดสอบก่อนได้รับอนุญาตจากทางสตูดิโอ';
  });
}

function initBetaRepeater() {
  $wSafely('#betaVoicebankRepeater', (repeater) => {
    repeater.data = BETA_VOICEBANKS.map(b => ({ _id: b.id, ...b }));

    repeater.onItemReady(($item, itemData) => {
      $wSafely($item('#betaName'), el => { el.text = itemData.name; });
      $wSafely($item('#betaVersion'), el => { el.text = `เวอร์ชัน: ${itemData.version}`; });
      $wSafely($item('#betaEngine'), el => { el.text = `ระบบ: ${itemData.engine}`; });
      $wSafely($item('#betaStatus'), el => { el.text = `สถานะ: ${itemData.status}`; });
      $wSafely($item('#betaUpdateDate'), el => { el.text = `อัปเดต: ${itemData.updateDate}`; });
      $wSafely($item('#betaChangelog'), el => { el.text = itemData.changelog; });

      $wSafely($item('#betaDownloadBtn'), btn => {
        btn.onClick(() => {
          if (itemData.downloadUrl && itemData.downloadUrl !== '#') {
            toastSuccess(`เปิดลิงก์ดาวน์โหลด BETA: ${itemData.name}`);
          } else {
            showToast({
              message: `คลังเสียง ${itemData.name} เปิดให้ทดสอบเฉพาะผู้ได้รับสิทธิ์`,
              actionText: 'กรอกใบสมัครด้านล่าง',
              type: 'info'
            });
          }
        });
      });
    });
  });
}

function initBetaApplicationForm() {
  $wSafely('#betaSelectDropdown', (dropdown) => {
    dropdown.options = BETA_VOICEBANKS.map(b => ({
      label: `${b.name} (${b.version})`,
      value: b.id
    }));
  });

  $wSafely('#btnSubmitBetaApp', (btn) => {
    btn.onClick(async () => {
      let voicebankId = '';
      let fullName = '';
      let email = '';
      let dawOrEngine = '';
      let experienceLevel = 'Intermediate';

      $wSafely('#betaSelectDropdown', el => { voicebankId = el.value || (BETA_VOICEBANKS[0] && BETA_VOICEBANKS[0].id); });
      $wSafely('#betaFullNameInput', el => { fullName = (el.value || '').trim(); });
      $wSafely('#betaEmailInput', el => { email = (el.value || '').trim(); });
      $wSafely('#betaDawInput', el => { dawOrEngine = (el.value || '').trim(); });
      $wSafely('#betaExpDropdown', el => { experienceLevel = el.value || 'Intermediate'; });

      if (!fullName || fullName.length < 2) {
        toastError('กรุณาระบุชื่อ-นามสกุลของผู้สมัคร');
        return;
      }
      if (!email || !email.includes('@')) {
        toastError('กรุณาระบุอีเมลที่ถูกต้องสำหรับรับผลการคัดเลือก');
        return;
      }
      if (!dawOrEngine) {
        toastError('กรุณาระบุโปรแกรมที่ใช้งาน (เช่น OpenUtau, Synthesizer V)');
        return;
      }

      btn.disable();
      btn.label = 'กำลังส่งใบสมัคร...';

      try {
        const res = await applyBetaTester({
          voicebankId,
          fullName,
          email,
          dawOrEngine,
          experienceLevel
        });

        if (res && res.success) {
          toastSuccess(res.message || 'ส่งใบสมัครเรียบร้อยแล้ว!', `รหัสใบสมัคร: ${res.applicationId || 'BETA-APP'}`);
          $wSafely('#betaFullNameInput', el => { el.value = ''; });
          $wSafely('#betaEmailInput', el => { el.value = ''; });
          $wSafely('#betaDawInput', el => { el.value = ''; });
        } else {
          toastError(res?.message || 'ไม่สามารถส่งใบสมัครได้');
        }
      } catch (err) {
        logStandard('VoicebankBetaPage', 'Beta application error', err.message, '', 'error');
        toastError('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
      } finally {
        btn.enable();
        btn.label = 'ส่งใบสมัครทดสอบ BETA';
      }
    });
  });
}