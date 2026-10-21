/**
 * DELTA SYNTH — Toast Notification System
 * 
 * Standard from AGENT.md Section 9:
 * - Max size: 280x80px
 * - Offset: (16, 20) bottom-right
 * - Corner radius: 6px
 * - Colors: #CC2200 (Primary/Error), #1A1A1A (Background), #F0F0F0 (Text)
 * - Concise, clear, and actionable message
 * - Structured logging via logStandard (AGENT.md Section 11)
 * - Zero swallowed exceptions (AGENT.md Section 6)
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { THEME } from 'public/theme';
import { $wSafely, logStandard } from 'public/utils';

let activeToastTimeout = null;

/**
 * Show a toast notification on the active page
 * Supports options object or positional string arguments
 * @param {object|string} optionsOrMessage - Main message or options object
 * @param {string} [legacyActionOrType=''] - Action subtitle or type string
 * @param {'info'|'success'|'warning'|'error'} [legacyType='info']
 */
export function showToast(optionsOrMessage, legacyActionOrType = '', legacyType = 'info') {
  try {
    let options = {};
    if (typeof optionsOrMessage === 'string') {
      const validTypes = ['info', 'success', 'warning', 'error'];
      const isSecondArgType = validTypes.includes(legacyActionOrType);

      options = {
        message: optionsOrMessage,
        actionText: isSecondArgType ? '' : legacyActionOrType,
        type: isSecondArgType ? legacyActionOrType : legacyType
      };
    } else if (optionsOrMessage && typeof optionsOrMessage === 'object') {
      options = optionsOrMessage;
    } else {
      logStandard('Toast', 'Show notification', 'Invalid arguments provided to showToast', 'Pass an options object or message string', 'warn');
      return;
    }

    const {
      message = '',
      actionText = '',
      type = 'info',
      duration = THEME.toast.durationMs,
      onAction = null
    } = options;

    if (typeof $w === 'undefined') {
      console.log(`[Toast ${type.toUpperCase()}] ${message} ${actionText ? `— ${actionText}` : ''}`);
      return;
    }

    const toastContainer = $wSafely('#toastContainer');
    const toastMessage = $wSafely('#toastMessage');
    const toastAction = $wSafely('#toastAction');
    const toastIcon = $wSafely('#toastIcon');

    if (!toastContainer) {
      // Fallback: log to console if no toast container element is bound on the page
      console.log(`[Toast ${type.toUpperCase()}] ${message} ${actionText ? `— ${actionText}` : ''}`);
      return;
    }

    if (activeToastTimeout) {
      clearTimeout(activeToastTimeout);
      activeToastTimeout = null;
    }

    // Set text content
    if (toastMessage) {
      toastMessage.text = message || '';
    }
    if (toastAction) {
      if (actionText) {
        toastAction.text = actionText;
        if (typeof toastAction.show === 'function') {
          toastAction.show();
        }
      } else {
        if (typeof toastAction.hide === 'function') {
          toastAction.hide();
        }
      }
    }

    // Set badge / icon indicators based on type
    const typeIcons = {
      success: '✓',
      warning: '⚠',
      error: '✕',
      info: 'ℹ'
    };

    if (toastIcon) {
      toastIcon.text = typeIcons[type] || 'ℹ';
    }

    // Handle action callback defensively
    if (toastAction && typeof onAction === 'function') {
      if (typeof toastAction.onClick === 'function') {
        toastAction.onClick(() => {
          try {
            onAction();
          } catch (err) {
            logStandard('Toast', 'Execute action callback', err?.message || String(err), 'Check onAction handler implementation', 'error');
          } finally {
            hideToast();
          }
        });
      }
    }

    // Display container
    if (typeof toastContainer.show === 'function') {
      toastContainer.show('fade', { duration: THEME.animation.durationFast });
    }

    activeToastTimeout = setTimeout(() => {
      hideToast();
    }, duration);

  } catch (err) {
    logStandard('Toast', 'Render toast notification', err?.message || String(err), 'Verify toast container elements and options', 'error');
  }
}

/**
 * Hide the active toast notification immediately
 */
export function hideToast() {
  try {
    if (typeof $w === 'undefined') return;
    const toastContainer = $wSafely('#toastContainer');
    if (toastContainer && toastContainer.isVisible) {
      if (typeof toastContainer.hide === 'function') {
        toastContainer.hide('fade', { duration: THEME.animation.durationFast });
      }
    }
    if (activeToastTimeout) {
      clearTimeout(activeToastTimeout);
      activeToastTimeout = null;
    }
  } catch (err) {
    logStandard('Toast', 'Hide toast notification', err?.message || String(err), 'Verify element visibility state', 'warn');
  }
}

/**
 * Shorthand helper for success toast
 */
export function toastSuccess(message, actionText = 'เรียบร้อย') {
  showToast({ message, actionText, type: 'success' });
}

/**
 * Shorthand helper for error toast with actionable recommendation
 */
export function toastError(message, actionText = 'ลองใหม่อีกครั้ง') {
  showToast({ message, actionText, type: 'error', duration: 4500 });
}

/**
 * Shorthand helper for warning toast
 */
export function toastWarning(message, actionText = 'โปรดตรวจสอบ') {
  showToast({ message, actionText, type: 'warning' });
}

/**
 * Shorthand helper for info toast
 */
export function toastInfo(message, actionText = '') {
  showToast({ message, actionText, type: 'info' });
}

export default {
  showToast,
  hideToast,
  toastSuccess,
  toastError,
  toastWarning,
  toastInfo
};
