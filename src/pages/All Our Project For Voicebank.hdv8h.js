/**
 * DELTA SYNTH — Projects Showcase Page Script (All Our Project For Voicebank.hdv8h.js)
 * 
 * Synchronized with Wix Canvas & hdv8h.d.ts:
 * - Native Wix project cards (#text140..#text227, #button243..#button358, #image31..#image59)
 * - Dynamic category filter and project repeater
 * 
 * Complies with AGENT.md:
 * - Red (#CC2200), Black (#1A1A1A), White (#F0F0F0) branding
 * - Defensive design with $wSafely
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { PROJECTS } from 'public/projectData';
import { showToast, toastInfo } from 'public/toast';
import { $wSafely, logStandard } from 'public/utils';

let activeCategory = 'All';

$w.onReady(function () {
  logStandard('ProjectsPage', 'Projects page initializing', '', '', 'info');

  initWixProjectButtons();
  initCategoryFilters();
  initProjectsRepeater();
  renderProjects();

  logStandard('ProjectsPage', 'Projects page ready', '', '', 'info');
});

function initWixProjectButtons() {
  const projectButtons = [
    '#button243', '#button244', '#button245', '#button246',
    '#button247', '#button248', '#button249', '#button250',
    '#button251', '#button252', '#button253', '#button254',
    '#button255', '#button256', '#button257', '#button258'
  ];

  projectButtons.forEach((btnId, idx) => {
    $wSafely(btnId, (btn) => {
      const proj = PROJECTS[idx % PROJECTS.length];
      btn.onClick(() => {
        if (proj) {
          showToast({
            message: `โครงการ: ${proj.titleTh || proj.title}`,
            actionText: 'ดูรายละเอียด',
            type: 'info'
          });
        }
      });
    });
  });
}

function initCategoryFilters() {
  const categories = [
    { selector: '#btnCatAll', cat: 'All' },
    { selector: '#btnCatAi', cat: 'AI Engine' },
    { selector: '#btnCatPhonemizer', cat: 'Phonemizer' },
    { selector: '#btnCatWeb', cat: 'Web Platform' }
  ];

  categories.forEach(({ selector, cat }) => {
    $wSafely(selector, (btn) => {
      btn.onClick(() => {
        activeCategory = cat;
        renderProjects();
      });
    });
  });
}

function renderProjects() {
  let filtered = [...PROJECTS];
  if (activeCategory !== 'All') {
    filtered = filtered.filter(p => p.category === activeCategory);
  }

  $wSafely('#projectsRepeater', (repeater) => {
    repeater.data = filtered.map(p => ({ _id: p.id, ...p }));
  });
}

function initProjectsRepeater() {
  $wSafely('#projectsRepeater', (repeater) => {
    repeater.onItemReady(($item, itemData) => {
      $item('#projectTitle').text = itemData.title;
      $item('#projectTitleTh').text = itemData.titleTh || '';
      $item('#projectCategory').text = itemData.category;
      $item('#projectStatus').text = itemData.status;
      $item('#projectDate').text = `วันที่: ${itemData.date}`;
      $item('#projectDesc').text = itemData.description;
    });
  });
}
