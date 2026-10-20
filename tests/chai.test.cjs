const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { JSDOM, VirtualConsole } = require('jsdom');
const source = readFileSync('chai-club.js', 'utf8');
const fixture = readFileSync('tests/fixtures/chai.html', 'utf8');

function page(html = fixture, path = '/chai') {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => { if (error.type !== 'css parsing') errors.push(error.message); });
  const dom = new JSDOM(html, { virtualConsole, url: `https://www.jewishtricities.com${path}`, runScripts: 'outside-only' });
  const ticks = [];
  dom.window.setInterval = fn => (ticks.push(fn), ticks.length);
  dom.window.clearInterval = () => {};
  const nativeForm = dom.window.document.getElementById("5995797");
  const originalControls = nativeForm ? [...nativeForm.elements] : [];
  const originalContract = nativeForm ? contract(nativeForm) : null;
  dom.window.eval(source);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  return { dom, close() { dom.window.close(); assert.deepEqual(errors, [], "No initialization errors"); }, originalControls, originalContract, document: dom.window.document, rerun() { ticks.forEach(fn => fn()); } };
}

function contract(form) {
  return { action: form.getAttribute('action'), method: form.method, submit: form.getAttribute('onsubmit'),
    controls: [...form.elements].map(e => [e.id, e.name, e.type, e.required, e.getAttribute('onchange')]).sort((a,b) => a[0].localeCompare(b[0])) };
}

test('production missing-wrapper shape is restored without swallowing partners', () => {
  const p = page();
  try {
    assert.equal(p.document.querySelectorAll('.chai-intro').length, 1);
    assert.equal(p.document.querySelector('.chai-intro-copy').parentElement, p.document.querySelector('.chai-intro'));
    assert.equal(p.document.querySelector('.chai-impact-list').parentElement, p.document.querySelector('.chai-intro'));
    assert.equal(p.document.querySelectorAll('.chai-faq').length, 1);
    assert.equal(p.document.querySelector('.chai-faq-head').parentElement, p.document.querySelector('.chai-faq'));
    assert.equal(p.document.querySelector('.chai-faq-list').parentElement, p.document.querySelector('.chai-faq'));
    assert.equal(p.document.querySelector('.chai-faq .chai-partners'), null);
    assert.equal(p.document.querySelector('.chai-faq').getAttribute('aria-labelledby'), 'chai-faq-title');
  } finally { p.close(); }
});

test('all repeated initialization preserves original controls, listeners and form contract', () => {
  const p = page();
  try {
    const form = p.document.getElementById('5995797');
    const before = p.originalContract, controls = p.originalControls;
    const intro = p.document.querySelector('.chai-intro-copy'), faq = p.document.querySelector('.chai-faq-list');
    let changes = 0;
    controls[0].addEventListener('change', () => changes++);
    for (let i = 0; i < 45; i++) p.rerun();
    p.dom.window.eval(source);
    p.document.dispatchEvent(new p.dom.window.Event('DOMContentLoaded'));
    assert.deepEqual(contract(form), before);
    controls.forEach(control => assert.ok([...form.elements].includes(control)));
    controls[0].dispatchEvent(new p.dom.window.Event('change', { bubbles: true }));
    assert.equal(changes, 1);
    assert.equal(p.document.querySelector('.chai-intro-copy'), intro);
    assert.equal(p.document.querySelector('.chai-faq-list'), faq);
    for (const selector of ['.chai-intro', '.chai-faq', '#tc-chai-refinement-styles', '#tc-chai-join-panel', '#tc-chai-continuity', '.tc-chai-hero-action', '.tc-chai-hero-grid', '.tc-chai-hero-art']) {
      assert.equal(p.document.querySelectorAll(selector).length, 1, selector);
    }
    assert.equal(p.document.querySelectorAll('.tc-chai-impact-art').length, 3);
  } finally { p.close(); }
});

test('editorial imagery is decorative, remote, and does not alter native fields', () => {
  const p = page();
  try {
    const images = [...p.document.querySelectorAll('.tc-chai-hero-art img, .tc-chai-impact-art img')];
    assert.equal(images.length, 4);
    images.forEach(image => {
      assert.equal(image.alt, '');
      assert.match(image.src, /^https:\/\/w2\.chabad\.org\/media\/images\//);
      assert.ok(Number(image.getAttribute('width')) > 0);
      assert.ok(Number(image.getAttribute('height')) > 0);
    });
    const sources = images.map(image => image.src);
    assert.equal(sources.filter(item => item === 'https://w2.chabad.org/media/images/1324/sOqZ13243323.jpg').length, 2);
    assert.equal(sources.filter(item => item === 'https://w2.chabad.org/media/images/1270/yPnp12706783.jpg').length, 1);
    assert.equal(sources.filter(item => item === 'https://w2.chabad.org/media/images/1324/bSEH13243362.jpg').length, 1);
    p.originalControls.forEach(control => assert.ok([...p.document.getElementById('5995797').elements].includes(control)));
  } finally { p.close(); }
});

test('existing correct wrappers are preserved', () => {
  const html = fixture.replace('class="chai-inline-system"', 'class="chai-inline-system chai-intro"')
    .replace('<div class="chai-faq-head">', '<div class="chai-faq" aria-labelledby="chai-faq-title"><div class="chai-faq-head">')
    .replace('<!-- FAQ END -->', '</div><!-- FAQ END -->');
  const p = page(html);
  try { p.rerun(); assert.equal(p.document.querySelectorAll('.chai-intro').length, 1); assert.equal(p.document.querySelectorAll('.chai-faq').length, 1); }
  finally { p.close(); }
});

test('incomplete intro or non-adjacent FAQ is not restructured', () => {
  const p = page(fixture.replace('class="chai-impact-list"', 'class="unexpected-content"')
    .replace('<div class="chai-faq-list">', '<p>Keep this content in place</p><div class="chai-faq-list">'));
  try { assert.equal(p.document.querySelector('.chai-intro'), null); assert.equal(p.document.querySelector('.chai-faq'), null); }
  finally { p.close(); }
});

test('unrelated pages are untouched', () => {
  const p = page('<!doctype html><html><head></head><body><form id="other"><input name="email"></form></body></html>', '/about');
  try { assert.equal(p.document.documentElement.className, ''); assert.equal(p.document.querySelector('link'), null); assert.equal(p.document.querySelectorAll('input').length, 1); }
  finally { p.close(); }
});

test('only one gift tier stays selected; custom amount enables and clears appropriately', () => {
  const p = page();
  try {
    const choose = id => { const e=p.document.getElementById(id); e.checked=true; e.dispatchEvent(new p.dom.window.Event('change',{bubbles:true})); };
    choose('input_8_0'); choose('input_18_0');
    assert.equal(p.document.getElementById('input_8_0').checked, false);
    choose('other_8');
    assert.equal(p.document.getElementById('input_8').disabled, false);
    p.document.getElementById('input_8').value='99';
    choose('input_19_0');
    assert.equal(p.document.getElementById('input_8').disabled, true);
    assert.equal(p.document.getElementById('input_8').value, '');
    assert.equal(p.document.getElementById('other_8').checked, false);
  } finally { p.close(); }
});
