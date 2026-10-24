import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, relative } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve('dist');
const base = (process.env.SITE_BASE || '/').replace(/\/$/, '');
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? walk(resolve(dir, e.name)) : resolve(dir, e.name)))).flat();
}
const files = (await walk(root)).filter(f => f.endsWith('.html'));
let checked = 0;
for (const file of files) {
  const html = await readFile(file, 'utf8');
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${file}: expected one h1`);
  assert(!html.includes('href="#"'), `${file}: placeholder link`);
  const route = relative(root, file).replaceAll('\\', '/').replace(/index\.html$/, '');
  for (const [, attr, value] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|data:)/.test(value)) continue;
    const url = new URL(value, `https://local.test${base}/${route}`);
    assert(url.pathname.startsWith(`${base}/`), `${file}: URL escapes base: ${value}`);
    let target = resolve(root, decodeURIComponent(url.pathname.slice(base.length + 1)));
    assert(target.startsWith(root), `Escapes output: ${value}`);
    if ((await stat(target)).isDirectory()) target = resolve(target, 'index.html');
    await stat(target);
    if (attr === 'href' && url.hash) {
      const targetHtml = await readFile(target, 'utf8');
      assert(targetHtml.includes(`id="${url.hash.slice(1)}"`), `Missing anchor ${value} in ${file}`);
    }
    checked++;
  }
  for (const [, url] of html.matchAll(/<meta property="og:image" content="([^"]+)"/g)) {
    const pathname = new URL(url).pathname;
    assert(pathname.startsWith(`${base}/`));
    await stat(resolve(root, pathname.slice(base.length + 1)));
  }
}
assert(files.length >= 8, 'Expected home, six projects, and 404');
console.log(`PASS: ${files.length} pages; ${checked} local links/assets and all OG assets resolve (base: ${base || '/'}).`);
