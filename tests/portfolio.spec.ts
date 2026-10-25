import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function toolkit(page: Page) {
  await page.setViewportSize({ width: 900, height: 1000 });
  await page.goto('./');
  const row = page.locator('[data-carousel]').first();
  await row.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(row).toHaveAttribute('data-initialized', 'true');
  await expect(row).not.toHaveAttribute('data-pause-reasons', /offscreen/);
  return { row, viewport: row.locator('[data-viewport]') };
}
const position = (viewport: ReturnType<Page['locator']>) => viewport.evaluate((el) => el.scrollLeft);

test('responsive content, assets, and accessibility', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('./');
    await expect(page.locator('nav')).toHaveCount(0);
    await expect(page.locator('.project-card')).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('.contact').scrollIntoViewIfNeeded();
    await page.locator('img').evaluateAll(async (images) => {
      await Promise.all((images as HTMLImageElement[]).map(async (img) => { img.loading = 'eager'; await img.decode(); }));
    });
    expect(await page.locator('img').evaluateAll((images) => (images as HTMLImageElement[]).filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src))).toEqual([]);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `docs/preview-${width}.png`, fullPage: true });
  }
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
  expect(errors).toEqual([]);
});

test('auto-scroll pauses on hover at exact position and resumes on leave', async ({ page }) => {
  const { row, viewport } = await toolkit(page);
  const start = await position(viewport);
  await expect.poll(() => position(viewport)).toBeGreaterThan(start + 8);
  await row.locator('h3').hover();
  const paused = await position(viewport);
  await page.waitForTimeout(400);
  expect(await position(viewport)).toBe(paused);
  await page.mouse.move(0, 0);
  await expect.poll(() => position(viewport)).toBeGreaterThan(paused + 6);
});

test('no buttons or duplicate tab stops; keyboard focus pauses until it leaves', async ({ page }) => {
  const { row, viewport } = await toolkit(page);
  await expect(page.locator('[data-carousel] button')).toHaveCount(0);
  await expect(row.getByRole('link')).toHaveCount(7);
  await expect(row.locator('[data-clone] a:not([tabindex="-1"])')).toHaveCount(0);
  await viewport.focus();
  await page.keyboard.press('ArrowRight');
  const paused = await position(viewport);
  await page.waitForTimeout(350);
  expect(await position(viewport)).toBe(paused);
  await expect(row).toHaveAttribute('data-pause-reasons', /focus/);
  await page.locator('.hero .button').focus();
  await row.scrollIntoViewIfNeeded();
  await expect.poll(() => position(viewport)).toBeGreaterThan(paused + 5);
});

test('continuous forward loop crosses the seam without reversing or a visual jump', async ({ page }) => {
  const { row, viewport } = await toolkit(page);
  const cycle = Number(await row.getAttribute('data-cycle-width'));
  await row.locator('h3').hover();
  await viewport.evaluate((el, width) => { el.scrollLeft = width * 2 - 2; }, cycle);
  await page.waitForTimeout(250);
  await page.mouse.move(0, 0);
  const samples = await viewport.evaluate(async (el) => {
    const values: number[] = [];
    for (let i = 0; i < 24; i++) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      values.push(el.scrollLeft);
    }
    return values;
  });
  expect(samples.some((value) => value < cycle + 20)).toBe(true);
  for (let i = 1; i < samples.length; i++) {
    const delta = (samples[i] - samples[i - 1] + cycle) % cycle;
    expect(delta).toBeLessThanOrEqual(2);
  }
  // Last real card and first visual copy are adjacent, with exactly one normal gap.
  const seamGap = await row.locator('.tool-list').evaluate((list) => {
    const items = [...list.children] as HTMLElement[];
    const last = items.filter((item) => !item.dataset.clone).at(-1)!;
    return last.nextElementSibling!.getBoundingClientRect().left - last.getBoundingClientRect().right;
  });
  expect(seamGap).toBeCloseTo(12, 0);
});

test('dragging backward across the start wraps and resumes on pointer leave', async ({ page }) => {
  const { row, viewport } = await toolkit(page);
  const cycle = Number(await row.getAttribute('data-cycle-width'));
  await row.locator('h3').hover();
  await viewport.evaluate((el, width) => { el.scrollLeft = width + 10; }, cycle);
  await page.waitForTimeout(220);
  const box = (await row.locator('li:not([data-clone]) .tool-card').nth(1).boundingBox())!;
  await page.mouse.move(box.x + 40, box.y + 70);
  await page.mouse.down();
  await page.mouse.move(box.x + 160, box.y + 70, { steps: 12 });
  await page.mouse.up();
  expect(await position(viewport)).toBeGreaterThan(cycle * 2 - 130);
  expect(await position(viewport)).toBeLessThan(cycle * 2 - 90);
  await page.mouse.move(0, 0);
  const released = await position(viewport);
  await expect.poll(() => position(viewport)).toBeGreaterThan(released + 5);
});

test('200 percent zoom, keyboard tab order, and drag cancellation', async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await expect(page.locator('.hero .button')).toBeFocused();
  const { row, viewport } = await toolkit(page);
  const box = (await row.locator('li:not([data-clone]) .tool-card').nth(2).boundingBox())!;
  await page.mouse.move(box.x + 80, box.y + 70);
  await page.mouse.down();
  await page.mouse.move(box.x - 40, box.y + 70, { steps: 6 });
  await expect(viewport).toHaveClass(/is-dragging/);
  await viewport.dispatchEvent('pointercancel', { pointerId: 1, pointerType: 'mouse', bubbles: true });
  await page.mouse.up();
  await expect(viewport).not.toHaveClass(/is-dragging/);
  await page.mouse.move(0, 0);
  const released = await position(viewport);
  await expect.poll(() => position(viewport)).toBeGreaterThan(released + 5);
});

