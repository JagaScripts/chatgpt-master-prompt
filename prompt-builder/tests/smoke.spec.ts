import { test, expect } from '@playwright/test';

test.describe('Prompt Builder smoke', () => {
  test('loads app and shows toolbar', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: /copy/i })).toBeVisible();
  });

  test('can type in a section and see preview update', async ({ page }) => {
    await page.goto('/');
    const textarea = page.locator('textarea').first();
    await textarea.fill('My goal is to write a clear prompt.');
    await expect(page.locator('pre')).toContainText('My goal is to write a clear prompt.');
  });
});


