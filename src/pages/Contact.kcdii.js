/**
 * DELTA SYNTH — Contact Page Script (Contact.kcdii.js)
 * 
 * Synchronized with Wix Canvas & kcdii.d.ts:
 * - #Section1RegularTitle1: $w.Text (Title)
 * - #Section1RegularLongtext1: $w.Text (Description)
 * - #form2: $w.Form (Contact Form Container)
 * - #input1: $w.TextInput (Full Name)
 * - #input2: $w.TextInput (Email Address)
 * - #input3: $w.TextInput (Subject)
 * - #textBox1: $w.TextBox (Message)
 * - #button1: $w.Button (Submit Button)
 * - #text7: $w.Text (Response / Status Label)
 * - #text1..#text6: $w.Text (Contact Info & FAQ)
 * 
 * Complies with AGENT.md:
 * - Red (#CC2200), Black (#1A1A1A), White (#F0F0F0) branding
 * - Defensive design with $wSafely
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { submitContactMessage } from 'backend/contactService.jsw';
import { showToast, toastSuccess, toastError } from 'public/toast';
import { $wSafely, logStandard } from 'public/utils';

$w.onReady(function () {
  logStandard('ContactPage', 'Contact page initializing', '', '', 'info');

  syncWixContactHeadings();
  initWixContactForm();

  logStandard('ContactPage', 'Contact page ready', '', '', 'info');
});

/**
 * Synchronize Contact Page Headings and Info Labels
 */
function syncWixContactHeadings() {
  $wSafely('#Section1RegularTitle1', (el) => {
    el.text = 'CONTACT US — DELTA SYNTH';
  });

  $wSafely('#Section1RegularLongtext1', (el) => {
    el.text = 'ส่งข้อความถึงทีมงาน DELTA SYNTH สำหรับการสอบถามทั่วไป ความร่วมมือ หรือแจ้งปัญหาการใช้งาน';
  });

  $wSafely('#text1', (el) => { el.text = 'อีเมลติดต่อหลัก (Official Email):'; });
  $wSafely('#text2', (el) => { el.text = 'delta.vocaloid09378@gmail.com'; });
  $wSafely('#text3', (el) => { el.text = 'เวลาทำการและการตอบกลับ: ภายใน 24-48 ชั่วโมง'; });
  $wSafely('#text4', (el) => { el.text = 'Official Discord & Social Media: DELTA SYNTH Studio'; });
  $wSafely('#text5', (el) => { el.text = 'การนำไปใช้เชิงพาณิชย์: กรุณาใส่เครดิต DELTA SYNTH ในผลงานเสมอ'; });
  $wSafely('#text6', (el) => { el.text = 'กรอกแบบฟอร์มด้านล่างเพื่อส่งข้อความถึงทีมงานโดยตรง'; });
}

/**
 * Initialize Native Wix Contact Form (#input1, #input2, #input3, #textBox1, #button1, #text7)
 */
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

      // Client-side validation
      if (!name || name.length < 2) {
        setStatusMessage('กรุณากรอกชื่อของคุณอย่างน้อย 2 ตัวอักษร', 'error');
        toastError('กรุณากรอกชื่อของคุณ');
        return;
      }
      if (!email || !email.includes('@')) {
        setStatusMessage('กรุณากรอกอีเมลที่ถูกต้อง', 'error');
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
      btn.label = 'กำลังส่งข้อความ...';
      setStatusMessage('กำลังบันทึกและส่งข้อมูล...', 'info');

      try {
        const result = await submitContactMessage({
          name,
          email,
          subject,
          category: 'General',
          message
        });

        if (result.success) {
          setStatusMessage(`ส่งข้อความสำเร็จ! (Ticket ID: ${result.ticketId})`, 'success');
          toastSuccess(result.message, `Ticket ID: ${result.ticketId}`);

          // Reset inputs
          $wSafely('#input1', el => { el.value = ''; });
          $wSafely('#input2', el => { email = ''; el.value = ''; });
          $wSafely('#input3', el => { el.value = ''; });
          $wSafely('#textBox1', el => { el.value = ''; });
        } else {
          setStatusMessage(result.message, 'error');
          toastError(result.message);
        }
      } catch (err) {
        logStandard('ContactPage', 'Submit contact form', err.message, 'Retry submission', 'error');
        setStatusMessage('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', 'error');
        toastError('ไม่สามารถส่งข้อความได้ในขณะนี้');
      } finally {
        isSending = false;
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
