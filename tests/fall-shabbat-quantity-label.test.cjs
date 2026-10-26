const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { createHash } = require('node:crypto');
const { JSDOM, VirtualConsole } = require('jsdom');

const assetPath = 'site-code/footer-23-be9674432d27.css';
const source = readFileSync(assetPath, 'utf8');
const manifest = JSON.parse(readFileSync('site-code/migration-manifest.json', 'utf8'));
const labelSelector = 'body.tc-shabbat-night-page-v5 #RegisterBody .toggle_options > .inline_block:has(> #performance_32450_quantityOfAttendees) > div:first-child';

test('quantity label alignment asset matches its immutable content hash', () => {
  assert.equal(
    createHash('sha256').update(source).digest('hex'),
    'be9674432d27407c5cba0c4a1d19200abeaee02d2e0ce4b73a71443d0b5a832c'
  );
});

test('quantity label alignment manifest metadata matches the immutable asset', () => {
  const entry = manifest.find(item => item.path === assetPath);
  assert.deepEqual(entry, {
    path: assetPath,
    filename: 'footer-23-be9674432d27.css',
    tag: 'style',
    attributes: ' id="tc-fall-quantity-label-center"',
    sha256: 'be9674432d27407c5cba0c4a1d19200abeaee02d2e0ce4b73a71443d0b5a832c',
    bytes: 258,
    characters: 258
  });
});

test('quantity label alignment targets only the intended event and native quantity label', () => {
  assert.match(source, /^\/\*[^]*?\*\/\s*body\.tc-shabbat-night-page-v5\s/);
  assert.match(source, /#performance_32450_quantityOfAttendees/);
  assert.match(source, /text-align:\s*center\s*!important/);
  assert.doesNotMatch(source, /#performance_32450_priceCategory/);
  assert.doesNotMatch(source, /(?:width|height|display|position|margin|padding)\s*:/);
  assert.doesNotMatch(source, /@import\b/i);
});

test('quantity label selector matches the label but not the guest type label or select', () => {
  const dom = new JSDOM(`<!doctype html><body class="tc-shabbat-night-page-v5">
    <div id="RegisterBody"><div class="toggle_options">
      <div class="inline_block"><div>Guest type</div><select id="performance_32450_priceCategory"></select></div>
      <div class="inline_block"><div>Number of guests</div><select id="performance_32450_quantityOfAttendees"></select></div>
    </div></div>
  </body>`);

  try {
    const matches = dom.window.document.querySelectorAll(labelSelector);
    assert.equal(matches.length, 1);
    assert.equal(matches[0].textContent, 'Number of guests');
    assert.equal(matches[0].nextElementSibling.id, 'performance_32450_quantityOfAttendees');
    dom.window.document.body.classList.remove('tc-shabbat-night-page-v5');
    assert.equal(dom.window.document.querySelectorAll(labelSelector).length, 0);
  } finally {
    dom.window.close();
  }
});

test('quantity label alignment stylesheet parses without browser CSS errors', () => {
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
