const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { JSDOM, VirtualConsole } = require('jsdom');
const source = readFileSync('chai-club.js', 'utf8');
const fixture = readFileSync('tests/fixtures/chai.html', 'utf8');

function page(html = fixture, path = '/chai', options = {}) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => { if (error.type !== 'css parsing') errors.push(error.message); });
  const dom = new JSDOM(html, { virtualConsole, url: `https://www.jewishtricities.com${path}`, runScripts: 'outside-only' });
  const ticks = [];
  const observers = [];
  dom.window.setInterval = fn => (ticks.push(fn), ticks.length);
  dom.window.clearInterval = () => {};
  if (options.reduceMotion) {
    dom.window.matchMedia = query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener() {},
      removeEventListener() {}
    });
  }
  if (options.intersectionObserver) {
    dom.window.requestAnimationFrame = fn => (fn(), 1);
    dom.window.IntersectionObserver = class {
      constructor(callback, observerOptions) {
        this.callback = callback;
        this.options = observerOptions;
        this.targets = [];
        this.unobserved = [];
        observers.push(this);
      }
      observe(target) { this.targets.push(target); }
      unobserve(target) { this.unobserved.push(target); }
      trigger(target, isIntersecting, top = 0) {
        this.callback([{ target, isIntersecting, boundingClientRect: { top } }]);
      }
    };
  }
  const nativeForm = dom.window.document.getElementById("5995797");
  const originalControls = nativeForm ? [...nativeForm.elements] : [];
  const originalContract = nativeForm ? contract(nativeForm) : null;
  dom.window.eval(source);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  return { dom, close() { dom.window.close(); assert.deepEqual(errors, [], "No initialization errors"); }, observers, originalControls, originalContract, document: dom.window.document, rerun() { ticks.forEach(fn => fn()); } };
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
    for (const selector of ['.chai-intro', '.chai-faq', '#tc-chai-refinement-styles', '#tc-chai-join-panel', '.tc-chai-hero-action', '.tc-chai-hero-grid', '.tc-chai-hero-art', '.tc-chai-section-nav', '.tc-chai-mobile-join', '.tc-chai-gift-summary', '.tc-chai-partner-count']) {
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
    assert.equal(sources.filter(item => item === 'https://w2.chabad.org/media/images/1324/sOqZ13243323.jpg').length, 1);
    assert.equal(sources.filter(item => item === 'https://w2.chabad.org/media/images/1389/Qhze13899668.jpeg').length, 1);
    assert.equal(sources.filter(item => item === 'https://w2.chabad.org/media/images/1389/pPdT13899572.jpg').length, 1);
    assert.equal(sources.filter(item => item === 'https://w2.chabad.org/media/images/1389/YXBy13899570.jpeg').length, 1);
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

test('partner count is derived from the rendered public names', () => {
  const p = page();
  try {
    assert.equal(p.document.querySelectorAll('.tc-chai-partner-name').length, 3);
    assert.equal(p.document.querySelector('.tc-chai-partner-count').textContent, '3 active Chai Club partners—and growing.');
  } finally { p.close(); }
});

test('gift summary follows preset, custom, and recurrence choices', () => {
  const p = page();
  try {
    const choose = id => { const e=p.document.getElementById(id); e.checked=true; e.dispatchEvent(new p.dom.window.Event('change',{bubbles:true})); };
    const summary = () => p.document.querySelector('.tc-chai-gift-summary-value').textContent;
    assert.equal(summary(), 'Select an amount above');
    choose('input_8_0');
    assert.equal(summary(), '$36 CAD/month');
    choose('input_19_2');
    assert.equal(summary(), '$1,000 CAD/month');

    const recurring = p.document.getElementById('input_24');
    recurring.checked = false;
    recurring.dispatchEvent(new p.dom.window.Event('change',{bubbles:true}));
    assert.equal(summary(), '$1,000 CAD one-time');
    assert.equal(p.document.querySelector('.tc-chai-reassurance').textContent, 'Secure payment · One-time gift');

    recurring.checked = true;
    recurring.dispatchEvent(new p.dom.window.Event('change',{bubbles:true}));
    assert.equal(p.document.querySelector('.tc-chai-reassurance').textContent, 'Secure payment · Change or cancel your monthly gift anytime');
    choose('other_8');
    assert.equal(summary(), 'Enter your gift amount above');
    const custom = p.document.getElementById('input_8');
    custom.value = '99';
    custom.dispatchEvent(new p.dom.window.Event('change',{bubbles:true}));
    assert.equal(summary(), '$99 CAD/month');
    custom.value = '-25';
    custom.dispatchEvent(new p.dom.window.Event('change',{bubbles:true}));
    assert.equal(summary(), 'Enter your gift amount above');
    custom.value = '1e3';
    custom.dispatchEvent(new p.dom.window.Event('change',{bubbles:true}));
    assert.equal(summary(), 'Enter your gift amount above');
  } finally { p.close(); }
});

test('section navigation uses stable public targets and sticky CTA fails closed', () => {
  const p = page();
  try {
    const links = [...p.document.querySelectorAll('.tc-chai-section-nav a')].map(link => link.getAttribute('href'));
    assert.deepEqual(links, ['#chai-intro-title', '#tc-chai-partners-title', '#tc-chai-join-title']);
    const sticky = p.document.querySelector('.tc-chai-mobile-join');
    assert.equal(sticky.getAttribute('href'), '#tc-chai-join-title');
    assert.equal(sticky.getAttribute('aria-hidden'), 'true');
    assert.equal(sticky.tabIndex, -1);
  } finally { p.close(); }
});

test('reveal enhancement keeps content visible when observers are unavailable', () => {
  const p = page();
  try {
    const targets = [...p.document.querySelectorAll('.tc-chai-reveal')];
    assert.ok(targets.length >= 8);
    targets.forEach(target => assert.ok(target.classList.contains('is-revealed')));
    assert.equal(p.document.documentElement.classList.contains('tc-chai-motion-ready'), false);
  } finally { p.close(); }
});

test('reveal enhancement honors reduced-motion preferences', () => {
  const p = page(fixture, '/chai', { reduceMotion: true });
  try {
    const targets = [...p.document.querySelectorAll('.tc-chai-reveal')];
    assert.ok(targets.length >= 8);
    targets.forEach(target => assert.ok(target.classList.contains('is-revealed')));
    assert.equal(p.document.documentElement.classList.contains('tc-chai-motion-ready'), false);
  } finally { p.close(); }
});

test('intersection observers reveal once and retire the mobile CTA at the form', () => {
  const p = page(fixture, '/chai', { intersectionObserver: true });
  try {
    const hero = p.document.querySelector('.article-header');
    const revealObserver = p.observers.find(observer => observer.options.rootMargin === '0px 0px -10% 0px');
    assert.ok(revealObserver);
    assert.equal(revealObserver.targets.length, 0);
    assert.equal(p.document.documentElement.classList.contains('tc-chai-loading'), true);
    p.document.getElementById('tc-chai-refinement-styles').dispatchEvent(new p.dom.window.Event('load'));
    assert.equal(p.document.documentElement.classList.contains('tc-chai-loading'), false);
    assert.ok(revealObserver.targets.includes(hero));
    assert.equal(hero.classList.contains('is-revealed'), false);
    revealObserver.trigger(hero, true);
    assert.equal(hero.classList.contains('is-revealed'), true);
    assert.ok(revealObserver.unobserved.includes(hero));
    revealObserver.trigger(hero, false);
    assert.equal(hero.classList.contains('is-revealed'), true);

    const heroJoin = p.document.querySelector('.tc-chai-hero-primary');
    const joinPanel = p.document.querySelector('#tc-chai-join-panel');
    const mobileJoin = p.document.querySelector('.tc-chai-mobile-join');
    const heroObserver = p.observers.find(observer => observer.targets.includes(heroJoin));
    const joinObserver = p.observers.find(observer => observer.targets.includes(joinPanel));
    assert.ok(heroObserver);
    assert.ok(joinObserver);
    heroObserver.trigger(heroJoin, false);
    assert.equal(mobileJoin.classList.contains('is-visible'), true);
    assert.equal(mobileJoin.getAttribute('aria-hidden'), 'false');
    assert.equal(mobileJoin.tabIndex, 0);
    joinObserver.trigger(joinPanel, true, 100);
    assert.equal(mobileJoin.classList.contains('is-visible'), false);
    assert.equal(mobileJoin.getAttribute('aria-hidden'), 'true');
    assert.equal(mobileJoin.tabIndex, -1);
  } finally { p.close(); }
});
