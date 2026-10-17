import { mkdir, copyFile, cp, readFile, writeFile } from 'node:fs/promises';
import { copy } from './content.js';

await mkdir('dist', { recursive: true });
for (const file of ['styles.css', 'app.js', 'content.js', 'achievements.js', 'robots.txt', 'sitemap.xml']) {
  await copyFile(file, `dist/${file}`);
}
// Include default-language text in HTML before client-side language switching.
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const html = (await readFile('index.html', 'utf8')).replace(
  /(<[a-z][^>]*data-t="([^"]+)"[^>]*>)([^<]*)(<\/[a-z][^>]*>)/g,
  (match, open, key, text, close) => typeof copy.en[key] === 'string' ? `${open}${escape(copy.en[key])}${close}` : match
);
await writeFile('dist/index.html', html);
await cp('assets', 'dist/assets', { recursive: true });
console.log('Production site built in dist/');
