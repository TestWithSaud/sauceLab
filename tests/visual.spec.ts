import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';
import { CHECKOUT_INFO } from '../test-data/testData';

test.describe('Visual Regression', () => {

    test('inventory page', { tag: ['@visual'] }, async ({ page }) => {
        const pm = new PageManager(page);
        await pm.inventoryPage.open();
        await expect(page).toHaveScreenshot('inventory.png', { fullPage: true });
    });

    test('cart page with items', { tag: ['@visual'] }, async ({ page }) => {
        const pm = new PageManager(page);
        await pm.inventoryPage.open();
        await pm.inventoryPage.addProductToCartByIndex(0);
        await pm.inventoryPage.addProductToCartByIndex(1);
        await pm.inventoryPage.goToCart();
        await expect(page).toHaveScreenshot('cart.png', { fullPage: true });
    });

    test('checkout step one page', { tag: ['@visual'] }, async ({ page }) => {
        const pm = new PageManager(page);
        await pm.inventoryPage.open();
        await pm.inventoryPage.addProductToCartByIndex(0);
        await pm.inventoryPage.goToCart();
        await pm.cartPage.proceedToCheckout();
        await pm.checkoutStepOnePage.waitForPageLoad();
        await expect(page).toHaveScreenshot('checkout-step-one.png', { fullPage: true });
    });

    test('checkout step two page', { tag: ['@visual'] }, async ({ page }) => {
        const pm = new PageManager(page);
        await pm.inventoryPage.open();
        await pm.inventoryPage.addProductToCartByIndex(0);
        await pm.inventoryPage.goToCart();
        await pm.cartPage.proceedToCheckout();
        await pm.checkoutStepOnePage.waitForPageLoad();
        await pm.checkoutStepOnePage.completeCheckoutStepOne(CHECKOUT_INFO.VALID);
        await expect(page).toHaveScreenshot('checkout-step-two.png', { fullPage: true });
    });

    test('checkout complete page', { tag: ['@visual'] }, async ({ page }) => {
        const pm = new PageManager(page);
        await pm.inventoryPage.open();
        await pm.inventoryPage.addProductToCartByIndex(0);
        await pm.inventoryPage.goToCart();
        await pm.cartPage.proceedToCheckout();
        await pm.checkoutStepOnePage.waitForPageLoad();
        await pm.checkoutStepOnePage.completeCheckoutStepOne(CHECKOUT_INFO.VALID);
        await pm.checkoutStepTwoPage.clickFinish();
        await expect(page).toHaveScreenshot('checkout-complete.png', { fullPage: true });
    });

    test('product detail page', { tag: ['@visual'] }, async ({ page }) => {
        const pm = new PageManager(page);
        await pm.inventoryPage.open();
        await pm.inventoryPage.productNames.first().click();
        await expect(page).toHaveScreenshot('product-detail.png', { fullPage: true });
    });

    test('empty cart page', { tag: ['@visual'] }, async ({ page }) => {
        const pm = new PageManager(page);
        await pm.inventoryPage.open();
        await pm.inventoryPage.goToCart();
        await expect(page).toHaveScreenshot('empty-cart.png', { fullPage: true });
    });

});
