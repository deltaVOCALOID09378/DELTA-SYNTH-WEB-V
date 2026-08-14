/**
 * DELTA SYNTH — Events List Page Script (Events.mim9b.js)
 * 
 * Synchronized with Wix Canvas & mim9b.d.ts:
 * - Native Wix Event App element: #eventList1 ($w.IFrame)
 * - Dynamic events repeater: #eventsRepeater
 * 
 * Complies with AGENT.md:
 * - Red (#CC2200), Black (#1A1A1A), White (#F0F0F0) branding
 * - Defensive design with $wSafely
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { EVENTS } from 'public/projectData';
import { showToast, toastSuccess } from 'public/toast';
import { $wSafely, logStandard } from 'public/utils';

$w.onReady(function () {
  logStandard('EventsPage', 'Events page initializing', '', '', 'info');

  initWixEventWidget();
  initEventsRepeater();

  logStandard('EventsPage', 'Events page ready', '', '', 'info');
});

function initWixEventWidget() {
  $wSafely('#eventList1', (widget) => {
    // Native Wix Event App widget binding if active
  });
}

function initEventsRepeater() {
  $wSafely('#eventsRepeater', (repeater) => {
    repeater.data = EVENTS.map(e => ({ _id: e.id, ...e }));

    repeater.onItemReady(($item, itemData) => {
      $item('#eventTitle').text = itemData.title;
      $item('#eventTitleTh').text = itemData.titleTh || '';
      $item('#eventDate').text = `📅 วันที่: ${itemData.date} (${itemData.time})`;
      $item('#eventLocation').text = `📍 สถานที่: ${itemData.location}`;
      $item('#eventType').text = itemData.type;
      $item('#eventDesc').text = itemData.description;
      $item('#eventParticipants').text = `ผู้ลงทะเบียนแล้ว: ${itemData.currentRegistered} / ${itemData.maxParticipants} คน`;

      $item('#eventRegisterBtn').onClick(() => {
        if (itemData.registrationOpen) {
          toastSuccess(`กำลังเปิดหน้าลงทะเบียน: ${itemData.titleTh || itemData.title}`);
        } else {
          showToast({ message: 'กิจกรรมนี้ปิดรับลงทะเบียนแล้ว', type: 'warning' });
        }
      });
    });
  });
}
