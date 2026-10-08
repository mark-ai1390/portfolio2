import { expect, test } from '@playwright/test';

for (const id of ['copterdrone', 'primekraft', '4sales']) {
  test(`${id}: mobile viewer, two hints, zoom, pan and return`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 375, height: 844 });
    await page.goto(`/projects/${id}`);
    await expect(page.locator('.case-image-link--hint')).toHaveCount(2);
    await expect(page.locator('.case-hero .case-image-hint, .case-concepts .case-image-hint')).toHaveCount(0);
    const link = page.locator('.case-image-link').first();
    await link.scrollIntoViewIfNeeded();
    const href = await link.getAttribute('href');
    const scroll = await page.evaluate(() => scrollY);
    await link.click();
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(page.locator('.case-viewer-original')).toHaveAttribute('src', href!);
    await expect(page.locator('.case-viewer-zoom output')).toHaveText('200%');
    await expect(page.getByRole('button', { name: 'Закрыть просмотр изображения' })).toBeFocused();
    await page.getByRole('button', { name: 'Увеличить изображение', exact: true }).click();
    await expect(page.locator('.case-viewer-zoom output')).toHaveText('250%');
    const stage = page.locator('.case-viewer-viewport');
    const box = (await stage.boundingBox())!;
    await page.mouse.move(box.x + box.width * .7, box.y + 80);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * .3, box.y + 80, { steps: 8 });
    await page.mouse.up();
    expect(await stage.evaluate(e => e.scrollLeft)).toBeGreaterThan(0);
    await page.getByRole('button', { name: 'По ширине', exact: true }).click();
    await expect(page.locator('.case-viewer-zoom output')).toHaveText('100%');
    await expect.poll(() => stage.evaluate(e => e.scrollLeft)).toBe(0);
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
    await expect(link).toBeFocused();
    await expect(page.locator('.case-image-link--hint')).toHaveCount(1);
    expect(await page.evaluate(() => Math.abs(scrollY - scroll))).toBeLessThan(2);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('Desktop: keyboard opens the viewer, original is available, cues stay hidden', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/projects/primekraft');
  await expect(page.locator('.case-image-hint').first()).not.toBeVisible();
  const link = page.locator('.case-image-link').first();
  await link.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.case-viewer-zoom output')).toHaveText('100%');
  await expect(page.getByRole('link', { name: 'Открыть оригинал ↗', exact: true })).toHaveAttribute('href', (await link.getAttribute('href'))!);
  await page.keyboard.press('+');
  await expect(page.locator('.case-viewer-zoom output')).toHaveText('125%');
  await page.keyboard.press('Escape');
  await expect(link).toBeFocused();
});
