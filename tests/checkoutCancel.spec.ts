import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';
import { CHECKOUT_INFO } from '../test-data/testData';

test.describe('Checkout Cancel Flows', () => {
    let pm: PageManager;

    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page);
        await pm.inventoryPage.open();
        await pm.inventoryPage.addProductToCartByIndex(0);
        await pm.inventoryPage.goToCart();
    });

    test('cancel on step one returns to cart with items', { tag: ['@checkout', '@regression'] }, async ({ page }) => {
        await pm.cartPage.proceedToCheckout();
        await pm.checkoutStepOnePage.waitForPageLoad();

        await pm.checkoutStepOnePage.clickCancel();

        await expect(page).toHaveURL(/cart\.html/);
        await expect(pm.cartPage.pageTitle).toHaveText('Your Cart');
        expect(await pm.cartPage.getCartItemCount()).toBe(1);
    });

    test('cancel on step two returns to inventory', { tag: ['@checkout', '@regression'] }, async ({ page }) => {
        await pm.cartPage.proceedToCheckout();
        await pm.checkoutStepOnePage.waitForPageLoad();
        await pm.checkoutStepOnePage.completeCheckoutStepOne(CHECKOUT_INFO.VALID);
        await expect(page).toHaveURL(/checkout-step-two\.html/);

        await pm.checkoutStepTwoPage.clickCancel();

        await expect(page).toHaveURL(/inventory\.html/);
        await expect(pm.inventoryPage.pageTitle).toHaveText('Products');
    });

    test('validation error on step one can be dismissed', { tag: ['@checkout', '@regression'] }, async ({ page }) => {
        await pm.cartPage.proceedToCheckout();
        await pm.checkoutStepOnePage.waitForPageLoad();
        await pm.checkoutStepOnePage.clickContinue();

        await expect(pm.checkoutStepOnePage.errorMessageContainer).toBeVisible();

        await page.locator('[data-test="error-button"]').click();

        await expect(pm.checkoutStepOnePage.errorMessageContainer).not.toBeVisible();
        await expect(page).toHaveURL(/checkout-step-one\.html/);
    });
});
