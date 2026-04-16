import { test, expect } from '@playwright/test';

test.describe('Corporate User Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as user
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@adorn.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('should navigate catalog and add to cart', async ({ page }) => {
    await page.click('text=Gift Catalog');
    await page.waitForURL('/dashboard/catalog');

    // Click 'Add to Request' on the first item
    const addBtn = page.locator('button:has-text("Add to Request")').first();
    await addBtn.click();

    // Verify button changes to 'Added to Cart'
    await expect(page.locator('text=Added to Cart')).toBeVisible();

    // Go to cart
    await page.click('text=View Request Cart');
    await page.waitForURL('/dashboard/cart');

    // Verify item is in cart
    await expect(page.locator('h3:has-text("1. Selected Gift Cards")')).toBeVisible();
    await expect(page.locator('div[class*="itemInfo"]')).toBeVisible();
  });

  test('should handle bulk CSV upload', async ({ page }) => {
    await page.goto('/dashboard/cart');
    
    // Create a mock CSV buffer
    const csvContent = 'name,email,amount\nAlice,alice@example.com,1000\nBob,bob@example.com,2000';
    
    // Upload the file
    await page.setInputFiles('input[id="bulk-upload"]', {
      name: 'recipients.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from(csvContent)
    });

    // Verify preview appears
    await expect(page.locator('text=2 Recipients Loaded')).toBeVisible();
    const table = page.locator('table');
    await expect(table).toBeVisible();
    await expect(table.locator('td:has-text("Alice")').first()).toBeVisible();
  });

  test('should submit request successfully', async ({ page }) => {
    await page.goto('/dashboard/catalog');
    await page.locator('button:has-text("Add to Request")').first().click();
    await page.goto('/dashboard/cart');

    await page.fill('input[placeholder="e.g. Employee Appreciation Q1"]', 'Test Occasion');
    await page.fill('textarea[placeholder="Additional instructions..."]', 'Test Notes');
    
    await page.click('button:has-text("Submit for Approval")');

    // Should show success state
    await expect(page.locator('text=Request Submitted Successfully!')).toBeVisible();
  });
});
