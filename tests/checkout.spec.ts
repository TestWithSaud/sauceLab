import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';
import { CHECKOUT_INFO } from '../test-data/testData';

test.describe('E2E Checkout Flow', () => {
    let pm: PageManager;

    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page);
        await pm.inventoryPage.open();
    });

    test('should successfully complete checkout with 3 random items', { tag: ['@smoke', '@checkout'] }, async ({ page }) => {
        const selectedProducts = await pm.inventoryPage.addRandomProductsToCart(3);
        const selectedProductNames = selectedProducts.map(p => p.name);

        expect(await pm.inventoryPage.getCartCount()).toBe(3);
        await expect(pm.inventoryPage.shoppingCartBadge).toBeVisible();

        await pm.inventoryPage.goToCart();
        await expect(page).toHaveURL(/cart\.html/);
        await expect(pm.cartPage.pageTitle).toHaveText('Your Cart');
        expect(await pm.cartPage.getCartItemCount()).toBe(3);
        expect(await pm.cartPage.areItemsInCart(selectedProductNames)).toBeTruthy();

        await pm.cartPage.proceedToCheckout();
        await pm.checkoutStepOnePage.waitForPageLoad();
        await expect(page).toHaveURL(/checkout-step-one\.html/);
        await expect(pm.checkoutStepOnePage.pageTitle).toHaveText('Checkout: Your Information');

        await pm.checkoutStepOnePage.fillCheckoutInformation(CHECKOUT_INFO.VALID);
        await pm.checkoutStepOnePage.clickContinue();

        await expect(page).toHaveURL(/checkout-step-two\.html/);
        await expect(pm.checkoutStepTwoPage.pageTitle).toHaveText('Checkout: Overview');
        expect(await pm.checkoutStepTwoPage.getItemCount()).toBe(3);
        expect(await pm.checkoutStepTwoPage.areItemsInOrder(selectedProductNames)).toBeTruthy();
        await expect(pm.checkoutStepTwoPage.paymentInformation).not.toBeEmpty();
        await expect(pm.checkoutStepTwoPage.shippingInformation).not.toBeEmpty();

        const priceSummary = await pm.checkoutStepTwoPage.getPriceSummary();
        expect(priceSummary.subtotal).toBeGreaterThan(0);
        expect(priceSummary.tax).toBeGreaterThan(0);
        expect(priceSummary.total).toBeGreaterThan(0);
        expect(await pm.checkoutStepTwoPage.isPriceCalculationCorrect()).toBeTruthy();

        await pm.checkoutStepTwoPage.clickFinish();

        await expect(page).toHaveURL(/checkout-complete\.html/);
        await expect(pm.checkoutCompletePage.pageTitle).toHaveText('Checkout: Complete!');
        await expect(pm.checkoutCompletePage.completeHeader).toContainText('Thank you for your order');
        await expect(pm.checkoutCompletePage.ponyExpressImage).toBeVisible();
        await expect(pm.checkoutCompletePage.completeText).toBeVisible();
    });

    test('should maintain cart items consistency through checkout flow', { tag: ['@checkout', '@regression'] }, async ({ page }) => {
        const selectedProducts = await pm.inventoryPage.addRandomProductsToCart(3);
        const selectedProductNames = selectedProducts.map(p => p.name);

        await pm.inventoryPage.goToCart();
        const cartItems = await pm.cartPage.getAllItemNames();
        expect(cartItems).toEqual(expect.arrayContaining(selectedProductNames));

        await pm.cartPage.proceedToCheckout();
        await pm.checkoutStepOnePage.waitForPageLoad();
        await pm.checkoutStepOnePage.completeCheckoutStepOne(CHECKOUT_INFO.VALID);

        const orderItems = await pm.checkoutStepTwoPage.getAllItemNames();
        expect(orderItems).toEqual(expect.arrayContaining(selectedProductNames));
        expect(await pm.checkoutStepTwoPage.getItemCount()).toBe(3);
    });

    test('should calculate prices correctly in checkout overview', { tag: ['@checkout', '@regression'] }, async ({ page }) => {
        const selectedProducts = await pm.inventoryPage.addRandomProductsToCart(3);

        const expectedSubtotal = selectedProducts.reduce((sum, p) => {
            return sum + parseFloat(p.price.replace('$', ''));
        }, 0);

        await pm.inventoryPage.goToCart();
        await pm.cartPage.proceedToCheckout();
        await pm.checkoutStepOnePage.waitForPageLoad();
        await pm.checkoutStepOnePage.completeCheckoutStepOne(CHECKOUT_INFO.VALID);

        const priceSummary = await pm.checkoutStepTwoPage.getPriceSummary();
        expect(priceSummary.subtotal).toBeCloseTo(expectedSubtotal, 2);
        expect(priceSummary.subtotal).toBeGreaterThan(0);
        expect(priceSummary.tax).toBeGreaterThan(0);
        expect(priceSummary.total).toBeGreaterThan(0);
        expect(priceSummary.subtotal + priceSummary.tax).toBeCloseTo(priceSummary.total, 2);
        expect(await pm.checkoutStepTwoPage.isPriceCalculationCorrect()).toBeTruthy();
    });

    test('should show error when first name is missing', { tag: ['@checkout', '@regression'] }, async ({ page }) => {
        await pm.inventoryPage.addProductToCartByIndex(0);
        await pm.inventoryPage.goToCart();
        await pm.cartPage.proceedToCheckout();
        await pm.checkoutStepOnePage.waitForPageLoad();

        await pm.checkoutStepOnePage.fillCheckoutInformation({ firstName: '', lastName: 'Doe', postalCode: '12345' });
        await pm.checkoutStepOnePage.clickContinue();

        await expect(pm.checkoutStepOnePage.errorMessageContainer).toBeVisible();
        await expect(pm.checkoutStepOnePage.errorMessageContainer).toContainText('First Name is required');
        await expect(page).toHaveURL(/checkout-step-one\.html/);
    });

    test('should show error when last name is missing', { tag: ['@checkout', '@regression'] }, async ({ page }) => {
        await pm.inventoryPage.addProductToCartByIndex(0);
        await pm.inventoryPage.goToCart();
        await pm.cartPage.proceedToCheckout();
        await pm.checkoutStepOnePage.waitForPageLoad();

        await pm.checkoutStepOnePage.fillCheckoutInformation({ firstName: 'John', lastName: '', postalCode: '12345' });
        await pm.checkoutStepOnePage.clickContinue();

        await expect(pm.checkoutStepOnePage.errorMessageContainer).toBeVisible();
        await expect(pm.checkoutStepOnePage.errorMessageContainer).toContainText('Last Name is required');
        await expect(page).toHaveURL(/checkout-step-one\.html/);
    });

    test('should show error when postal code is missing', { tag: ['@checkout', '@regression'] }, async ({ page }) => {
        await pm.inventoryPage.addProductToCartByIndex(0);
        await pm.inventoryPage.goToCart();
        await pm.cartPage.proceedToCheckout();
        await pm.checkoutStepOnePage.waitForPageLoad();

        await pm.checkoutStepOnePage.fillCheckoutInformation({ firstName: 'John', lastName: 'Doe', postalCode: '' });
        await pm.checkoutStepOnePage.clickContinue();

        await expect(pm.checkoutStepOnePage.errorMessageContainer).toBeVisible();
        await expect(pm.checkoutStepOnePage.errorMessageContainer).toContainText('Postal Code is required');
        await expect(page).toHaveURL(/checkout-step-one\.html/);
    });

    test('should complete checkout successfully', { tag: ['@checkout', '@regression'] }, async ({ page }) => {
        await pm.inventoryPage.addRandomProductsToCart(3);
        await pm.inventoryPage.goToCart();
        await pm.cartPage.proceedToCheckout();
        await pm.checkoutStepOnePage.waitForPageLoad();
        await pm.checkoutStepOnePage.completeCheckoutStepOne(CHECKOUT_INFO.VALID);
        await pm.checkoutStepTwoPage.clickFinish();

        await expect(page).toHaveURL(/checkout-complete\.html/);
        await expect(pm.checkoutCompletePage.completeHeader).toBeVisible();
    });
});
