const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

const root = path.join(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'chanukah-lit.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'chanukah-lit.js'), 'utf8');

function fixture() {
  const quantityOptions = Array.from({ length: 25 }, (_, index) => {
    const nativeState = index === 4 ? ' disabled' : index === 5 ? ' hidden' : '';
    return `<option value="${index + 1}"${nativeState}>${index + 1}</option>`;
  }).join('');
  return `<!doctype html><html><head><script id="asset" src="https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@abc123/chanukah-lit.js"></script></head><body>
    <form id="RegisterSinglePage" class="view_form">
      <div id="RegisterHeader"></div>
      <div id="RegisterBody">
        <div id="Performances"><div class="regular">old helper</div>
          <div id="performance_32687">
            <div id="performance_32687_reservations" class="reservations">
              <div class="reservation"><div class="clearfix medium_vertical_padding"><div class="g100">1</div><div><input id="child-first" type="text"></div><div><input id="child-last" type="text"></div><div class="seat_selection"></div><div class="ticket-type">Child</div><button class="remove_reservation" type="button">×</button><div class="price">$12</div></div>
                <div class="embedded_form"><form><label for="grade">What grade is your child in?</label><select id="grade"><option>Grade 1</option></select><button type="submit">Submit</button></form></div>
              </div>
            </div>
            <div id="performance_32687_additionalsToggle"><div class="toggle_options">
              <div><div>Old ticket</div><select id="performance_32687_priceCategory"><option value="9830">Children (3-12) - $12.00</option><option value="12304">Hebrew School Student - $0.00</option></select></div>
              <div><div>Old quantity</div><select id="performance_32687_quantityOfAttendees">${quantityOptions}</select></div>
              <div><button id="performance_32687_addAttendeeButton"><span>Continue</span></button></div>
            </div><div class="toggle_message">Add additional reservations</div></div>
          </div>
        </div>
        <div id="Summary"></div><div id="ReserversInformation"></div><div id="PaymentInformation"></div>
        <button id="SubmitButton"><span>Make Reservation</span></button>
      </div>
    </form>
  </body></html>`;
}

function page(url = 'https://www.jewishtricities.com/tools/events/register_cdo/eventid/24173') {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(fixture(), { url, runScripts: 'outside-only', virtualConsole });
  Object.defineProperty(dom.window.document, 'currentScript', { configurable: true, value: dom.window.document.getElementById('asset') });
  const callbacks = [];
  dom.window.setTimeout = fn => (callbacks.push(fn), callbacks.length);
  dom.window.eval(js);
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  return { dom, document: dom.window.document, flush() { while (callbacks.length) callbacks.shift()(); }, close() { dom.window.close(); assert.deepEqual(errors, []); } };
}

test('assets are scoped to only the Chanukah LIT event and receipt', () => {
  assert.match(js, /24173/);
  assert.match(js, /32687/);
  assert.match(css, /body\.tc-chanukah-lit-event/);
  assert.match(css, /body\.tc-chanukah-lit-receipt/);
  assert.doesNotMatch(css, /(^|\n)(html|body)(\s|,|\{)/);
});

test('hero uses the externally hosted banner next to the pinned script', () => {
  const p = page();
  try {
    const banner = p.document.querySelector('#tcChanukahLitIntro .tc-lit-banner');
    assert.ok(banner);
    assert.equal(banner.src, 'https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@abc123/chanukah-lit-banner.png');
    assert.match(banner.alt, /Chanukah LIT/);
  } finally { p.close(); }
});

test('initialization preserves native controls and stays idempotent', () => {
  const p = page();
  try {
    const form = p.document.getElementById('RegisterSinglePage');
    const controls = [...form.elements];
    const category = p.document.getElementById('performance_32687_priceCategory');
    const grade = p.document.getElementById('grade');
    for (let i = 0; i < 25; i++) p.dom.window.__tcChanukahLitV1.run();
    assert.equal(p.document.querySelectorAll('#tcChanukahLitIntro').length, 1);
    assert.equal(p.document.getElementById('performance_32687_priceCategory'), category);
    assert.equal(p.document.getElementById('grade'), grade);
    controls.forEach(control => assert.ok([...form.elements].includes(control)));
  } finally { p.close(); }
});

test('ticket ages and registration labels are corrected', () => {
  const p = page();
  try {
    const options = [...p.document.getElementById('performance_32687_priceCategory').options].map(option => option.textContent);
    assert.ok(options.includes('Children (7–12) - $12.00'));
    assert.ok(options.includes('Hebrew School Student - $0.00'));
    assert.equal(p.document.querySelector('#SubmitButton span').textContent, 'Complete registration');
    assert.equal(p.document.querySelector('#performance_32687_addAttendeeButton span').textContent, 'Add child');
    assert.equal(p.document.getElementById('grade').getAttribute('aria-label'), 'Child 1 grade');
    assert.equal(p.document.querySelector('.reservation .g100').textContent, '1');
    assert.equal(p.document.querySelector('.reservation .ticket-type').textContent, 'Child');
  } finally { p.close(); }
});

test('quantity choices stop at the 15-child event capacity', () => {
  const p = page();
  try {
    const reservations = p.document.getElementById('performance_32687_reservations');
    const quantity = p.document.getElementById('performance_32687_quantityOfAttendees');
    const addButton = p.document.getElementById('performance_32687_addAttendeeButton');
    const availableValues = () => [...quantity.options].filter(option => !option.hidden && !option.disabled).map(option => Number(option.value));
    const expectedThrough = maximum => Array.from({ length: maximum }, (_, index) => index + 1).filter(value => value !== 5 && value !== 6);

    assert.deepEqual(availableValues(), expectedThrough(14));
    assert.equal(quantity.options[4].disabled, true);
    assert.equal(quantity.options[4].hidden, false);
    assert.equal(quantity.options[5].disabled, false);
    assert.equal(quantity.options[5].hidden, true);

    reservations.appendChild(reservations.firstElementChild.cloneNode(true));
    p.dom.window.__tcChanukahLitV1.run();
    assert.deepEqual(availableValues(), expectedThrough(13));

    while (reservations.children.length < 15) reservations.appendChild(reservations.firstElementChild.cloneNode(true));
    p.dom.window.__tcChanukahLitV1.run();
    assert.deepEqual(availableValues(), []);
    assert.equal(quantity.disabled, true);
    assert.equal(addButton.disabled, true);

    while (reservations.children.length > 9) reservations.lastElementChild.remove();
    p.dom.window.__tcChanukahLitV1.run();
    assert.deepEqual(availableValues(), [1, 2, 3, 4]);
    assert.equal(quantity.disabled, false);
    assert.equal(addButton.disabled, false);
    assert.equal(quantity.options[4].disabled, true);
    assert.equal(quantity.options[4].hidden, false);
    assert.equal(quantity.options[5].disabled, false);
    assert.equal(quantity.options[5].hidden, true);
  } finally { p.close(); }
});

test('event details match the approved flyer and pricing', () => {
  assert.match(js, /Sunday, November 29/);
  assert.match(js, /3:30–4:00 PM/);
  assert.match(js, /Children ages 7–12/);
  assert.match(js, /\$12 per child/);
  assert.match(js, /Hebrew School students free/);
  assert.match(js, /Space is limited to 15 children/);
});

test('unrelated pages remain untouched', () => {
  const p = page('https://www.jewishtricities.com/about');
  try {
    assert.equal(p.document.body.className, '');
    assert.equal(p.document.getElementById('tcChanukahLitIntro'), null);
  } finally { p.close(); }
});

test('an adjacent event ID remains untouched', () => {
  const p = page('https://www.jewishtricities.com/tools/events/register_cdo/eventid/241730');
  try {
    assert.equal(p.document.body.className, '');
    assert.equal(p.document.getElementById('tcChanukahLitIntro'), null);
  } finally { p.close(); }
});

test('CSS parses and modernizes all event buttons', () => {
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>');
  const style = dom.window.document.createElement('style');
  style.textContent = css;
  dom.window.document.head.appendChild(style);
  assert.ok(style.sheet.cssRules.length > 20);
  assert.match(css, /#RegisterBody button,/);
  assert.match(css, /border-radius: 13px !important;/);
  assert.match(css, /linear-gradient\(180deg, #ffd84b, var\(--lit-gold\)\)/);
  dom.window.close();
});

test('grade form is styled per child and its independent submit is hidden', () => {
  assert.match(css, /#performance_32687_reservations \.embedded_form/);
  assert.match(css, /\.embedded_form button\[type="submit"\]/);
  assert.match(css, /display: none !important;/);
});

test('native close control does not become a stray gold action button', () => {
  assert.match(css, /\.toggle_options > \.regular\.float_right\s*\{\s*display: none !important;/);
  assert.match(css, /\.remove_reservation\s*\{[\s\S]*?min-height: 32px !important;[\s\S]*?padding: 0 !important;[\s\S]*?border-radius: 50% !important;/);
});

test('phone and tablet layouts are included', () => {
  assert.match(css, /@media \(max-width: 820px\)/);
  assert.match(css, /@media \(max-width: 600px\)/);
  assert.match(css, /@media \(max-width: 390px\)/);
  assert.match(css, /:nth-child\(5\)\s*\{\s*grid-column: 2 !important;/);
  assert.match(css, /:nth-child\(6\)\s*\{\s*grid-column: 3 !important;/);
  assert.match(css, /:nth-child\(7\)\s*\{\s*grid-column: 4 !important;/);
});

test('script never replaces or submits the native form', () => {
  assert.doesNotMatch(js, /cloneNode|\.submit\(|requestSubmit|outerHTML\s*=/);
  assert.doesNotMatch(js, /\.remove\(|removeChild/);
});
