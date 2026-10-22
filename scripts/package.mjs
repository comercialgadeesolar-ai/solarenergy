import { mkdir, cp, rm, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const project = resolve(import.meta.dirname, '..');
const release = '/workspace/releases';
const plugin = resolve(release, 'orbita-solar');
await mkdir(release, { recursive: true });
await rm(plugin, { recursive: true, force: true });
await mkdir(plugin);
for (const path of ['orbita-solar.php', 'index.php', 'templates', 'dist', 'public', 'LEIA-ME.md']) {
  await cp(resolve(project, path), resolve(plugin, path), { recursive: true });
}
const template = await readFile(resolve(project, 'templates/landing.html'), 'utf8');
const floatingMenu = await readFile(resolve(project, 'templates/floating-menu.html'), 'utf8');
const floatingStyles = await readFile(resolve(project, 'public/floating-menu.css'), 'utf8');
const homeTemplate = await readFile(resolve(project, 'templates/home.html'), 'utf8');
const home = homeTemplate.replace('/* FLOATING_MENU_STYLES */', floatingStyles).replace('<!-- FLOATING_MENU -->', floatingMenu.replaceAll('href="#', 'href="index2.html#').replace('href="index2.html#inicio" data-section="inicio"', 'href="index.html" data-section="inicio" aria-current="location"'));
await writeFile(resolve(project, 'index.html'), home);
await writeFile(resolve(release, 'index.html'), home);
await writeFile(resolve(plugin, 'index.html'), home);
await writeFile(resolve(plugin, 'demo.html'), `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#070c13"><title>Órbita Solar — Demo</title><link rel="icon" href="public/favicon.svg"><link rel="stylesheet" href="dist/orbita-solar.css"></head><body class="orbita-solar" id="orbita-solar"><div id="app">${template}</div>${floatingMenu}<script type="module" src="dist/orbita-solar.js"></script></body></html>`);
const css = await readFile(resolve(project, 'dist/orbita-solar.css'), 'utf8');
const js = (await readFile(resolve(project, 'dist/orbita-solar.js'), 'utf8')).replace(/<\/script/gi, '<\\/script');
await writeFile(resolve(release, 'orbita-solar-demo.html'), `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#070c13"><title>Órbita Solar — Demo</title><style>${css}</style></head><body class="orbita-solar" id="orbita-solar"><div id="app">${template}</div>${floatingMenu}<script type="module">${js}</script></body></html>`);
await cp(resolve(release, 'orbita-solar-demo.html'), resolve(plugin, 'demo-autocontida.html'));
await cp(resolve(release, 'orbita-solar-demo.html'), resolve(project, 'index2.html'));
await cp(resolve(release, 'orbita-solar-demo.html'), resolve(release, 'index2.html'));
await cp(resolve(release, 'orbita-solar-demo.html'), resolve(plugin, 'index2.html'));
await rm(resolve(release, 'orbita-solar-wordpress.zip'), { force: true });
execFileSync('zip', ['-9qr', resolve(release, 'orbita-solar-wordpress.zip'), 'orbita-solar'], { cwd: release });
await rm(resolve(release, 'orbita-solar-completo.zip'), { force: true });
execFileSync('zip', ['-9qr', resolve(release, 'orbita-solar-completo.zip'), '.', '-x', 'node_modules/*', '.git/*', 'test-results/*', 'playwright-report/*', 'downloads/*', '_site/*', '.env', '.env.*'], { cwd: project });
execFileSync('zip', ['-9qj', resolve(release, 'orbita-solar-completo.zip'), resolve(release, 'orbita-solar-demo.html')]);
await rm(resolve(release, 'gse-solar-site-html.zip'), { force: true });
execFileSync('zip', ['-9qj', resolve(release, 'gse-solar-site-html.zip'), resolve(release, 'index.html'), resolve(release, 'index2.html')]);
console.log('Pacote WordPress e demo PHP/HTML gerados em /workspace/releases/orbita-solar-wordpress.zip');
