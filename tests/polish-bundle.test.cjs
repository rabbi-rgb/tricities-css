const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const { JSDOM, VirtualConsole } = require('jsdom');
const manifest = JSON.parse(fs.readFileSync('site-polish-bundle.json','utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

test('bundle contains every original stylesheet unchanged and in order', () => {
  const inputs=manifest.sources.map(({path,sha256,bytes})=>{
    const content=fs.readFileSync(path);
    assert.equal(sha(content),sha256,`${path} changed: rebuild bundle and repeat visual review`);
    assert.equal(content.length,bytes);
    assert.doesNotMatch(content.toString(), /url\s*\(|@(?:import|charset|layer|namespace)\b|sourceMappingURL/i);
    return Buffer.concat([Buffer.from(`/* Source: ${path} — unchanged, in original header order. */\n`),content,Buffer.from('\n\n')]);
  });
  const bundle=fs.readFileSync(manifest.output);
  assert.deepEqual(bundle,Buffer.concat(inputs));
  assert.equal(sha(bundle),manifest.sha256);
});

test('CSS parsing preserves all rules, declaration priorities and media queries', () => {
  const errors=[];
  const virtualConsole=new VirtualConsole();
  virtualConsole.on('jsdomError',error=>errors.push(error.message));
  const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{virtualConsole});
  try {
    const parse=content=>{
      const style=dom.window.document.createElement('style');
      style.textContent=content;
      dom.window.document.head.appendChild(style);
      assert.ok(style.sheet,'stylesheet parses');
      const rules=[...style.sheet.cssRules].map(rule=>rule.cssText);
      style.remove();return rules;
    };
    const originals=manifest.sources.flatMap(({path})=>parse(fs.readFileSync(path,'utf8')));
    assert.deepEqual(parse(fs.readFileSync(manifest.output,'utf8')),originals);
    assert.deepEqual(errors,[]);
  } finally {dom.window.close();}
});
