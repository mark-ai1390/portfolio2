import { expect, test } from '@playwright/test';

test('проекты идут в заданном порядке; контакты ведут к автору', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(3);
  await expect(page.getByRole('heading', { level: 2 })).toHaveText(['Prime Kraft', 'CopterDrone', '4sales CRM']);
  await expect(page.getByRole('link', { name: 'Email' })).toHaveAttribute('href', 'mailto:ligeon199815@gmail.com');
  await expect(page.getByRole('link', { name: 'Telegram' })).toHaveAttribute('href', 'https://t.me/Markro1998');
  await expect(page.getByRole('link', { name: 'Telegram' })).toHaveAttribute('rel', 'noopener noreferrer');
});

for (const width of [1440, 1280, 1024, 768, 390, 375]) {
  test(`главная при ${width}px: нет горизонтальной прокрутки, доступны контакты и проекты`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Email' })).toBeInViewport();
    await expect(page.getByRole('link', { name: 'Telegram' })).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    for (const title of ['Prime Kraft', 'CopterDrone', '4sales CRM']) {
      await page.getByRole('heading', { name: title }).scrollIntoViewIfNeeded();
      await expect(page.getByRole('heading', { name: title })).toBeInViewport();
    }
    if (width === 1440) {
      const layout = await page.locator('.portfolio-layout').boundingBox();
      const author = await page.locator('.author-panel').boundingBox();
      const projects = await page.getByRole('main').boundingBox();
      expect(layout?.width).toBe(1440);
      expect(author?.width).toBe(360);
      expect(projects?.width).toBe(856);
      expect(projects!.x - (author!.x + author!.width)).toBe(64);
    }
  });
}

test('короткое окно не скрывает имя автора и контакты', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto('/');
  await expect(page.getByText('Марк Сангинов', { exact: true })).toBeInViewport();
  await expect(page.getByRole('link', { name: 'Email' })).toBeInViewport();
});

test('клавиатурный переход к проектам и фокус контактов работают', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'К проектам' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await page.goto('/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  const email = page.getByRole('link', { name: 'Email' });
  await expect(email).toBeFocused();
  expect(await email.evaluate(element => getComputedStyle(element).outlineStyle)).toBe('solid');
});

test('неизвестный адрес не подменяется главной; возврат работает', async ({ page }) => {
  await page.goto('/missing-page');
  await expect(page.getByRole('heading', { name: 'Страница не найдена' })).toBeVisible();
  await page.getByRole('link', { name: 'На главную' }).click();
  await expect(page.getByRole('heading', { name: 'Product Design' })).toBeVisible();
});
