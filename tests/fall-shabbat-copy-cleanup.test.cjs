const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { createHash } = require('node:crypto');
const { JSDOM, VirtualConsole } = require('jsdom');

const notePath = 'site-code/footer-21-81351837868a.js';
const kickerPath = 'site-code/footer-22-300e977e0dd1.css';
const noteSource = readFileSync(notePath, 'utf8');
const kickerSource = readFileSync(kickerPath, 'utf8');

test('copy and kicker cleanup assets match their immutable content hashes', () => {
  assert.equal(
    createHash('sha256').update(noteSource).digest('hex'),
    '81351837868a9f6c5ae5286a963c3939598913fdfbfe858c13b5dc9f30a375fd'
  );
  assert.equal(
    createHash('sha256').update(kickerSource).digest('hex'),
    '300e977e0dd1e91f0c8b59f5c08fac2d9969cc543769aa64300cb99eca06e02a'
  );
});

test('welcome note contains only the requested reassurance and stays corrected', async () => {
  const dom = new JSDOM(
    '<!doctype html><div id="tcShabbatNightIntroV5"><div class="tc-help-note">Adult group: $80 for up to four adults, then $20 per additional adult. Choose whatever works for you. Everyone is welcome.</div></div>',
    {
      runScripts: 'dangerously',
      url: 'https://www.jewishtricities.com/tools/events/register_cdo/eventid/23975'
    }
  );

  try {
    dom.window.eval(noteSource);
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
    const note = dom.window.document.querySelector('.tc-help-note');
    assert.equal(note.textContent, 'Choose whatever works for you. Everyone is welcome.');

    note.textContent = 'Adult group: $80 for up to four adults.';
    await new Promise(resolve => dom.window.setTimeout(resolve, 0));
    assert.equal(note.textContent, 'Choose whatever works for you. Everyone is welcome.');
  } finally {
    dom.window.__tcFallWelcomeNoteCleanupV1?.observer?.disconnect();
    dom.window.close();
  }
});

test('welcome note catches an intro inserted after initialization', async () => {
  const dom = new JSDOM('<!doctype html><main></main>', {
    runScripts: 'dangerously',
    url: 'https://www.jewishtricities.com/tools/events/register_cdo/eventid/23975'
  });

  try {
    dom.window.eval(noteSource);
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
    const intro = dom.window.document.createElement('section');
    intro.id = 'tcShabbatNightIntroV5';
    intro.innerHTML = '<div class="tc-help-note">Adult group: $80 for up to four adults.</div>';
    dom.window.document.querySelector('main').appendChild(intro);
    await new Promise(resolve => dom.window.setTimeout(resolve, 0));
    assert.equal(intro.querySelector('.tc-help-note').textContent, 'Choose whatever works for you. Everyone is welcome.');
  } finally {
    dom.window.__tcFallWelcomeNoteCleanupV1?.observer?.disconnect();
    dom.window.close();
  }
});

test('welcome note initializes only once when the asset is evaluated twice', async () => {
  const dom = new JSDOM(
    '<!doctype html><div id="tcShabbatNightIntroV5"><div class="tc-help-note">Old copy.</div></div>',
    {
      runScripts: 'dangerously',
      url: 'https://www.jewishtricities.com/tools/events/register_cdo/eventid/23975'
    }
  );

  try {
    const NativeMutationObserver = dom.window.MutationObserver;
    let observerCount = 0;
    dom.window.MutationObserver = class extends NativeMutationObserver {
      constructor(callback) {
        super(callback);
        observerCount += 1;
      }
    };
    dom.window.eval(noteSource);
    dom.window.eval(noteSource);
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
    await new Promise(resolve => dom.window.setTimeout(resolve, 0));
    assert.equal(observerCount, 1);
    assert.equal(dom.window.document.querySelector('.tc-help-note').textContent, 'Choose whatever works for you. Everyone is welcome.');
  } finally {
    dom.window.__tcFallWelcomeNoteCleanupV1?.observer?.disconnect();
    dom.window.close();
  }
});

test('welcome note script is limited to the exact intended event URL', () => {
  const dom = new JSDOM(
    '<!doctype html><div id="tcShabbatNightIntroV5"><div class="tc-help-note">Keep this text.</div></div>',
    {
      runScripts: 'dangerously',
      url: 'https://www.jewishtricities.com/tools/events/register_cdo/eventid/239750'
    }
  );

  try {
    dom.window.eval(noteSource);
    dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
    assert.equal(dom.window.document.querySelector('.tc-help-note').textContent, 'Keep this text.');
  } finally {
    dom.window.close();
  }
});

test('kicker cleanup removes the badge and decorative dots while staying event-scoped', () => {
  const css = kickerSource.replace(/\/\*[\s\S]*?\*\//g, '');
  const selectorBlocks = css.match(/(?:^|})\s*([^@{}][^{}]*)\{/g) || [];
  const selectors = selectorBlocks
    .map(block => block.replace(/^}\s*/, '').replace(/\{$/, '').trim())
    .filter(group => group && !group.startsWith('@'));

  selectors.forEach(group => {
    group.split(',').forEach(selector => {
      assert.match(selector.trim(), /^body\.tc-shabbat-night-page-v5(?:\s|$)/, selector);
    });
  });
  assert.match(kickerSource, /background:\s*transparent\s*!important/);
  assert.match(kickerSource, /border:\s*0\s*!important/);
  assert.match(kickerSource, /border-radius:\s*0\s*!important/);
  assert.match(kickerSource, /content:\s*none\s*!important/);
  assert.doesNotMatch(kickerSource, /@import\b/i);
});

test('kicker cleanup stylesheet parses without browser CSS errors', () => {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { virtualConsole });

  try {
    const style = dom.window.document.createElement('style');
    style.textContent = kickerSource;
    dom.window.document.head.appendChild(style);
    assert.ok(style.sheet);
    assert.deepEqual(errors, []);
  } finally {
    dom.window.close();
  }
});
