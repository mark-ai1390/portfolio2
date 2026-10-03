import { expect, test } from '@playwright/test';

for (const width of [1440, 375]) {
  test(`новое вступление при ${width}px: плашка бренда, раскрытие задачи и адаптация`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/projects/copterdrone');
    const title = page.getByRole('heading', { level: 1 });
    await expect(title).toHaveAccessibleName('Редизайн интернет-магазина CopterDrone');
    await title.scrollIntoViewIfNeeded();
    await expect(title).toBeInViewport();
    await expect.poll(() => page.locator('.case-company').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(255, 255, 255)');
    expect(await page.locator('.case-company').evaluate(element => getComputedStyle(element).color)).toBe('rgb(18, 18, 19)');
    const task = page.getByRole('region', { name: 'Задача', exact: true });
    await task.scrollIntoViewIfNeeded();
    await expect.poll(() => task.locator('.text-block-line').evaluateAll(lines => lines.length > 0 && lines.every(line => getComputedStyle(line).opacity === '1'))).toBe(true);
    await expect(task.locator('p').first()).toHaveAttribute('aria-label', /Помочь пользователю/);
    await page.setViewportSize({ width: 375, height: 900 });
    await expect.poll(() => task.locator('.text-block-line').evaluateAll(lines => lines.every(line => getComputedStyle(line).opacity === '1'))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('.case-research-intro').evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY - innerHeight * .5));
    await expect.poll(() => page.locator('.case-research-intro .text-block-line').evaluateAll(lines => lines.length > 0 && lines.every(line => getComputedStyle(line).opacity === '1'))).toBe(true);
  });
}

for (const width of [1440, 375]) {
  test(`блюр исследования при ${width}px раскрывается при подходе к блоку`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/projects/copterdrone');
    const root = page.locator('.research');
    const stage = page.locator('.research-stage');
    const scrollStageTo = async (top: number) => root.evaluate((element, offset) => scrollTo(0, element.getBoundingClientRect().top + scrollY - offset), top);
    await scrollStageTo(740);
    await expect.poll(() => stage.evaluate(element => getComputedStyle(element).opacity)).toBe('0');
    await scrollStageTo(560);
    await expect.poll(() => stage.evaluate(element => Number(getComputedStyle(element).opacity))).toBeGreaterThan(.3);
    expect(await stage.evaluate(element => Number(getComputedStyle(element).opacity))).toBeLessThan(.8);
    await scrollStageTo(380);
    await expect.poll(() => stage.evaluate(element => getComputedStyle(element).filter)).toBe('blur(0px)');
    await scrollStageTo(740);
    await page.locator('.research-image').first().focus();
    await expect.poll(() => stage.evaluate(element => getComputedStyle(element).opacity)).toBe('1');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await stage.evaluate(element => getComputedStyle(element).filter)).toBe('none');
  });
}

test('reduced motion показывает весь текст без масок и сохраняет плашку бренда', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/projects/copterdrone');
  await expect(page.locator('.block-revealer')).toHaveCount(0);
  await expect(page.locator('.text-block-line')).toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.case-task p')).toHaveText([
    'Помочь пользователю ориентироваться в большом ассортименте и пройти путь от поиска товара до оформления заказа.',
    'Сохранить узнаваемость магазина, усилить визуальную иерархию и сделать ключевые сценарии понятными на desktop и мобильных устройствах.',
  ]);
  expect(await page.locator('.case-company').evaluate(element => getComputedStyle(element).backgroundColor)).toBe('rgb(255, 255, 255)');
});

test('CopterDrone открывается с главной, обновляется и возвращает к карточке', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'CopterDrone', exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/copterdrone$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('Редизайн интернет-магазина CopterDrone');
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
    await expect(page.locator('.case-scroll-cue')).toHaveCount(0);
    const concepts = page.getByRole('region', { name: 'Готовые концепты CopterDrone', exact: true });
    await concepts.scrollIntoViewIfNeeded();
    await expect.poll(() => concepts.locator('img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth === 2048 && img.naturalHeight === 755)).toBe(true);
    const geometry = await concepts.locator('img').evaluate(element => {
      const rect = element.getBoundingClientRect();
      const hero = document.querySelector('.case-hero')!;
      const task = document.querySelector('.case-task')!;
      return { width: rect.width, height: rect.height, mainWidth: document.querySelector('.case-main')!.getBoundingClientRect().width,
        afterHero: Boolean(hero.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING),
        beforeTask: Boolean(element.compareDocumentPosition(task) & Node.DOCUMENT_POSITION_FOLLOWING) };
    });
    expect(geometry.width).toBeCloseTo(geometry.mainWidth, 1);
    expect(geometry.width / geometry.height).toBeCloseTo(1160 / 428, 2);
    expect(geometry.afterHero && geometry.beforeTask).toBe(true);
    await page.getByRole('link', { name: 'Макеты проекта в Figma ↗' }).scrollIntoViewIfNeeded();
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

for (const width of [1440, 375]) {
  test(`обновлённые выводы и равномерная рамка интервью при ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/projects/copterdrone');
    await expect(page.locator('.research-step h3')).toHaveText(['UX-интервью', 'Навигация и поиск', 'Визуальная иерархия', 'Поддержка и оформление']);
    await expect(page.locator('.research-image')).toHaveCount(1);
    const image = page.locator('.research-image');
    await image.focus();
    await expect.poll(() => image.locator('img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    const gaps = await image.evaluate(element => {
      const outer = element.getBoundingClientRect();
      const inner = element.querySelector('img')!.getBoundingClientRect();
      return [inner.left - outer.left, outer.right - inner.right, inner.top - outer.top, outer.bottom - inner.bottom];
    });
    for (const gap of gaps) expect(gap).toBeCloseTo(12, 1);
  });
}
