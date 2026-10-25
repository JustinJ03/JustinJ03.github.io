import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const origin = process.env.TEST_URL || 'http://localhost:4321';
const base = (process.env.SITE_BASE || '').replace(/\/$/, '');
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true });
await mkdir('.qa', { recursive: true });
const errors = [];
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${origin}${base}/`);
    await page.evaluate(() => document.fonts.ready);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}px`);
    await page.screenshot({ path: `.qa/home-${width}.png`, fullPage: true });
    if (width === 375 || width === 1440) await page.screenshot({ path: `.qa/preview-${width}.png` });
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    assert.deepEqual(results.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target).join(', ')}`), [], `Accessibility at ${width}px`);
  }
  await page.locator('#projects').screenshot({path:'.qa/projects.png'});
  await page.locator('#skills').screenshot({path:'.qa/loadout.png'});
  const card = page.locator('[data-project-status="built"]').first();
  await card.hover({position:{x:40,y:90}});
  assert.notEqual(await card.evaluate(el => getComputedStyle(el).transform), 'none', 'Desktop card tilt');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${origin}${base}/`);
  await page.keyboard.press('Tab');
  assert.equal(await page.locator(':focus').textContent(), 'Skip to content');
  await page.keyboard.press('Enter');
  assert.equal(await page.locator(':focus').getAttribute('id'), 'main');
  const menu = page.getByRole('button', { name: /Menu/ });
  await menu.focus(); await page.keyboard.press('Enter');
  assert.equal(await menu.getAttribute('aria-expanded'), 'true');
  await page.keyboard.press('Escape');
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  assert(await menu.evaluate(el => el === document.activeElement));
  await menu.click(); await page.getByRole('navigation').getByRole('link', { name: 'Projects', exact: true }).click();
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  // Mission filters preserve truthful status groups and work by keyboard.
  assert.equal(await page.locator('[data-project-status]:visible').count(), 3);
  await page.getByRole('button', { name: 'Explorations', exact: true }).click();
  assert.equal(await page.locator('[data-project-status]:visible').count(), 3);
  assert.equal(await page.locator('[data-project-status="built"]:visible').count(), 0);
  await page.getByRole('button', { name: 'All projects', exact: true }).focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('[data-project-status]:visible').count(), 6);
  assert.equal(await page.locator('#project-count').textContent(), '06 projects selected');
  await page.locator('[data-tool="JavaScript"]').click();
  assert.equal(await page.locator('[data-tool="JavaScript"]').getAttribute('aria-pressed'), 'true');
  assert((await page.locator('#tool-readout').textContent()).includes('JavaScript selected'));
  assert.equal(await page.locator('[data-tool] svg').count(), await page.locator('[data-tool]').count());
  await page.locator('.exploring-tools summary').click();
  await page.locator('[data-tool="Supabase"]').click();
  assert((await page.locator('#tool-readout').textContent()).includes('not completed professional experience'));
  await page.locator('.profile-console summary').first().click();
  assert(await page.getByRole('heading', { name: 'Assistant Systems Developer' }).isVisible());
  // Complete the mini-game using both touch controls and focused keyboard input.
  await page.locator('#game-start').click();
  await page.keyboard.press('ArrowLeft');
  assert.equal(await page.locator('#moves').textContent(), '0');
  await page.getByRole('button', {name:'Move right',exact:true}).click();
  let cell = 41;
  await page.locator('.game-grid').focus();
  for (const target of [10,30,4,45,23]) {
    while (Math.floor(cell/8) !== Math.floor(target/8)) {
      const down = cell < target; await page.keyboard.press(down ? 'ArrowDown' : 'ArrowUp'); cell += down ? 8 : -8;
    }
    while (cell !== target) { const right = cell < target; await page.keyboard.press(right ? 'ArrowRight' : 'ArrowLeft'); cell += right ? 1 : -1; }
  }
  assert.equal(await page.locator('#packets').textContent(), '5 / 5');
  assert.equal(await page.locator('#moves').textContent(), '28');
  assert((await page.locator('#game-status').textContent()).includes('Run complete!'));
  await page.locator('#game-start').click();
  assert.equal(await page.locator('#moves').textContent(), '0');
  assert.equal(await page.locator('#packets').textContent(), '0 / 5');
  for (const palette of ['pink','amber','cyan']) {
    await page.locator(`button[data-palette="${palette}"]`).click();
    assert.equal(await page.locator('html').getAttribute('data-palette'), palette);
    const audit = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    assert.deepEqual(audit.violations.map(v => `${v.id}: ${v.nodes.map(n=>n.target).join(', ')}`), [], `${palette} palette accessibility`);
  }
  await page.locator('#effects-toggle').click();
  assert.equal(await page.locator('html').getAttribute('data-effects'), 'off');
  assert.equal(await page.locator('.hover-bike').evaluate(el => getComputedStyle(el).animationName), 'none');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
  await page.setViewportSize({ width: 640, height: 450 });
  await page.goto(`${origin}${base}/`);
  await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Overflow at 200% CSS zoom');
  await page.evaluate(() => { document.documentElement.style.zoom = ''; });
  for (const slug of ['myfinance', 'chirper', 'edusdg', 'chripy', 'booking-assistant', 'irrigation']) {
    await page.goto(`${origin}${base}/projects/${slug}/`);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${slug} overflow`);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    assert.deepEqual(results.violations.map(v => v.id), [], `${slug} accessibility`);
  }
  await page.goto(`${origin}${base}/404.html`);
  assert.equal(await page.getByRole('link', { name: /Back to the arcade/ }).getAttribute('href'), `${base}/`);
  const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const staticPage = await nojs.newPage();
  await staticPage.goto(`${origin}${base}/`);
  assert(await staticPage.getByRole('navigation').isVisible(), 'No-JS navigation hidden');
  await staticPage.getByRole('navigation').getByRole('link', { name: 'Projects', exact: true }).click();
  assert(staticPage.url().endsWith('#projects'));
  assert.equal(await staticPage.locator('a[href^="mailto:"]').count(), 1);
  assert.equal(await staticPage.locator('[data-project-status]:visible').count(), 6);
  await nojs.close();
  assert.deepEqual(errors, [], 'Browser console/network errors');
  console.log('PASS: 320/375/768/1440px, axe WCAG AA in all 3 palettes, project filters, tool selection/icons, mini-game win/reset/boundaries, profile disclosure, motion toggle, project pages, keyboard/Escape, no-JS, reduced motion, 200% CSS zoom, 404, and browser errors.');
} finally { await browser.close(); }
