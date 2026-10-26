const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { createHash } = require('node:crypto');
const { JSDOM, VirtualConsole } = require('jsdom');

const assetPath = 'site-code/footer-20-9edaba2cee18.css';
const source = readFileSync(assetPath, 'utf8');

test('fall photo refresh filename matches its immutable content hash', () => {
  assert.equal(createHash('sha256').update(source).digest('hex'), '9edaba2cee187be4cd934208a81c4d398ad51cb54c774d5643a16bca3f3bf6ea');
});

test('fall photo refresh remains scoped to the intended event body class', () => {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, '');
  const selectorBlocks = css.match(/(?:^|})\s*([^@{}][^{}]*)\{/g) || [];
  const selectors = selectorBlocks
    .map(block => block.replace(/^}\s*/, '').replace(/\{$/, '').trim())
    .filter(group => group && !group.startsWith('@'));

  selectors.forEach(group => {
    group.split(',').forEach(selector => {
      assert.match(selector.trim(), /^body\.tc-shabbat-night-page-v5(?:\s|$)/, selector);
    });
  });
  assert.doesNotMatch(source, /@import\b/i);
});

test('fall photo refresh uses the approved HTTPS image with a local color fallback', () => {
  const urls = [...source.matchAll(/url\("([^"]+)"\)/g)].map(match => match[1]);
  assert.equal(urls.length, 3);
  urls.forEach(url => {
    assert.match(url, /^https:\/\/images\.unsplash\.com\/photo-1767547909570-c96777094294\?/);
  });
  assert.equal((source.match(/background-color:\s*#132c25\s*!important;/g) || []).length, 3);
  assert.match(source, /linear-gradient\(/);
  assert.match(source, /background:\s*[\s\S]*url\(/);
});

test('fall photo stylesheet parses without browser CSS errors', () => {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { virtualConsole });
  try {
    const style = dom.window.document.createElement('style');
    style.textContent = source;
    dom.window.document.head.appendChild(style);
    assert.ok(style.sheet);
    assert.deepEqual(errors, []);
  } finally {
    dom.window.close();
  }
});
