const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

const root = path.join(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'charcuterie-champagne.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'charcuterie-champagne.js'), 'utf8');

function fixture() {
  return `<!doctype html><html><body>
    <form id="RegisterSinglePage" class="view_form">
      <div id="RegisterHeader"></div>
      <div id="RegisterBody">
        <div id="Performances"><div class="regular">old helper</div>
          <div id="performance_32663">
            <div id="performance_32663_reservations" class="reservations"></div>
            <div id="performance_32663_additionalsToggle"><div class="toggle_options">
              <div><div>Old ticket</div><select id="performance_32663_priceCategory"><option value="12284">Women's Circle Ticket - $25</option></select></div>
              <div><div>Old quantity</div><select id="performance_32663_quantityOfAttendees"><option value="1">1</option></select></div>
              <div><button id="performance_32663_addAttendeeButton"><span>Continue</span></button></div>
            </div></div>
          </div>
        </div>
        <div id="Summary"><div class="large_top_margin medium_bottom_margin"><input id="TotalDonation" name="donation"></div></div>
        <div id="ReserversInformation"></div><div id="PaymentInformation"></div>
        <button id="SubmitButton"><span>Make Reservation</span></button>
      </div>
    </form>
  </body></html>`;
}

function page(url = 'https://www.jewishtricities.com/tools/events/register_cdo/eventid/24151') {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(fixture(), { url, runScripts: 'outside-only', virtualConsole });
  const callbacks = [];
  dom.window.setTimeout = fn => (callbacks.push(fn), callbacks.length);
  dom.window.eval(js);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  return { dom, document: dom.window.document, flush() { while (callbacks.length) callbacks.shift()(); }, close() { dom.window.close(); assert.deepEqual(errors, []); } };
}

test('assets are scoped to only the Charcuterie event and receipt', () => {
  assert.match(js, /eventid\/' \+ EVENT_ID/);
  assert.match(js, /24151/);
  assert.match(js, /performance_' \+ PERFORMANCE_ID/);
  assert.match(css, /body\.tc-charcuterie-event/);
  assert.match(css, /body\.tc-charcuterie-receipt/);
  assert.doesNotMatch(css, /(^|\n)(html|body)(\s|,|\{)/);
});

test('hero uses one supplied event photograph and no duplicate experience card', () => {
  assert.match(js, /IwTf13928094\.png/);
  assert.doesNotMatch(js, /UoPK13928095\.png/);
  assert.doesNotMatch(js, /tc-cnc-experience|Create\. Gather\. Enjoy\./);
  assert.doesNotMatch(css, /tc-cnc-experience/);
  assert.doesNotMatch(js, /tc-cnc-art|tc-cnc-bubbles|tc-cnc-glass|tc-cnc-board|tc-cnc-grapes|tc-cnc-cheese|tc-cnc-brie|tc-cnc-crackers/);
});

test('initialization preserves native controls and stays idempotent', () => {
  const p = page();
  try {
    const nativeForm = p.document.getElementById('RegisterSinglePage');
    const controls = [...nativeForm.elements];
    const donation = p.document.getElementById('TotalDonation');
    const category = p.document.getElementById('performance_32663_priceCategory');
    const quantity = p.document.getElementById('performance_32663_quantityOfAttendees');
    for (let i = 0; i < 25; i++) p.dom.window.__tcCharcuterieEventV1.run();
    assert.equal(p.document.querySelectorAll('#tcCharcuterieIntro').length, 1);
    assert.equal(p.document.querySelectorAll('#tcCharcuterieSupport').length, 1);
    assert.equal(p.document.getElementById('TotalDonation'), donation);
    assert.equal(p.document.getElementById('performance_32663_priceCategory'), category);
    assert.equal(p.document.getElementById('performance_32663_quantityOfAttendees'), quantity);
    controls.forEach(control => assert.ok([...nativeForm.elements].includes(control)));
    assert.equal(nativeForm.querySelectorAll('input[name="donation"]').length, 1);
    assert.equal(nativeForm.querySelectorAll('input[name="tc_cnc_support"]').length, 5);
  } finally { p.close(); }
});

test('sponsorship choices update the native Chabad One donation input', () => {
  const p = page();
  try {
    const donation = p.document.getElementById('TotalDonation');
    const choose = value => {
      const radio = p.document.querySelector(`input[name="tc_cnc_support"][value="${value}"]`);
      radio.checked = true;
      radio.dispatchEvent(new p.dom.window.Event('change', { bubbles: true }));
    };
    assert.equal(donation.value, '0.00');
    choose('25');
    assert.equal(donation.value, '25.00');
    choose('100');
    assert.equal(donation.value, '100.00');
    choose('custom');
    const custom = p.document.getElementById('tcCharcuterieGift');
    assert.equal(custom.disabled, false);
    custom.value = '72.50';
    custom.dispatchEvent(new p.dom.window.Event('input', { bubbles: true }));
    assert.equal(donation.value, '72.50');
  } finally { p.close(); }
});

test('unrelated pages remain untouched', () => {
  const p = page('https://www.jewishtricities.com/about');
  try {
    assert.equal(p.document.body.className, '');
    assert.equal(p.document.getElementById('tcCharcuterieIntro'), null);
    assert.equal(p.document.getElementById('tcCharcuterieSupport'), null);
  } finally { p.close(); }
});

test('CSS parses in a browser stylesheet', () => {
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>');
  const style = dom.window.document.createElement('style');
  style.textContent = css;
  dom.window.document.head.appendChild(style);
  assert.ok(style.sheet.cssRules.length > 20);
  dom.window.close();
});

test('current Chabad One form markup receives the compact layout', () => {
  assert.match(css, /#performance_32663_reservations \.reservation > \.clearfix\.medium_vertical_padding/);
  assert.match(css, /#ReserversInformation > \.large_top_padding > \.clearfix/);
  assert.match(css, /#Payment \.clearfix\.small_vertical_padding/);
  assert.match(css, /#Buttons > \.large_top_padding/);
});

test('script never replaces or submits the native form', () => {
  assert.doesNotMatch(js, /cloneNode|\.submit\(|requestSubmit|outerHTML\s*=/);
  assert.match(js, /document\.getElementById\('TotalDonation'\)/);
  assert.match(js, /dispatchEvent\(new Event\('input'/);
  assert.match(js, /dispatchEvent\(new Event\('change'/);
});
