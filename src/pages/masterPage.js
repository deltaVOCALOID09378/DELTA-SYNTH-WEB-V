/**
 * DELTA SYNTH — Master Page Script (Site-Wide Global Code)
 * 
 * Synchronized with Wix Canvas & MasterPageElementsMap:
 * - #horizontalMenu1: $w.Menu
 * - #text24: $w.Text (Header Title)
 * - #text111: $w.Text (Footer Copyright)
 * - #header1: $w.Header
 * - #footer1: $w.Footer
 * - #membersLoginBar1: $w.AppWidget
 * - #accountNavBar1: $w.AccountNavBar
 * 
 * Complies with AGENT.md:
 * - Theme: Leelawadee UI, Red (#CC2200), Black (#1A1A1A), White (#F0F0F0)
 * - Global audio dock & toast notifications
 * - Defensive design with $wSafely
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { THEME } from 'public/theme';
import { showToast, toastInfo } from 'public/toast';
import { $wSafely, logStandard } from 'public/utils';
import { globalAudioPlayer } from 'public/audioPlayer';

$w.onReady(function () {
  logStandard('MasterPage', 'Global script initializing', '', '', 'info');

  syncWixHeader();
  syncWixFooter();
  initGlobalAudioDock();
  initMobileMenu();

  logStandard('MasterPage', 'Global script ready', '', '', 'info');
});

/**
 * Synchronize Header Title & Navigation Menu
 */
function syncWixHeader() {
  $wSafely('#text24', (el) => {
    el.text = 'DELTA SYNTH';
  });

  $wSafely('#horizontalMenu1', (menu) => {
    // Custom menu styling or click feedback if supported
  });
}

/**
 * Synchronize Footer Copyright & Info
 */
function syncWixFooter() {
  const currentYear = new Date().getFullYear();
  $wSafely('#text111', (el) => {
    el.text = `© ${currentYear} DELTA SYNTH. We are the Professional singing for you all your passion. All rights reserved.`;
  });

  $wSafely('#footerYear', (label) => {
    label.text = `© ${currentYear} DELTA SYNTH. All rights reserved.`;
  });
}

/**
 * Global floating audio player dock
 */
function initGlobalAudioDock() {
  globalAudioPlayer.subscribe((state) => {
    $wSafely('#globalAudioDock', (dock) => {
      if (state.isPlaying) {
        dock.show('fade', { duration: THEME.animation.durationNormal });
        $wSafely('#globalAudioTrackTitle', (label) => {
          label.text = state.currentTrackId ? `กำลังเล่น: ${state.currentTrackId}` : 'กำลังเล่นตัวอย่างเสียง';
        });
        $wSafely('#globalAudioPlayPauseBtn', (btn) => {
          btn.label = '❚❚ หยุดชั่วคราว';
        });
      } else {
        if (!state.currentTrackId) {
          dock.hide('fade', { duration: THEME.animation.durationNormal });
        } else {
          $wSafely('#globalAudioPlayPauseBtn', (btn) => {
            btn.label = '▶ เล่นต่อ';
          });
        }
      }
    });
  });

  $wSafely('#globalAudioPlayPauseBtn', (btn) => {
    btn.onClick(() => {
      if (globalAudioPlayer.isPlaying) {
        globalAudioPlayer.pause();
      } else if (globalAudioPlayer.currentTrackUrl) {
        globalAudioPlayer.play(globalAudioPlayer.currentTrackId, globalAudioPlayer.currentTrackUrl);
      }
    });
  });

  $wSafely('#globalAudioStopBtn', (btn) => {
    btn.onClick(() => {
      globalAudioPlayer.stop();
    });
  });
}

/**
 * Mobile drawer menu toggle
 */
function initMobileMenu() {
  let isMenuOpen = false;

  $wSafely('#mobileMenuBtn', (btn) => {
    btn.onClick(() => {
      isMenuOpen = !isMenuOpen;
      $wSafely('#mobileMenuContainer', (container) => {
        if (isMenuOpen) {
          container.show('slide', { direction: 'top', duration: THEME.animation.durationNormal });
        } else {
          container.hide('slide', { direction: 'top', duration: THEME.animation.durationNormal });
        }
      });
    });
  });
}
