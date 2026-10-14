import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('PHP renders the content; WebGL, planet selection and controls work', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/index.php');
  await expect(page.getByRole('heading', { name: 'O futuro é solar. O próximo passo é seu.' })).toBeVisible();
  await expect(page.locator('#solar-canvas canvas')).toBeVisible();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Pausar órbitas' }).click();
  await expect(page.getByRole('button', { name: 'Retomar órbitas' })).toHaveAttribute('aria-pressed', 'true');
  const canvas = page.locator('#solar-canvas canvas');
  const initial = await canvas.screenshot();
  await page.getByRole('button', { name: 'Aproximar', exact: true }).click();
  await page.waitForTimeout(350);
  const zoomed = await canvas.screenshot();
  expect(initial.equals(zoomed)).toBe(false);
  await page.getByRole('button', { name: 'Restaurar visão' }).click();
  const bounds = await canvas.boundingBox();
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await expect(page.locator('#planet-info h3')).toHaveText('Sol');
  await canvas.scrollIntoViewIfNeeded();
  const draggedBounds = await canvas.boundingBox();
  await page.mouse.move(draggedBounds.x + draggedBounds.width / 2, draggedBounds.y + draggedBounds.height / 2);
  await page.mouse.down();
  await page.mouse.move(draggedBounds.x + draggedBounds.width / 2 + 70, draggedBounds.y + draggedBounds.height / 2 + 20, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(350);
  expect(initial.equals(await canvas.screenshot())).toBe(false);
  await page.getByRole('button', { name: 'Terra', exact: true }).click();
  await expect(page.locator('#planet-info h3')).toHaveText('Terra');
  await expect(page.getByRole('button', { name: 'Terra', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Saturno', exact: true }).click();
  await expect(page.locator('#planet-info')).toContainText('29 anos');
  await page.screenshot({ path: '/workspace/releases/site-desktop.png', fullPage: true });
  expect(errors).toEqual([]);
});

test('calculator updates savings and system size from both inputs', async ({ page }) => {
  await page.goto('/index.php');
  await expect(page.locator('#annual-savings')).toHaveText(/4\.320/);
  await expect(page.locator('#system-size')).toHaveText('3,3 kWp');
  await expect(page.locator('#panel-count')).toHaveText('7 painéis');
  await page.locator('#monthly-bill').fill('1000');
  await expect(page.locator('#annual-savings')).toHaveText(/9\.600/);
  await expect(page.locator('#panel-count')).toHaveText('14 painéis');
  await page.locator('#sun-hours').fill('6');
  await expect(page.locator('#system-size')).toHaveText('5,6 kWp');
  await expect(page.locator('#panel-count')).toHaveText('11 painéis');
});

test('mobile layout, navigation and all planet details are usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/index.php');
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Benefícios' }).click();
  await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const planet of ['Sol','Mercúrio','Vênus','Terra','Marte','Júpiter','Saturno','Urano','Netuno']) {
    await page.getByRole('button', { name: planet, exact: true }).click();
    await expect(page.locator('#planet-info h3')).toHaveText(planet);
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: '/workspace/releases/site-mobile.png', fullPage: true });
});

test('server-rendered PHP remains informative without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:8080/index.php');
  await expect(page.getByRole('heading', { name: 'Tudo começa com a luz' })).toBeVisible();
  await expect(page.locator('.planet-pill')).toHaveCount(9);
  await context.close();
});

test('WebGL fallback preserves planet information and calculator', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
      return original.call(this, type, ...args);
    };
  });
  await page.goto('/index.php');
  await expect(page.locator('.scene-fallback')).toBeVisible();
  await page.getByRole('button', { name: 'Terra', exact: true }).click();
  await expect(page.locator('#planet-info h3')).toHaveText('Terra');
  await page.locator('#monthly-bill').fill('500');
  await expect(page.locator('#annual-savings')).toHaveText(/4\.800/);
});

test('reduced motion starts paused', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/index.php');
  await expect(page.getByRole('button', { name: 'Retomar órbitas' })).toHaveAttribute('aria-pressed', 'true');
});

test('Earth-only manual zoom follows the planet and restores the full system', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/index.php');
  await page.getByRole('button', { name: 'Pausar órbitas' }).click();
  await expect(page.locator('#earth-zoom-panel')).toBeHidden();
  await page.getByRole('button', { name: 'Zoom na Terra', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Voltar ao sistema solar' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#solar-canvas')).toHaveAttribute('aria-label', /^Terra em 3D/);
  await expect(page.locator('#planet-info h3')).toHaveText('Terra');
  await expect(page.getByRole('slider', { name: 'Zoom manual da Terra' })).toBeVisible();
  await expect(page.locator('.sun-callout')).toBeHidden();
  await page.locator('#earth-zoom').fill('20');
  await expect(page.locator('#earth-zoom-value')).toHaveText('20%');
  const canvas = page.locator('#solar-canvas canvas');
  const far = await canvas.screenshot();
  await page.locator('#earth-zoom').fill('100');
  await expect(page.locator('#earth-zoom-value')).toHaveText('100%');
  await page.waitForTimeout(200);
  expect(far.equals(await canvas.screenshot())).toBe(false);
  await page.locator('#earth-zoom').fill('50');
  await page.getByRole('button', { name: 'Aproximar', exact: true }).click();
  expect(Number(await page.locator('#earth-zoom').inputValue())).toBeGreaterThan(50);
  await page.getByRole('button', { name: 'Afastar', exact: true }).click();
  expect(Number(await page.locator('#earth-zoom').inputValue())).toBeLessThan(70);
  await page.locator('#earth-zoom').fill('50');
  await canvas.hover();
  await page.keyboard.down('Control');
  await page.mouse.wheel(0, -150);
  await page.keyboard.up('Control');
  await expect.poll(async () => Number(await page.locator('#earth-zoom').inputValue())).toBeGreaterThan(50);
  await page.getByRole('button', { name: 'Retomar órbitas' }).click();
  await page.waitForTimeout(1200);
  await expect(page.locator('#solar-canvas')).toHaveAttribute('aria-label', /^Terra em 3D/);
  await page.getByRole('button', { name: 'Pausar órbitas' }).click();
  await page.screenshot({ path: '/workspace/releases/zoom-terra-desktop.png' });
  await page.getByRole('button', { name: 'Voltar ao sistema solar' }).click();
  await expect(page.locator('#earth-zoom-panel')).toBeHidden();
  await expect(page.locator('.sun-callout')).toBeVisible();
  await expect(page.locator('#solar-canvas')).toHaveAttribute('aria-label', /^Sol e oito planetas/);
  await page.getByRole('button', { name: 'Zoom na Terra', exact: true }).click();
  await page.getByRole('button', { name: 'Restaurar visão' }).click();
  await expect(page.getByRole('button', { name: 'Zoom na Terra', exact: true })).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#earth-zoom-panel')).toBeHidden();
  expect(errors).toEqual([]);
});

