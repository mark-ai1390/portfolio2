import { expect, test } from '@playwright/test';

test('Наверх остаётся за правой границей текста на широких и узких экранах', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/projects/copterdrone');
  for (const width of [1920, 1440, 1280, 1024, 768, 390, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await page.locator('.case-followup').first().scrollIntoViewIfNeeded();
    const button = page.getByRole('button', { name: 'Наверх, к началу кейса' });
    await expect(button).toBeVisible();
    const content = await page.locator('.case-main').boundingBox();
    const visibleControl = await (width >= 1280 ? button : button.locator('svg')).boundingBox();
    expect(visibleControl!.x).toBeGreaterThanOrEqual(content!.x + content!.width - .5);
    expect(visibleControl!.x + visibleControl!.width).toBeLessThanOrEqual(width);
  }
});

for (const id of ['primekraft', 'copterdrone', '4sales']) {
  for (const width of [1440, 375]) {
    test(`${id} ${width}px: концепты загружаются в WebP, оригинал остаётся по клику`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: width < 768 ? 2 : 1, reducedMotion: 'reduce' });
      const page = await context.newPage();
      const requested: string[] = [];
      page.on('request', request => { if (request.resourceType() === 'image') requested.push(request.url()); });
      await page.goto(`http://127.0.0.1:4173/projects/${id}`);
      const image = page.locator('.case-concepts img:visible');
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
      const selected = await image.evaluate((img: HTMLImageElement) => img.currentSrc);
      expect(selected).toMatch(width < 768 ? /\/assets\/mobile\/.+-750\.webp$/ : /\/assets\/responsive\/.+-1160\.webp$/);
      const original = await page.locator('.case-concepts a:visible').getAttribute('href');
      expect(original).toMatch(width < 768 ? /-mobile-concepts-v1\.webp$/ : /-concepts\.png$/);
      expect(requested.some(url => url.endsWith(original!))).toBe(false);
      const optimizedResponse = await context.request.get(selected);
      const originalResponse = await context.request.get(`http://127.0.0.1:4173${original}`);
      expect(optimizedResponse.ok()).toBe(true);
      expect(originalResponse.ok()).toBe(true);
      expect((await optimizedResponse.body()).byteLength).toBeLessThan((await originalResponse.body()).byteLength * (width < 768 ? .75 : .3));
      await context.close();
    });
  }
}
