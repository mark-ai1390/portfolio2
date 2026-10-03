import { expect, test } from '@playwright/test';

const links = {
  copterdrone: 'https://www.figma.com/design/7VNybOgr3XMlOhhE8K4hRe/Drone?node-id=3-2',
  primekraft: 'https://www.figma.com/design/GUFncQWHBUdFHVNdevA6D1/primekraft?node-id=2049-14576',
  '4sales': 'https://www.figma.com/design/ufCGdzahHmwbLQWYjeAzNp/CRMED?node-id=394-13480',
};

for (const [id, href] of Object.entries(links)) {
  for (const width of [1440, 375]) {
    test(`${id} ${width}px: ссылки на проект и возврат после исследования`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/projects/${id}`);
      await expect(page.getByRole('link', { name: 'Макеты Figma', exact: true })).toHaveAttribute('href', href);
      await expect(page.getByRole('link', { name: 'Макеты проекта в Figma ↗', exact: true })).toHaveAttribute('href', href);
      const button = page.getByRole('button', { name: 'Наверх, к началу кейса' });
      await expect(button).toHaveCount(0);
      await page.locator('.case-followup').first().scrollIntoViewIfNeeded();
      await expect(button).toBeVisible();
      const bounds = await button.boundingBox();
      expect(bounds!.x).toBeGreaterThan(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      await button.focus();
      await expect(button).toBeFocused();
      await page.keyboard.press('Enter');
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
      await expect(page.locator('.case-header')).toBeFocused();
      await expect(button).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
}

test('Наверх: hover-анимация, обычная плавная прокрутка и повторное появление', async ({ page }) => {
  await page.goto('/projects/copterdrone');
  const button = page.getByRole('button', { name: 'Наверх, к началу кейса' });
  await page.locator('.case-content').scrollIntoViewIfNeeded();
  await expect(button).toBeVisible();
  await button.hover();
  await expect.poll(() => button.locator('.interactive-hover-active').evaluate(e => getComputedStyle(e).opacity)).toBe('1');
  await button.click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect(button).toHaveCount(0);
  await page.locator('.case-content').scrollIntoViewIfNeeded();
  await expect(button).toBeVisible();
});