test('Earth zoom is usable on mobile and the slider supports keyboard controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/index.php');
  await page.getByRole('button', { name: 'Zoom na Terra', exact: true }).click();
  const slider = page.getByRole('slider', { name: 'Zoom manual da Terra' });
  await slider.fill('70');
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(slider).toHaveValue('71');
  await expect(page.locator('#earth-zoom-value')).toHaveText('71%');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const panelBounds = await page.locator('#earth-zoom-panel').boundingBox();
  expect(panelBounds.x).toBeGreaterThanOrEqual(0);
  expect(panelBounds.x + panelBounds.width).toBeLessThanOrEqual(390);
  await page.screenshot({ path: '/workspace/releases/zoom-terra-mobile.png' });
});

test('self-contained HTML demo runs with no additional resource requests', async ({ page }) => {
  const requests = [];
  const errors = [];
  page.on('request', request => { if (/^https?:/.test(request.url())) requests.push(request.url()); });
  page.on('pageerror', error => errors.push(error.message));
  const demo = await readFile('/workspace/releases/orbita-solar-demo.html', 'utf8');
  await page.route('**/self-contained-demo.html', route => route.fulfill({ contentType: 'text/html; charset=utf-8', body: demo }));
  await page.goto('/self-contained-demo.html');
  await expect(page.locator('#solar-canvas canvas')).toBeVisible();
  await page.getByRole('button', { name: 'Zoom na Terra', exact: true }).click();
  await page.locator('#earth-zoom').fill('90');
  await expect(page.locator('#earth-zoom-value')).toHaveText('90%');
  await page.getByRole('button', { name: 'Voltar ao sistema solar' }).click();
  await page.getByRole('button', { name: 'Marte', exact: true }).click();
  await expect(page.locator('#planet-info h3')).toHaveText('Marte');
  await page.locator('#monthly-bill').fill('1000');
  await expect(page.locator('#annual-savings')).toHaveText(/9\.600/);
  expect(requests).toEqual(['http://127.0.0.1:8080/self-contained-demo.html']);
  expect(errors).toEqual([]);
});

for (const width of [1440, 390, 320]) {
  test(`floating navigation stays visible at every section and footer (${width}px)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/index.php');
    const menu = page.getByRole('navigation', { name: 'Menu flutuante' });
    await expect(menu).toBeVisible();
    for (const id of ['inicio', 'como-funciona', 'universo', 'beneficios', 'simulador']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect(menu).toBeInViewport({ ratio: 1 });
      const bounds = await menu.boundingBox();
      expect(bounds.y).toBeGreaterThanOrEqual(0);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(844);
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    }
    await menu.getByRole('link', { name: 'Simulador' }).click();
    await expect(page).toHaveURL(/#simulador$/);
    await expect(menu.getByRole('link', { name: 'Simulador' })).toHaveAttribute('aria-current', 'location');
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await expect(menu).toBeInViewport({ ratio: 1 });
    const footerBounds = await page.locator('footer').boundingBox();
    const menuBounds = await menu.boundingBox();
    expect(footerBounds.y + footerBounds.height).toBeLessThanOrEqual(menuBounds.y);
    await page.screenshot({ path: `/workspace/releases/menu-flutuante-${width}.png` });
    await menu.getByRole('link', { name: 'Início', exact: true }).click();
    await expect(page).toHaveURL(/#inicio$/);
    await expect(page.locator('#hero-title')).toBeInViewport();
  });
}

test('floating menu works on a WordPress theme page without the solar shortcode', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/tests/wordpress-page.php');
  await expect(page.locator('#orbita-solar')).toHaveCount(0);
  const menu = page.getByRole('navigation', { name: 'Menu flutuante' });
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await expect(menu).toBeInViewport({ ratio: 1 });
  await menu.getByRole('link', { name: 'Simulador' }).click();
  await expect(page).toHaveURL(/\/index.php#simulador$/);
  await expect(page.locator('#monthly-bill')).toBeInViewport();
  await expect(page.getByRole('navigation', { name: 'Menu flutuante' })).toHaveCount(1);
  expect(errors).toEqual([]);
});
