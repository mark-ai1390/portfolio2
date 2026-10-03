import { expect, test } from '@playwright/test';

const sections: Record<string, string[]> = {
  copterdrone: ['От поиска к оформлению заказа', 'Главная: ассортимент на первом плане', 'Каталог: быстрее к товарам', 'Карточка товара: всё для принятия решения', 'Корзина и оформление — два понятных этапа', 'Личный кабинет с нуля', 'Узнаваемая и технологичная айдентика', 'Что получилось', 'Контакты'],
  primekraft: ['От первого экрана к покупке', 'Шапка: понятные точки входа', 'Каталог и быстрый просмотр', 'Оформление заказа без лишних поисков', 'Фирменный стиль как система', 'Рафт — персонаж бренда', 'Персонализация и навигация', 'Контент в едином стиле', 'За пределами интерфейса', 'Что получилось', 'Контакты'],
  '4sales': ['Архитектура и вайрфреймы', 'Система вокруг заказа', 'Сначала структура, затем визуальный слой', 'Детальный вайрфрейм', 'Единая логика рабочих экранов', 'Дашборд: обзор работы с продажами', 'Заказы: управляемая рабочая очередь', 'Клиенты: контакты и история отношений', 'Коммуникации: отдельное пространство для переписки', 'Товары и склады: учёт в общей системе', 'Менеджеры: люди и показатели', 'Компоненты вместо разрозненных экранов', 'Общая система интерфейса', 'От макетов к браузерному прототипу', 'Посмотреть CRM в браузере', 'Что получилось', 'Контакты'],
};
for (const [id, titles] of Object.entries(sections)) {
  for (const width of [1440, 1280, 1024, 768, 390, 375]) {
    test(`${id} ${width}px: полный кейс, иллюстрации и контакты`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width, height: width === 1280 ? 600 : 900 });
      await page.goto(`/projects/${id}`);
      let previous = -1;
      for (const title of titles) {
        const heading = page.getByRole('heading', { name: title, exact: true });
        await expect(heading).toHaveCount(1);
        const y = await heading.evaluate(e => e.getBoundingClientRect().top + scrollY);
        expect(y).toBeGreaterThan(previous);
        previous = y;
      }
      for (const img of await page.locator('.case-illustration img').all()) {
        await img.scrollIntoViewIfNeeded();
        await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth === 2048 && e.naturalHeight > 0)).toBe(true);
        expect(await img.evaluate((e: HTMLImageElement) => Math.abs(e.width / e.height - e.naturalWidth / e.naturalHeight))).toBeLessThan(.02);
      }
      await page.locator('.case-contacts').scrollIntoViewIfNeeded();
      await expect(page.getByRole('heading', { name: 'Контакты', exact: true })).toBeInViewport();
      await expect(page.locator('.case-contact-links a').first()).toHaveAttribute('href', 'mailto:ligeon199815@gmail.com');
      await expect(page.locator('.case-contact-links a').last()).toHaveAttribute('href', 'https://t.me/Markro1998');
      await expect.poll(() => page.locator('.case-contact-icon img').evaluateAll(items => items.every(e => (e as HTMLImageElement).naturalWidth > 0))).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const figure = page.locator('.case-illustration a').last();
      await figure.focus();
      expect(await figure.evaluate(e => getComputedStyle(e).outlineStyle)).toBe('solid');
    });
  }
}
test('CRM: принцип отбора над текстовой таблицей и рабочие ссылки', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/projects/4sales');
  const benchmark = page.getByRole('table', { name: 'Бенчмаркинг — сравнение подходов retailCRM и 4sales', exact: true });
  await benchmark.scrollIntoViewIfNeeded();
  const bounds = await benchmark.boundingBox();
  const principle = await page.getByRole('heading', { name: 'Принцип отбора решений', exact: true }).evaluate(e => e.getBoundingClientRect().top);
  expect(principle).toBeLessThan(bounds!.y);
  await expect(benchmark.getByRole('row')).toHaveCount(6);
  await expect(page.locator('img[src="/assets/cases/306-102876.webp"]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Рассмотреть архитектуру в Figma ↗', exact: true })).toHaveAttribute('href', 'https://www.figma.com/design/ufCGdzahHmwbLQWYjeAzNp?node-id=2-22093');
  await expect(page.getByRole('link', { name: 'Открыть компоненты и макеты ↗', exact: true })).toHaveAttribute('href', 'https://www.figma.com/design/ufCGdzahHmwbLQWYjeAzNp?node-id=394-13480');
  await expect(page.locator('[data-figma-node="306:103320"] a')).toHaveAttribute('href', 'https://4sales-about.mark-sanginov.workers.dev/');
});
