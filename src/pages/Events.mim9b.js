/**
 * DELTA SYNTH — Events List Page Script (Events.mim9b.js)
 * 
 * Synchronized with Wix Canvas & mim9b.d.ts:
 * - Native Wix Event App element: #eventList1 ($w.IFrame)
 * - Dynamic events repeater: #eventsRepeater
 * 
 * Standards from AGENT.md:
 * - Red (#CC2200), Black (#1A1A1A), White (#F0F0F0) branding
 * - Defensive design with $wSafely
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { EVENTS } from 'public/projectData';
import { showToast, toastSuccess, toastInfo } from 'public/toast';
import { $wSafely, logStandard } from 'public/utils';
import wixLocation from 'wix-location-frontend';

$w.onReady(function () {
  logStandard('EventsPage', 'Events list page initializing', '', '', 'info');

  initWixEventWidget();
  initEventsRepeater();

  logStandard('EventsPage', 'Events list page ready', '', '', 'info');
});

function initWixEventWidget() {
  $wSafely('#eventList1', (widget) => {
    // ผูกการทำงานร่วมกับ Widget กิจกรรมของ Wix
  });
}

function initEventsRepeater() {
  $wSafely('#eventsRepeater', (repeater) => {
    repeater.data = EVENTS.map(e => ({ _id: e.id, ...e }));

    repeater.onItemReady(($item, itemData) => {
      $wSafely($item('#eventTitle'), el => { el.text = itemData.title; });
      $wSafely($item('#eventTitleTh'), el => { el.text = itemData.titleTh || ''; });
      $wSafely($item('#eventDate'), el => { el.text = `📅 ${itemData.date} | เวลา ${itemData.time}`; });
      $wSafely($item('#eventLocation'), el => { el.text = `📍 ${itemData.location}`; });
      $wSafely($item('#eventType'), el => { el.text = itemData.type; });
      $wSafely($item('#eventDesc'), el => { el.text = itemData.description; });
      
      $wSafely($item('#eventParticipants'), el => {
        el.text = `ผู้ลงทะเบียน: ${itemData.currentRegistered} / ${itemData.maxParticipants} คน`;
      });

      $wSafely($item('#eventStatusBadge'), badge => {
        badge.text = itemData.registrationOpen ? '● เปิดรับลงทะเบียน' : '✕ ปิดรับลงทะเบียน';
      });

      $wSafely($item('#eventRegisterBtn'), btn => {
        btn.label = itemData.registrationOpen ? 'ลงทะเบียนเข้าร่วม' : 'เต็มแล้ว / ปิดรับ';
        if (!itemData.registrationOpen) {
          btn.disable();
        }

        btn.onClick(() => {
          if (itemData.registrationOpen) {
            wixLocation.to(`/event-details-registration?eventId=${itemData.id}`);
          } else {
            showToast({ message: 'กิจกรรมนี้ปิดรับลงทะเบียนเรียบร้อยแล้ว', type: 'info' });
          }
        });
      });
    });
  });
}