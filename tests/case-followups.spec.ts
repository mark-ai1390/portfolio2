import { expect, test } from '@playwright/test';

test('вывод CopterDrone: задержка, посимвольный blur и однократное раскрытие', async ({ page }) => {
  await page.goto('/projects/copterdrone');
  const block = page.getByRole('region', { name: 'Главный вывод', exact: true });
  const letters = block.locator('.text-animate-character');
  await block.scrollIntoViewIfNeeded();
  expect(await letters.count()).toBeGreaterThan(100);
  expect(await letters.first().evaluate(e => getComputedStyle(e).opacity)).toBe('0');
  await page.waitForTimeout(1000);
  expect(await letters.first().evaluate(e => getComputedStyle(e).opacity)).toBe('0');
  await expect.poll(() => letters.evaluateAll(items => items.every(e => getComputedStyle(e).opacity === '1' && getComputedStyle(e).filter === 'blur(0px)'))).toBe(true);
  await page.evaluate(() => scrollTo(0, 0));
  await block.scrollIntoViewIfNeeded();
  expect(await letters.first().evaluate(e => getComputedStyle(e).opacity)).toBe('1');
});

for (const id of ['primekraft', '4sales']) {
  test(`${id}: следующий блок раскрывается из blur один раз`, async ({ page }) => {
    await page.goto(`/projects/${id}`);
    const block = page.locator('.case-followup').first();
    const reveal = block.locator('.case-blur-reveal');
    expect(await reveal.evaluate(e => getComputedStyle(e).opacity)).toBe('0');
    await block.scrollIntoViewIfNeeded();
    await expect.poll(() => reveal.evaluate(e => getComputedStyle(e).opacity)).toBe('1');
    expect(await reveal.evaluate(e => getComputedStyle(e).filter)).toBe('blur(0px)');
    await page.evaluate(() => scrollTo(0, 0));
    await block.scrollIntoViewIfNeeded();
    expect(await reveal.evaluate(e => getComputedStyle(e).opacity)).toBe('1');
  });
}

for (const id of ['copterdrone', 'primekraft', '4sales']) {
  for (const width of [1440, 375]) {
    test(`${id} ${width}px: новые тексты доступны при reduced motion`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/projects/${id}`);
      await expect(page.locator('.case-followup')).toHaveCount(id === '4sales' ? 2 : 1);
      for (const block of await page.locator('.case-followup').all()) {
        await block.scrollIntoViewIfNeeded();
        await expect(block.getByRole('heading', { level: 2 })).toBeInViewport();
        await expect(block.locator('p').first()).toBeVisible();
      }
      await expect(page.locator('.case-followup .text-animate-character')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
}
