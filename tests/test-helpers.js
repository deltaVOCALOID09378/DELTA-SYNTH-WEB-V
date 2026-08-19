/**
 * DELTA SYNTH — Master Test Harness & Mock Environment
 * 
 * Standards from AGENT.md:
 * - Pure Node.js test environment (node:test, node:assert/strict)
 * - Complete Wix Velo runtime emulation ($w, wix-data, wix-location, wix-window)
 * - HTML5 Audio mock & AGENT.md Toast geometry validation
 * - Structured log validation ([Component] Action failed: <cause>. Suggested action: <next step>.)
 * 
 * Made And Checked By DELTA SYNTH & Gemini AI
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

// ============================================================================
// 1. Mock Wix Element & $w Selector Engine
// ============================================================================

export class MockElement {
  constructor(id, type = 'Box') {
    this.id = id.replace(/^#/, '');
    this.uniqueId = `mock_${this.id}_${Math.random().toString(36).substr(2, 6)}`;
    this.type = `$w.${type}`;
    this.isVisible = true;
    this.collapsed = false;
    this.text = '';
    this.value = '';
    this.src = '';
    this.alt = '';
    this.label = '';
    this.link = '';
    this.target = '_self';
    this.options = [];
    this._data = [];
    this.style = {};
    this._listeners = new Map();
    this._itemReadyCallbacks = [];
  }

  show(animation, options) {
    this.isVisible = true;
    return Promise.resolve();
  }

  hide(animation, options) {
    this.isVisible = false;
    return Promise.resolve();
  }

  collapse() {
    this.collapsed = true;
    return Promise.resolve();
  }

  expand() {
    this.collapsed = false;
    return Promise.resolve();
  }

  onClick(handler) {
    this._addListener('click', handler);
  }

  onChange(handler) {
    this._addListener('change', handler);
  }

  onInput(handler) {
    this._addListener('input', handler);
  }

  onItemReady(handler) {
    this._itemReadyCallbacks.push(handler);
  }

  _addListener(event, handler) {
    if (typeof handler !== 'function') return;
    if (!this._listeners.has(event)) this._listeners.set(event, []);
    this._listeners.get(event).push(handler);
  }

  trigger(event, eventData = {}) {
    const handlers = this._listeners.get(event) || [];
    handlers.forEach(h => {
      try {
        h(eventData);
      } catch (err) {
        console.error(`[MockElement] Error in ${event} handler for #${this.id}:`, err);
      }
    });
  }

  simulateClick(eventData = {}) {
    this.trigger('click', eventData);
  }
}

export class MockRepeater extends MockElement {
  constructor(id) {
    super(id, 'Repeater');
    this._itemScopes = new Map();
  }

  set data(items) {
    this._data = Array.isArray(items) ? items : [];
    this._renderItems();
  }

  get data() {
    return this._data || [];
  }

  _renderItems() {
    this._itemScopes.clear();
    this._data.forEach((itemData, index) => {
      const itemId = itemData._id || `item_${index}`;
      const scopeMap = new Map();

      const $item = (selector) => {
        const cleanId = selector.replace(/^#/, '');
        if (!scopeMap.has(cleanId)) {
          const el = new MockElement(cleanId);
          scopeMap.set(cleanId, el);
        }
        return scopeMap.get(cleanId);
      };

      this._itemScopes.set(itemId, scopeMap);

      this._itemReadyCallbacks.forEach(cb => {
        try {
          cb($item, itemData, index);
        } catch (err) {
          console.error(`[MockRepeater] Error in onItemReady for item ${itemId}:`, err);
        }
      });
    });
  }

  getItemScope(itemId) {
    return this._itemScopes.get(itemId);
  }

  forEachItem(callback) {
    if (typeof callback !== 'function') return;
    this._data.forEach((itemData, index) => {
      const itemId = itemData._id || `item_${index}`;
      const scopeMap = this._itemScopes.get(itemId) || new Map();
      const $item = (selector) => {
        const cleanId = selector.replace(/^#/, '');
        if (!scopeMap.has(cleanId)) {
          scopeMap.set(cleanId, new MockElement(cleanId));
        }
        return scopeMap.get(cleanId);
      };
      callback($item, itemData, index);
    });
  }
}

class MockCanvasEngine {
  constructor() {
    this.elements = new Map();
    this.onReadyCallbacks = [];
    this.isReady = false;
  }

  reset() {
    this.elements.clear();
    this.onReadyCallbacks = [];
    this.isReady = false;
  }

  registerElement(id, type = 'Box') {
    const cleanId = id.replace(/^#/, '');
    if (!this.elements.has(cleanId)) {
      const el = type === 'Repeater' ? new MockRepeater(cleanId) : new MockElement(cleanId, type);
      this.elements.set(cleanId, el);
    }
    return this.elements.get(cleanId);
  }

  getElement(id) {
    const cleanId = id.replace(/^#/, '');
    return this.elements.get(cleanId) || null;
  }

  createSelector() {
    const selectorFn = (selector) => {
      if (typeof selector !== 'string') return null;

      // Handle comma-separated selectors
      if (selector.includes(',')) {
        return selector.split(',').map(s => selectorFn(s.trim())).filter(Boolean);
      }

      const cleanId = selector.replace(/^#/, '');
      if (!this.elements.has(cleanId)) {
        return [];
      }
      return this.elements.get(cleanId);
    };

    selectorFn.onReady = (callback) => {
      if (typeof callback === 'function') {
        this.onReadyCallbacks.push(callback);
        if (this.isReady) {
          callback();
        }
      }
    };

    return selectorFn;
  }

  triggerReady() {
    this.isReady = true;
    this.onReadyCallbacks.forEach(cb => {
      try {
        cb();
      } catch (err) {
        console.error('[MockCanvasEngine] onReady callback error:', err);
      }
    });
  }
}

export const canvasEngine = new MockCanvasEngine();

// ============================================================================
// 2. Mock wix-data Query Builder & In-Memory Store
// ============================================================================

class MockWixDataQuery {
  constructor(collectionName, store) {
    this.collectionName = collectionName;
    this.store = store;
    this.predicates = [];
    this.sortFields = [];
    this._skip = 0;
    this._limit = 50;
  }

  eq(field, value) {
    this.predicates.push(item => item[field] === value);
    return this;
  }

  ne(field, value) {
    this.predicates.push(item => item[field] !== value);
    return this;
  }

  contains(field, value) {
    if (!value) return this;
    const q = String(value).toLowerCase();
    this.predicates.push(item => {
      const val = item[field];
      return typeof val === 'string' && val.toLowerCase().includes(q);
    });
    return this;
  }

  startsWith(field, value) {
    if (!value) return this;
    const q = String(value).toLowerCase();
    this.predicates.push(item => typeof item[field] === 'string' && item[field].toLowerCase().startsWith(q));
    return this;
  }

  endsWith(field, value) {
    if (!value) return this;
    const q = String(value).toLowerCase();
    this.predicates.push(item => typeof item[field] === 'string' && item[field].toLowerCase().endsWith(q));
    return this;
  }

  ge(field, value) {
    this.predicates.push(item => item[field] >= value);
    return this;
  }

  gt(field, value) {
    this.predicates.push(item => item[field] > value);
    return this;
  }

  le(field, value) {
    this.predicates.push(item => item[field] <= value);
    return this;
  }

  lt(field, value) {
    this.predicates.push(item => item[field] < value);
    return this;
  }

  hasSome(field, array) {
    if (!Array.isArray(array) || array.length === 0) return this;
    this.predicates.push(item => {
      const val = item[field];
      if (Array.isArray(val)) return val.some(v => array.includes(v));
      return array.includes(val);
    });
    return this;
  }

  hasAll(field, array) {
    if (!Array.isArray(array) || array.length === 0) return this;
    this.predicates.push(item => {
      const val = item[field];
      if (Array.isArray(val)) return array.every(v => val.includes(v));
      return false;
    });
    return this;
  }

  ascending(field) {
    this.sortFields.push({ field, dir: 1 });
    return this;
  }

  descending(field) {
    this.sortFields.push({ field, dir: -1 });
    return this;
  }

  skip(count) {
    this._skip = Math.max(0, parseInt(count, 10) || 0);
    return this;
  }

  limit(count) {
    this._limit = Math.max(1, parseInt(count, 10) || 50);
    return this;
  }

  async find() {
    const collection = this.store.get(this.collectionName) || [];
    let results = collection.filter(item => this.predicates.every(p => p(item)));

    // Sort
    if (this.sortFields.length > 0) {
      results.sort((a, b) => {
        for (const { field, dir } of this.sortFields) {
          if (a[field] < b[field]) return -1 * dir;
          if (a[field] > b[field]) return 1 * dir;
        }
        return 0;
      });
    }

    const totalCount = results.length;
    const pagedItems = results.slice(this._skip, this._skip + this._limit);
    const totalPages = Math.ceil(totalCount / this._limit) || 1;
    const currentPage = Math.floor(this._skip / this._limit) + 1;

    return {
      items: pagedItems,
      totalCount,
      length: pagedItems.length,
      currentPage,
      totalPages,
      hasNext: () => currentPage < totalPages,
      hasPrev: () => currentPage > 1,
      nextPage: async () => {
        this._skip += this._limit;
        return this.find();
      },
      prevPage: async () => {
        this._skip = Math.max(0, this._skip - this._limit);
        return this.find();
      }
    };
  }

  async count() {
    const res = await this.find();
    return res.totalCount;
  }
}

export class MockWixData {
  constructor() {
    this.collections = new Map();
    this.hooks = new Map();
  }

  reset() {
    this.collections.clear();
    this.hooks.clear();
  }

  seed(collectionName, items) {
    this.collections.set(collectionName, JSON.parse(JSON.stringify(items)));
  }

  registerHook(collectionName, hookType, fn) {
    const key = `${collectionName}_${hookType}`;
    if (!this.hooks.has(key)) this.hooks.set(key, []);
    this.hooks.get(key).push(fn);
  }

  async _runHooks(collectionName, hookType, item, context = {}) {
    let currentItem = { ...item };
    const globalKey = `*_${hookType}`;
    const specificKey = `${collectionName}_${hookType}`;

    const hooks = [...(this.hooks.get(globalKey) || []), ...(this.hooks.get(specificKey) || [])];
    for (const hook of hooks) {
      currentItem = (await hook(currentItem, context)) || currentItem;
    }
    return currentItem;
  }

  query(collectionName) {
    return new MockWixDataQuery(collectionName, this.collections);
  }

  async insert(collectionName, item, options = {}) {
    if (!this.collections.has(collectionName)) {
      this.collections.set(collectionName, []);
    }
    let processed = await this._runHooks(collectionName, 'beforeInsert', item);
    processed._id = processed._id || `id_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    processed._createdDate = processed._createdDate || new Date();
    processed._updatedDate = new Date();

    this.collections.get(collectionName).push(processed);
    return processed;
  }

  async get(collectionName, id, options = {}) {
    const items = this.collections.get(collectionName) || [];
    return items.find(i => i._id === id) || null;
  }

  async update(collectionName, item, options = {}) {
    const items = this.collections.get(collectionName) || [];
    const idx = items.findIndex(i => i._id === item._id);
    if (idx === -1) throw new Error(`Item ${item._id} not found in ${collectionName}`);

    let processed = await this._runHooks(collectionName, 'beforeUpdate', item);
    processed._updatedDate = new Date();
    items[idx] = processed;
    return processed;
  }

  async remove(collectionName, id, options = {}) {
    const items = this.collections.get(collectionName) || [];
    const idx = items.findIndex(i => i._id === id);
    if (idx === -1) throw new Error(`Item ${id} not found in ${collectionName}`);
    const removed = items.splice(idx, 1)[0];
    return removed;
  }

  async bulkInsert(collectionName, items, options = {}) {
    if (!Array.isArray(items)) return { inserted: 0, items: [] };
    const insertedItems = [];
    for (const item of items) {
      const inserted = await this.insert(collectionName, item, options);
      insertedItems.push(inserted);
    }
    return { inserted: insertedItems.length, items: insertedItems };
  }
}

export const mockWixData = new MockWixData();

// ============================================================================
// 3. Mock wix-location Navigator
// ============================================================================

export class MockWixLocation {
  constructor() {
    this.reset();
  }

  reset() {
    this.baseUrl = 'https://www.deltasynth.com';
    this.protocol = 'https:';
    this.prefix = '';
    this.path = [];
    this.query = {};
    this.url = 'https://www.deltasynth.com/';
    this.history = [];
    this.changeListeners = [];
  }

  to(targetUrl) {
    this.history.push(targetUrl);
    this.url = targetUrl.startsWith('http') ? targetUrl : `${this.baseUrl}${targetUrl}`;

    try {
      const parsed = new URL(this.url);
      this.path = parsed.pathname.split('/').filter(Boolean);
      this.query = Object.fromEntries(parsed.searchParams.entries());
    } catch (_) {
      this.path = targetUrl.split('?')[0].split('/').filter(Boolean);
    }

    this.changeListeners.forEach(fn => {
      try {
        fn(this.url);
      } catch (_) {}
    });
  }

  onChange(callback) {
    if (typeof callback === 'function') {
      this.changeListeners.push(callback);
    }
  }
}

export const mockWixLocation = new MockWixLocation();

// ============================================================================
// 4. Mock wix-window Environment
// ============================================================================

export class MockWixWindow {
  constructor() {
    this.reset();
  }

  reset() {
    this.formFactor = 'Desktop';
    this.rendering = { env: 'browser', renderCycle: 1 };
    this.viewMode = 'Site';
    this.multilingual = { currentLanguage: 'th', siteLanguages: ['th', 'en'] };
    this.openedLightboxes = [];
    this.clipboardHistory = [];
  }

  setFormFactor(formFactor) {
    this.formFactor = formFactor;
  }

  openLightbox(name, data) {
    this.openedLightboxes.push({ name, data });
    return Promise.resolve({ closed: true });
  }

  copyToClipboard(text) {
    this.clipboardHistory.push(text);
    return Promise.resolve();
  }

  scrollTo(x, y) {
    return Promise.resolve();
  }

  getBoundingRect() {
    return Promise.resolve({
      window: { height: 1080, width: 1920 },
      document: { height: 2500, width: 1920 },
      scroll: { x: 0, y: 0 }
    });
  }
}

export const mockWixWindow = new MockWixWindow();

// ============================================================================
// 5. Mock HTML5 Audio Element
// ============================================================================

export class MockAudio {
  static instances = [];
  static simulateAutoplayRejection = false;
  static simulateNetworkError = false;

  static resetAll() {
    MockAudio.instances.forEach(inst => inst.pause());
    MockAudio.instances = [];
    MockAudio.simulateAutoplayRejection = false;
    MockAudio.simulateNetworkError = false;
  }

  constructor(src = '') {
    this.src = src;
    this.currentTime = 0;
    this.duration = 180;
    this.volume = 1.0;
    this.paused = true;
    this.ended = false;
    this.muted = false;
    this.readyState = 4;

    this.onplay = null;
    this.onpause = null;
    this.onended = null;
    this.onerror = null;
    this.ontimeupdate = null;

    this._eventListeners = new Map();
    MockAudio.instances.push(this);
  }

  addEventListener(event, handler) {
    if (typeof handler !== 'function') return;
    if (!this._eventListeners.has(event)) this._eventListeners.set(event, []);
    this._eventListeners.get(event).push(handler);
  }

  removeEventListener(event, handler) {
    if (!this._eventListeners.has(event)) return;
    const list = this._eventListeners.get(event);
    const idx = list.indexOf(handler);
    if (idx !== -1) list.splice(idx, 1);
  }

  _emit(event, data = {}) {
    if (typeof this[`on${event}`] === 'function') {
      try {
        this[`on${event}`](data);
      } catch (err) {
        console.error(`[MockAudio] Error in on${event} handler:`, err);
      }
    }
    const handlers = this._eventListeners.get(event) || [];
    handlers.forEach(h => {
      try {
        h(data);
      } catch (err) {
        console.error(`[MockAudio] Error in ${event} listener:`, err);
      }
    });
  }

  async play() {
    if (MockAudio.simulateNetworkError) {
      this.paused = true;
      this._emit('error', new Error('Network playback failure'));
      return Promise.reject(new Error('Network playback failure'));
    }

    if (MockAudio.simulateAutoplayRejection) {
      this.paused = true;
      const notAllowedErr = new Error('play() failed because the user didn\'t interact with the document first.');
      notAllowedErr.name = 'NotAllowedError';
      return Promise.reject(notAllowedErr);
    }

    this.paused = false;
    this.ended = false;
    this._emit('play');
    return Promise.resolve();
  }

  pause() {
    if (!this.paused) {
      this.paused = true;
      this._emit('pause');
    }
  }

  load() {
    this.currentTime = 0;
  }
}

// ============================================================================
// 6. Test Sandbox Setup & Teardown
// ============================================================================

export function setupTestEnvironment() {
  canvasEngine.reset();
  mockWixData.reset();
  mockWixLocation.reset();
  mockWixWindow.reset();
  MockAudio.resetAll();

  // Setup globals
  globalThis.$w = canvasEngine.createSelector();
  globalThis.Audio = MockAudio;

  // Initialize standard Toast container elements
  canvasEngine.registerElement('#toastContainer', 'Box');
  canvasEngine.registerElement('#toastMessage', 'Text');
  canvasEngine.registerElement('#toastAction', 'Button');
  canvasEngine.registerElement('#toastIcon', 'Text');

  return {
    $w: globalThis.$w,
    canvasEngine,
    mockWixData,
    mockWixLocation,
    mockWixWindow,
    MockAudio
  };
}

export function teardownTestEnvironment() {
  MockAudio.resetAll();
  canvasEngine.reset();
  delete globalThis.$w;
  delete globalThis.Audio;
}

// ============================================================================
// 7. Structured Log & Console Spy Utilities
// ============================================================================

export class ConsoleSpy {
  constructor() {
    this.logs = [];
    this.originalLog = console.log;
    this.originalWarn = console.warn;
    this.originalError = console.error;

    console.log = (...args) => {
      this.logs.push({ level: 'log', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), args, timestamp: Date.now() });
      this.originalLog.apply(console, args);
    };

    console.warn = (...args) => {
      this.logs.push({ level: 'warn', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), args, timestamp: Date.now() });
      this.originalWarn.apply(console, args);
    };

    console.error = (...args) => {
      this.logs.push({ level: 'error', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), args, timestamp: Date.now() });
      this.originalError.apply(console, args);
    };
  }

  restore() {
    console.log = this.originalLog;
    console.warn = this.originalWarn;
    console.error = this.originalError;
  }

  clear() {
    this.logs = [];
  }

  getLogs(level) {
    if (!level) return this.logs;
    return this.logs.filter(l => l.level === level);
  }

  hasLogMatching(pattern, level) {
    const list = this.getLogs(level);
    return list.some(l => (pattern instanceof RegExp ? pattern.test(l.message) : l.message.includes(pattern)));
  }
}

/**
 * Asserts that a log entry conforms to AGENT.md Section 11 format:
 * [Component] Action failed: <cause>. Suggested action: <next step>.
 */
