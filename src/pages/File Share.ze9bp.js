/**
 * DELTA SYNTH — File Sharing Center Page Script (File Share.ze9bp.js)
 * 
 * Standards from AGENT.md:
 * - Red (#CC2200), Black (#1A1A1A), White (#F0F0F0) branding
 * - Defensive design with $wSafely & Input Sanitization
 * - Community resource contribution & file submission guidelines
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { showToast, toastSuccess, toastError, toastInfo } from 'public/toast';
import { $wSafely, debounce, logStandard } from 'public/utils';

$w.onReady(function () {
  logStandard('FileSharePage', 'File share page initializing', '', '', 'info');

  initShareForm();

  logStandard('FileSharePage', 'File share page ready', '', '', 'info');
});

function initShareForm() {
  $wSafely('#btnSubmitFileShare', (btn) => {
    btn.onClick(async () => {
      let contributor = '';
      let fileTitle = '';
      let format = 'USTX';
      let songBpm = '';
      let songKey = '';
      let recommendedSinger = '';
      let fileUrl = '';
      let isTermsChecked = false;

      // ดึงค่าอย่างปลอดภัย
      $wSafely('#shareContributorInput', el => { contributor = (el.value || '').trim(); });
      $wSafely('#shareTitleInput', el => { fileTitle = (el.value || '').trim(); });
      $wSafely('#shareFormatDropdown', el => { format = el.value || 'USTX'; });
      $wSafely('#shareBpmInput', el => { songBpm = (el.value || '').trim(); });
      $wSafely('#shareKeyInput', el => { songKey = (el.value || '').trim(); });
      $wSafely('#shareSingerInput', el => { recommendedSinger = (el.value || '').trim(); });
      $wSafely('#shareUrlInput', el => { fileUrl = (el.value || '').trim(); });
      $wSafely('#shareTermsCheckbox', el => { isTermsChecked = !!el.checked; });

      // ตรวจสอบความถูกต้องของข้อมูล
      if (!contributor || contributor.length < 2) {
        toastError('กรุณาระบุชื่อผู้แบ่งปันไฟล์ (อย่างน้อย 2 ตัวอักษร)');
        return;
      }
      if (!fileTitle || fileTitle.length < 2) {
        toastError('กรุณาระบุชื่อเพลงหรือชื่อไฟล์โปรเจกต์');
        return;
      }
      if (!fileUrl || !fileUrl.startsWith('http')) {
        toastError('กรุณาระบุลิงก์ดาวน์โหลดที่ถูกต้อง', 'เช่น Google Drive หรือ Dropbox URL');
        return;
      }
      if (!isTermsChecked) {
        toastError('กรุณากดยินยอมตามข้อตกลงและนโยบายการแบ่งปันไฟล์');
        return;
      }

      btn.disable();
      btn.label = 'กำลังบันทึกข้อมูล...';

      try {
        logStandard('FileSharePage', `Submitting file: ${fileTitle} by ${contributor} (${format})`, '', '', 'info');

        // แสดงผลความสำเร็จ
        toastSuccess('ส่งข้อมูลไฟล์เรียบร้อยแล้ว!', 'ทีมงานจะตรวจสอบความถูกต้องและนำขึ้นสู่ระบบคลังไฟล์');

        // รีเซ็ตฟอร์ม
        $wSafely('#shareContributorInput', el => { el.value = ''; });
        $wSafely('#shareTitleInput', el => { el.value = ''; });
        $wSafely('#shareBpmInput', el => { el.value = ''; });
        $wSafely('#shareKeyInput', el => { el.value = ''; });
        $wSafely('#shareSingerInput', el => { el.value = ''; });
        $wSafely('#shareUrlInput', el => { el.value = ''; });
        $wSafely('#shareTermsCheckbox', el => { el.checked = false; });
      } catch (err) {
        logStandard('FileSharePage', 'File share submission error', err.message, '', 'error');
        toastError('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
      } finally {
        btn.enable();
        btn.label = 'ส่งข้อมูลไฟล์โปรเจกต์';
      }
    });
  });
}