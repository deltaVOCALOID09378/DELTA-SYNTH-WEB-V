/**
 * DELTA SYNTH — Activity Log & Fix Updates Page Script (Activity for Fix and Input Date.afeou.js)
 * 
 * Standards from AGENT.md:
 * - Red (#CC2200), Black (#1A1A1A), White (#F0F0F0) branding
 * - Defensive design with $wSafely
 * - Activity logs, changelogs, and version history
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { CHANGELOGS } from 'public/projectData';
import { showToast } from 'public/toast';
import { $wSafely, debounce, logStandard } from 'public/utils';

$w.onReady(function () {
  logStandard('ActivityPage', 'Activity log page initializing', '', '', 'info');

  initActivityRepeater();
  initActivitySearch();

  logStandard('ActivityPage', 'Activity log page ready', '', '', 'info');
});

function initActivityRepeater() {
  $wSafely('#activityRepeater', (repeater) => {
    repeater.data = CHANGELOGS.map((c, idx) => ({
      _id: `act_${idx}`,
      ...c
    }));

    repeater.onItemReady(($item, itemData) => {
      $item('#actVersion').text = itemData.version;
      $item('#actDate').text = `วันที่: ${itemData.date}`;
      $item('#actCategory').text = itemData.category;
      $item('#actTitle').text = itemData.title;
      $item('#actDetails').text = itemData.details;
    });
  });
}

function initActivitySearch() {
  $wSafely('#activitySearchInput', (input) => {
    input.onInput(debounce(() => {
      const q = (input.value || '').toLowerCase().trim();
      const filtered = CHANGELOGS.filter(c => 
        c.version.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.details.toLowerCase().includes(q)
      );

      $wSafely('#activityRepeater', (repeater) => {
        repeater.data = filtered.map((c, idx) => ({ _id: `act_${idx}`, ...c }));
      });
    }, 300));
  });
}
