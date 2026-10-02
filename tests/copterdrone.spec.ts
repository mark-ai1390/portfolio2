import { expect, test } from '@playwright/test';

test('задача выделяет три ключевые фразы и сохраняет переносы на телефоне', async ({ page }) => {
  await page.goto('/projects/copterdrone');
  const task = page.getByRole('region', { name: 'Задача', exact: true });
  await task.scrollIntoViewIfNeeded();
  await expect(task.locator('p')).toHaveText('Упростить поиск и выбор радиоуправляемых моделей, сделать оформление заказа понятнее и обновить визуальный стиль магазина.');
  await expect(task.locator('.rough-annotation')).toHaveCount(3);
  await expect.poll(() => task.locator('.rough-annotation path').count()).toBeGreaterThanOrEqual(3);
  await page.setViewportSize({ width: 375, height: 900 });
  await task.scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(task.locator('.rough-annotation')).toHaveCount(3);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => task.locator('.rough-annotation path').evaluateAll(paths => paths.every(path => getComputedStyle(path).animationName === 'none'))).toBe(true);
});

for (const width of [1440, 375]) {
  test(`исследование плавно проявляется при прокрутке ${width}px; фокус и reduced motion сохраняют доступ`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/projects/copterdrone');
    const stage = page.locator('.research-stage');
    const scrollButtonsTo = async (top: number) => {
      await page.locator('.case-cover').evaluate((element, offset) => {
        const bounds = element.getBoundingClientRect();
        scrollTo(0, bounds.top + scrollY + bounds.height * (700 / 1227) - offset);
      }, top);
    };
    await scrollButtonsTo(20);
    await expect.poll(() => stage.evaluate(element => Number(getComputedStyle(element).opacity))).toBe(0);
    await scrollButtonsTo(-120);
    await expect.poll(() => stage.evaluate(element => Number(getComputedStyle(element).opacity))).toBeGreaterThan(.3);
    expect(await stage.evaluate(element => Number(getComputedStyle(element).opacity))).toBeLessThan(.8);
    await scrollButtonsTo(-250);
    await expect.poll(() => stage.evaluate(element => getComputedStyle(element).opacity)).toBe('1');
    await expect.poll(() => stage.evaluate(element => getComputedStyle(element).filter)).toBe('blur(0px)');
    await scrollButtonsTo(20);
    await page.locator('.research-image').first().focus();
    await expect.poll(() => stage.evaluate(element => getComputedStyle(element).opacity)).toBe('1');
    await page.locator('.research-image').first().evaluate(element => (element as HTMLElement).blur());
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await scrollButtonsTo(20);
    await expect.poll(() => stage.evaluate(element => getComputedStyle(element).opacity)).toBe('1');
    expect(await stage.evaluate(element => getComputedStyle(element).filter)).toBe('none');
    expect(await page.locator('.case-scroll-cue svg').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  });
}

test('CopterDrone открывается с главной, обновляется и возвращает к карточке', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'CopterDrone', exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/copterdrone$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Редизайн интернет-магазина CopterDrone');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'UX-исследование', exact: true })).toBeVisible();
  await page.getByRole('link', { name: '← На главную' }).click();
  await expect(page.getByRole('heading', { name: 'CopterDrone', exact: true })).toBeInViewport();
});

for (const width of [1440, 1280, 1024, 768, 390, 375]) {
  test(`кейс при ${width}px: четыре шага доступны, изображения загружаются`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/projects/copterdrone');
    await page.getByRole('link', { name: 'Полный кейс в Figma ↗' }).scrollIntoViewIfNeeded();
    await expect(page.locator('.research-step')).toHaveCount(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const link of await page.locator('.research-image').all()) {
      await link.focus();
      await expect(link).toBeInViewport();
      await expect.poll(() => link.locator('img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}

test('прокрутка последовательно двигает линию; уменьшенная анимация снимает закрепление', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/projects/copterdrone');
  const section = page.locator('.research');
  await expect(section).toHaveClass(/research--pinned/);
  await section.evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY - 80));
  await expect.poll(() => page.locator('.research-step.is-active').count()).toBe(1);
  await section.evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY - 80 + 1500));
  await expect.poll(() => page.locator('.research-step.is-active').count()).toBe(4);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(section).not.toHaveClass(/research--pinned/);
  await expect.poll(() => page.locator('.research-step.is-active').count()).toBe(4);
  expect(await page.locator('.research-track').evaluate(element => getComputedStyle(element).transform)).toBe('none');
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(section).not.toHaveClass(/research--pinned/);
});
