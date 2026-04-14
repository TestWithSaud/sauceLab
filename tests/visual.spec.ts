import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';
import { CHECKOUT_INFO } from '../test-data/testData';

test.describe('Visual Regression', () => {

    test('inventory page', async ({ page }) => {
        const pm = new PageManager(page);
        await pm.inventoryPage.open();
        await expect(page).toHaveScreenshot('inventory.png', { fullPage: true });
    });

    test('cart page with items', async ({ page }) => {
        const pm = new PageManager(page);
        await pm.inventoryPage.open();
        await pm.inventoryPage.addProductToCartByIndex(0);
        await pm.inventoryPage.addProductToCartByIndex(1);
        await pm.inventoryPage.goToCart();
        await expect(page).toHaveScreenshot('cart.png', { fullPage: true });
    });

    test('checkout step one page', async ({ page }) => {
        const pm = new PageManager(page);
        await pm.inventoryPage.open();
        await pm.inventoryPage.addProductToCartByIndex(0);
        await pm.inventoryPage.goToCart();
        await pm.cartPage.proceedToCheckout();
        await pm.checkoutStepOnePage.waitForPageLoad();
        await expect(page).toHaveScreenshot('checkout-step-one.png', { fullPage: true });
    });

    test('checkout step two page', async ({ page }) => {
        const pm = new PageManager(page);
        await pm.inventoryPage.open();
        await pm.inventoryPage.addProductToCartByIndex(0);
        await pm.inventoryPage.goToCart();
        await pm.cartPage.proceedToCheckout();
        await pm.checkoutStepOnePage.waitForPageLoad();
        await pm.checkoutStepOnePage.completeCheckoutStepOne(CHECKOUT_INFO.VALID);
        await expect(page).toHaveScreenshot('checkout-step-two.png', { fullPage: true });
    });

    test('checkout complete page', async ({ page }) => {
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

});
