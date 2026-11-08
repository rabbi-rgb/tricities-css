const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
const code=fs.readFileSync('us-donation-layout.js','utf8');
function fixture(aid='6406028'){
 const dom=new JSDOM(`<link rel="canonical" href="https://www.jewishtricities.com/templates/articlecco_cdo/aid/${aid}/jewish/Partner-with-us.htm"><form id="6406028"><ul class="form-section"><li id="id_12">Intro</li><li id="id_3"><input id="first_3" name="first"></li><li id="id_4"><input name="email"></li><li id="id_8"><div id="cid_8"><div class="form-multiple-column"><span class="form-radio-item"><input type="radio" id="input_8_0" name="amount" value="50.00"></span><input type="radio" id="other_8" name="amount"><input type="number" id="input_8" name="other" min="1" disabled></div></div></li><li id="id_15"><input id="input_15" type="checkbox" value="Monthly"></li><li id="id_14">Total</li><li id="id_7"><input name="card"></li><li id="id_13"><textarea name="comments"></textarea></li><li id="id_2"><button type="submit">Submit</button></li></ul></form>`,{runScripts:'outside-only'});
 dom.window.HTMLElement.prototype.scrollIntoView=function(){};
 return dom;
}
test('U.S. gift-first presentation preserves native nodes, listeners and values across repeated initialization',()=>{
 const {window:w}=fixture();const f=w.document.forms[0],nodes=[...f.elements];let changed=0;nodes[0].addEventListener('change',()=>changed++);
 w.eval(code);w.eval(code);
 assert.equal(f.querySelectorAll('.tc-us-next').length,0);assert.equal(f.querySelectorAll('.tc-us-flow-hint').length,1);assert.equal(f.querySelectorAll('#cid_8 .form-multiple-column').length,0);assert(f.querySelector('.tc-us-amount-grid'));assert(nodes.every(n=>n.isConnected));
 assert.equal(w.document.querySelector('#input_8_0').value,'50.00');assert.equal(w.document.querySelector('#input_8').min,'1');assert(w.document.querySelector('#input_8').disabled);
 assert(w.document.querySelector('#id_3').hidden);assert(!w.document.querySelector('#id_8').hidden);
 nodes[0].dispatchEvent(new w.Event('change'));assert.equal(changed,1);w.close();
});
test('preset selection advances automatically and the same selection works again after Back',async()=>{
 const {window:w}=fixture();w.eval(code);const d=w.document,f=d.forms[0],radio=d.querySelector('#input_8_0');
 radio.click();await new Promise(r=>setTimeout(r,160));
 assert.equal(f.dataset.tcUsStep,'2');assert.equal(d.activeElement.className,'tc-us-details-title');
 d.querySelector('.tc-us-back').click();assert(radio.checked);assert.equal(f.dataset.tcUsStep,'1');
 radio.click();await new Promise(r=>setTimeout(r,160));assert.equal(f.dataset.tcUsStep,'2');w.close();
});
test('Other waits for completion; moving to monthly does not advance a partial gift; Enter cannot submit',async()=>{
 const {window:w}=fixture();w.eval(code);const d=w.document,f=d.forms[0],other=d.querySelector('#input_8');
 d.querySelector('#other_8').checked=true;other.disabled=false;other.value='1';other.dispatchEvent(new w.Event('input',{bubbles:true}));
 await new Promise(r=>setTimeout(r,160));assert.equal(f.dataset.tcUsStep,'1');
 other.dispatchEvent(new w.FocusEvent('blur',{relatedTarget:d.querySelector('#input_15')}));await new Promise(r=>setTimeout(r,160));assert.equal(f.dataset.tcUsStep,'1');
 other.value='125';const event=new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true});other.dispatchEvent(event);
 assert(event.defaultPrevented);assert.equal(f.dataset.tcUsStep,'2');assert.equal(other.value,'125');
 d.querySelector('.tc-us-back').click();other.value='';const submit=new w.Event('submit',{bubbles:true,cancelable:true});f.dispatchEvent(submit);assert(submit.defaultPrevented);assert.equal(f.dataset.tcUsStep,'1');w.close();
});
test('switching rapidly from preset to Other cancels automatic progression',async()=>{
 const {window:w}=fixture();w.eval(code);const d=w.document;d.querySelector('#input_8_0').click();d.querySelector('#other_8').click();
 await new Promise(r=>setTimeout(r,180));assert.equal(d.forms[0].dataset.tcUsStep,'1');assert(d.querySelector('#other_8').checked);w.close();
});
test('unrelated page remains unchanged and receives no staged controls',()=>{
 const {window:w}=fixture('4970020');const before=w.document.body.innerHTML;w.eval(code);assert.equal(w.document.body.innerHTML,before);w.close();
});
test('every layout selector stays behind the exact U.S. page and native form guard',()=>{
 const css=fs.readFileSync('us-donation-palette.css','utf8');const dom=new JSDOM('<style></style>');const sheet=dom.window.document.styleSheets[0];dom.window.document.querySelector('style').textContent=css;
 const guard='html:has(link[rel="canonical"][href*="/aid/6406028/"]):has(form[id="6406028"])';
 function walk(rules){for(const rule of rules){if(rule.cssRules)walk(rule.cssRules);if(!rule.selectorText)continue;let depth=0,part='';for(const c of rule.selectorText+','){if(c==='('||c==='[')depth++;if(c===')'||c===']')depth--;if(c===','&&depth===0){assert(part.trim().startsWith(guard),part);part='';}else part+=c;}}}
 walk(dom.window.document.styleSheets[0].cssRules);dom.window.close();
});
