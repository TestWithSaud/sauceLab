import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';

test.describe('Inventory Page', () => {
    let pm: PageManager;

    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page);
        await pm.inventoryPage.open();
    });

    test('should display 6 products', { tag: ['@smoke', '@inventory'] }, async ({ page }) => {
        await expect(pm.inventoryPage.pageTitle).toHaveText('Products');
        expect(await pm.inventoryPage.getProductCount()).toBe(6);
        await expect(pm.inventoryPage.productNames.first()).toBeVisible();
    });

    test('should sort products by name A to Z', { tag: ['@inventory', '@regression'] }, async () => {
        await pm.inventoryPage.selectSortOption('az');

        const names = await pm.inventoryPage.productNames.allInnerTexts();
        expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    });

    test('should sort products by name Z to A', { tag: ['@inventory', '@regression'] }, async () => {
        await pm.inventoryPage.selectSortOption('za');

        const names = await pm.inventoryPage.productNames.allInnerTexts();
        expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
    });

    test('should sort products by price low to high', { tag: ['@inventory', '@regression'] }, async () => {
        await pm.inventoryPage.selectSortOption('lohi');

        const priceTexts = await pm.inventoryPage.productPrices.allInnerTexts();
        const prices = priceTexts.map(p => parseFloat(p.replace('$', '')));
        expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    test('should sort products by price high to low', { tag: ['@inventory', '@regression'] }, async () => {
        await pm.inventoryPage.selectSortOption('hilo');

        const priceTexts = await pm.inventoryPage.productPrices.allInnerTexts();
        const prices = priceTexts.map(p => parseFloat(p.replace('$', '')));
        expect(prices).toEqual([...prices].sort((a, b) => b - a));
    });

    test('should navigate to product detail page', { tag: ['@inventory', '@regression'] }, async ({ page }) => {
        const firstName = await pm.inventoryPage.productNames.first().innerText();

        await pm.inventoryPage.productNames.first().click();

        await expect(page).toHaveURL(/inventory-item\.html/);
        await expect(page.getByText(firstName)).toBeVisible();
    });
});
