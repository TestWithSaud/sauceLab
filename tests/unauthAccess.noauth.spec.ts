import { test, expect } from '@playwright/test';

const PROTECTED_PATHS = [
    '/inventory.html',
    '/cart.html',
    '/checkout-step-one.html',
    '/checkout-step-two.html',
    '/checkout-complete.html',
];

test.describe('Unauthenticated Access', () => {
    for (const path of PROTECTED_PATHS) {
        test(`${path} redirects to login when unauthenticated`, { tag: ['@login', '@regression'] }, async ({ page }) => {
            await page.goto(path);

            await expect(page).toHaveURL(/saucedemo\.com\/?$/);
            await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
        });
    }
});
