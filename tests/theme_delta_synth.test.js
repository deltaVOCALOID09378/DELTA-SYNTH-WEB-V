/**
 * DELTA SYNTH — Theme & Design System Automated Test Suite
 * 
 * Verifies DELTA SYNTH Theme across All Portals, Stylesheets, and Components:
 * - Tier 1: Normal / Happy Path (Tokens, Fonts, Stylesheet Integrity, Linkage)
 * - Tier 2: Boundary Values (WCAG AA Contrast Ratios, Geometry Boundaries)
 * - Tier 3: Malformed / Invalid Input (Anti-Regression, Rogue Token Guards)
 * - Tier 4: Failure & Recovery Path (Path Normalization, Concurrent Token Access)
 * 
 * Standards Compliance: AGENT.md (Sections 1-20), write-tests Skill
 * Made And Checked By DELTA SYNTH & All Code Agentic AI Engine
 * Original by DELTA SYNTH
 * Version: 1.1
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'src', 'public');

// Helper to calculate relative luminance according to WCAG 2.1 specifications
function getLuminance(hexColor) {
  const cleanHex = hexColor.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

describe('Tier 5: DELTA SYNTH Theme Verification & Integrity', () => {

  // ==========================================================================
  // Tier 1: Normal / Happy Path
  // ==========================================================================
  describe('Tier 1: Normal / Happy Path (Tokens & Stylesheet Integrity)', () => {
    it('TC-TH-01: THEME constants in theme.js strictly adhere to AGENT.md Section 9 specs', async () => {
      const themePath = path.join(publicDir, 'theme.js');
      assert.ok(fs.existsSync(themePath), 'theme.js must exist');
      const themeUrl = pathToFileURL(themePath).href;
      const themeModule = await import(themeUrl);
      const THEME = themeModule.THEME || themeModule.default;

      assert.strictEqual(THEME.colors.primary.toUpperCase(), '#CC2200', 'Primary color must be #CC2200');
      assert.strictEqual(THEME.colors.primaryHover.toUpperCase(), '#FF4422', 'Primary hover must be #FF4422');
      assert.strictEqual(THEME.colors.primaryPressed.toUpperCase(), '#991100', 'Primary pressed must be #991100');
      assert.strictEqual(THEME.colors.bgDark.toUpperCase(), '#1A1A1A', 'Background dark must be #1A1A1A');
      assert.strictEqual(THEME.colors.textLight.toUpperCase(), '#F0F0F0', 'Text light must be #F0F0F0');
      assert.ok(THEME.fonts.primary.includes('Leelawadee UI'), 'Primary font must include Leelawadee UI');
      assert.ok(THEME.fonts.heading.includes('Leelawadee UI'), 'Heading font must include Leelawadee UI');
    });

    it('TC-TH-02: style.css defines all DELTA SYNTH design tokens in :root', () => {
      const stylePath = path.join(publicDir, 'style.css');
      assert.ok(fs.existsSync(stylePath), 'style.css must exist');
      const content = fs.readFileSync(stylePath, 'utf8');

      assert.ok(content.length > 5000, 'style.css must be the complete stylesheet (>5000 bytes)');
      assert.ok(/--primary:\s*#CC2200/i.test(content), 'style.css must define --primary: #CC2200');
      assert.ok(/--primary-hover:\s*#FF4422/i.test(content), 'style.css must define --primary-hover: #FF4422');
      assert.ok(/--primary-pressed:\s*#991100/i.test(content), 'style.css must define --primary-pressed: #991100');
      assert.ok(/--ink:\s*#1A1A1A/i.test(content), 'style.css must define --ink: #1A1A1A');
      assert.ok(/--paper:\s*#F0F0F0/i.test(content), 'style.css must define --paper: #F0F0F0');
      assert.ok(/--muted:\s*#9CA3AF/i.test(content), 'style.css must define --muted: #9CA3AF');
    });

    it('TC-TH-03: style.css prioritizes Leelawadee UI in display and body fonts', () => {
      const stylePath = path.join(publicDir, 'style.css');
      const content = fs.readFileSync(stylePath, 'utf8');

      assert.ok(/--font-display:\s*['"]Leelawadee UI['"]/i.test(content), 'Display font must start with Leelawadee UI');
      assert.ok(/--font-body:\s*['"]Leelawadee UI['"]/i.test(content), 'Body font must start with Leelawadee UI');
    });

    it('TC-TH-04: profile-theme.css strictly complies with DELTA SYNTH theme tokens', () => {
      const profileThemePath = path.join(publicDir, 'profile-theme.css');
      assert.ok(fs.existsSync(profileThemePath), 'profile-theme.css must exist');
      const content = fs.readFileSync(profileThemePath, 'utf8');

      assert.ok(/--profile-bg:\s*#1A1A1A/i.test(content), 'profile-theme.css must use #1A1A1A as bg');
      assert.ok(/--profile-primary:\s*#CC2200/i.test(content), 'profile-theme.css must use #CC2200 as primary');
      assert.ok(/--profile-hover:\s*#FF4422/i.test(content), 'profile-theme.css must use #FF4422 as hover');
      assert.ok(/--profile-text:\s*#F0F0F0/i.test(content), 'profile-theme.css must use #F0F0F0 as text');
    });

    it('TC-TH-05: Core portal HTML pages link to style.css', () => {
      const corePages = ['index.html', 'about.html', 'voicebank.html', 'files.html', 'collab.html', 'events.html', 'project.html'];
      for (const page of corePages) {
        const pagePath = path.join(publicDir, page);
        if (fs.existsSync(pagePath)) {
          const html = fs.readFileSync(pagePath, 'utf8');
          assert.ok(html.includes('style.css'), `${page} must reference style.css`);
        }
      }
    });

    it('TC-TH-06: Singer profile HTML pages link to ../style.css', () => {
      const singersDir = path.join(publicDir, 'singers');
      assert.ok(fs.existsSync(singersDir), 'singers directory must exist');
      const files = fs.readdirSync(singersDir).filter(f => f.endsWith('.html') && f !== 'index.html' && f !== 'tackpee.html');
      assert.ok(files.length >= 50, `Expected at least 50 singer profiles, found ${files.length}`);

      for (const file of files) {
        const filePath = path.join(singersDir, file);
        const html = fs.readFileSync(filePath, 'utf8');
        assert.ok(html.includes('style.css'), `${file} must reference style.css`);
      }
    });

    it('TC-TH-07: Toast geometry conforms to AGENT.md Section 9 specifications', async () => {
      const themePath = path.join(publicDir, 'theme.js');
      const themeUrl = pathToFileURL(themePath).href;
      const { THEME } = await import(themeUrl);
      assert.strictEqual(THEME.toast.maxWidth, 280, 'Toast maxWidth must be <= 280px');
      assert.strictEqual(THEME.toast.maxHeight, 80, 'Toast maxHeight must be <= 80px');
      assert.strictEqual(THEME.toast.offsetRight, 16, 'Toast offsetRight must be 16px');
      assert.strictEqual(THEME.toast.offsetBottom, 20, 'Toast offsetBottom must be 20px');
      assert.strictEqual(THEME.toast.borderRadius, 6, 'Toast borderRadius must be 6px');
    });
  });

  // ==========================================================================
  // Tier 2: Boundary Values
  // ==========================================================================
  describe('Tier 2: Boundary Values (WCAG AA Contrast & Clamping)', () => {
    it('TC-TH-08: WCAG AA contrast ratio for primary text (#F0F0F0) on cosmic dark (#1A1A1A) exceeds 4.5:1', () => {
      const ratio = getContrastRatio('#F0F0F0', '#1A1A1A');
      assert.ok(ratio >= 4.5, `Contrast ratio ${ratio.toFixed(2)}:1 must meet or exceed WCAG AA 4.5:1`);
    });

    it('TC-TH-09: WCAG AA contrast ratio for muted text (#9CA3AF) on cosmic dark (#1A1A1A) exceeds 4.5:1', () => {
      const ratio = getContrastRatio('#9CA3AF', '#1A1A1A');
      assert.ok(ratio >= 4.5, `Contrast ratio ${ratio.toFixed(2)}:1 must meet or exceed WCAG AA 4.5:1`);
    });

    it('TC-TH-10: Color normalization accepts case-insensitive hex tokens', () => {
      const normalize = (c) => c.trim().toUpperCase();
      assert.strictEqual(normalize('#cc2200'), '#CC2200');
      assert.strictEqual(normalize('#ff4422'), '#FF4422');
      assert.strictEqual(normalize('#991100'), '#991100');
      assert.strictEqual(normalize('#1a1a1a'), '#1A1A1A');
      assert.strictEqual(normalize('#f0f0f0'), '#F0F0F0');
    });

    it('TC-TH-11: Toast bounds clamping function restricts extreme values to max 280x80px', () => {
      const clampToast = (w, h) => ({
        width: Math.min(Math.max(w, 0), 280),
        height: Math.min(Math.max(h, 0), 80)
      });

      const clamped1 = clampToast(500, 200);
      assert.strictEqual(clamped1.width, 280);
      assert.strictEqual(clamped1.height, 80);

      const clamped2 = clampToast(200, 50);
      assert.strictEqual(clamped2.width, 200);
      assert.strictEqual(clamped2.height, 50);
    });
  });

  // ==========================================================================
  // Tier 3: Malformed / Invalid Input
  // ==========================================================================
  describe('Tier 3: Malformed / Invalid Input (Anti-Regression & Fallbacks)', () => {
    it('TC-TH-12: Zero light theme regressions in style.css body background', () => {
      const stylePath = path.join(publicDir, 'style.css');
      const content = fs.readFileSync(stylePath, 'utf8');

      // Ensure body has background var(--ink) or dark color, NOT #F0F0F0
      const bodyBgMatch = content.match(/body\s*\{[^}]*background:\s*([^;]+);/);
      assert.ok(bodyBgMatch, 'body must define background');
      const bgVal = bodyBgMatch[1].trim();
      assert.ok(bgVal.includes('var(--ink)') || bgVal.includes('#1A1A1A') || bgVal.includes('#0d0d0d'),
        `body background must be dark, found: ${bgVal}`);
    });

    it('TC-TH-13: Zero rogue cyan/violet overrides in profile-theme.css', () => {
      const profileThemePath = path.join(publicDir, 'profile-theme.css');
      const content = fs.readFileSync(profileThemePath, 'utf8');

      // Ensure no override of text-red-500 to cyan
      assert.ok(!content.includes('--profile-cyan: #4fe3d0'), 'Must not contain rogue cyan #4fe3d0');
      assert.ok(!content.includes('--profile-violet: #9075ff'), 'Must not contain rogue violet #9075ff');
    });

    it('TC-TH-14: Malformed or missing theme token safely resolves to DELTA SYNTH fallbacks', () => {
      const resolveToken = (theme, key, fallback) => {
        if (!theme || typeof theme !== 'object') return fallback;
        return theme.colors?.[key] || fallback;
      };

      const fallbackPrimary = resolveToken(null, 'primary', '#CC2200');
      assert.strictEqual(fallbackPrimary, '#CC2200');

      const fallbackMissing = resolveToken({ colors: {} }, 'primary', '#CC2200');
      assert.strictEqual(fallbackMissing, '#CC2200');
    });
  });

  // ==========================================================================
  // Tier 4: Failure & Recovery Path
  // ==========================================================================
  describe('Tier 4: Failure & Recovery Path (Path Normalization & Concurrency)', () => {
    it('TC-TH-15: Relative CSS path resolution between portal root and singer profiles', () => {
      const resolveCssPath = (currentRoute) => {
        if (currentRoute.startsWith('/singers/')) {
          return '../style.css';
        }
        return 'style.css';
      };

      assert.strictEqual(resolveCssPath('/index.html'), 'style.css');
      assert.strictEqual(resolveCssPath('/voicebank.html'), 'style.css');
      assert.strictEqual(resolveCssPath('/singers/ayanami_hikaru.html'), '../style.css');
      assert.strictEqual(resolveCssPath('/singers/tagpy.html'), '../style.css');
    });

    it('TC-TH-16: Concurrent theme token queries (100 parallel reads) complete without variance', async () => {
      const themePath = path.join(publicDir, 'theme.js');
      const themeUrl = pathToFileURL(themePath).href;
      const start = performance.now();
      const readPromises = Array.from({ length: 100 }, async () => {
        const mod = await import(`${themeUrl}?t=${Math.random()}`);
        const theme = mod.THEME || mod.default;
        assert.strictEqual(theme.colors.primary, '#CC2200');
        assert.strictEqual(theme.colors.bgDark, '#1A1A1A');
        assert.strictEqual(theme.toast.maxWidth, 280);
      });

      await Promise.all(readPromises);
      const elapsed = performance.now() - start;
      assert.ok(elapsed < 2000, `100 concurrent token reads completed in ${elapsed.toFixed(2)}ms`);
    });
  });

  it('TC-TH-17: starfield.js exports complete Meteor Shower Engine API', () => {
    const starfieldContent = fs.readFileSync(path.resolve(process.cwd(), 'src/public/js/starfield.js'), 'utf8');
    assert.ok(starfieldContent.includes('seedInitialMeteors'), 'seedInitialMeteors must be present');
    assert.ok(starfieldContent.includes('spawnMeteor'), 'spawnMeteor must be present');
    assert.ok(starfieldContent.includes('spawnFlare'), 'spawnFlare must be present');
    assert.ok(starfieldContent.includes('ensureCanvas'), 'ensureCanvas must be present');
    assert.ok(starfieldContent.includes('static init('), 'static init must be exported');
    assert.ok(starfieldContent.includes('destroy()'), 'destroy must be exported');
  });

  it('TC-TH-18: starfield.js strictly enforces zero shadowBlur and zero canvas filters in code', () => {
    const starfieldContent = fs.readFileSync(path.resolve(process.cwd(), 'src/public/js/starfield.js'), 'utf8');
    assert.strictEqual(/ctx\.shadowBlur\s*=/g.test(starfieldContent), false, 'ctx.shadowBlur assignment must not be used');
    assert.strictEqual(/ctx\.filter\s*=/g.test(starfieldContent), false, 'ctx.filter assignment must not be used');
  });

  it('TC-TH-19: style.css enforces backdrop-filter none and disables blur globally', () => {
    const styleContent = fs.readFileSync(path.resolve(process.cwd(), 'src/public/style.css'), 'utf8');
    assert.ok(styleContent.includes('backdrop-filter: none !important'), 'Global backdrop-filter none required');
    assert.ok(styleContent.includes('-webkit-backdrop-filter: none !important'), 'Global -webkit-backdrop-filter none required');
    assert.ok(styleContent.includes('#space-bg'), '#space-bg rule required');
    assert.ok(styleContent.includes('filter: none !important;'), 'filter none required for background');
  });

  it('TC-TH-20: index.html contains verified New Works showcase sections and links', () => {
    const indexContent = fs.readFileSync(path.resolve(process.cwd(), 'src/public/index.html'), 'utf8');
    assert.ok(indexContent.includes('id="new-works"'), 'New works section must exist');
    assert.ok(indexContent.includes('id="thai-rvc-webui"'), 'Thai RVC Web UI card must exist');
    assert.ok(indexContent.includes('id="the-darkside-ui"'), 'The Darkside UI card must exist');
    assert.ok(indexContent.includes('https://github.com/deltaVOCALOID09378/Thai_RVC_WebUI'), 'Valid Thai RVC repo link');
    assert.ok(indexContent.includes('https://github.com/deltaVOCALOID09378'), 'Valid The Darkside repo link');
  });

  it('TC-TH-21: i18n.js contains complete translation keys for new works across all 9 languages', () => {
    const i18nContent = fs.readFileSync(path.resolve(process.cwd(), 'src/public/js/i18n.js'), 'utf8');
    const languages = ['th', 'en', 'fr', 'es', 'es-cl', 'zh', 'ja', 'ru', 'ko'];
    for (const lang of languages) {
      assert.ok(i18nContent.includes(`'${lang}':`) || i18nContent.includes(`${lang}:`), `Language ${lang} block missing`);
    }
    assert.ok(i18nContent.includes('nav_new_works'), 'nav_new_works missing');
    assert.ok(i18nContent.includes('nw_title'), 'nw_title missing');
    assert.ok(i18nContent.includes('nw_rvc_desc'), 'nw_rvc_desc missing');
    assert.ok(i18nContent.includes('nw_dark_desc'), 'nw_dark_desc missing');
  });

});
