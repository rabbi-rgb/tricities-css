const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
const code=fs.readFileSync('homepage-repairs.js','utf8');
function page(home=true) {
  const dom=new JSDOM(`<meta name="viewport" content="width=device-width, maximum-scale=1, user-scalable=0"><div id="header"><input id="Fname" name="fname"></div>${home?'<div class="hp-table"><div class="hp_subscribe"><form action="/subscribe" method="post"><label for="Fname">First Name</label><input id="Fname" name="fname"><label for="Lname">Last Name</label><input id="Lname" name="lname"><label for="Email">Email Address</label><input id="Email" name="email" type="email"><input name="subscriptionid" type="hidden" value="keep"></form></div></div>':''}<script id="tc-homepage-repairs" src="https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@release/homepage-repairs.js"></script>`,{url:'https://www.jewishtricities.com/',runScripts:'outside-only'});
  return dom;
}
function run(dom){dom.window.eval(code);dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));}
test('duplicate-ID signup labels focus the local field while native nodes and handlers survive',()=>{
  const dom=page(),d=dom.window.document,form=d.querySelector('form'),input=form.querySelector('[name=fname]');
  let changed=0;input.addEventListener('change',()=>changed++);
  run(dom);run(dom);
  form.querySelector('label').click();assert.equal(d.activeElement,input);
  assert.equal(input.getAttribute('aria-label'),'First Name');
  assert.equal(form.querySelector('[name=fname]'),input);assert.equal(input.id,'Fname');
  input.dispatchEvent(new dom.window.Event('change'));assert.equal(changed,1);
  assert.equal(form.getAttribute('action'),'/subscribe');assert.equal(form.method,'post');
  assert.equal(form.querySelector('[name=subscriptionid]').value,'keep');
  assert.equal(d.querySelectorAll('#tc-homepage-repair-styles').length,1);
  assert.equal(d.querySelector('#tc-homepage-repair-styles').href,'https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@release/homepage-repairs.css');
  assert.equal(d.querySelector('meta').content,'width=device-width, initial-scale=1.0');
});
test('asynchronous carousel controls retain native events and disabled state',async()=>{
  const dom=page(),d=dom.window.document;run(dom);
  const section=d.createElement('div');section.id='injected-upcoming-events-section';
  section.innerHTML='<button class="events-carousel-arrow prev" disabled>❮</button><button class="events-carousel-arrow next">❯</button>';
  let clicked=0;section.lastChild.addEventListener('click',()=>clicked++);d.body.appendChild(section);
  await new Promise(resolve=>dom.window.setTimeout(resolve,0));
  assert.equal(section.firstChild.getAttribute('aria-label'),'Previous events');assert.equal(section.firstChild.disabled,true);
  assert.equal(section.lastChild.getAttribute('aria-label'),'Next events');section.lastChild.click();assert.equal(clicked,1);
});
test('other page families keep their viewport and receive no homepage stylesheet',()=>{
  const dom=page(false),d=dom.window.document;run(dom);
  assert.equal(d.querySelector('#tc-homepage-repair-styles'),null);
  assert.match(d.querySelector('meta').content,/user-scalable=0/);
});
