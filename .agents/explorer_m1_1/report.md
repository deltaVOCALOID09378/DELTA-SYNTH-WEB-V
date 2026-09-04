# Analysis & Hardening Plan: `src/public/utils.js` & `src/public/wixPageTemplate.js`
**Milestone**: M1 (Public Core & Audio Hardening)  
**Author**: Explorer M1_1  
**Date**: 2026-08-16  

---

## 1. Executive Summary

This report provides an in-depth architectural and code quality investigation of `src/public/utils.js` and `src/public/wixPageTemplate.js` against **AGENT.md** standards (Defensive Design §6, Structured Logging §11, UI Standards §9, and Preserve Before Replace §2).

### Key Identified Vulnerabilities & Defects
1. **`$wSafely` Scope Limitation (`utils.js:19-34`)**: Currently only inspects the global `$w` canvas selector. It cannot accept a scoped selector like `$item` inside repeaters, leading to unhandled runtime errors in repeater row item lookups across 9 dynamic pages.
2. **Swallowed Exceptions / Empty Catch Blocks (`utils.js:30, 100`)**: Empty catch blocks (`catch (err) {}` and `catch (_) {}`) swallow errors silently. In `$wSafely`, user-supplied `action(el)` callback exceptions were swallowed, hiding critical runtime bugs. In `formatDateThai`, invalid inputs were caught silently without diagnostic warnings.
3. **Date Semantic Edge Case (`utils.js:80-82`)**: `new Date(null)` evaluates to timestamp `0` (1 Jan 1970 / BE 2513), producing false valid dates instead of `'ไม่ระบุวันที่'`.
4. **`sanitizeInput` Contract Mismatch (`utils.js:138`)**: Missing `maxLength` parameter specified in `PROJECT.md` interface contract.
5. **Toast Signature Mismatch (`wixPageTemplate.js:68, 71`)**: Positional string arguments `showToast('msg', 'success')` were passed to an object-destructuring function `showToast({ message, type })`, causing toasts to render empty text and fallback to default `'info'` state.

---

## 2. Detailed Gap Analysis

### 2.1 `src/public/utils.js`

#### A. `$wSafely(selector, action = null, scope = null)`
- **Current Behavior**:
  ```javascript
  export function $wSafely(selector, action = null) {
    try {
      if (typeof $w !== 'function') return null;
      const el = $w(selector);
      ...
    } catch (err) {
      return null;
    }
  }
  ```
- **Defects**:
  - **No Repeater/Scoped Context**: When Wix Velo renders repeaters via `repeater.onItemReady(($item, itemData) => { ... })`, child elements must be queried through `$item('#id')`, not global `$w('#id')`. Because `$wSafely` had no `scope` argument, all 9 repeater pages were forced to either use raw `$item` (risking crash on missing canvas elements) or bypass `$wSafely`.
  - **Swallowed Action Callback Errors**: If the developer's `action(el)` callback threw an exception (e.g. accessing undefined property of `itemData`), the outer `catch (err)` caught it and silently returned `null`.
  - **Input Validation**: Missing validation for `selector` string.
- **Remediation**:
  - Add optional `scope` parameter: `export function $wSafely(selector, action = null, scope = null)`.
  - Check if `typeof scope === 'function'` (e.g. `$item`), else fallback to `scope.$w`, else global `$w`.
  - Separate element lookup `try/catch` from `action(el)` execution `try/catch`. If `action(el)` throws, log via `logStandard('$wSafely', ...)`.

#### B. `formatDateThai(dateInput, includeTime = false)`
- **Current Behavior**:
  ```javascript
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 'ไม่ระบุวันที่';
    ...
  } catch (_) {
    return 'ไม่ระบุวันที่';
  }
  ```
- **Defects**:
  - `catch (_)` violates AGENT.md §6 and §16 (no swallowed exceptions).
  - Passing `null` to `new Date(null)` creates `new Date(0)` which is `1970-01-01` (Thai BE 2513), incorrectly formatting `null` as `"1 มกราคม 2513"`.
- **Remediation**:
  - Guard `if (dateInput === null || dateInput === undefined || dateInput === '') return 'ไม่ระบุวันที่';`.
  - Replace `catch (_)` with structured warning log `logStandard('utils/formatDateThai', ...)`.

#### C. `debounce` & `throttle` Lifecycle Cleanup
- **Current Behavior**:
  Timers could not be cleared on page unload or component destruction.
- **Remediation**:
  - Attach `.cancel()` method to the returned debounced/throttled functions.
  - Guard against non-function `func` arguments and negative/NaN timer inputs.

#### D. `sanitizeInput(text, maxLength = 1000)`
- **Current Behavior**:
  Hardcoded `slice(0, 1000)` without `maxLength` parameter.
