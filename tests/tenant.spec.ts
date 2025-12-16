import { test, expect } from '@playwright/test';

test('App loads home page', async ({ page }) => {
  await page.goto('https://sober-stay--y2sqw27xjv.replit.app');
  await expect(page).toHaveTitle(/Sober/i);
});