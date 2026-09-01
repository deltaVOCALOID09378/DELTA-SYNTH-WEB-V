/**
 * DELTA SYNTH — Contact Page Script (Contact.kcdii.js)
 * 
 * Synchronized with Wix Canvas & kcdii.d.ts:
 * - Headings: #Section1RegularTitle1, #Section1RegularLongtext1
 * - Information labels: #text1..#text6
 * - Contact Form: #input1 (Name), #input2 (Email), #input3 (Subject), #textBox1 (Message), #button1 (Submit), #text7 (Status)
 * 
 * Standards from AGENT.md:
 * - Red (#CC2200), Black (#1A1A1A), White (#F0F0F0) branding
 * - Defensive design with $wSafely & Server Web Module
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { submitContactMessage } from 'backend/contactService.jsw';
import { showToast, toastSuccess, toastError, toastInfo } from 'public/toast';
import { $wSafely, logStandard } from 'public/utils';

$w.onReady(function () {
  logStandard('ContactPage', 'Contact page initializing', '', '', 'info');

  syncWixContactHeadings();
  initWixContactForm();

  logStandard('ContactPage', 'Contact page ready', '', '', 'info');
});

function syncWixContactHeadings() {
  $wSafely('#Section1RegularTitle1', (el) => {
    el.text = 'CONTACT US — DELTA SYNTH STUDIO';
  });

  $wSafely('#Section1RegularLongtext1', (el) => {
    el.text = 'ติดต่อสอบถามข้อมูลคลังเสียง ส่งข้อเสนอแนะ แจ้งปัญหาการใช้งาน หรือติดต่อความร่วมมือสร้างสรรค์ผลงานเพลง';
  });

  $wSafely('#text1', (el) => { el.text = 'อีเมลติดต่อหลัก (Official Gmail):'; });
  $wSafely('#text2', (el) => { el.text = 'delta.vocaloid09378@gmail.com'; });
  $wSafely('#text3', (el) => { el.text = 'เวลาตอบกลับโดยประมาณ: ภายใน 24–48 ชั่วโมง'; });
  $wSafely('#text4', (el) => { el.text = 'YouTube & Social: DELTA SYNTH Official (@deltaSYNTH0320)'; });
  $wSafely('#text5', (el) => { el.text = 'การนำไปใช้ในผลงาน: กรุณาใส่เครดิต DELTA SYNTH และชื่อผู้ให้เสียงในคำอธิบายผลงานเสมอ'; });
  $wSafely('#text6', (el) => { el.text = 'กรอกข้อมูลในแบบฟอร์มด้านล่างเพื่อส่งข้อความถึงทีมงานผู้พัฒนาโดยตรง'; });
}

function initWixContactForm() {
  let isSending = false;

  $wSafely('#button1', (btn) => {
    btn.label = 'ส่งข้อความ (Submit Message)';

    btn.onClick(async () => {
      if (isSending) return;

      let name = '';
      let email = '';
      let subject = '';
      let message = '';

      $wSafely('#input1', el => { name = (el.value || '').trim(); });
      $wSafely('#input2', el => { email = (el.value || '').trim(); });
      $wSafely('#input3', el => { subject = (el.value || '').trim(); });
      $wSafely('#textBox1', el => { message = (el.value || '').trim(); });

      // ตรวจสอบข้อมูลนำเข้า
      if (!name || name.length < 2) {
        setStatusMessage('กรุณากรอกชื่อของคุณอย่างน้อย 2 ตัวอักษร', 'error');
        toastError('กรุณากรอกชื่อของคุณ');
        return;
      }
      if (!email || !email.includes('@')) {
        setStatusMessage('กรุณากรอกที่อยู่อีเมลที่ถูกต้อง', 'error');
        toastError('กรุณากรอกอีเมลที่ถูกต้อง');
        return;
      }
      if (!subject || subject.length < 3) {
        setStatusMessage('กรุณากรอกหัวข้อข้อความ', 'error');
        toastError('กรุณากรอกหัวข้อข้อความ');
        return;
      }
      if (!message || message.length < 10) {
        setStatusMessage('กรุณากรอกรายละเอียดข้อความอย่างน้อย 10 ตัวอักษร', 'error');
        toastError('ข้อความสั้นเกินไป');
        return;
      }

      isSending = true;
      btn.disable();
      btn.label = 'กำลังส่งข้อความ...';
      setStatusMessage('กำลังส่งข้อความถึงทีมงาน...', 'info');

      try {
        const result = await submitContactMessage({
          name,
          email,
          subject,
          category: 'General',
          message
        });

        if (result && result.success) {
          setStatusMessage(`ส่งข้อความสำเร็จเรียบร้อย! (Ticket ID: ${result.ticketId || 'CONTACT-OK'})`, 'success');
          toastSuccess(result.message || 'ส่งข้อความสำเร็จ', `Ticket ID: ${result.ticketId}`);

          // ล้างข้อมูลในฟอร์ม
          $wSafely('#input1', el => { el.value = ''; });
          $wSafely('#input2', el => { el.value = ''; });
          $wSafely('#input3', el => { el.value = ''; });
          $wSafely('#textBox1', el => { el.value = ''; });
        } else {
          setStatusMessage(result?.message || 'เกิดข้อผิดพลาดในการส่งข้อความ', 'error');
          toastError(result?.message || 'ไม่สามารถส่งข้อความได้');
        }
      } catch (err) {
        logStandard('ContactPage', 'Submit contact form error', err.message, '', 'error');
        setStatusMessage('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', 'error');
        toastError('ไม่สามารถส่งข้อความได้ในขณะนี้');
      } finally {
        isSending = false;
        btn.enable();
        btn.label = 'ส่งข้อความ (Submit Message)';
      }
    });
  });
}

function setStatusMessage(msg, type = 'info') {
  $wSafely('#text7', (el) => {
    el.text = msg;
    el.show();
  });
}