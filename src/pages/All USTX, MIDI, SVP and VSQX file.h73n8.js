/**
 * DELTA SYNTH — Music Resource Files Library Script (All USTX, MIDI, SVP and VSQX file.h73n8.js)
 * 
 * Synchronized with Wix Canvas & h73n8.d.ts:
 * - Native Wix text labels: #text25..#text35
 * - Dynamic format filtering: USTX, MIDI, SVP, VSQX
 * - Real-time search and download tracking
 * 
 * Complies with AGENT.md:
 * - Red (#CC2200), Black (#1A1A1A), White (#F0F0F0) branding
 * - Defensive design with $wSafely
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { MUSIC_FILES } from 'public/projectData';
import { trackFileDownload } from 'backend/fileService.jsw';
import { showToast, toastSuccess } from 'public/toast';
import { $wSafely, debounce, logStandard } from 'public/utils';

let activeFormat = 'All';
let searchKeyword = '';

$w.onReady(function () {
  logStandard('FilesArchivePage', 'Files archive page initializing', '', '', 'info');

  syncWixStaticFileLabels();
  initFormatTabs();
  initSearchInput();
  initFilesRepeater();
  renderFiles();

  logStandard('FilesArchivePage', 'Files archive page ready', '', '', 'info');
});

/**
 * Synchronize static text elements on Wix Canvas
 */
function syncWixStaticFileLabels() {
  $wSafely('#text25', el => { el.text = 'ALL MUSIC & RESOURCE FILES — DELTA SYNTH'; });
  $wSafely('#text26', el => { el.text = 'คลังแจกไฟล์ดนตรีสำหรับการฝึกมิกซ์ จูนเสียง และสร้างสรรค์ผลงานเพลง'; });
  $wSafely('#text27', el => { el.text = 'รูปแบบไฟล์ที่รองรับ: USTX (OpenUtau), MIDI (DAW), SVP (Synthesizer V), VSQX (Vocaloid)'; });
  $wSafely('#text28', el => { el.text = 'ดาวน์โหลดและใช้งานได้ฟรี 100% สำหรับการสร้างสรรค์ผลงานเพลง'; });
}

/**
 * Format filter tabs
 */
function initFormatTabs() {
  const tabs = [
    { selector: '#tabAllFiles', format: 'All' },
    { selector: '#tabUstx', format: 'USTX' },
    { selector: '#tabMidi', format: 'MIDI' },
    { selector: '#tabSvp', format: 'SVP' },
    { selector: '#tabVsqx', format: 'VSQX' }
  ];

  tabs.forEach(({ selector, format }) => {
    $wSafely(selector, (tab) => {
      tab.onClick(() => {
        activeFormat = format;
        renderFiles();
      });
    });
  });
}

function initSearchInput() {
  $wSafely('#filesSearchInput', (input) => {
    input.onInput(debounce(() => {
      searchKeyword = input.value || '';
      renderFiles();
    }, 300));
  });
}

function renderFiles() {
  let filtered = [...MUSIC_FILES];

  if (activeFormat !== 'All') {
    filtered = filtered.filter(f => f.format.toUpperCase() === activeFormat.toUpperCase());
  }

  if (searchKeyword.trim()) {
    const q = searchKeyword.toLowerCase().trim();
    filtered = filtered.filter(f =>
      f.title.toLowerCase().includes(q) ||
      f.producer.toLowerCase().includes(q) ||
      f.recommendedSinger.toLowerCase().includes(q) ||
      f.format.toLowerCase().includes(q)
    );
  }

  $wSafely('#filesCountLabel', (label) => {
    label.text = `พบไฟล์ทั้งหมด ${filtered.length} รายการ`;
  });

  $wSafely('#filesRepeater', (repeater) => {
    repeater.data = filtered.map(f => ({ _id: f.id, ...f }));
  });
}

function initFilesRepeater() {
  $wSafely('#filesRepeater', (repeater) => {
    repeater.onItemReady(($item, itemData) => {
      $item('#fileTitle').text = itemData.title;
      $item('#fileProducer').text = `ผู้สร้าง: ${itemData.producer}`;
      $item('#fileFormatBadge').text = itemData.format;
      $item('#fileBpmKey').text = `BPM: ${itemData.bpm} | Key: ${itemData.key}`;
      $item('#fileEngine').text = `โปรแกรม: ${itemData.compatibleEngine}`;
      $item('#fileRecommendedSinger').text = `นักร้องแนะนำ: ${itemData.recommendedSinger}`;
      $item('#fileSize').text = `ขนาด: ${itemData.fileSize}`;

      $item('#fileDownloadBtn').onClick(async () => {
        try {
          await trackFileDownload(itemData.id);
          toastSuccess(`กำลังเริ่มดาวน์โหลดไฟล์ ${itemData.format}: ${itemData.title}`);
        } catch (err) {
          logStandard('FilesArchivePage', 'File download tracking', err.message, 'Proceeding with download', 'warn');
        }
      });
    });
  });
}
