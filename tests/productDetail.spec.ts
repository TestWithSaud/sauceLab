import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';

test.describe('Product Detail Page', () => {
    let pm: PageManager;

    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page);
        await pm.inventoryPage.open();
    });

    test('should display all product detail elements', { tag: ['@smoke', '@inventory'] }, async ({ page }) => {
        await pm.inventoryPage.productNames.first().click();

        await expect(page).toHaveURL(/inventory-item\.html/);
        await expect(pm.productDetailPage.productName).toBeVisible();
        await expect(pm.productDetailPage.productPrice).toBeVisible();
        await expect(pm.productDetailPage.productDescription).toBeVisible();
        await expect(pm.productDetailPage.productImage).toBeVisible();
        await expect(pm.productDetailPage.backToProductsButton).toBeVisible();
    });

    test('should show matching product name from inventory', { tag: ['@inventory', '@regression'] }, async ({ page }) => {
        const inventoryName = await pm.inventoryPage.productNames.first().innerText();

        await pm.inventoryPage.productNames.first().click();

        await expect(page).toHaveURL(/inventory-item\.html/);
        await expect(pm.productDetailPage.productName).toHaveText(inventoryName);
    });

    test('should add item to cart from detail page', { tag: ['@inventory', '@regression'] }, async ({ page }) => {
        await pm.inventoryPage.productNames.first().click();

        await pm.productDetailPage.addToCartButton.click();

        await expect(pm.inventoryPage.shoppingCartBadge).toHaveText('1');
        await expect(pm.productDetailPage.removeButton).toBeVisible();
        await expect(pm.productDetailPage.addToCartButton).not.toBeVisible();
    });

    test('should remove item from cart on detail page', { tag: ['@inventory', '@regression'] }, async ({ page }) => {
        await pm.inventoryPage.productNames.first().click();
        await pm.productDetailPage.addToCartButton.click();

        await pm.productDetailPage.removeButton.click();

        await expect(pm.inventoryPage.shoppingCartBadge).not.toBeVisible();
        await expect(pm.productDetailPage.addToCartButton).toBeVisible();
        await expect(pm.productDetailPage.removeButton).not.toBeVisible();
    });

    test('should return to inventory via back to products button', { tag: ['@inventory', '@regression'] }, async ({ page }) => {
        await pm.inventoryPage.productNames.first().click();
        await expect(page).toHaveURL(/inventory-item\.html/);

        await pm.productDetailPage.backToProductsButton.click();

        await expect(page).toHaveURL(/inventory\.html/);
        await expect(pm.inventoryPage.pageTitle).toHaveText('Products');
    });
});
