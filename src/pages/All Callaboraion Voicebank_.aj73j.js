/**
 * DELTA SYNTH — Collaboration Voicebanks Page Script (All Callaboraion Voicebank_.aj73j.js)
 * 
 * Synchronized with Wix Canvas & aj73j.d.ts:
 * - Native Wix header & text elements (#Section4ListHeaderTitle1, #text128..#text149)
 * - Native ColumnStrips (#columnStrip26, #columnStrip31, #columnStrip32, #columnStrip33)
 * - Native buttons (#button217..#button253) & video players (#videoPlayer26..#videoPlayer33)
 * - Dynamic collaboration repeater and real-time audio demo preview
 * 
 * Standards from AGENT.md:
 * - Red (#CC2200), Black (#1A1A1A), White (#F0F0F0) branding
 * - Defensive design with $wSafely
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { VOICEBANKS, queryVoicebanks } from 'public/voicebankData';
import { globalAudioPlayer } from 'public/audioPlayer';
import { showToast, toastInfo } from 'public/toast';
import { $wSafely, debounce, logStandard } from 'public/utils';
import wixLocation from 'wix-location-frontend';

$w.onReady(function () {
  logStandard('CollabVoicebankPage', 'Collaboration page initializing', '', '', 'info');

  syncWixCollabHeader();
  syncNativeCollabColumns();
  initCollabVoicebankRepeater();

  logStandard('CollabVoicebankPage', 'Collaboration page ready', '', '', 'info');
});

// =========================================================================
// 1. ซิงโครไนซ์หัวข้อหลักประจำหน้า (Header Title)
// =========================================================================

function syncWixCollabHeader() {
  $wSafely('#Section4ListHeaderTitle1', (el) => {
    el.text = 'COLLABORATION VOICEBANKS — DELTA SYNTH';
  });
}

// =========================================================================
// 2. ซิงโครไนซ์องค์ประกอบ Native Wix Canvas (4 คอลัมน์พาร์ตเนอร์หลัก)
// =========================================================================

function syncNativeCollabColumns() {
  const collabSingers = VOICEBANKS.filter(v => v.type === 'Collaboration');

  // ตารางผูกความสัมพันธ์ของ Native Elements แต่ละคอลัมน์บน Canvas
  const columnConfigs = [
    // Column 1: Shiroino Mochi (columnStrip26 / column30)
    {
      idMatch: 'shiroino_mochi',
      fallbackIdx: 0,
      title: '#text128',
      subtitle: '#text130',
      description: '#text131',
      image: '#image26',
      video: '#videoPlayer26',
      btnPlay: '#button217',
      btnDownload: '#button218',
      btnDetails: '#button219',
      btnTerms: '#button220'
    },
    // Column 2: Quint (columnStrip31 / column35)
    {
      idMatch: 'quint',
      fallbackIdx: 1,
      title: '#text140',
      subtitle: '#text141',
      description: '#text143',
      image: '#image31',
      video: '#videoPlayer31',
      btnPlay: '#button243',
      btnDownload: '#button244',
      btnDetails: '#button245',
      btnTerms: '#button246'
    },
    // Column 3: Felix (columnStrip32 / column36)
    {
      idMatch: 'felix',
      fallbackIdx: 2,
      title: '#text144',
      subtitle: '#text145',
      description: '#text146',
      image: '#image32',
      video: '#videoPlayer32',
      btnPlay: '#button248',
      btnDownload: '#button249',
      btnDetails: '#button250',
      btnTerms: null
    },
    // Column 4: Ibara Kouya (columnStrip33 / column37)
    {
      idMatch: 'ibara_kouya',
      fallbackIdx: 3,
      title: '#text147',
      subtitle: '#text148',
      description: '#text149',
      image: '#image33',
      video: '#videoPlayer33',
      btnPlay: '#button251',
      btnDownload: '#button252',
      btnDetails: '#button253',
      btnTerms: null
    }
  ];

  columnConfigs.forEach((cfg) => {
    // ค้นหานักร้องตาม ID หรือใช้ Index สำรอง
    const singer = collabSingers.find(v => v.id.toLowerCase().includes(cfg.idMatch)) ||
                   collabSingers[cfg.fallbackIdx % collabSingers.length];

    if (!singer) return;

    // 1. ข้อมูลข้อความ (ชื่อ, พาร์ตเนอร์/ประเภท, คำอธิบาย)
    $wSafely(cfg.title, el => { el.text = singer.name; });
    $wSafely(cfg.subtitle, el => { el.text = `พาร์ตเนอร์: ${singer.voicer || 'DELTA Partner Team'} • ${singer.genre || 'Vocaloid/UTAU'}`; });
    $wSafely(cfg.description, el => { el.text = singer.description || 'คลังเสียงความร่วมมือพิเศษเพื่อขยายขอบเขตเสียงร้องสังเคราะห์ไทย'; });

    // 2. ภาพประจำตัวนักร้อง
    $wSafely(cfg.image, el => {
      if (singer.imageFull || singer.image) {
        el.src = singer.imageFull || singer.image;
        el.alt = singer.name;
      }
    });

    // 3. วิดีโอเดโม (ถ้ามี)
    $wSafely(cfg.video, el => {
      if (singer.videoDemoUrl || singer.youtubeUrl) {
        el.src = singer.videoDemoUrl || singer.youtubeUrl;
        el.show();
      }
    });

    // 4. ปุ่มเล่นเสียงตัวอย่าง (Play Sample)
    $wSafely(cfg.btnPlay, btn => {
      btn.label = 'ฟังเสียงตัวอย่าง';
      btn.onClick(() => {
        if (singer.audioSample) {
          globalAudioPlayer.play(singer.name, singer.audioSample);
          showToast({
            message: `กำลังเล่นเสียงตัวอย่าง: ${singer.name}`,
            actionText: 'หยุด',
            type: 'info',
            onAction: () => globalAudioPlayer.stop()
          });
        } else {
          showToast({ message: `ยังไม่มีไฟล์เสียงตัวอย่างสำหรับ ${singer.name}`, type: 'warn' });
        }
      });
    });

    // 5. ปุ่มดาวน์โหลดคลังเสียง (Download Voicebank)
    $wSafely(cfg.btnDownload, btn => {
      btn.label = 'ดาวน์โหลดคลังเสียง';
      btn.onClick(() => {
        if (singer.downloadUrl && singer.downloadUrl !== '#') {
          wixLocation.to(singer.downloadUrl);
        } else {
          showToast({ message: `คลังเสียง ${singer.name} อยู่ระหว่างเตรียมไฟล์ดาวน์โหลด`, type: 'info' });
        }
      });
    });

    // 6. ปุ่มดูรายละเอียดโปรไฟล์ (View Profile)
    $wSafely(cfg.btnDetails, btn => {
      btn.label = 'รายละเอียดโปรไฟล์';
      btn.onClick(() => {
        if (singer.detailUrl) {
          wixLocation.to(singer.detailUrl);
        }
      });
    });

    // 7. ปุ่มเงื่อนไขการใช้งาน (Terms & License)
    if (cfg.btnTerms) {
      $wSafely(cfg.btnTerms, btn => {
        btn.label = 'เงื่อนไขการใช้งาน';
        btn.onClick(() => {
          showToast({
            message: `${singer.name}: โปรดตรวจสอบลิขสิทธิ์และข้อตกลงของทีมพาร์ตเนอร์ก่อนนำไปใช้เชิงพาณิชย์`,
            type: 'info'
          });
        });
      });
    }
  });
}

// =========================================================================
// 3. ซิงโครไนซ์ Dynamic Repeater (สำหรับส่วนจัดแสดงแบบ Dynamic Card)
// =========================================================================

function initCollabVoicebankRepeater() {
  const collabSingers = VOICEBANKS.filter(v => v.type === 'Collaboration');

  $wSafely('#collabVoicebankRepeater', (repeater) => {
    repeater.data = collabSingers.map(v => ({ _id: v.id, ...v }));

    repeater.onItemReady(($item, itemData) => {
      $wSafely($item('#collabSingerImage'), el => {
        el.src = itemData.image || itemData.imageFull || 'images/logo.png';
        el.alt = itemData.name;
      });

      $wSafely($item('#collabSingerName'), el => { el.text = itemData.name; });
      $wSafely($item('#collabSingerNameTh'), el => { el.text = itemData.nameTh || ''; });
      $wSafely($item('#collabSingerVoicer'), el => { el.text = `พาร์ตเนอร์: ${itemData.voicer}`; });
      $wSafely($item('#collabSingerGenre'), el => { el.text = `แนวเพลง: ${itemData.genre}`; });
      $wSafely($item('#collabSingerLang'), el => { el.text = `ภาษา: ${itemData.language || 'Thai / JP / EN'}`; });

      $wSafely($item('#collabPlayBtn'), btn => {
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

      $wSafely($item('#collabDownloadBtn'), btn => {
        btn.onClick(() => {
          if (itemData.downloadUrl && itemData.downloadUrl !== '#') {
            wixLocation.to(itemData.downloadUrl);
          }
        });
      });
    });
  });
}