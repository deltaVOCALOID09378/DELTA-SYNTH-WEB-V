/**
 * DELTA SYNTH — File Sharing Center Page Script (File Share.ze9bp.js)
 * 
 * Standards from AGENT.md:
 * - Red (#CC2200), Black (#1A1A1A), White (#F0F0F0) branding
 * - Defensive design with $wSafely
 * - Community resource contribution & guidelines
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { showToast, toastSuccess, toastError } from 'public/toast';
import { $wSafely, logStandard } from 'public/utils';

$w.onReady(function () {
  logStandard('FileSharePage', 'File share page initializing', '', '', 'info');

  initShareForm();

  logStandard('FileSharePage', 'File share page ready', '', '', 'info');
});

function initShareForm() {
  $wSafely('#btnSubmitFileShare', (btn) => {
    btn.onClick(() => {
      let contributor = '';
      let fileTitle = '';
      let format = 'USTX';
      let fileUrl = '';
      let isTermsChecked = false;

      $wSafely('#shareContributorInput', el => { contributor = (el.value || '').trim(); });
      $wSafely('#shareTitleInput', el => { fileTitle = (el.value || '').trim(); });
      $wSafely('#shareFormatDropdown', el => { format = el.value || 'USTX'; });
      $wSafely('#shareUrlInput', el => { fileUrl = (el.value || '').trim(); });
      $wSafely('#shareTermsCheckbox', el => { isTermsChecked = !!el.checked; });

      if (!contributor || contributor.length < 2) {
        toastError('กรุณาระบุชื่อผู้แบ่งปันไฟล์');
        return;
      }
      if (!fileTitle || fileTitle.length < 2) {
        toastError('กรุณาระบุชื่อเพลงหรือชื่อไฟล์');
        return;
      }
      if (!fileUrl || !fileUrl.startsWith('http')) {
        toastError('กรุณาระบุลิงก์ดาวน์โหลดที่ถูกต้อง', 'เช่น Google Drive หรือ Dropbox');
        return;
      }
      if (!isTermsChecked) {
        toastError('กรุณายินยอมตามข้อตกลงการแบ่งปันไฟล์');
        return;
      }

      toastSuccess('ส่งข้อมูลไฟล์เรียบร้อยแล้ว!', 'ทีมงานจะตรวจสอบและนำขึ้นระบบคลังไฟล์');

      // Reset form
      $wSafely('#shareContributorInput', el => { el.value = ''; });
      $wSafely('#shareTitleInput', el => { el.value = ''; });
      $wSafely('#shareUrlInput', el => { el.value = ''; });
      $wSafely('#shareTermsCheckbox', el => { el.checked = false; });
    });
  });
}