export function assertStructuredLog(logMessage) {
  const structuredRegex = /^\[(?<component>[^\]]+)\] (?<action>.+) failed: (?<cause>.+)\. Suggested action: (?<suggestedAction>.+)\.$/;
  const match = logMessage.match(structuredRegex);
  assert.ok(match, `Log message "${logMessage}" does not match standard AGENT.md format: [Component] Action failed: <cause>. Suggested action: <next step>.`);
  return match.groups;
}

/**
 * Validates toast geometry against AGENT.md Section 9 specifications
 */
export function validateToastGeometry(theme) {
  const toast = theme.toast || {};
  assert.ok(toast.maxWidth <= 280, `Toast maxWidth ${toast.maxWidth} exceeds 280px limit`);
  assert.ok(toast.maxHeight <= 80, `Toast maxHeight ${toast.maxHeight} exceeds 80px limit`);
  assert.strictEqual(toast.offsetRight, 16, `Toast offsetRight must be 16px`);
  assert.strictEqual(toast.offsetBottom, 20, `Toast offsetBottom must be 20px`);
  assert.strictEqual(toast.borderRadius, 6, `Toast borderRadius must be 6px`);
  assert.strictEqual(theme.colors.primary, '#CC2200', `Theme primary color must be #CC2200`);
  assert.strictEqual(theme.colors.bgDark, '#1A1A1A', `Theme bgDark color must be #1A1A1A`);
  assert.strictEqual(theme.colors.textLight, '#F0F0F0', `Theme textLight color must be #F0F0F0`);
}

