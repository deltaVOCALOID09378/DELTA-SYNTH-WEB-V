/**
 * DELTA SYNTH — Main / Home Page Script (Main.ggt15.js)
 * 
 * Synchronized with Wix Canvas & ggt15.d.ts:
 * - #Section1RegularTitle1: $w.Text (Hero Title)
 * - #Section1RegularLongtext1: $w.Text (Hero Subtitle)
 * - #Section1RegularButton1: $w.Button (Hero CTA Button)
 * - #text1, #text25, #text28, #text33, #text34, #text35, #text37, #text38, #text112, #text113: $w.Text
 * - #image3, #image4, #image5, #image7, #image9..#image35: $w.Image
 * 
 * Complies with AGENT.md:
 * - Red (#CC2200), Black (#1A1A1A), White (#F0F0F0) branding
 * - Defensive design with $wSafely
 * - Audio preview for featured singers
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { VOICEBANKS } from 'public/voicebankData';
import { PROJECTS, CHANGELOGS } from 'public/projectData';
import { globalAudioPlayer } from 'public/audioPlayer';
import { showToast, toastSuccess } from 'public/toast';
import { $wSafely, debounce, logStandard } from 'public/utils';

$w.onReady(function () {
  logStandard('MainPage', 'Home page initializing', '', '', 'info');

  syncWixHeroElements();
  syncWixNewsElements();
  syncWixSingerImages();
  initFeaturedSingers();

  logStandard('MainPage', 'Home page ready', '', '', 'info');
});

/**
 * Synchronize Native Wix Hero Section Elements
 */
function syncWixHeroElements() {
  $wSafely('#Section1RegularTitle1', (el) => {
    el.text = "WELCOME To our DELTA SYNTH's Studio Website";
  });

  $wSafely('#Section1RegularLongtext1', (el) => {
    el.text = 'We are the Professional singing for you all your passion.\nคลังเสียงสังเคราะห์ดิจิทัลภาษาไทยและสากลมาตรฐานสตูดิโอ';
  });

  $wSafely('#Section1RegularButton1', (btn) => {
    btn.label = 'เข้าสู่หน้ารวมนักร้อง (Enter Voicebank Hub)';
    btn.onClick(() => {
      toastSuccess('กำลังนำท่านเข้าสู่คลังเสียง DELTA SYNTH Hub');
    });
  });
}

/**
 * Synchronize News and Updates Content on Wix Canvas
 */
function syncWixNewsElements() {
  $wSafely('#text35', (el) => {
    el.text = 'NEWS activity and new VOICEBANK for fix and UPgrade in 2025-2026';
  });

  $wSafely('#text34', (el) => {
    el.text = 'โครงการยกระดับเสียงร้องสู่ DiffSinger AI รองรับ 7 ภาษา (ไทย, อังกฤษ, ญี่ปุ่น, จีน, เกาหลี, ฝรั่งเศส, สเปน) ร่วมกับพาร์ตเนอร์';
  });

  $wSafely('#text37', (el) => {
    el.text = 'More Projects & Downloads\nดาวน์โหลดไฟล์เพลง USTX, MIDI, SVP, VSQX และคลังเสียงนักร้องได้ฟรีทันที';
  });

  $wSafely('#text38', (el) => {
    el.text = 'Thank you for your support — By Mr. Delta';
  });
}

/**
 * Synchronize Singer Images on Canvas
 */
function syncWixSingerImages() {
  const sampleSingers = VOICEBANKS.slice(0, 8);
  const imageElementIds = ['#image3', '#image4', '#image5', '#image7', '#image9', '#image10', '#image11', '#image14'];

  imageElementIds.forEach((id, idx) => {
    if (sampleSingers[idx]) {
      $wSafely(id, (img) => {
        img.alt = sampleSingers[idx].name;
        img.tooltip = `${sampleSingers[idx].name} (${sampleSingers[idx].engine})`;
        img.onClick(() => {
          if (sampleSingers[idx].audioSample) {
            globalAudioPlayer.play(sampleSingers[idx].name, sampleSingers[idx].audioSample);
            showToast({
              message: `กำลังเล่นเสียงตัวอย่าง: ${sampleSingers[idx].name}`,
              actionText: 'หยุด',
              type: 'info',
              onAction: () => globalAudioPlayer.stop()
            });
          }
        });
      });
    }
  });
}

/**
 * Featured Singers Repeater (Dynamic Binding)
 */
function initFeaturedSingers() {
  const featured = VOICEBANKS.slice(0, 6);

  $wSafely('#featuredRepeater', (repeater) => {
    repeater.data = featured.map(v => ({ _id: v.id, ...v }));
    repeater.onItemReady(($item, itemData) => {
      $item('#singerImage').src = itemData.image || 'images/logo.png';
      $item('#singerName').text = itemData.name;
      $item('#singerNameTh').text = itemData.nameTh || '';
      $item('#singerEngine').text = itemData.engine;

      $item('#playDemoBtn').onClick(() => {
        if (itemData.audioSample) {
          globalAudioPlayer.play(itemData.name, itemData.audioSample);
        }
      });
    });
  });
}
