import { expect, test } from '@playwright/test';

const cases = [
  { id: 'primekraft', card: 'PrimeKraft', company: 'Prime Kraft', title: 'Редизайн интернет-магазина Prime Kraft', task: /Объединить узнаваемость Prime Kraft/ },
  { id: '4sales', card: '4SALES CRM', company: '4sales', title: 'CRM для ежедневной работы с продажами 4sales', task: /Сохранить возможности 4sales/ },
];

for (const item of cases) {
  for (const width of [1440, 1280, 1024, 768, 390, 375]) {
    test(`${item.company} при ${width}px: оригинальные концепты и общий формат вступления`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`/projects/${item.id}`);
      await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(item.title);
      const concepts = page.getByRole('region', { name: `Готовые концепты ${item.company}`, exact: true });
      await concepts.scrollIntoViewIfNeeded();
      await expect.poll(() => concepts.locator('img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth === 2048 && img.naturalHeight === 755)).toBe(true);
      const geometry = await concepts.locator('img').boundingBox();
      const main = await page.locator('.case-main').boundingBox();
      expect(geometry!.width).toBeCloseTo(main!.width, 1);
      expect(geometry!.width / geometry!.height).toBeCloseTo(1160 / 428, 2);
      if (width === 1440) expect(geometry!.height).toBe(428);
      expect(await page.locator('main > section').evaluateAll(elements => elements.map(element => element.className))).toEqual(['case-hero', 'case-concepts', 'case-task']);
      await page.locator('.case-task').evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY - innerHeight * .3));
      await expect.poll(() => page.locator('.case-task .text-block-line').evaluateAll(lines => lines.length > 0 && lines.every(line => getComputedStyle(line).opacity === '1'))).toBe(true);
      await expect(page.locator('.case-task p').first()).toHaveAttribute('aria-label', item.task);
      await expect(page.locator('.case-scroll-cue')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(errors).toEqual([]);
    });
  }

  test(`${item.company}: переход с главной, reload и возврат к карточке`, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: item.card, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/projects/${item.id}$`));
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(item.title);
    await page.getByRole('link', { name: '← На главную' }).click();
    await expect(page.getByRole('heading', { name: item.card, exact: true })).toBeInViewport();
  });

  test(`${item.company}: reduced motion, короткое окно и доступный focus`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 600 });
    await page.goto(`/projects/${item.id}/`);
    await expect(page.locator('.block-revealer')).toHaveCount(0);
    await expect(page.locator('.text-block-line')).toHaveCount(0);
    await expect(page.locator('.case-task p')).toHaveCount(2);
    const link = page.getByRole('link', { name: `Открыть готовые концепты ${item.company} в полном размере` });
    await link.focus();
    await expect(link).toBeInViewport();
    expect(await link.evaluate(element => getComputedStyle(element).outlineStyle)).toBe('solid');
    await expect(link).toHaveAttribute('href', `/assets/${item.id}-concepts.png`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
