/**
 * DELTA SYNTH — Universal Utilities & Defensive Helpers
 * 
 * Standards from AGENT.md:
 * - Section 2: Preserve Before Replace
 * - Section 6: Defensive design against null/undefined/missing DOM elements & Zero swallowed exceptions
 * - Section 11 Logging: [Component] Action failed: <cause>. Suggested action: <next step>.
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

/**
 * Defensive element getter for Wix Velo canvas and scoped repeater items.
 * Prevents runtime exceptions if an element ID is not present on the current page canvas or repeater scope.
 * 
 * @param {string} selector - e.g. '#myButton'
 * @param {Function} [action=null] - Optional callback receiving the element if found: (el) => void
 * @param {Function|object} [scope=null] - Optional scope function (e.g. $item in repeaters) or object with query function. Defaults to global $w.
 * @returns {object|null} The Wix element or null
 */
export function $wSafely(selector, action = null, scope = null) {
  if (typeof selector !== 'string' || !selector.trim()) {
    return null;
  }

  const trimmedSelector = selector.trim();
  if (trimmedSelector === '#' || trimmedSelector === '.') {
    return null;
  }
  let el = null;

  try {
    let queryFn = null;
    if (typeof scope === 'function') {
      queryFn = scope;
    } else if (scope && typeof scope === 'object' && typeof scope.$w === 'function') {
      queryFn = scope.$w;
    } else if (typeof $w === 'function') {
      queryFn = $w;
    }

    if (!queryFn) {
      return null;
    }

    el = queryFn(trimmedSelector);
  } catch (lookupErr) {
    // Selector does not exist on active canvas/repeater scope — expected safe fallback
    return null;
  }

  const isValidElement = el && typeof el === 'object' && (
    'id' in el || 'uniqueId' in el || 'type' in el ||
    typeof el.show === 'function' || typeof el.hide === 'function' ||
    typeof el.onClick === 'function'
  );

  if (!isValidElement) {
    return null;
  }

  if (typeof action === 'function') {
    try {
      action(el);
    } catch (actionErr) {
      logStandard(
        '$wSafely',
        `Action execution on "${trimmedSelector}"`,
        actionErr?.message || String(actionErr),
        'Inspect action callback logic',
        'error'
      );
      return null;
    }
  }

  return el;
}

/**
 * Debounce a function call with cancellation capability
 * @param {Function} func 
 * @param {number} [waitMs=300] 
 * @returns {Function}
 */
export function debounce(func, waitMs = 300) {
  if (typeof func !== 'function') {
    return () => {};
  }
  const delay = (typeof waitMs === 'number' && !isNaN(waitMs) && waitMs >= 0) ? waitMs : 300;
  let timeout = null;

  const executedFunction = function (...args) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(this, args);
    }, delay);
  };

  executedFunction.cancel = function () {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return executedFunction;
}

/**
 * Throttle a function call with cancellation capability
 * @param {Function} func 
 * @param {number} [limitMs=300] 
 * @returns {Function}
 */
export function throttle(func, limitMs = 300) {
  if (typeof func !== 'function') {
    return () => {};
  }
  const limit = (typeof limitMs === 'number' && !isNaN(limitMs) && limitMs >= 0) ? limitMs : 300;
  let inThrottle = false;
  let throttleTimer = null;

  const executedFunction = function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      throttleTimer = setTimeout(() => {
        inThrottle = false;
        throttleTimer = null;
      }, limit);
    }
  };

  executedFunction.cancel = function () {
    inThrottle = false;
    if (throttleTimer) {
      clearTimeout(throttleTimer);
      throttleTimer = null;
    }
  };

  return executedFunction;
}

/**
 * Format a Date object to Thai Buddhist Era string
 * @param {Date|string|number} dateInput 
 * @param {boolean} [includeTime=false]
 * @returns {string} e.g. "13 สิงหาคม 2569" or "ไม่ระบุวันที่"
 */
export function formatDateThai(dateInput, includeTime = false) {
  if (dateInput === null || dateInput === undefined || dateInput === '') {
    return 'ไม่ระบุวันที่';
  }

  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) {
      return 'ไม่ระบุวันที่';
    }

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
  } catch (err) {
    logStandard(
      'utils/formatDateThai',
      'Format date',
      err?.message || String(err),
      'Provide valid Date object, ISO string, or timestamp',
      'warn'
    );
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
  const searchKeys = Array.isArray(keys) && keys.length > 0
    ? keys
    : ['name', 'title', 'tags', 'description', 'engine'];

  return items.filter(item => {
    if (!item || typeof item !== 'object') return false;
    return searchKeys.some(key => {
      const val = item[key];
      if (typeof val === 'string') {
        return val.toLowerCase().includes(normalizedQuery);
      }
      if (typeof val === 'number' && !isNaN(val)) {
        return String(val).toLowerCase().includes(normalizedQuery);
      }
      if (Array.isArray(val)) {
        return val.some(v => {
          if (typeof v === 'string') return v.toLowerCase().includes(normalizedQuery);
          if (typeof v === 'number' && !isNaN(v)) return String(v).toLowerCase().includes(normalizedQuery);
          return false;
        });
      }
      return false;
    });
  });
}

/**
 * Sanitize string input to prevent injection and trim excess length
 * @param {string} text 
 * @param {number} [maxLength=1000]
 * @returns {string}
 */
export function sanitizeInput(text, maxLength = 1000) {
  if (typeof text !== 'string') {
    return '';
  }
  const maxLen = (typeof maxLength === 'number' && !isNaN(maxLength) && maxLength > 0)
    ? maxLength
    : 1000;

  return text
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLen);
}

/**
 * Format numbers with comma separators (Thai locale)
 * @param {number|string} num 
 * @returns {string} e.g. "1,000"
 */
export function formatNumber(num) {
  const n = num;

  if (typeof n !== 'number' || isNaN(n) || !isFinite(n)) {
    return '0';
  }
  return n.toLocaleString('th-TH');
}

/**
 * Standard structured logger adhering to AGENT.md Section 11
 * Format: [Component] Action failed: <cause>. Suggested action: <next step>.
 * 
 * @param {string} component - Name of the component, page, or service
 * @param {string} action - Action being attempted or executed
 * @param {string} [cause=''] - What went wrong (if failure)
 * @param {string} [suggestedAction=''] - Recommended next step
 * @param {'info'|'warn'|'error'} [level='info']
 */
export function logStandard(component, action, cause = '', suggestedAction = '', level = 'info') {
  const compStr = typeof component === 'string' && component.trim() ? component.trim() : 'System';
  const actStr = typeof action === 'string' && action.trim() ? action.trim() : 'Operation';
  const prefix = `[${compStr}]`;

  const isFailure = Boolean(cause) || level === 'error' || level === 'warn';

  if (isFailure) {
    const causeStr = typeof cause === 'string' && cause.trim() ? cause.trim() : (cause?.message || 'Unknown error');
    const nextStepStr = typeof suggestedAction === 'string' && suggestedAction.trim() ? suggestedAction.trim() : 'Check inputs and retry';
    const msg = `${prefix} ${actStr} failed: ${causeStr}. Suggested action: ${nextStepStr}.`;

    if (level === 'warn') {
      console.warn(msg);
    } else {
      console.error(msg);
    }
  } else {
    console.log(`${prefix} ${actStr}`);
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
