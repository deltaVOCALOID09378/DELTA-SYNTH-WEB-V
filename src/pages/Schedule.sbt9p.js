/**
 * DELTA SYNTH — Release Schedule & Roadmap Script (Schedule.sbt9p.js)
 * 
 * Synchronized with Wix Canvas & sbt9p.d.ts:
 * - Native Wix Schedule App: #schedule1 ($w.IFrame)
 * - Dynamic roadmap timeline: #roadmapRepeater
 * 
 * Complies with AGENT.md:
 * - Red (#CC2200), Black (#1A1A1A), White (#F0F0F0) branding
 * - Defensive design with $wSafely
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { showToast } from 'public/toast';
import { $wSafely, logStandard } from 'public/utils';

const ROADMAP_ITEMS = [
  {
    _id: 'road_01',
    quarter: 'Q3 2026',
    date: 'สิงหาคม 2026',
    title: 'Codebase & Wix Velo Optimization',
    status: 'Completed',
    statusBadge: '✓ เสร็จสมบูรณ์',
    details: 'ปรับปรุงประสิทธิภาพเว็บ Velo และ Static Portal ให้ทำงานรวดเร็ว ไร้ข้อผิดพลาด'
  },
  {
    _id: 'road_02',
    quarter: 'Q3 2026',
    date: 'กันยายน 2026',
    title: 'DiffSinger Thai Generation 2 Rollout',
    status: 'In Progress',
    statusBadge: '⚡ กำลังดำเนินการ',
    details: 'ปล่อยโมเดลเสียง DiffSinger AI รุ่นใหม่สำหรับ Ayanami Hikaru และ SUN'
  },
  {
    _id: 'road_03',
    quarter: 'Q4 2026',
    date: 'พฤศจิกายน 2026',
    title: 'Vocaloid & Synthesizer V Cross-Tuning Support',
    status: 'Planned',
    statusBadge: '⏳ แผนงาน',
    details: 'อัปเดตไฟล์ SVP และ VSQX สำหรับเพลงออริจินัลทั้งหมด'
  },
  {
    _id: 'road_04',
    quarter: 'Q1 2027',
    date: 'มกราคม 2027',
    title: 'DELTA SYNTH Studio Suite 3.0',
    status: 'Planned',
    statusBadge: '⏳ แผนงาน',
    details: 'ซอฟต์แวร์ผู้ช่วยปรับจูนเสียงภาษาไทยอัตโนมัติบน OpenUtau'
  }
];

$w.onReady(function () {
  logStandard('SchedulePage', 'Schedule page initializing', '', '', 'info');

  initWixScheduleApp();
  initRoadmapRepeater();

  logStandard('SchedulePage', 'Schedule page ready', '', '', 'info');
});

function initWixScheduleApp() {
  $wSafely('#schedule1', (app) => {
    // Native Wix Schedule App integration
  });
}

function initRoadmapRepeater() {
  $wSafely('#roadmapRepeater', (repeater) => {
    repeater.data = ROADMAP_ITEMS;
    repeater.onItemReady(($item, itemData) => {
      $item('#roadmapQuarter').text = itemData.quarter;
      $item('#roadmapDate').text = itemData.date;
      $item('#roadmapTitle').text = itemData.title;
      $item('#roadmapStatus').text = itemData.statusBadge;
      $item('#roadmapDetails').text = itemData.details;
    });
  });
}