test('drag over a link suppresses only drag-click; ordinary and modifier clicks work', async ({ page }) => {
  const { row, viewport } = await toolkit(page);
  await page.evaluate(() => {
    (window as unknown as { activations: number }).activations = 0;
    document.addEventListener('click', (event) => {
      if ((event.target as Element).closest('.tool-card')) {
        if (!event.defaultPrevented) (window as unknown as { activations: number }).activations++;
        event.preventDefault();
      }
    });
  });
  const card = row.locator('li:not([data-clone]) .tool-card').nth(2);
  const box = (await card.boundingBox())!;
  const start = await position(viewport);
  await page.mouse.move(box.x + 80, box.y + 70);
  await page.mouse.down();
  await page.mouse.move(box.x - 40, box.y + 70, { steps: 10 });
  await page.mouse.up();
  expect(await position(viewport)).toBeGreaterThan(start + 90);
  const activations = () => page.evaluate(() => (window as unknown as { activations: number }).activations);
  expect(await activations()).toBe(0);
  await card.click();
  expect(await activations()).toBe(1);
  await card.click({ modifiers: ['Control'] });
  expect(await activations()).toBe(2);
  await card.focus();
  await page.keyboard.press('Enter');
  expect(await activations()).toBe(3);
  await page.locator('.hero .button').focus();
  await row.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const released = await position(viewport);
  await expect.poll(() => position(viewport)).toBeGreaterThan(released + 5);
});

test('focused final card is visible and motion resumes after focus leaves', async ({ page }) => {
  const { row, viewport } = await toolkit(page);
  const link = row.locator('li:not([data-clone]) .tool-card').last();
  await link.focus();
  const outer = (await viewport.boundingBox())!;
  const inner = (await link.boundingBox())!;
  expect(inner.x + inner.width).toBeLessThanOrEqual(outer.x + outer.width);
  await page.locator('.hero .button').focus();
  await row.scrollIntoViewIfNeeded();
  const paused = await position(viewport);
  await expect.poll(() => position(viewport)).toBeGreaterThan(paused + 5);
});

test('reduced motion defaults to still and keyboard scrolling remains available', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const { row, viewport } = await toolkit(page);
  const start = await position(viewport);
  await page.waitForTimeout(350);
  expect(await position(viewport)).toBe(start);
  await viewport.focus();
  await page.keyboard.press('ArrowRight');
  expect(await position(viewport)).toBeGreaterThan(start + 100);
  await row.evaluate((el) => { el.style.width = '1800px'; });
  await expect(row).toHaveAttribute('data-pause-reasons', /fits/);
  await expect(row.locator('[data-clone]')).toHaveCount(0);
});

test('offscreen and hidden documents stop; return has no elapsed-time jump', async ({ page }) => {
  const { row, viewport } = await toolkit(page);
  await page.locator('.contact').scrollIntoViewIfNeeded();
  await expect(row).toHaveAttribute('data-pause-reasons', /offscreen/);
  const offscreen = await position(viewport);
  await page.waitForTimeout(300);
  expect(await position(viewport)).toBe(offscreen);
  await row.scrollIntoViewIfNeeded();
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
  const hidden = await position(viewport);
  await page.waitForTimeout(300);
  expect(await position(viewport)).toBe(hidden);
  const steps = await viewport.evaluate(async (el) => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    let previous = el.scrollLeft;
    document.dispatchEvent(new Event('visibilitychange'));
    const deltas: number[] = [];
    for (let i = 0; i < 6; i++) {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      deltas.push(Math.abs(el.scrollLeft - previous));
      previous = el.scrollLeft;
    }
    return deltas;
  });
  expect(Math.max(...steps)).toBeLessThanOrEqual(2);
});

test('touch uses native horizontal swipe and preserves vertical page scroll', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:4321${process.env.BASE_PATH || ''}/`);
  const row = page.locator('[data-carousel]').first();
  await row.scrollIntoViewIfNeeded();
  const viewport = row.locator('[data-viewport]');
  const bounds = (await viewport.boundingBox())!;
  const session = await context.newCDPSession(page);
  const y = bounds.y + 75;
  const initialX = await position(viewport);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 290, y }] });
  for (const x of [260, 220, 180, 140, 100]) {
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
    await page.waitForTimeout(25);
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(() => position(viewport)).toBeGreaterThan(initialX + 80);
  await expect.poll(() => row.getAttribute('data-pause-reasons')).not.toMatch(/touching/);
  const initialY = await page.evaluate(() => scrollY);
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 150, y }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 150, y: y - 120 }] });
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(initialY);
  await context.close();
});

test('without JavaScript, content and native scrolling survive; 404 returns home', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  const base = `http://127.0.0.1:4321${process.env.BASE_PATH || ''}/`;
  await page.goto(base);
  await expect(page.locator('.tool-card')).toHaveCount(30);
  await expect(page.locator('[data-controls]:visible')).toHaveCount(0);
  await expect(page.locator('.project-card')).toHaveCount(3);
  expect(await page.locator('[data-viewport]').first().evaluate((el) => el.scrollWidth > el.clientWidth && getComputedStyle(el).overflowX === 'auto')).toBe(true);
  await page.goto(`${base}404.html`);
  await page.getByRole('link', { name: "Back to Justin's page" }).click();
  await expect(page.locator('h1')).toHaveText("Hey, I'm Justin.");
  await context.close();
});
