/**
 * DELTA SYNTH — Wix Velo Standard Page Template
 * 
 * Use this file as a starting point for ALL new Wix Velo pages.
 * 
 * Complies with AGENT.md:
 * - Section 2: Preserve Before Replace
 * - Section 6: Defensive design ($wSafely with global and repeater scope)
 * - Section 9: UI Standard & Toast Notifications (toastSuccess, toastError, showToast)
 * - Section 11: Structured Logging (logStandard)
 * - Bilingual Support Setup (Thai/English)
 * - Theme adherence (Red #CC2200, Black #1A1A1A, White #F0F0F0)
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { $wSafely, logStandard } from 'public/utils';
import { THEME } from 'public/theme';
import { showToast, toastSuccess, toastError, toastInfo } from 'public/toast';

$w.onReady(function () {
  try {
    logStandard('PageName', 'Page initialized', '', '', 'info');
    
    // 1. Initialize UI Elements
    initUI();
    
    // 2. Setup Bilingual Text (if applicable in Velo Canvas)
    setupBilingualContent();
    
    // 3. Bind Event Listeners
    bindEvents();
  } catch (err) {
    logStandard('PageName', 'Page initialization', err?.message || String(err), 'Check component layout and canvas IDs', 'error');
    toastError('ไม่สามารถโหลดหน้าเว็บได้อย่างสมบูรณ์');
  }
});

/**
 * Initialize and reset UI elements on load
 */
function initUI() {
  // Defensive UI element styling and text setup
  $wSafely('#pageTitle', (el) => {
    // el.text = "DELTA SYNTH";
    // el.style.color = THEME.colors.primary;
  });
}

/**
 * Setup Thai / English Text depending on the chosen language state
 */
function setupBilingualContent() {
  const currentLanguage = 'TH'; // Can be fetched from wix-window or local storage
  
  $wSafely('#descriptionText', (el) => {
    if (currentLanguage === 'TH') {
      el.text = "ค่าย DELTA SYNTH เป็นค่ายเพลงเสมือนจริง";
    } else {
      el.text = "DELTA SYNTH is a virtual music label.";
    }
  });
}

/**
 * Bind all button clicks and interactions defensively
 */
function bindEvents() {
  $wSafely('#actionButton', (btn) => {
    btn.onClick((event) => {
      try {
        logStandard('PageName', 'actionButton clicked');
        
        // Execute operation...
        
        // Correct toast invocations adhering to AGENT.md:
        toastSuccess('ดำเนินการสำเร็จ');
      } catch (error) {
        logStandard('PageName', 'actionButton click handler', error?.message || String(error), 'Check function logic', 'error');
        toastError('เกิดข้อผิดพลาด กรุณาลองใหม่');
      }
    });
  });
}

/**
 * Example: Standard repeater binding with scoped $wSafely ($item)
 * @param {Array<object>} items 
 */
export function initRepeaterExample(items) {
  $wSafely('#exampleRepeater', (repeater) => {
    if (!Array.isArray(items) || items.length === 0) {
      repeater.data = [];
      return;
    }

    repeater.data = items;
    repeater.onItemReady(($item, itemData) => {
      try {
        // Scoped lookups using $item
        $wSafely('#itemTitle', (el) => { el.text = itemData.title || ''; }, $item);
        $wSafely('#itemDesc', (el) => { el.text = itemData.description || ''; }, $item);
        $wSafely('#itemBtn', (btn) => {
          btn.onClick(() => {
            toastInfo(`เลือกรายการ: ${itemData.title || ''}`);
          });
        }, $item);
      } catch (itemErr) {
        logStandard('PageName', 'Repeater item render', itemErr?.message || String(itemErr), 'Verify itemData schema', 'warn');
      }
    });
  });
}

export function myPublicFunction() {
  // Exported functions for Wix Velo
}
