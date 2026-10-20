// Check a fresh browser-exported public DOM. No external scripts or network requests execute.
const { readFileSync } = require('node:fs');
const assert = require('node:assert/strict');
const { JSDOM, VirtualConsole } = require('jsdom');
(async () => {
  assert.ok(process.argv[2], 'Usage: pnpm check:markup /absolute/path/to/fresh-chai-dom.html');
  const html = readFileSync(process.argv[2], 'utf8');
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => { if (error.type !== 'css parsing') errors.push(error.message); });
  const dom = new JSDOM(html, { url: 'https://www.jewishtricities.com/chai', runScripts: 'outside-only', virtualConsole });
  try {
    const doc = dom.window.document;
    const form = doc.getElementById('5995797');
    assert.ok(form, 'Native Chai form missing');
    const nativeControls = [...form.elements];
    for (const selector of ['#id_12 .chai-intro-copy', '#id_12 .chai-impact-list', '#id_25 .chai-faq-head', '#id_25 .chai-faq-list', '#first_3', '#input_8', '#input_24', '#id_2']) {
      assert.ok(form.querySelector(selector), `Published markup changed: ${selector}`);
    }
    dom.window.setInterval = () => 1;
    dom.window.clearInterval = () => {};
    dom.window.eval(readFileSync('chai-club.js', 'utf8'));
    doc.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
    assert.deepEqual(errors, [], 'Initialization errors');
    assert.equal(form.querySelectorAll('.chai-intro').length, 1);
    assert.equal(form.querySelectorAll('.chai-faq').length, 1);
    assert.equal(form.querySelectorAll('#tc-chai-join-panel').length, 1);
    assert.equal(form.querySelector('.chai-faq .chai-partners'), null);
    nativeControls.forEach(control => assert.ok([...form.elements].includes(control), `Native control replaced: ${control.id}`));
    console.log('Supplied Chai markup is compatible. Visual/mobile review remains required.');
  } finally { dom.window.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