// ============================================================================
// 8. Mock HTTP Request Generator
// ============================================================================

export function createMockHttpRequest({ method = 'GET', path = [], query = {}, body = null, headers = {} } = {}) {
  return {
    method,
    path: Array.isArray(path) ? path : [path],
    query: query || {},
    headers: {
      'content-type': 'application/json',
      ...headers
    },
    body: {
      json: async () => {
        if (body === null || body === undefined) throw new Error('Empty or invalid JSON body');
        return body;
      },
      text: async () => JSON.stringify(body)
    }
  };
}

// ============================================================================
// 9. Zero-Dependency Dynamic Module Loader for .jsw and Public Modules
// ============================================================================

const moduleCache = new Map();

export async function loadModule(specifier) {
  let filePath;
  if (specifier.startsWith('public/')) {
    const sub = specifier.slice('public/'.length);
    filePath = path.resolve(process.cwd(), 'src/public', (sub.endsWith('.js') || sub.endsWith('.json')) ? sub : `${sub}.js`);
  } else if (specifier.startsWith('backend/')) {
    const sub = specifier.slice('backend/'.length);
    filePath = path.resolve(process.cwd(), 'src/backend', sub);
  } else if (path.isAbsolute(specifier)) {
    filePath = specifier;
  } else {
    filePath = path.resolve(process.cwd(), specifier);
  }

  if (moduleCache.has(filePath)) {
    return moduleCache.get(filePath);
  }

  if (filePath.endsWith('.json')) {
    const content = await fs.promises.readFile(filePath, 'utf8');
    const json = JSON.parse(content);
    const mod = { default: json, ...json };
    moduleCache.set(filePath, mod);
    return mod;
  }

  try {
    const mod = await import(pathToFileURL(filePath).href);
    moduleCache.set(filePath, mod);
    return mod;
  } catch (err) {
    if (err.code === 'ERR_UNKNOWN_FILE_EXTENSION' || err.message.includes('Unknown file extension') || err.code === 'ERR_MODULE_NOT_FOUND' || err.message.includes('Cannot find module') || err.code === 'ERR_IMPORT_ATTRIBUTE_MISSING') {
      const mod = await importViaDataUri(filePath);
      moduleCache.set(filePath, mod);
      return mod;
    }
    throw err;
  }
}

