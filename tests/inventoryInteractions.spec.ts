import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';

test.describe('Inventory Button Interactions', () => {
    let pm: PageManager;

    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page);
        await pm.inventoryPage.open();
    });

    test('Add to cart button toggles to Remove', { tag: ['@inventory', '@regression'] }, async ({ page }) => {
        const { add, remove } = await pm.inventoryPage.getProductButtonLocators(0);

        await expect(add).toBeVisible();
        await expect(remove).not.toBeVisible();

        await add.click();

        await expect(remove).toBeVisible();
        await expect(add).not.toBeVisible();
        await expect(pm.inventoryPage.shoppingCartBadge).toHaveText('1');
    });

    test('Remove button toggles back to Add to cart', { tag: ['@inventory', '@regression'] }, async ({ page }) => {
        const { add, remove } = await pm.inventoryPage.getProductButtonLocators(0);

        await add.click();
        await expect(remove).toBeVisible();

        await remove.click();

        await expect(add).toBeVisible();
        await expect(remove).not.toBeVisible();
        await expect(pm.inventoryPage.shoppingCartBadge).not.toBeVisible();
    });
});
