/**
 * DELTA SYNTH — Activity Log & YouTube Monthly Video Feed Script
 * File: Activity for Fix and Input Date.afeou.js
 * 
 * Standards from AGENT.md:
 * - Brand Colors: Red (#CC2200), Black (#1A1A1A), White (#F0F0F0)
 * - Defensive design with $wSafely
 * - Activity logs, changelogs, and monthly video rotation (5 latest clips)
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { CHANGELOGS, YOUTUBE_CLIPS } from 'public/projectData';
import { showToast } from 'public/toast';
import { $wSafely, debounce, logStandard } from 'public/utils';

$w.onReady(function () {
  logStandard('ActivityPage', 'Activity & Video feed page initializing', '', '', 'info');

  // เริ่มต้นระบบแสดงผลบันทึกกิจกรรมและ Changelog
  initActivityRepeater();
  initActivitySearch();

  // เริ่มต้นระบบแสดงผลคลิป YouTube 5 รายการล่าสุด (อัปเดตตามรอบเดือน)
  initYouTubeFeed();

  logStandard('ActivityPage', 'Activity & Video feed page ready', '', '', 'info');
});

// ==========================================
// 1. ระบบแสดงผลบันทึกกิจกรรม (Changelog)
// ==========================================

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
        (c.version && c.version.toLowerCase().includes(q)) ||
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q)) ||
        (c.details && c.details.toLowerCase().includes(q))
      );

      $wSafely('#activityRepeater', (repeater) => {
        repeater.data = filtered.map((c, idx) => ({ _id: `act_${idx}`, ...c }));
      });
    }, 300));
  });
}

// ==========================================
// 2. ระบบแสดงผลคลิป YouTube 5 รายการล่าสุด (หมุนเวียนรอบ 1 เดือน)
// ==========================================

/**
 * ดึงรายการคลิป 5 รายการล่าสุด โดยคำนวณตามรอบเดือนปัจจุบัน
 * หากเดือนปัจจุบันมีคลิปไม่ถึง 5 คลิป ระบบจะดึงคลิปล่าสุดย้อนหลังมาเติมให้ครบ 5 คลิปอัตโนมัติ
 */
function getMonthlyFeaturedClips(clipsList, maxItems = 5) {
  if (!Array.isArray(clipsList) || clipsList.length === 0) return [];

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentMonthKey = `${currentYear}-${currentMonth}`; // เช่น '2026-08'

  // เรียงลำดับจากวันที่อัปโหลดล่าสุดลงไปเก่าสุด
  const sortedClips = [...clipsList].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

  // คัดกรองคลิปประจำเดือนปัจจุบันก่อน
  const currentMonthClips = sortedClips.filter(clip => clip.uploadDate.startsWith(currentMonthKey));

  // หากในเดือนปัจจุบันมีคลิป ให้ใช้คลิปเดือนนี้ หากน้อยกว่า 5 ให้นำคลิปล่าสุดที่เหลือมาต่อท้ายจนครบ
  let displayClips = currentMonthClips;
  if (displayClips.length < maxItems) {
    const remaining = sortedClips.filter(clip => !displayClips.some(dc => dc.id === clip.id));
    displayClips = displayClips.concat(remaining.slice(0, maxItems - displayClips.length));
  } else {
    displayClips = displayClips.slice(0, maxItems);
  }

  return displayClips;
}

function initYouTubeFeed() {
  $wSafely('#youtubeRepeater', (repeater) => {
    const activeClips = getMonthlyFeaturedClips(YOUTUBE_CLIPS, 5);

    if (activeClips.length === 0) {
      logStandard('YouTubeFeed', 'No YouTube clips available to display', '', '', 'warn');
      return;
    }

    // แสดงหัวข้อรอบเดือนปัจจุบันที่กล่องข้อความกำกับ (ถ้ามี Element)
    $wSafely('#currentMonthLabel', (label) => {
      const now = new Date();
      const monthNamesTh = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ];
      label.text = `คลิปไฮไลต์ประจำเดือน ${monthNamesTh[now.getMonth()]} ${now.getFullYear() + 543}`;
    });

    // กำหนดข้อมูลลง Repeater
    repeater.data = activeClips.map((clip, index) => ({
      _id: `yt_${clip.id || index}`,
      ...clip
    }));

    repeater.onItemReady(($item, itemData) => {
      // 1. ข้อมูลชื่อคลิปและหมวดหมู่
      $wSafely($item('#videoTitle'), el => { el.text = itemData.title; });
      $wSafely($item('#videoCategory'), el => { el.text = itemData.category || 'Music / Cover'; });
      
      // 2. วันที่อัปโหลดและคำอธิบายโดยย่อ
      $wSafely($item('#videoDate'), el => { el.text = `เผยแพร่เมื่อ: ${itemData.uploadDate}`; });
      $wSafely($item('#videoShortDesc'), el => { el.text = itemData.description; });

      // 3. ภาพปก Thumbnail หรือเครื่องเล่นวิดีโอ
      $wSafely($item('#videoThumbnail'), el => {
        el.src = itemData.thumbnail || `https://img.youtube.com/vi/${itemData.videoId}/hqdefault.jpg`;
        el.alt = itemData.title;
        el.onClick(() => {
          if (itemData.youtubeUrl) {
            import('wix-location-frontend').then(wixLocation => {
              wixLocation.to(itemData.youtubeUrl);
            });
          }
        });
      });

      // 4. ปุ่มเปิดฟังบน YouTube
      $wSafely($item('#videoWatchBtn'), el => {
        el.link = itemData.youtubeUrl;
        el.target = '_blank';
        el.label = 'รับชมบน YouTube';
      });
    });

    logStandard('YouTubeFeed', `Loaded ${activeClips.length} featured clips for current rotation`, '', '', 'info');
  });
}