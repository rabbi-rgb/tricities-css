const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
const script=fs.readFileSync('candlelighting-page.js','utf8');
function page(path,widget=true){
  const dom=new JSDOM(`<meta name="viewport" content="width=device-width, maximum-scale=1, user-scalable=0">${widget?'<div id="candle_lighting"><button id="SaveLocationButton" disabled>Save</button></div>':''}<script id="tc-candlelighting-page" src="https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@release/candlelighting-page.js"></script>`,{url:'https://www.jewishtricities.com'+path,runScripts:'outside-only'});
  dom.window.eval(script);dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));return dom;
}
test('candle enhancement keeps native controls and initializes once with pinned assets',()=>{
  const dom=page('/calendar/candlelighting.htm/locationid/2866/locationtype/1');
  const d=dom.window.document,button=d.getElementById('SaveLocationButton');
  dom.window.eval(script);d.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  assert.equal(d.querySelectorAll('#tc-candlelighting-styles').length,1);
  assert.equal(d.getElementById('tc-candlelighting-styles').href,'https://cdn.jsdelivr.net/gh/rabbi-rgb/tricities-css@release/candlelighting-fixes.css');
  assert.equal(d.getElementById('SaveLocationButton'),button);assert.equal(button.disabled,true);
  assert.equal(d.querySelector('meta[name="viewport"]').content,'width=device-width, initial-scale=1.0');
});
test('candle enhancement leaves unrelated pages and absent widget untouched',()=>{
  for(const [path,widget] of [['/calendar/events.asp',true],['/calendar/candlelighting.htm',false]]){
    const dom=page(path,widget),d=dom.window.document;
    assert.equal(d.querySelector('#tc-candlelighting-styles'),null);
    assert.match(d.querySelector('meta[name="viewport"]').content,/user-scalable=0/);
  }
});
test('canonical syndicated candle-lighting route receives the same enhancement',()=>{
  const dom=page('/calendar/candlelighting_cdo/aid/6226/jewish/Shabbat-Candle-Lighting-Times.htm');
  assert.ok(dom.window.document.getElementById('tc-candlelighting-styles'));
});
