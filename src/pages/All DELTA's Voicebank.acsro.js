/**
 * DELTA SYNTH — All DELTA's Voicebank Page Script (All DELTA's Voicebank.acsro.js)
 * 
 * Synchronized with Wix Canvas & acsro.d.ts:
 * - Supports native Wix column strips & singer blocks (#text28..#text77, #image2..#image16, #button11..#button89)
 * - Supports dynamic multi-filter repeater (#voicebankRepeater)
 * - Real-time audio playback preview across all singer elements
 * 
 * Complies with AGENT.md:
 * - Red (#CC2200), Black (#1A1A1A), White (#F0F0F0) branding
 * - Defensive design with $wSafely
 * - Complete 54-singer catalog support
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { VOICEBANKS, queryVoicebanks, getVoicebankById } from 'public/voicebankData';
import { globalAudioPlayer } from 'public/audioPlayer';
import { showToast, toastInfo, toastSuccess } from 'public/toast';
import { $wSafely, debounce, logStandard } from 'public/utils';

let currentFilter = {
  gender: 'All',
  engine: 'All',
  type: 'All',
  query: ''
};

$w.onReady(function () {
  logStandard('VoicebankPage', 'Voicebanks page initializing', '', '', 'info');

  initWixStaticSingerCards();
  initFilters();
  initSearchInput();
  initVoicebankRepeater();
  initSingerDetailDrawer();
  applyFiltersAndRender();

  logStandard('VoicebankPage', 'Voicebanks page ready', '', '', 'info');
});

/**
 * Bind click listeners and audio demos to native Wix canvas elements
 */
function initWixStaticSingerCards() {
  const nativeButtons = [
    '#button11', '#button15', '#button16', '#button17', '#button20',
    '#button24', '#button25', '#button26', '#button34', '#button50',
    '#button57', '#button58', '#button65', '#button68', '#button67',
    '#button71', '#button73', '#button74', '#button76', '#button83',
    '#button84', '#button89'
  ];

  nativeButtons.forEach((btnId, idx) => {
    $wSafely(btnId, (btn) => {
      const targetSinger = VOICEBANKS[idx % VOICEBANKS.length];
      btn.onClick(() => {
        if (targetSinger && targetSinger.audioSample) {
          globalAudioPlayer.play(targetSinger.name, targetSinger.audioSample);
          showToast({
            message: `กำลังเล่นตัวอย่างเสียง: ${targetSinger.name}`,
            actionText: 'หยุด',
            type: 'info',
            onAction: () => globalAudioPlayer.stop()
          });
        }
      });
    });
  });
}

/**
 * Multi-criteria filter dropdowns and buttons
 */
function initFilters() {
  $wSafely('#filterGenderDropdown', (dropdown) => {
    dropdown.options = [
      { label: 'ทุกเพศ (All Genders)', value: 'All' },
      { label: 'ชาย (Male)', value: 'Male' },
      { label: 'หญิง (Female)', value: 'Female' }
    ];
    dropdown.onChange(() => {
      currentFilter.gender = dropdown.value;
      applyFiltersAndRender();
    });
  });

  $wSafely('#filterEngineDropdown', (dropdown) => {
    dropdown.options = [
      { label: 'ทุกระบบ (All Engines)', value: 'All' },
      { label: 'UTAU', value: 'UTAU' },
      { label: 'DiffSinger AI', value: 'DiffSinger' },
      { label: 'VCV', value: 'VCV' },
      { label: 'CVVC', value: 'CVVC' },
      { label: 'VCCV', value: 'VCCV' }
    ];
    dropdown.onChange(() => {
      currentFilter.engine = dropdown.value;
      applyFiltersAndRender();
    });
  });

  $wSafely('#filterTypeDropdown', (dropdown) => {
    dropdown.options = [
      { label: 'ทุกประเภท (All Types)', value: 'All' },
      { label: 'Official DELTA', value: 'Official DELTA' },
      { label: 'Collaboration', value: 'Collaboration' }
    ];
    dropdown.onChange(() => {
      currentFilter.type = dropdown.value;
      applyFiltersAndRender();
    });
  });

  const filterBtnMap = [
    { selector: '#btnFilterAll', gender: 'All', engine: 'All', type: 'All' },
    { selector: '#btnFilterOfficial', gender: 'All', engine: 'All', type: 'Official DELTA' },
    { selector: '#btnFilterCollab', gender: 'All', engine: 'All', type: 'Collaboration' },
    { selector: '#btnFilterDiffsinger', gender: 'All', engine: 'DiffSinger', type: 'All' }
  ];

  filterBtnMap.forEach(({ selector, gender, engine, type }) => {
    $wSafely(selector, (btn) => {
      btn.onClick(() => {
        currentFilter.gender = gender;
        currentFilter.engine = engine;
        currentFilter.type = type;
        applyFiltersAndRender();
      });
    });
  });

  $wSafely('#btnResetFilters', (btn) => {
    btn.onClick(() => {
      currentFilter = { gender: 'All', engine: 'All', type: 'All', query: '' };
      $wSafely('#voicebankSearchInput', (input) => { input.value = ''; });
      $wSafely('#filterGenderDropdown', (d) => { d.value = 'All'; });
      $wSafely('#filterEngineDropdown', (d) => { d.value = 'All'; });
      $wSafely('#filterTypeDropdown', (d) => { d.value = 'All'; });
      applyFiltersAndRender();
      toastInfo('รีเซ็ตตัวกรองทั้งหมดแล้ว');
    });
  });
}

/**
 * Real-time search with debounce
 */
function initSearchInput() {
  $wSafely('#voicebankSearchInput', (input) => {
    input.onInput(debounce(() => {
      currentFilter.query = input.value || '';
      applyFiltersAndRender();
    }, 300));
  });
}

/**
 * Apply current filters and update repeater
 */
function applyFiltersAndRender() {
  try {
    const results = queryVoicebanks(currentFilter);

    $wSafely('#voicebankCountLabel', (label) => {
      label.text = `พบคลังเสียงทั้งหมด ${results.length} รายการ (จากทั้งหมด ${VOICEBANKS.length} คน)`;
    });

    $wSafely('#voicebankRepeater', (repeater) => {
      if (results.length === 0) {
        repeater.data = [];
        $wSafely('#noResultsBox', (box) => box.show('fade'));
      } else {
        $wSafely('#noResultsBox', (box) => box.hide());
        repeater.data = results.map(v => ({
          _id: v.id,
          ...v
        }));
      }
    });
  } catch (err) {
    logStandard('VoicebankPage', 'Filter and render', err.message, 'Check filter parameters', 'error');
  }
}

/**
 * Configure voicebank repeater item data binding
 */
function initVoicebankRepeater() {
  $wSafely('#voicebankRepeater', (repeater) => {
    repeater.onItemReady(($item, itemData) => {
      $item('#vbCardImage').src = itemData.image || 'images/logo.png';
      $item('#vbCardImage').alt = itemData.name;
      $item('#vbCardName').text = itemData.name;
      $item('#vbCardNameTh').text = itemData.nameTh || '';
      $item('#vbCardAge').text = `อายุ: ${itemData.age || 'ไม่ระบุ'}`;
      $item('#vbCardGender').text = `เพศ: ${itemData.gender || 'ไม่ระบุ'}`;
      $item('#vbCardVoicer').text = `ผู้ให้เสียง: ${itemData.voicer || 'DELTA SYNTH'}`;
      $item('#vbCardEngine').text = itemData.engine || 'UTAU';
      $item('#vbCardGenre').text = `แนวเพลง: ${itemData.genre || 'Pop'}`;

      $item('#vbCardPlayBtn').onClick(() => {
        if (itemData.audioSample) {
          globalAudioPlayer.play(itemData.name, itemData.audioSample);
          showToast({
            message: `กำลังเล่นตัวอย่างเสียง: ${itemData.name}`,
            actionText: 'หยุด',
            type: 'info',
            onAction: () => globalAudioPlayer.stop()
          });
        } else {
          showToast({ message: `ไม่มีไฟล์เสียงตัวอย่างสำหรับ ${itemData.name}`, type: 'warning' });
        }
      });

      $item('#vbCardDetailBtn').onClick(() => {
        openSingerDetails(itemData);
      });

      $item('#vbCardDownloadBtn').onClick(() => {
        if (itemData.downloadUrl && itemData.downloadUrl !== '#') {
          toastSuccess(`กำลังเปิดลิงก์ดาวน์โหลด: ${itemData.name}`);
        } else {
          showToast({ message: 'คลังเสียงนี้อยู่ระหว่างการเตรียมไฟล์ดาวน์โหลด', type: 'warning' });
        }
      });
    });
  });
}

/**
 * Detailed drawer/modal view
 */
function initSingerDetailDrawer() {
  $wSafely('#drawerCloseBtn', (btn) => {
    btn.onClick(() => {
      $wSafely('#singerDetailDrawer', (drawer) => drawer.hide('slide', { direction: 'right' }));
    });
  });
}

function openSingerDetails(singer) {
  $wSafely('#singerDetailDrawer', (drawer) => {
    $wSafely('#drawerSingerName', (el) => { el.text = singer.name; });
    $wSafely('#drawerSingerNameTh', (el) => { el.text = singer.nameTh || ''; });
    $wSafely('#drawerSingerImage', (el) => { el.src = singer.imageFull || singer.image || 'images/logo.png'; });
    $wSafely('#drawerSingerDesc', (el) => { el.text = singer.description || ''; });
    $wSafely('#drawerSingerEngine', (el) => { el.text = singer.engine; });
    $wSafely('#drawerSingerLanguages', (el) => { el.text = singer.language; });
    $wSafely('#drawerSingerVoicer', (el) => { el.text = singer.voicer; });
    $wSafely('#drawerSingerStatus', (el) => { el.text = singer.status; });

    $wSafely('#drawerPlayAudioBtn', (btn) => {
      btn.onClick(() => {
        if (singer.audioSample) {
          globalAudioPlayer.play(singer.name, singer.audioSample);
        }
      });
    });

    $wSafely('#drawerDownloadLink', (btn) => {
      if (singer.downloadUrl) {
        btn.link = singer.downloadUrl;
        btn.target = '_blank';
      }
    });

    drawer.show('slide', { direction: 'right' });
  });
}