async function importViaDataUri(filePath, visited = new Map()) {
  if (visited.has(filePath)) {
    return visited.get(filePath);
  }

  async function processCode(srcPath) {
    let code = await fs.promises.readFile(srcPath, 'utf8');

    // Replace public imports
    code = code.replace(/from\s+['"]public\/([^'"]+)['"]/g, (m, p) => {
      const target = path.resolve(process.cwd(), 'src/public', (p.endsWith('.js') || p.endsWith('.json')) ? p : `${p}.js`);
      return `from ${JSON.stringify(pathToFileURL(target).href)}`;
    });

    // Replace backend imports
    const backendMatches = [...code.matchAll(/from\s+['"]backend\/([^'"]+)['"]/g)];
    for (const match of backendMatches) {
      const sub = match[1];
      const target = path.resolve(process.cwd(), 'src/backend', sub);
      if (target.endsWith('.jsw')) {
        const depCode = await processCode(target);
        const depDataUri = `data:text/javascript;charset=utf-8,${encodeURIComponent(depCode)}`;
        code = code.replace(match[0], `from ${JSON.stringify(depDataUri)}`);
      } else {
        code = code.replace(match[0], `from ${JSON.stringify(pathToFileURL(target).href)}`);
      }
    }

    return code;
  }

  const processedCode = await processCode(filePath);
  const dataUri = `data:text/javascript;charset=utf-8,${encodeURIComponent(processedCode)}`;
  const mod = await import(dataUri);
  visited.set(filePath, mod);
  return mod;
}

export async function loadPublicModule(name) {
  return loadModule(`public/${name}`);
}

export async function loadBackendModule(name) {
  return loadModule(`backend/${name}`);
}

export default {
  MockElement,
  MockRepeater,
  canvasEngine,
  mockWixData,
  mockWixLocation,
  mockWixWindow,
  MockAudio,
  setupTestEnvironment,
  teardownTestEnvironment,
  ConsoleSpy,
  assertStructuredLog,
  validateToastGeometry,
  createMockHttpRequest,
  loadModule,
  loadPublicModule,
  loadBackendModule
};