- **Remediation**:
  - Support `maxLength` parameter defaulting to `1000`.
  - Handle numeric inputs safely.

#### E. `searchFilter` Multi-type Safety
- **Current Behavior**:
  Only checked `string` and `Array<string>` fields. Number fields (e.g. year, ID, count) were ignored.
- **Remediation**:
  - Add support for numeric values and arrays containing numbers.
  - Defensive fallback if `keys` is not an array.

#### F. `logStandard(component, action, cause = '', suggestedAction = '', level = 'info')`
- **Current Behavior**:
  Standardized per AGENT.md §11: `[Component] Action failed: <cause>. Suggested action: <next step>.`
- **Remediation**:
  - Ensure defensive string coercion so `undefined`/`null`/Error objects never print `[object Object]` in production console.

---

### 2.2 `src/public/wixPageTemplate.js`

#### A. Toast Signature Mismatch
- **Current Code (`lines 68, 71`)**:
  ```javascript
  showToast('ดำเนินการสำเร็จ', 'success');
  ...
  showToast('เกิดข้อผิดพลาด กรุณาลองใหม่', 'error');
  ```
- **Analysis**:
  In `src/public/toast.js`, `showToast` is declared as:
  ```javascript
  export function showToast({ message, actionText = '', type = 'info', duration = THEME.toast.durationMs, onAction = null })
  ```
  When invoked with `showToast('ดำเนินการสำเร็จ', 'success')`, the first argument is treated as the options object. In JavaScript:
  `const { message, type } = 'ดำเนินการสำเร็จ';` => `message` is `undefined`, `type` is `undefined` (defaulting to `'info'`).
  This caused the toast message to render blank and displayed an info icon instead of success or error.
- **Remediation**:
  - Import shorthand helpers `toastSuccess` and `toastError` from `public/toast`.
  - Update template calls to:
    `toastSuccess('ดำเนินการสำเร็จ');`
    `toastError('เกิดข้อผิดพลาด กรุณาลองใหม่');`
  - Also provide documented examples of `showToast({ message, type, actionText, onAction })` for advanced use cases.

#### B. Repeater Scoped Pattern Boilerplate
- Add a canonical repeater initialization example (`initRepeaterExample`) using `$wSafely(selector, action, $item)` to serve as the template for all 14 page scripts.

---

## 3. Concrete Code Recommendations

### 3.1 Proposed `src/public/utils.js`

```javascript
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
    if (typeof text === 'number' && !isNaN(text)) {
      return String(text);
    }
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
  const n = typeof num === 'number'
    ? num
    : (typeof num === 'string' && num.trim() !== '' ? Number(num) : NaN);

  if (typeof n !== 'number' || isNaN(n)) {
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
```

---

### 3.2 Proposed `src/public/wixPageTemplate.js`

```javascript
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
    // el.style.color = THEME.colors.red;
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
```

---

## 4. Verification Plan & Test Cases

The following test suites must be verified to validate the implementation:

| Test ID | Test Target | Test Scenario | Expected Outcome |
|---|---|---|---|
| **T-UT-01** | `$wSafely` (Root) | Call `$wSafely('#existing')` with mocked global `$w` | Returns element, executes action callback |
| **T-UT-02** | `$wSafely` (Scoped) | Call `$wSafely('#child', action, mockItem)` with mocked `$item` | Passes `$item` scope, queries child, returns element |
| **T-UT-03** | `$wSafely` (Missing Element) | Call `$wSafely('#notFound')` where query returns null or throws | Returns `null` without unhandled exception |
| **T-UT-04** | `$wSafely` (Action Error) | `action(el)` throws inside callback | Logs standard error via `logStandard`, does not crash |
| **T-UT-05** | `debounce` | Multiple rapid invocations within 50ms | Executes once after wait interval; `.cancel()` aborts timer |
| **T-UT-06** | `throttle` | Multiple rapid invocations | Executes immediately on leading edge, ignores subsequent calls until limit |
| **T-UT-07** | `formatDateThai` | Pass `null`, `undefined`, `""`, valid ISO string, Date object | `null` -> `'ไม่ระบุวันที่'`, ISO -> `'13 สิงหาคม 2569'` |
| **T-UT-08** | `searchFilter` | Search across string & number keys, non-string queries | Accurately matches substrings; returns empty on non-array |
| **T-UT-09** | `sanitizeInput` | Input with `<script>alert(1)</script>` and custom `maxLength` | Strips `<>`, trims whitespace, truncates at `maxLength` |
| **T-UT-10** | `logStandard` | Call with error and info levels | Outputs `[Component] Action failed: <cause>. Suggested action: <next step>.` |
| **T-UT-11** | `wixPageTemplate` | Check toast invocations in template | Calls `toastSuccess('...')` and `toastError('...')` matching object contract |
