import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';

test.describe('Cart Edge Cases', () => {
    let pm: PageManager;

    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page);
        await pm.inventoryPage.open();
        await pm.inventoryPage.goToCart();
    });

    test('empty cart shows correct layout', { tag: ['@cart', '@regression'] }, async ({ page }) => {
        await expect(page).toHaveURL(/cart\.html/);
        await expect(pm.cartPage.pageTitle).toHaveText('Your Cart');
        expect(await pm.cartPage.getCartItemCount()).toBe(0);
        await expect(pm.cartPage.checkoutButton).toBeVisible();
        await expect(pm.cartPage.continueShoppingButton).toBeVisible();
    });

    test('checkout is accessible from empty cart', { tag: ['@cart', '@regression'] }, async ({ page }) => {
        await pm.cartPage.proceedToCheckout();

        await expect(page).toHaveURL(/checkout-step-one\.html/);
        await expect(pm.checkoutStepOnePage.pageTitle).toHaveText('Checkout: Your Information');
    });

    test('cart item name links to product detail page', { tag: ['@cart', '@regression'] }, async ({ page }) => {
        await pm.cartPage.continueShopping();
        const productName = await pm.inventoryPage.productNames.first().innerText();
        await pm.inventoryPage.addProductToCartByIndex(0);
        await pm.inventoryPage.goToCart();

        await pm.cartPage.cartItemNames.first().click();

        await expect(page).toHaveURL(/inventory-item\.html/);
        await expect(pm.productDetailPage.productName).toHaveText(productName);
    });
});
