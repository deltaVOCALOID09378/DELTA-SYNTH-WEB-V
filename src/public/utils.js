/**
 * DELTA SYNTH — Universal Utilities & Defensive Helpers
 * 
 * Standards from AGENT.md:
 * - Defensive design against null/undefined/missing DOM elements
 * - Section 11 Logging: [Component] Action failed: <cause>. Suggested action: <next step>.
 * - Section 6 Stability, Errors & Type Safety
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

/**
 * Defensive element getter for Wix Velo
 * Prevents runtime exceptions if an element ID is not present on the current page.
 * @param {string} selector - e.g. '#myButton'
 * @param {Function} [action] - Optional callback receiving the element if found
 * @returns {object|null} The Wix element or null
 */
export function $wSafely(selector, action = null) {
  try {
    if (typeof $w !== 'function') return null;
    const el = $w(selector);
    if (el && typeof el === 'object' && ('id' in el || 'uniqueId' in el || 'type' in el)) {
      if (typeof action === 'function') {
        action(el);
      }
      return el;
    }
    return null;
  } catch (err) {
    // Element not found on this page canvas, silently return null
    return null;
  }
}

/**
 * Debounce a function call
 * @param {Function} func 
 * @param {number} waitMs 
 * @returns {Function}
 */
export function debounce(func, waitMs = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, waitMs);
  };
}

/**
 * Throttle a function call
 * @param {Function} func 
 * @param {number} limitMs 
 * @returns {Function}
 */
export function throttle(func, limitMs = 300) {
  let inThrottle = false;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limitMs);
    }
  };
}

/**
 * Format a Date object to Thai Buddhist Era string
 * @param {Date|string|number} dateInput 
 * @param {boolean} [includeTime=false]
 * @returns {string} e.g. "13 สิงหาคม 2569"
 */
export function formatDateThai(dateInput, includeTime = false) {
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 'ไม่ระบุวันที่';
    
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    const day = d.getDate();
    const month = thaiMonths[d.getMonth()];
    const yearBE = d.getFullYear() + 543;
    
    let result = `${day} ${month} ${yearBE}`;
    if (includeTime) {
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      result += ` เวลา ${hours}:${minutes} น.`;
    }
    return result;
  } catch (_) {
    return 'ไม่ระบุวันที่';
  }
}

/**
 * Search and filter an array of objects across specified key fields
 * @param {Array<object>} items 
 * @param {string} query 
 * @param {Array<string>} [keys=['name', 'title', 'tags', 'description', 'engine']]
 * @returns {Array<object>}
 */
export function searchFilter(items, query, keys = ['name', 'title', 'tags', 'description', 'engine']) {
  if (!Array.isArray(items)) return [];
  if (!query || typeof query !== 'string' || !query.trim()) return items;
  
  const normalizedQuery = query.trim().toLowerCase();
  
  return items.filter(item => {
    if (!item) return false;
    return keys.some(key => {
      const val = item[key];
      if (typeof val === 'string') {
        return val.toLowerCase().includes(normalizedQuery);
      }
      if (Array.isArray(val)) {
        return val.some(v => typeof v === 'string' && v.toLowerCase().includes(normalizedQuery));
      }
      return false;
    });
  });
}

/**
 * Sanitize string input to prevent injection
 * @param {string} text 
 * @returns {string}
 */
export function sanitizeInput(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 1000);
}

/**
 * Format numbers with comma separators
 * @param {number} num 
 * @returns {string}
 */
export function formatNumber(num) {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  return num.toLocaleString('th-TH');
}

/**
 * Standard structured logger adhering to AGENT.md Section 11
 * @param {string} component - Name of the component or page
 * @param {string} action - Action being attempted
 * @param {string} [cause] - What went wrong (if failure)
 * @param {string} [suggestedAction] - Recommended next step
 * @param {'info'|'warn'|'error'} [level='info']
 */
export function logStandard(component, action, cause = '', suggestedAction = '', level = 'info') {
  const prefix = `[${component}]`;
  if (cause || level === 'error') {
    const msg = `${prefix} ${action} failed: ${cause || 'Unknown error'}. Suggested action: ${suggestedAction || 'Check inputs and retry'}.`;
    if (level === 'warn') {
      console.warn(msg);
    } else {
      console.error(msg);
    }
  } else {
    console.log(`${prefix} ${action}`);
  }
}

export default {
  $wSafely,
  debounce,
  throttle,
  formatDateThai,
  searchFilter,
  sanitizeInput,
  formatNumber,
  logStandard
};
