/**
 * DELTA SYNTH — Toast Notification System
 * 
 * Standard from AGENT.md Section 9:
 * - Max size: 280x80px
 * - Offset: (16, 20) bottom-right
 * - Corner radius: 6px
 * - Colors: #CC2200 (Primary/Error), #1A1A1A (Background), #F0F0F0 (Text)
 * - Concise, clear, and actionable message
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import { THEME } from 'public/theme';

let activeToastTimeout = null;

/**
 * Show a toast notification on the active page
 * @param {object} options
 * @param {string} options.message - Main message text
 * @param {string} [options.actionText] - Optional suggested action or subtitle
 * @param {'info'|'success'|'warning'|'error'} [options.type='info']
 * @param {number} [options.duration] - Custom duration in milliseconds
 * @param {Function} [options.onAction] - Optional click handler
 */
export function showToast({ message, actionText = '', type = 'info', duration = THEME.toast.durationMs, onAction = null }) {
  try {
    if (typeof $w === 'undefined') {
      console.log(`[Toast ${type.toUpperCase()}] ${message} ${actionText ? `— ${actionText}` : ''}`);
      return;
    }

    const toastContainer = safeGetElement('#toastContainer');
    const toastMessage = safeGetElement('#toastMessage');
    const toastAction = safeGetElement('#toastAction');
    const toastIcon = safeGetElement('#toastIcon');

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
        toastAction.show();
      } else {
        toastAction.hide();
      }
    }

    // Set badge / icon / style indicators based on type
    const typeColors = {
      success: THEME.colors.success,
      warning: THEME.colors.warning,
      error: THEME.colors.primary,
      info: THEME.colors.info
    };

    const typeIcons = {
      success: '✓',
      warning: '⚠',
      error: '✕',
      info: 'ℹ'
    };

    if (toastIcon) {
      toastIcon.text = typeIcons[type] || 'ℹ';
    }

    // Handle action callback
    if (toastAction && typeof onAction === 'function') {
      toastAction.onClick(() => {
        try {
          onAction();
          hideToast();
        } catch (err) {
          console.error('[Toast] Action callback error:', err);
        }
      });
    }

    // Display container
    toastContainer.show('fade', { duration: THEME.animation.durationFast });

    activeToastTimeout = setTimeout(() => {
      hideToast();
    }, duration);

  } catch (err) {
    console.error('[Toast] Failed to render toast:', err);
  }
}

/**
 * Hide the active toast notification immediately
 */
export function hideToast() {
  try {
    if (typeof $w === 'undefined') return;
    const toastContainer = safeGetElement('#toastContainer');
    if (toastContainer && toastContainer.isVisible) {
      toastContainer.hide('fade', { duration: THEME.animation.durationFast });
    }
    if (activeToastTimeout) {
      clearTimeout(activeToastTimeout);
      activeToastTimeout = null;
    }
  } catch (err) {
    console.error('[Toast] Error hiding toast:', err);
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

function safeGetElement(selector) {
  try {
    if (typeof $w === 'function') {
      const el = $w(selector);
      return (el && el.uniqueId) ? el : null;
    }
    return null;
  } catch (_) {
    return null;
  }
}

export default {
  showToast,
  hideToast,
  toastSuccess,
  toastError,
  toastWarning,
  toastInfo
};
