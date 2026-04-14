import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';

test.describe('Cart Page', () => {
    let pm: PageManager;

    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page);
        await pm.inventoryPage.open();
    });

    test('should add item to cart and display it', { tag: ['@smoke', '@cart'] }, async ({ page }) => {
        const product = await pm.inventoryPage.getProductDetails(0);
        await pm.inventoryPage.addProductToCartByIndex(0);
        await pm.inventoryPage.goToCart();

        await expect(page).toHaveURL(/cart\.html/);
        await expect(pm.cartPage.pageTitle).toHaveText('Your Cart');
        expect(await pm.cartPage.getCartItemCount()).toBe(1);
        expect(await pm.cartPage.areItemsInCart([product.name])).toBeTruthy();
    });

    test('should remove item from cart', { tag: ['@cart', '@regression'] }, async ({ page }) => {
        await pm.inventoryPage.addProductToCartByIndex(0);
        await pm.inventoryPage.goToCart();

        expect(await pm.cartPage.getCartItemCount()).toBe(1);

        await pm.cartPage.removeItemByIndex(0);

        expect(await pm.cartPage.getCartItemCount()).toBe(0);
        await expect(pm.cartPage.checkoutButton).toBeVisible();
    });

    test('should update cart badge count as items are added', { tag: ['@cart', '@regression'] }, async ({ page }) => {
        expect(await pm.inventoryPage.getCartCount()).toBe(0);
        await expect(pm.inventoryPage.shoppingCartBadge).not.toBeVisible();

        await pm.inventoryPage.addProductToCartByIndex(0);
        expect(await pm.inventoryPage.getCartCount()).toBe(1);
        await expect(pm.inventoryPage.shoppingCartBadge).toBeVisible();

        await pm.inventoryPage.addProductToCartByIndex(1);
        expect(await pm.inventoryPage.getCartCount()).toBe(2);
    });

    test('should return to inventory from cart via continue shopping', { tag: ['@cart', '@regression'] }, async ({ page }) => {
        await pm.inventoryPage.goToCart();
        await expect(page).toHaveURL(/cart\.html/);

        await pm.cartPage.continueShopping();

        await expect(page).toHaveURL(/inventory\.html/);
        await expect(pm.inventoryPage.pageTitle).toHaveText('Products');
    });
});
