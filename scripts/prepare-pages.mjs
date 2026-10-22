import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// The public site contains the two self-contained HTML pages, not PHP or source files.
const project = resolve(import.meta.dirname, '..');
const output = resolve(project, '_site');
await mkdir(output, { recursive: true });
for (const name of ['index.html', 'index2.html']) {
  const html = await readFile(resolve(project, name), 'utf8');
  if (!html.toLowerCase().includes('<!doctype html>')) throw new Error(`${name}: HTML inválido.`);
  if (/\b(?:href|src)=["']\//i.test(html)) throw new Error(`${name}: recurso absoluto incompatível com o caminho do projeto no Pages.`);
  await writeFile(resolve(output, name), html);
}
await copyFile(resolve(project, 'public/favicon.svg'), resolve(output, 'favicon.svg'));
await writeFile(resolve(output, '.nojekyll'), '');
console.log('Site estático preparado em _site/ com index.html, index2.html e favicon.svg.');
