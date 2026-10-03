import { expect, test } from '@playwright/test';

test('оригинальные обложки и портрет загружаются; hover не меняет геометрию', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('img', { name: 'Марк Сангинов', exact: true })).toBeVisible();
  for (const card of await page.getByRole('article').all()) {
    await card.scrollIntoViewIfNeeded();
    const media = card.locator('.project-media');
    const before = await media.boundingBox();
    for (const img of await card.locator('img').all()) {
      expect(await img.evaluate(async element => {
        const image = element as HTMLImageElement;
        await image.decode();
        return image.naturalWidth > 0;
      })).toBe(true);
    }
    await card.hover();
    await expect(card.locator('.project-cover--hover')).toHaveCSS('opacity', '1');
    expect(await media.boundingBox()).toEqual(before);
    await page.mouse.move(0, 0);
    await expect(card.locator('.project-cover--hover')).toHaveCSS('opacity', '0');
  }
});

test('reduced motion отключает переход изображений', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const hoverImage = page.locator('.project-cover--hover').first();
  await page.getByRole('article').first().hover();
  await expect(hoverImage).toHaveCSS('transition-duration', '0s');
  await expect(hoverImage).toHaveCSS('opacity', '1');
});

test('сенсорный экран показывает normal и открывает кейс первым касанием', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/');
    await expect(page.locator('.project-cover--hover').first()).toHaveCSS('opacity', '0');
    await page.getByRole('article').first().tap();
    await expect(page).toHaveURL(/\/projects\/primekraft$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Редизайн интернет-магазина PRIMEKRAFT');
  } finally { await context.close(); }
});
