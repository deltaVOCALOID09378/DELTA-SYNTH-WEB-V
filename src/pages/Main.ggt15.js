/**
 * DELTA SYNTH — Main / Home Page Script (Main.ggt15.js)
 * 
 * Synchronized with Wix Canvas & ggt15.d.ts:
 * - Hero Section: #Section1RegularTitle1, #Section1RegularLongtext1, #Section1RegularButton1
 * - News & Text: #text1, #text25, #text28, #text33, #text34, #text35, #text37, #text38, #text112, #text113
 * - Native Singer Images: #image3..#image35 (Click-to-preview audio)
 * - Dynamic Featured Repeater: #featuredRepeater
 * 
 * Standards from AGENT.md:
 * - Red (#CC2200), Black (#1A1A1A), White (#F0F0F0) branding
 * - Defensive design with $wSafely
 * - Seamless audio preview integration with globalAudioPlayer
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { VOICEBANKS } from 'public/voicebankData';
import { PROJECTS, CHANGELOGS } from 'public/projectData';
import { globalAudioPlayer } from 'public/audioPlayer';
import { showToast, toastSuccess } from 'public/toast';
import { $wSafely, debounce, logStandard } from 'public/utils';
import wixLocation from 'wix-location-frontend';

$w.onReady(function () {
  logStandard('MainPage', 'DELTA SYNTH Home page initializing', '', '', 'info');

  syncWixHeroElements();
  syncWixNewsElements();
  syncWixSingerImages();
  initFeaturedSingers();

  logStandard('MainPage', 'DELTA SYNTH Home page ready', '', '', 'info');
});

function syncWixHeroElements() {
  $wSafely('#Section1RegularTitle1', (el) => {
    el.text = "WELCOME TO DELTA SYNTH STUDIO";
  });

  $wSafely('#Section1RegularLongtext1', (el) => {
    el.text = 'We are the Professional singing for all your passion.\nคลังเสียงสังเคราะห์ดิจิทัลภาษาไทยและสากลมาตรฐานสตูดิโอ';
  });

  $wSafely('#Section1RegularButton1', (btn) => {
    btn.label = 'เข้าสู่หน้ารวมนักร้อง (Voicebank Hub)';
    btn.onClick(() => {
      wixLocation.to('/blank'); // หรือ URL หน้า Voicebank หลัก
    });
  });
}

function syncWixNewsElements() {
  $wSafely('#text35', (el) => {
    el.text = 'NEWS & ACTIVITIES: Voicebank Upgrades & DiffSinger AI (2026)';
  });

  $wSafely('#text34', (el) => {
    el.text = 'โครงการยกระดับเสียงร้องสู่ DiffSinger AI รองรับ 7 ภาษา (ไทย, อังกฤษ, ญี่ปุ่น, จีน, เกาหลี, ฝรั่งเศส, สเปน) พร้อมโฟนีไมเซอร์ภาษาไทยรุ่นใหม่';
  });

  $wSafely('#text37', (el) => {
    el.text = 'Music Project Files & Downloads\nดาวน์โหลดไฟล์เพลง USTX, MIDI, SVP, VSQX และคลังเสียงนักร้องได้ฟรีทันที';
  });

  $wSafely('#text38', (el) => {
    el.text = 'Thank you for your support — By Mr. Delta';
  });
}

function syncWixSingerImages() {
  const sampleSingers = VOICEBANKS.slice(0, 8);
  const imageElementIds = ['#image3', '#image4', '#image5', '#image7', '#image9', '#image10', '#image11', '#image14'];

  imageElementIds.forEach((id, idx) => {
    if (sampleSingers[idx]) {
      const singer = sampleSingers[idx];
      $wSafely(id, (img) => {
        img.alt = singer.name;
        img.tooltip = `${singer.name} (${singer.engine}) - คลิกเพื่อฟังเสียงตัวอย่าง`;
        img.onClick(() => {
          if (singer.audioSample) {
            globalAudioPlayer.play(singer.name, singer.audioSample);
            showToast({
              message: `กำลังเล่นเสียงตัวอย่าง: ${singer.name}`,
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

function initFeaturedSingers() {
  const featured = VOICEBANKS.slice(0, 6);

  $wSafely('#featuredRepeater', (repeater) => {
    repeater.data = featured.map(v => ({ _id: v.id, ...v }));
    repeater.onItemReady(($item, itemData) => {
      $wSafely($item('#singerImage'), el => {
        el.src = itemData.image || 'images/logo.png';
        el.alt = itemData.name;
      });

      $wSafely($item('#singerName'), el => { el.text = itemData.name; });
      $wSafely($item('#singerNameTh'), el => { el.text = itemData.nameTh || ''; });
      $wSafely($item('#singerEngine'), el => { el.text = itemData.engine; });

      $wSafely($item('#playDemoBtn'), btn => {
        btn.onClick(() => {
          if (itemData.audioSample) {
            globalAudioPlayer.play(itemData.name, itemData.audioSample);
            showToast({
              message: `กำลังเล่นเสียงตัวอย่าง: ${itemData.name}`,
              actionText: 'หยุด',
              type: 'info',
              onAction: () => globalAudioPlayer.stop()
            });
          }
        });
      });
    });
  });
}