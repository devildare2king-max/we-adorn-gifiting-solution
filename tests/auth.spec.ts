import { test, expect } from '@playwright/test';

test.describe('Authentication & RBAC', () => {
  test('should login as Employee and see dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@adorn.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1:has-text("Welcome back, Jane Smith")').first()).toBeVisible();
  });

  test('should login as Corp Admin and see org overview', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'corp-admin@adorn.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard/corp');
    await expect(page.locator('h1:has-text("Welcome back, John Doe")').first()).toBeVisible();
  });

  test('should login as Super Admin and see admin panel', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@weadorn.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/admin');
    await expect(page.locator('h1:has-text("Super Admin Panel")').first()).toBeVisible();
  });

  test('should redirect Corp User away from Admin page', async ({ page }) => {
    // Login as user first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@adorn.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Try to access admin
    await page.goto('/admin');
    // It should redirect or show access denied depending on middleware
    // Our middleware redirects to dashboard if already logged in but wrong role
    await expect(page).toHaveURL('/dashboard');
  });
});
