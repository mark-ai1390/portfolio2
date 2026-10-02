import { expect, test } from '@playwright/test';

test('главная запускается без ошибок JavaScript и загружает локальный Rubik', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const failedRequests: string[] = [];
  page.on('requestfailed', request => failedRequests.push(request.url()));
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'Product Design' })).toBeVisible();
  await expect(page.getByText('Марк Сангинов', { exact: true })).toBeVisible();
  expect(await page.evaluate(async () => {
    await document.fonts.load('400 16px Rubik', 'Марк');
    return document.fonts.check('400 16px Rubik', 'Марк');
  })).toBe(true);
  expect(errors).toEqual([]);
  expect(failedRequests).toEqual([]);
});
