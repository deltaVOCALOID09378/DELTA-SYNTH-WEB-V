/**
 * DELTA SYNTH — Master Page Script (Site-Wide Global Code)
 * File: masterPage.js
 * 
 * Synchronized with Wix Canvas & MasterPageElementsMap:
 * - Header: #header1, #text24 (Site Title), #horizontalMenu1 (Desktop Nav), #mobileMenuBtn, #mobileMenuContainer
 * - Footer: #footer1, #text111 (Copyright), #footerYear, #footerSocialLinks
 * - Members & Account: #membersLoginBar1, #accountNavBar1
 * - Global Audio Dock: #globalAudioDock, #globalAudioTrackTitle, #globalAudioArtist, #globalAudioPlayPauseBtn, #globalAudioStopBtn, #globalAudioProgress
 * 
 * Standards from AGENT.md:
 * - Brand Theme: Leelawadee UI, Red (#CC2200), Black (#1A1A1A), White (#F0F0F0)
 * - Defensive design with $wSafely & Zero Unhandled Errors
 * - Real-time state synchronization with globalAudioPlayer
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { THEME } from 'public/theme';
import { showToast, toastInfo } from 'public/toast';
import { $wSafely, debounce, logStandard } from 'public/utils';
import { globalAudioPlayer } from 'public/audioPlayer';
import wixLocation from 'wix-location-frontend';

$w.onReady(function () {
  logStandard('MasterPage', 'DELTA SYNTH global masterPage initializing', '', '', 'info');

  syncWixHeader();
  syncWixFooter();
  initGlobalAudioDock();
  initMobileMenu();
  initGlobalRouteWatcher();

  logStandard('MasterPage', 'DELTA SYNTH global masterPage ready', '', '', 'info');
});

// =========================================================================
// 1. ซิงโครไนซ์แถบส่วนหัว (Header & Desktop Navigation)
// =========================================================================

function syncWixHeader() {
  // 1.1 โลโก้และชื่อเว็บไซต์
  $wSafely('#text24', (el) => {
    el.text = 'DELTA SYNTH';
    el.onClick(() => {
      wixLocation.to('/');
    });
  });

  // 1.2 แถบเมนูนำทางหลัก (Horizontal Menu)
  $wSafely('#horizontalMenu1', (menu) => {
    // กำหนดการตอบสนองเมื่อเลือกเมนูนำทาง
    menu.onItemClick && menu.onItemClick((event) => {
      logStandard('Navigation', `User navigated to: ${event.item.label}`, '', '', 'info');
    });
  });

  // 1.3 แถบสมาชิก / เข้าสู่ระบบ (ถ้ามีเปิดใช้งาน)
  $wSafely('#membersLoginBar1', (loginBar) => {
    // ปรับแต่งสถานะการแสดงผลสำหรับสมาชิก
  });
}

// =========================================================================
// 2. ซิงโครไนซ์ส่วนท้ายเว็บ (Footer & Copyright)
// =========================================================================

function syncWixFooter() {
  const currentYear = new Date().getFullYear();

  // 2.1 ข้อความลิขสิทธิ์หลัก
  $wSafely('#text111', (el) => {
    el.text = `© ${currentYear} DELTA SYNTH — Thai Virtual Singer & Audio Synthesis Studio. All rights reserved.`;
  });

  $wSafely('#footerYear', (label) => {
    label.text = `© ${currentYear} DELTA SYNTH. All rights reserved.`;
  });

  // 2.2 ลิงก์โซเชียลมีเดียใน Footer
  const socialMappings = [
    { id: '#footerYoutubeLink', url: 'https://www.youtube.com/@deltaSYNTH0320' },
    { id: '#footerSoundCloudLink', url: 'https://soundcloud.com/delta-synth' },
    { id: '#footerGithubLink', url: 'https://github.com/DELTA-SYNTH' },
    { id: '#footerEmailLink', url: 'mailto:delta.vocaloid09378@gmail.com' }
  ];

  socialMappings.forEach(mapping => {
    $wSafely(mapping.id, btn => {
      btn.link = mapping.url;
      btn.target = '_blank';
    });
  });
}

// =========================================================================
// 3. เครื่องเล่นเสียงลอยตัวส่วนกลาง (Global Audio Player Dock)
// =========================================================================

function initGlobalAudioDock() {
  // สมาชิกผู้รับฟังสถานะการเล่นเสียงแบบ Real-time
  if (globalAudioPlayer && typeof globalAudioPlayer.subscribe === 'function') {
    globalAudioPlayer.subscribe((state) => {
      $wSafely('#globalAudioDock', (dock) => {
        if (state.isPlaying) {
          dock.show('fade', { duration: THEME?.animation?.durationNormal || 200 });

          // อัปเดตชื่อเพลง / นักร้อง
          $wSafely('#globalAudioTrackTitle', (label) => {
            label.text = state.currentTrackTitle || state.currentTrackId || 'กำลังเล่นตัวอย่างเสียง';
          });
          $wSafely('#globalAudioArtist', (label) => {
            label.text = state.currentArtist ? `นักร้อง: ${state.currentArtist}` : 'DELTA SYNTH Vocalist';
          });

          // ปุ่มควบคุมการเล่น
          $wSafely('#globalAudioPlayPauseBtn', (btn) => {
            btn.label = '❚❚ หยุดชั่วคราว';
          });
        } else {
          if (!state.currentTrackId && !state.currentTrackUrl) {
            dock.hide('fade', { duration: THEME?.animation?.durationNormal || 200 });
          } else {
            $wSafely('#globalAudioPlayPauseBtn', (btn) => {
              btn.label = '▶ เล่นต่อ';
            });
          }
        }

        // อัปเดต Progress Bar (ถ้ามี Element)
        if (typeof state.progressPercent === 'number') {
          $wSafely('#globalAudioProgress', (progress) => {
            progress.value = state.progressPercent;
          });
        }
      });
    });
  }

  // 3.1 ปุ่ม Play / Pause
  $wSafely('#globalAudioPlayPauseBtn', (btn) => {
    btn.onClick(() => {
      if (globalAudioPlayer.isPlaying) {
        globalAudioPlayer.pause();
      } else if (globalAudioPlayer.currentTrackUrl || globalAudioPlayer.currentTrackId) {
        globalAudioPlayer.resume ? globalAudioPlayer.resume() : 
          globalAudioPlayer.play(globalAudioPlayer.currentTrackId, globalAudioPlayer.currentTrackUrl);
      }
    });
  });

  // 3.2 ปุ่ม Stop / ปิดแถบเล่นเสียง
  $wSafely('#globalAudioStopBtn', (btn) => {
    btn.onClick(() => {
      globalAudioPlayer.stop();
      $wSafely('#globalAudioDock', dock => dock.hide('fade', { duration: 150 }));
    });
  });
}

// =========================================================================
// 4. ระบบเมนูนำทางสำหรับมือถือ (Mobile Drawer Menu)
// =========================================================================

function initMobileMenu() {
  let isMenuOpen = false;

  $wSafely('#mobileMenuBtn', (btn) => {
    btn.onClick(() => {
      isMenuOpen = !isMenuOpen;
      $wSafely('#mobileMenuContainer', (container) => {
        if (isMenuOpen) {
          container.show('slide', { direction: 'top', duration: THEME?.animation?.durationNormal || 200 });
          btn.label = '✕';
        } else {
          container.hide('slide', { direction: 'top', duration: THEME?.animation?.durationNormal || 200 });
          btn.label = '☰';
        }
      });
    });
  });

  // ปิดเมนูมือถืออัตโนมัติเมื่อกดเลือกลิงก์
  const mobileLinks = [
    '#mobileLinkHome', '#mobileLinkAbout', '#mobileLinkVoicebank',
    '#mobileLinkFiles', '#mobileLinkCollab', '#mobileLinkEvents'
  ];

  mobileLinks.forEach(linkId => {
    $wSafely(linkId, (link) => {
      link.onClick(() => {
        isMenuOpen = false;
        $wSafely('#mobileMenuContainer', c => c.hide('slide', { direction: 'top', duration: 150 }));
        $wSafely('#mobileMenuBtn', btn => { btn.label = '☰'; });
      });
    });
  });
}

// =========================================================================
// 5. ระบบตรวจจับการเปลี่ยนหน้า (Route Change Watcher)
// =========================================================================

function initGlobalRouteWatcher() {
  wixLocation.onChange((location) => {
    logStandard('RouteWatcher', `Page changed to: ${location.path.join('/')}`, '', '', 'info');

    // ปิดเมนูมือถือเมื่อมีการเปลี่ยนหน้า
    $wSafely('#mobileMenuContainer', container => {
      container.hide();
    });
    $wSafely('#mobileMenuBtn', btn => {
      btn.label = '☰';
    });
  });
}