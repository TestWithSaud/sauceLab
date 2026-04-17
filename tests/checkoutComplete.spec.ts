import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';
import { CHECKOUT_INFO } from '../test-data/testData';

test.describe('Checkout Complete Page', () => {
    test('Back Home button returns to inventory with empty cart', { tag: ['@checkout', '@regression'] }, async ({ page }) => {
        const pm = new PageManager(page);
        await pm.inventoryPage.open();
        await pm.inventoryPage.addProductToCartByIndex(0);
        await pm.inventoryPage.goToCart();
        await pm.cartPage.proceedToCheckout();
        await pm.checkoutStepOnePage.waitForPageLoad();
        await pm.checkoutStepOnePage.completeCheckoutStepOne(CHECKOUT_INFO.VALID);
        await pm.checkoutStepTwoPage.clickFinish();
        await expect(page).toHaveURL(/checkout-complete\.html/);

        await pm.checkoutCompletePage.backHomeButton.click();

        await expect(page).toHaveURL(/inventory\.html/);
        await expect(pm.inventoryPage.pageTitle).toHaveText('Products');
        await expect(pm.inventoryPage.shoppingCartBadge).not.toBeVisible();
    });
});
