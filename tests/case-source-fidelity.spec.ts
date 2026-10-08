import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const reviewedNodes = ['342-125905', '342-126465', '342-126639', '342-126661'];

test('PRIMEKRAFT: отмеченные композиции совпадают с рендерами Figma', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/projects/primekraft');
  for (const node of reviewedNodes) {
    const img = page.locator(`[data-figma-node="${node.replace('-', ':')}"] img`);
    await img.scrollIntoViewIfNeeded();
    await img.evaluate((e: HTMLImageElement) => e.decode());
    const reference = readFileSync(new URL(`./fixtures/figma/${node}.png`, import.meta.url)).toString('base64');
    const difference = await img.evaluate(async (e: HTMLImageElement, reference) => {
      const expected = new Image();
      expected.src = `data:image/png;base64,${reference}`;
      await expected.decode();
      const canvas = document.createElement('canvas');
      canvas.width = expected.naturalWidth;
      canvas.height = expected.naturalHeight;
      const context = canvas.getContext('2d', { willReadFrequently: true })!;
      context.drawImage(expected, 0, 0);
      const baseline = context.getImageData(0, 0, canvas.width, canvas.height).data;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(e, 0, 0, canvas.width, canvas.height);
      const actual = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let total = 0;
      for (let i = 0; i < actual.length; i += 4) {
        total += Math.abs(actual[i] - baseline[i]) + Math.abs(actual[i + 1] - baseline[i + 1]) + Math.abs(actual[i + 2] - baseline[i + 2]);
      }
      return total / (canvas.width * canvas.height * 3);
    }, reference);
    // Allows raster resampling and WebP quantization, while rejecting the
    // former reflowed layouts (errors 6.6–101.4), including a dark white panel.
    expect(difference, node).toBeLessThan(5);
  }
});

test('Кейсы: панели и заголовки после анимаций повторяют типографику Figma', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const [project, chapter] of [['copterdrone', '296:239745'], ['primekraft', '342:125831'], ['4sales', '306:102887']]) {
    await page.goto(`/projects/${project}`);
    const block = page.locator(`[data-figma-node="${chapter}"]`);
    await expect(block).toHaveCSS('padding', '40px');
    await expect(block).toHaveCSS('gap', '20px');
    await expect(block).toHaveCSS('background-color', 'rgba(30, 32, 37, 0.4)');
    await expect(block.locator('h2')).toHaveCSS('font-size', '48px');
    await expect(block.locator('h2')).toHaveCSS('font-weight', '700');
    const regular = page.locator('.case-content-text:not(.case-content-panel) h2').first();
    await expect(regular).toHaveCSS('font-size', '28px');
  }
});
