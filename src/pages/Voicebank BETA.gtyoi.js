/**
 * DELTA SYNTH — Voicebank BETA Testing Center Page Script (Voicebank BETA.gtyoi.js)
 * 
 * Synchronized with Wix Canvas & gtyoi.d.ts:
 * - Native Wix text headers: #Section1RegularTitle1, #Section1RegularLongtext1, #Section2RegularTitle1, #Section3RegularTitle1, #Section3RegularLongtext1, #text1
 * - Beta testing catalog & application form
 * 
 * Complies with AGENT.md:
 * - Red (#CC2200), Black (#1A1A1A), White (#F0F0F0) branding
 * - Defensive design with $wSafely
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { BETA_VOICEBANKS } from 'public/projectData';
import { applyBetaTester } from 'backend/registrationService.jsw';
import { showToast, toastSuccess, toastError } from 'public/toast';
import { $wSafely, logStandard } from 'public/utils';

$w.onReady(function () {
  logStandard('VoicebankBetaPage', 'Beta page initializing', '', '', 'info');

  syncWixBetaHeadings();
  initBetaRepeater();
  initBetaApplicationForm();

  logStandard('VoicebankBetaPage', 'Beta page ready', '', '', 'info');
});

function syncWixBetaHeadings() {
  $wSafely('#Section1RegularTitle1', el => {
    el.text = 'VOICEBANK BETA TESTING HUB';
  });

  $wSafely('#Section1RegularLongtext1', el => {
    el.text = 'ศูนย์ทดสอบคลังเสียงรุ่นทดลอง DiffSinger และ UTAU Extended ของ DELTA SYNTH ก่อนเปิดตัวอย่างเป็นทางการ';
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
    el.text = 'ข้อกำหนดการทดสอบ: ห้ามเผยแพร่ไฟล์เสียงดิบก่อนได้รับอนุญาตจากทางสตูดิโอ';
  });
}

function initBetaRepeater() {
  $wSafely('#betaVoicebankRepeater', (repeater) => {
    repeater.data = BETA_VOICEBANKS.map(b => ({ _id: b.id, ...b }));

    repeater.onItemReady(($item, itemData) => {
      $item('#betaName').text = itemData.name;
      $item('#betaVersion').text = `เวอร์ชัน: ${itemData.version}`;
      $item('#betaEngine').text = `ระบบ: ${itemData.engine}`;
      $item('#betaStatus').text = itemData.status;
      $item('#betaUpdateDate').text = `อัปเดต: ${itemData.updateDate}`;
      $item('#betaChangelog').text = itemData.changelog;

      $item('#betaDownloadBtn').onClick(() => {
        if (itemData.downloadUrl && itemData.downloadUrl !== '#') {
          toastSuccess(`เปิดลิงก์ดาวน์โหลด BETA: ${itemData.name}`);
        } else {
          showToast({
            message: 'คลังเสียงนี้เปิดให้ทดสอบเฉพาะผู้ได้รับสิทธิ์',
            actionText: 'กรอกใบสมัครด้านล่าง',
            type: 'info'
          });
        }
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
        toastError('กรุณาระบุชื่อ-นามสกุล');
        return;
      }
      if (!email || !email.includes('@')) {
        toastError('กรุณาระบุอีเมลที่ถูกต้อง');
        return;
      }
      if (!dawOrEngine) {
        toastError('กรุณาระบุโปรแกรมที่ใช้งาน (เช่น OpenUtau)');
        return;
      }

      btn.label = 'กำลังส่งใบสมัคร...';

      try {
        const res = await applyBetaTester({
          voicebankId,
          fullName,
          email,
          dawOrEngine,
          experienceLevel
        });

        if (res.success) {
          toastSuccess(res.message, `รหัสใบสมัคร: ${res.applicationId}`);
          $wSafely('#betaFullNameInput', el => { el.value = ''; });
          $wSafely('#betaEmailInput', el => { el.value = ''; });
          $wSafely('#betaDawInput', el => { el.value = ''; });
        } else {
          toastError(res.message);
        }
      } catch (err) {
        logStandard('VoicebankBetaPage', 'Beta application error', err.message, 'Retry application', 'error');
        toastError('เกิดข้อผิดพลาดในการส่งข้อมูล');
      } finally {
        btn.label = 'ส่งใบสมัครทดสอบ BETA';
      }
    });
  });
}
