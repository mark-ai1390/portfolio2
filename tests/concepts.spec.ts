import { expect, test } from '@playwright/test';

test('дополнительные проекты соответствуют структуре Figma и открывают модалку', async ({ page }) => {
  await page.goto('/');
  const section = page.getByRole('region', { name: 'Концепты и другие проекты' });
  await expect(section).toBeVisible();
  await expect(section.locator('.concept-card')).toHaveCount(5);

  const names = ['MPGO', 'EVAR', 'TENNISI.TJ', 'AYON', 'Лендинг'];
  for (const name of names) {
    await expect(section.getByRole('button', { name: new RegExp(name) })).toBeVisible();
  }
  const mpgo = section.getByRole('button', { name: /MPGO/ });
  await mpgo.click();
  const dialog = page.getByRole('dialog', { name: 'Извините, страница в разработке' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('ПРОЕКТ / MPGO')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(mpgo).toBeFocused();

  await section.getByRole('button', { name: /TENNISI.TJ/ }).click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Понятно' }).click();
  await expect(dialog).not.toBeVisible();

  const images = section.locator('.concept-card__image');
  expect(await images.count()).toBe(5);
  for (let i = 0; i < 5; i++) {
    await images.nth(i).scrollIntoViewIfNeeded();
    await expect.poll(() => images.nth(i).evaluate(img => img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0)).toBe(true);
  }
});

test('галерея концептов адаптируется к 375px без горизонтальной прокрутки', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const section = page.getByRole('region', { name: 'Концепты и другие проекты' });
  await expect(section).toBeVisible();
  await expect(section.locator('.concept-card')).toHaveCount(5);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
