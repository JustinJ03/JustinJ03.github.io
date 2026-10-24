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
  assert.equal(await page.getByRole('link', { name: /Back to the greenhouse/ }).getAttribute('href'), `${base}/`);
  const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const staticPage = await nojs.newPage();
  await staticPage.goto(`${origin}${base}/`);
  assert(await staticPage.getByRole('navigation').isVisible(), 'No-JS navigation hidden');
  await staticPage.getByRole('navigation').getByRole('link', { name: 'Projects', exact: true }).click();
  assert(staticPage.url().endsWith('#projects'));
  assert.equal(await staticPage.locator('a[href^="mailto:"]').count(), 1);
  await nojs.close();
  assert.deepEqual(errors, [], 'Browser console/network errors');
  console.log('PASS: 320/375/768/1440px, axe WCAG AA, project pages, menu keyboard/Escape, skip link, no-JS, reduced motion, 200% CSS zoom, 404, and browser errors.');
} finally { await browser.close(); }
