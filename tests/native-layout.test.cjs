const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {JSDOM} = require('jsdom');
const css = fs.readFileSync('site-theme.css', 'utf8');
const spacing = css.split('/* Reduce top space above Hebrew School registration form */')[1]
  .split('/* ============================================================')[0];

function page(classes, school, protectedClass = "") {
  return new JSDOM(`<!doctype html><html class="${protectedClass}"><head><style>
    .master-content-wrapper {padding-top:40px;padding-bottom:40px}
    .article-header {padding-top:40px;padding-bottom:40px}
    ${spacing}</style></head><body class="${classes}">
    ${school ? '<div class="chabad_content_head"></div><form id="6458566"></form>' : ''}
    <div class="master-content-wrapper"><div class="article-header"><h1 class="article-header__title">Page title</h1></div></div>
    </body></html>`);
}

test('registration spacing preserves native article, regular page and protected minisite headers', () => {
  for (const classes of ['cco_body sites-article home', 'cco_body sites-article', 'cco_body tc-chai', 'cco_body tc-high-holidays-minisite']) {
    const dom = page(classes, false);
    for (const selector of ['.article-header', '.master-content-wrapper']) {
      assert.equal(dom.window.getComputedStyle(dom.window.document.querySelector(selector)).paddingTop, '40px', classes);
    }
    dom.window.close();
  }
});

test('Hebrew School registration retains its compact spacing', () => {
  const dom = page('cco_body form secure section_branch sites-article', true);
  for (const selector of ['.article-header', '.master-content-wrapper']) {
    assert.equal(dom.window.getComputedStyle(dom.window.document.querySelector(selector)).paddingTop, '10px');
  }
  dom.window.close();
});

test('mobile local-navigation hiding does not match other section titles', () => {
  const mobile = css.split('/* Hide unwanted mobile local navigation title at bottom of pages */')[1].split('/* Subscribe thank-you message */')[0];
  const selector = mobile.slice(mobile.indexOf('{') + 1, mobile.indexOf('{', mobile.indexOf('{') + 1)).trim();
  const dom = new JSDOM('<!doctype html><html><body class="cco_body sites-article"><div class="section_title" id="article-title">Article section</div><div class="co_local_menu"><div class="section_title" id="menu-title">Local navigation</div></div></body></html>');
  assert.equal(dom.window.document.querySelector('#article-title').matches(selector), false);
  assert.equal(dom.window.document.querySelector('#menu-title').matches(selector), true);
  dom.window.close();
});

// Production protection markers live on the html element, including forms.
test('protected custom sites never inherit school header spacing, even with the school form', () => {
  for (const marker of ['tc-chai', 'tc-high-holidays-minisite']) {
    const dom = page('cco_body form sites-article', true, marker);
    assert.equal(dom.window.getComputedStyle(dom.window.document.querySelector('.article-header')).paddingTop, '40px');
    dom.window.close();
  }
});

test('Hebrew School header has room for long names without changing other native themes', () => {
  const rule = css.slice(css.indexOf('/* Native Hebrew School theme:'));
  const school = new JSDOM(`<!doctype html><html><head><link rel="stylesheet" href="/themes/hebrew_school/new-styles.css"><style>${rule}</style></head><body><div id="chabad_head"><div class="chabad_content_head"><div class="chabad_titles"><p class="HeaderTitle">Tri-City Chabad Hebrew Schools</p></div></div></div></body></html>`);
  const title = school.window.document.querySelector('.HeaderTitle');
  assert.equal(school.window.getComputedStyle(title).marginLeft, 'auto');
  assert.equal(school.window.getComputedStyle(title).lineHeight, '1.15');
  school.window.document.querySelector('link').remove();
  assert.notEqual(school.window.getComputedStyle(title).lineHeight, '1.15');
  school.window.close();
});

test('phone recipe categories stack within the content width', () => {
  const start = css.indexOf('@media screen and (max-width: 640px) {', css.indexOf('content="420700"'));
  const media = css.slice(start, css.indexOf('\n}\n', start) + 3);
  const body = media.slice(media.indexOf('{') + 1, media.lastIndexOf('}'));
  const dom = new JSDOM(`<!doctype html><html><head><meta name="scope-aid" content="102819"><style>${body}</style></head><body><table id="BodyWrapper" class="co_index double nested"><tbody><tr class="row"><td class="item left_column">Latkes</td><td class="separator"></td><td class="item right_column">Doughnuts</td></tr></tbody></table></body></html>`);
  for (const item of dom.window.document.querySelectorAll('td.item')) {
    assert.equal(dom.window.getComputedStyle(item).display, 'block');
    assert.equal(dom.window.getComputedStyle(item).width, '100%');
  }
  assert.equal(dom.window.getComputedStyle(dom.window.document.querySelector('td.separator')).display, 'none');
  dom.window.close();
});


test('school navigation wraps and registration stays in the normal flow on narrow screens', () => {
  const rule = css.slice(css.indexOf('/* The native school menu has a fixed'));
  const body = rule.slice(rule.indexOf('{') + 1, rule.lastIndexOf('}'));
  const dom = new JSDOM(`<!doctype html><html><head><link rel="stylesheet" href="/themes/hebrew_school/new-styles.css"><style>${body}</style></head><body><div id="chabad_head"><div class="navLogo"><div class="NavButton"><a href="/6458566">Register Here</a></div></div><div id="navigation"><div class="chabad_menu_content"><ul id="menu"><li>Home</li><li>Curriculum</li></ul></div></div></div></body></html>`);
  assert.equal(dom.window.getComputedStyle(dom.window.document.querySelector('#menu')).flexWrap, 'wrap');
  assert.equal(dom.window.getComputedStyle(dom.window.document.querySelector('.NavButton')).position, 'static');
  assert.equal(dom.window.getComputedStyle(dom.window.document.querySelector('#chabad_head')).height, 'auto');
  dom.window.close();
});
