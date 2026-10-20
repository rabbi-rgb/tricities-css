// Preserve every declaration and its order. Do not minify or remove old rules.
const fs = require('node:fs');
const crypto = require('node:crypto');
const sources = [
  'homepage-corners.css', 'homepage-polish.css', 'homepage-finish.css',
  'forms-refresh-v2.css', 'homepage-cleanup.css', 'homepage-signup-simple.css',
  'forms-alignment.css', 'learning-image-fix.css', 'homepage-radius.css',
  'homepage-blue-outline.css', 'homepage-header-align.css'
];
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const inputs = sources.map(path => ({ path, content:fs.readFileSync(path) }));
for (const {path,content} of inputs) {
  if (/url\s*\(|@(?:import|charset|layer|namespace)\b|sourceMappingURL/i.test(content.toString())) {
    throw new Error(`${path}: review path/order-sensitive CSS before bundling`);
  }
}
const content = Buffer.concat(inputs.flatMap(({path,content}) => [Buffer.from(`/* Source: ${path} — unchanged, in original header order. */\n`), content, Buffer.from('\n\n')]));
const output = `site-polish-bundle.${sha(content).slice(0,16)}.css`;
if (fs.existsSync(output) && !fs.readFileSync(output).equals(content)) throw new Error('Refusing to overwrite a different immutable bundle');
fs.writeFileSync(output, content);
fs.writeFileSync('site-polish-bundle.json', JSON.stringify({ output, sha256:sha(content), sources:inputs.map(({path,content}) => ({path,sha256:sha(content),bytes:content.length})) },null,2)+'\n');
console.log(output);
