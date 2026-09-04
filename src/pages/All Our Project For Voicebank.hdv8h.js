/**
 * DELTA SYNTH — Voicebank Projects & Showcase Script (All Our Project For Voicebank.hdv8h.js)
 * 
 * Synchronized with Wix Canvas & Voicebank/Project Elements:
 * - Header: #Section1RegularTitle1, #Section4ListHeaderTitle1
 * - Dynamic Project & Voicebank Repeaters: #projectRepeater, #collabVoicebankRepeater
 * - Real-time audio preview with globalAudioPlayer
 * 
 * Standards from AGENT.md:
 * - Red (#CC2200), Black (#1A1A1A), White (#F0F0F0) branding
 * - Defensive design with $wSafely
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { VOICEBANKS, queryVoicebanks } from 'public/voicebankData';
import { PROJECTS } from 'public/projectData';
import { globalAudioPlayer } from 'public/audioPlayer';
import { showToast, toastInfo, toastSuccess, toastWarn } from 'public/toast';
import { $wSafely, debounce, logStandard } from 'public/utils';
import wixLocation from 'wix-location-frontend';

$w.onReady(function () {
  logStandard('VoicebankProjectsPage', 'Voicebank projects page initializing', '', '', 'info');

  syncPageHeaders();
  initProjectsSection();
  initCollabVoicebanks();
  initNativeVoicebankButtons();

  logStandard('VoicebankProjectsPage', 'Voicebank projects page ready', '', '', 'info');
});

function syncPageHeaders() {
  $wSafely('#Section1RegularTitle1', el => {
    el.text = 'VOICEBANK & AI ENGINE PROJECTS';
  });

  $wSafely('#Section4ListHeaderTitle1', el => {
    el.text = 'COLLABORATION & SPECIAL VOICEBANKS — DELTA SYNTH';
  });
}

function initProjectsSection() {
  $wSafely('#projectRepeater', (repeater) => {
    repeater.data = PROJECTS.map(p => ({ _id: p.id, ...p }));

    repeater.onItemReady(($item, itemData) => {
      $wSafely($item('#projectTitle'), el => { el.text = itemData.titleTh || itemData.title; });
      $wSafely($item('#projectCategory'), el => { el.text = `หมวดหมู่: ${itemData.category}`; });
      $wSafely($item('#projectStatus'), el => { el.text = `สถานะ: ${itemData.status}`; });
      $wSafely($item('#projectDate'), el => { el.text = `วันที่: ${itemData.date}`; });
      $wSafely($item('#projectDesc'), el => { el.text = itemData.description; });
      $wSafely($item('#projectLanguages'), el => { el.text = `ภาษา: ${itemData.languages.join(', ')}`; });

      $wSafely($item('#projectDetailsBtn'), btn => {
        btn.onClick(() => {
          if (itemData.link) {
            wixLocation.to(itemData.link);
          }
        });
      });
    });
  });
}

function initCollabVoicebanks() {
  const collabSingers = VOICEBANKS.filter(v => v.type === 'Collaboration' || v.type === 'Official DELTA');

  $wSafely('#collabVoicebankRepeater', (repeater) => {
    repeater.data = collabSingers.map(v => ({ _id: v.id, ...v }));

    repeater.onItemReady(($item, itemData) => {
      $wSafely($item('#collabSingerImage'), el => {
        el.src = itemData.image || itemData.imageFull || 'images/logo.png';
        el.alt = itemData.name;
      });

      $wSafely($item('#collabSingerName'), el => { el.text = itemData.name; });
      $wSafely($item('#collabSingerNameTh'), el => { el.text = itemData.nameTh || ''; });
      $wSafely($item('#collabSingerVoicer'), el => { el.text = `ผู้ให้เสียง / พาร์ตเนอร์: ${itemData.voicer}`; });
      $wSafely($item('#collabSingerGenre'), el => { el.text = `แนวเพลง: ${itemData.genre}`; });

      $wSafely($item('#collabPlayBtn'), btn => {
        btn.onClick(() => {
          playSingerAudio(itemData);
        });
      });

      $wSafely($item('#collabDownloadBtn'), btn => {
        btn.onClick(() => {
          if (itemData.downloadUrl && itemData.downloadUrl !== '#') {
            wixLocation.to(itemData.downloadUrl);
          } else {
            showToast({ message: `คลังเสียง ${itemData.name} อยู่ระหว่างเตรียมไฟล์ดาวน์โหลด`, type: 'info' });
          }
        });
      });
    });
  });
}

function initNativeVoicebankButtons() {
  const collabButtons = [
    '#button217', '#button218', '#button219', '#button220',
    '#button243', '#button244', '#button245', '#button246',
    '#button248', '#button249', '#button250',
    '#button251', '#button252', '#button253'
  ];

  const collabSingers = VOICEBANKS.filter(v => v.type === 'Collaboration');
  if (collabSingers.length === 0) return;

  collabButtons.forEach((btnId, idx) => {
    $wSafely(btnId, (btn) => {
      const singer = collabSingers[idx % collabSingers.length];
      btn.onClick(() => {
        playSingerAudio(singer);
      });
    });
  });
}

function playSingerAudio(singer) {
  if (!singer || !singer.audioSample) {
    showToast({
      message: `ไม่พบไฟล์เสียงตัวอย่างของ ${singer?.name || 'ตัวละครนี้'}`,
      type: 'warn'
    });
    return;
  }

  globalAudioPlayer.play(singer.name, singer.audioSample);
  showToast({
    message: `กำลังเล่นเสียงตัวอย่าง: ${singer.name}`,
    actionText: 'หยุด',
    type: 'info',
    onAction: () => globalAudioPlayer.stop()
  });
}