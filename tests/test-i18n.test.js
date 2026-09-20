import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('i18n System Integrity & Multi-Language Coverage', async (t) => {
  const i18nPath = path.resolve('src/public/js/i18n.js');
  assert.ok(fs.existsSync(i18nPath), 'src/public/js/i18n.js must exist');

  const content = fs.readFileSync(i18nPath, 'utf8');

  // Verify all 9 languages are defined in LANGUAGES array
  const expectedLangs = ['th', 'en', 'fr', 'es', 'es-cl', 'zh', 'ja', 'ru', 'ko'];
  for (const lang of expectedLangs) {
    assert.ok(content.includes(`code: '${lang}'`), `Language code '${lang}' must be present in LANGUAGES`);
    assert.ok(content.includes(`${lang === 'es-cl' ? "'es-cl'" : lang}: {`), `Language '${lang}' must have a TRANSLATIONS dictionary`);
  }

  // Verify key UI elements exist across dictionaries
  const keyTokens = [
    'nav_main',
    'nav_about',
    'nav_voicebank',
    'nav_files',
    'nav_collab',
    'nav_events',
    'hero_title',
    'hero_desc',
    'hero_btn_drive',
    'vb_hero_title',
    'vb_drive_banner_title',
    'profile_return',
    'profile_age',
    'profile_gender',
    'profile_private_title',
    'profile_private_desc',
    'profile_private_badge',
    'footer_rights',
    'footer_made_by'
  ];

  for (const token of keyTokens) {
    assert.ok(content.includes(`${token}:`), `Translation key '${token}' must be defined in translations`);
  }

  // Parity check: src/public/js/i18n.js vs src/pages/js/i18n.js
  const pagesI18nPath = path.resolve('src/pages/js/i18n.js');
  assert.ok(fs.existsSync(pagesI18nPath), 'src/pages/js/i18n.js must exist');
  assert.equal(fs.readFileSync(pagesI18nPath, 'utf8'), content, 'src/pages/js/i18n.js must be identical to src/public/js/i18n.js');

  // Verify style.css contains .lang-switcher styles
  const css = fs.readFileSync('src/public/style.css', 'utf8');
  assert.ok(css.includes('.lang-switcher'), 'style.css must contain .lang-switcher');
  assert.ok(css.includes('.lang-btn'), 'style.css must contain .lang-btn');
  assert.ok(css.includes('.lang-dropdown'), 'style.css must contain .lang-dropdown');

  // Verify all singer files have i18n script tag
  const singerFiles = fs.readdirSync('src/public/singers').filter(f => f.endsWith('.html'));
  for (const f of singerFiles) {
    const singerContent = fs.readFileSync(path.join('src/public/singers', f), 'utf8');
    assert.ok(singerContent.includes('i18n.js'), `Singer profile '${f}' must include i18n.js`);
  }

  // Verify main public pages have i18n script tag
  const mainPages = ['index.html', 'about.html', 'voicebank.html', 'files.html', 'collab.html', 'events.html'];
  for (const p of mainPages) {
    const pageContent = fs.readFileSync(path.join('src/public', p), 'utf8');
    assert.ok(pageContent.includes('i18n.js'), `Main page '${p}' must include i18n.js`);
  }
});
