import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';

test.describe('Cart Quantity', () => {
    let pm: PageManager;

    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page);
        await pm.inventoryPage.open();
    });

    test('quantity column shows 1 for each individually added item', { tag: ['@cart', '@regression'] }, async ({ page }) => {
        await pm.inventoryPage.addProductToCartByIndex(0);
        await pm.inventoryPage.addProductToCartByIndex(1);
        await pm.inventoryPage.addProductToCartByIndex(2);
        await pm.inventoryPage.goToCart();

        const quantities = await pm.cartPage.cartItemQuantities.allInnerTexts();
        expect(quantities).toHaveLength(3);
        quantities.forEach(qty => expect(qty).toBe('1'));
    });
});
