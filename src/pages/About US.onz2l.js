/**
 * DELTA SYNTH — About Us Page Script (About US.onz2l.js)
 * 
 * Synchronized with Wix Canvas & onz2l.d.ts:
 * - #Section1RegularTitle1: $w.Text (Header Title)
 * - #Section1RegularSubtitle1: $w.Text (Subtitle)
 * - #Section2RegularTitle1: $w.Text (Vision Title)
 * - #Section2RegularLongtext1: $w.Text (Vision Description)
 * - #image1, #image2, #image3, #image4, #image5: $w.Image (Founders Artworks)
 * - #text25, #text26: $w.Text
 * 
 * Complies with AGENT.md:
 * - Red (#CC2200), Black (#1A1A1A), White (#F0F0F0) branding
 * - Defensive design with $wSafely
 * - Traceable logging with logStandard
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { showToast } from 'public/toast';
import { $wSafely, logStandard } from 'public/utils';

const FOUNDERS = [
  { name: 'Ayanami Hikaru (อายานามิ ฮิคารุ)', role: 'Lead Virtual Vocalist & System Representative' },
  { name: 'SUN (ซัน)', role: 'Acoustic Tuning & Envelope Specialist' },
  { name: 'Kochujang (โคชูจัง)', role: 'Visual Art & Creative Direction' },
  { name: 'Guren Kani (กุเร็น คานิ)', role: 'Phoneme Timing & Quality Assurance' },
  { name: 'Thitiya Anantanetr (ทิติยา อนันตเนตร)', role: 'Linguistic & Phonemizer Consultant' }
];

$w.onReady(function () {
  logStandard('AboutPage', 'About Us page initializing', '', '', 'info');

  syncWixAboutElements();
  syncWixFoundersImages();

  logStandard('AboutPage', 'About Us page ready', '', '', 'info');
});

/**
 * Synchronize Native Wix About Us Elements
 */
function syncWixAboutElements() {
  $wSafely('#Section1RegularTitle1', (el) => {
    el.text = 'ABOUT US — DELTA SYNTH';
  });

  $wSafely('#Section1RegularSubtitle1', (el) => {
    el.text = 'สตูดิโอผู้พัฒนาเสียงร้องสังเคราะห์เสมือนจริงภาษาไทยและสากลกว่า 54 นักร้อง';
  });

  $wSafely('#Section2RegularTitle1', (el) => {
    el.text = 'Our Vision & Mission (วิสัยทัศน์และพันธกิจ)';
  });

  $wSafely('#Section2RegularLongtext1', (el) => {
    el.text = 'มุ่งมั่นสร้างสรรค์และยกระดับคลังเสียงดิจิทัลภาษาไทยให้มีคุณภาพเสียงระดับมืออาชีพ รองรับ OpenUtau, UTAU และ DiffSinger AI พร้อมส่งเสริมคอมมูนิตี้ครีเอเตอร์เพลงอิสระให้เข้าถึงทรัพยากรคุณภาพได้ฟรี 100%';
  });

  $wSafely('#text25', (el) => {
    el.text = 'ทีมงานและผู้ร่วมก่อตั้งสตูดิโอ DELTA SYNTH';
  });

  $wSafely('#text26', (el) => {
    el.text = 'ขอขอบคุณทุกแรงสนับสนุนจากคอมมูนิตี้และพาร์ตเนอร์ทุกท่าน ที่ร่วมเดินทางและสร้างสรรค์ผลงานเพลงร่วมกับเราตลอดมา';
  });
}

/**
 * Synchronize Founder Portrait Images on Wix Canvas
 */
function syncWixFoundersImages() {
  const imageIds = ['#image1', '#image2', '#image3', '#image4', '#image5'];
  
  imageIds.forEach((id, idx) => {
    const founder = FOUNDERS[idx];
    if (!founder) return;

    $wSafely(id, (img) => {
      img.alt = founder.name;
      img.tooltip = `${founder.name}\n${founder.role}`;
      
      img.onClick(() => {
        showToast({
          message: founder.name,
          actionText: founder.role,
          type: 'info'
        });
      });
    });
  });
}