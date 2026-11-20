const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
const code=fs.readFileSync('homepage-chanukah.js','utf8');
function page(home=true){return new JSDOM(home?'<div class="hp-table"><div id="hero"></div><div id="programs"></div></div>':'<div class="tc-chai"><form><input name="amount" value="54"></form></div>',{url:'https://www.jewishtricities.com/',runScripts:'outside-only'});}
function run(dom){dom.window.eval(code);dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));}
test('waits for asynchronous event cards and inserts one compact link immediately below them',async()=>{
 const dom=page(),d=dom.window.document;run(dom);run(dom);
 const events=d.createElement('div');events.id='injected-upcoming-events-section';d.querySelector('#programs').before(events);
 await new Promise(r=>dom.window.setTimeout(r,0));assert.equal(d.querySelector('#tc-home-chanukah'),null);
 events.innerHTML='<div class="injected-event-card"><a href="/existing">Existing event</a></div>';
 await new Promise(r=>dom.window.setTimeout(r,0));run(dom);
 const card=d.querySelector('#tc-home-chanukah');assert.equal(events.nextElementSibling,card);assert.equal(card.nextElementSibling.id,'programs');
 assert.equal(d.querySelectorAll('#tc-home-chanukah').length,1);assert.equal(d.querySelectorAll('#tc-home-chanukah-styles').length,1);
 assert.equal(card.querySelector('a').href,'https://www.jewishtricities.com/7629340');
 assert.equal(card.querySelector('p').textContent,'A celebration for every age and stage here in the Tri-Cities.');
 assert.equal(events.querySelector('a').getAttribute('href'),'/existing');dom.window.close();
});
test('does not change other pages or their form state',()=>{
 const dom=page(false),d=dom.window.document,input=d.querySelector('input');run(dom);
 assert.equal(d.querySelector('#tc-home-chanukah-styles'),null);assert.equal(d.querySelector('#tc-home-chanukah'),null);assert.equal(d.querySelector('input'),input);assert.equal(input.value,'54');dom.window.close();
});
