/**
 * DELTA SYNTH — Collaboration Voicebanks Page Script (All Callaboraion Voicebank_.aj73j.js)
 * 
 * Synchronized with Wix Canvas & aj73j.d.ts:
 * - Native Wix header & text elements (#Section4ListHeaderTitle1, #text128..#text149)
 * - Native buttons (#button217..#button253) & video players (#videoPlayer26..#videoPlayer33)
 * - Dynamic collaboration repeater and real-time audio demo preview
 * 
 * Complies with AGENT.md:
 * - Red (#CC2200), Black (#1A1A1A), White (#F0F0F0) branding
 * - Defensive design with $wSafely
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { VOICEBANKS, queryVoicebanks } from 'public/voicebankData';
import { globalAudioPlayer } from 'public/audioPlayer';
import { showToast, toastInfo } from 'public/toast';
import { $wSafely, debounce, logStandard } from 'public/utils';

$w.onReady(function () {
  logStandard('CollabVoicebankPage', 'Collaboration page initializing', '', '', 'info');

  syncWixCollabLabels();
  initWixCollabButtons();
  initCollabVoicebanks();

  logStandard('CollabVoicebankPage', 'Collaboration page ready', '', '', 'info');
});

function syncWixCollabLabels() {
  $wSafely('#Section4ListHeaderTitle1', el => {
    el.text = 'COLLABORATION VOICEBANKS — DELTA SYNTH';
  });
}

function initWixCollabButtons() {
  const collabButtons = [
    '#button217', '#button218', '#button219', '#button220',
    '#button243', '#button244', '#button245', '#button246',
    '#button248', '#button249', '#button250',
    '#button251', '#button252', '#button253'
  ];

  const collabSingers = VOICEBANKS.filter(v => v.type === 'Collaboration');

  collabButtons.forEach((btnId, idx) => {
    $wSafely(btnId, (btn) => {
      const singer = collabSingers[idx % collabSingers.length];
      btn.onClick(() => {
        if (singer && singer.audioSample) {
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
  });
}

function initCollabVoicebanks() {
  const collabSingers = VOICEBANKS.filter(v => v.type === 'Collaboration');

  $wSafely('#collabVoicebankRepeater', (repeater) => {
    repeater.data = collabSingers.map(v => ({ _id: v.id, ...v }));

    repeater.onItemReady(($item, itemData) => {
      $item('#collabSingerImage').src = itemData.image || 'images/logo.png';
      $item('#collabSingerImage').alt = itemData.name;
      $item('#collabSingerName').text = itemData.name;
      $item('#collabSingerNameTh').text = itemData.nameTh || '';
      $item('#collabSingerVoicer').text = `พาร์ตเนอร์: ${itemData.voicer}`;
      $item('#collabSingerGenre').text = `แนวเพลง: ${itemData.genre}`;

      $item('#collabPlayBtn').onClick(() => {
        if (itemData.audioSample) {
          globalAudioPlayer.play(itemData.name, itemData.audioSample);
        }
      });
    });
  });
}
