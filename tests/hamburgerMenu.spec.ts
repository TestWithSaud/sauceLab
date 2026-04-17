import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';

test.describe('Hamburger Menu', () => {
    let pm: PageManager;

    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page);
        await pm.inventoryPage.open();
    });

    test('should open and show all menu items', { tag: ['@smoke', '@inventory'] }, async ({ page }) => {
        await pm.hamburgerMenuPage.open();

        await expect(pm.hamburgerMenuPage.allItemsLink).toBeVisible();
        await expect(pm.hamburgerMenuPage.aboutLink).toBeVisible();
        await expect(pm.hamburgerMenuPage.logoutLink).toBeVisible();
        await expect(pm.hamburgerMenuPage.resetAppStateLink).toBeVisible();
    });

    test('should close when X is clicked', { tag: ['@inventory', '@regression'] }, async ({ page }) => {
        await pm.hamburgerMenuPage.open();
        await expect(pm.hamburgerMenuPage.allItemsLink).toBeVisible();

        await pm.hamburgerMenuPage.close();

        await expect(pm.hamburgerMenuPage.allItemsLink).not.toBeVisible();
    });

    test('All Items navigates to inventory', { tag: ['@inventory', '@regression'] }, async ({ page }) => {
        await pm.inventoryPage.productNames.first().click();
        await expect(page).toHaveURL(/inventory-item\.html/);

        await pm.hamburgerMenuPage.open();
        await pm.hamburgerMenuPage.allItemsLink.click();

        await expect(page).toHaveURL(/inventory\.html/);
        await expect(pm.inventoryPage.pageTitle).toHaveText('Products');
    });

    test('About link points to saucelabs.com', { tag: ['@inventory', '@regression'] }, async ({ page }) => {
        await pm.hamburgerMenuPage.open();

        const href = await pm.hamburgerMenuPage.aboutLink.getAttribute('href');
        expect(href).toContain('saucelabs.com');
    });

    test('Logout redirects to login page', { tag: ['@inventory', '@regression'] }, async ({ page }) => {
        await pm.hamburgerMenuPage.open();
        await pm.hamburgerMenuPage.logoutLink.click();

        await expect(page).toHaveURL(/saucedemo\.com\/?$/);
        await expect(pm.loginPage.loginButton).toBeVisible();
    });

    test('Reset App State clears the cart', { tag: ['@inventory', '@regression'] }, async ({ page }) => {
        await pm.inventoryPage.addProductToCartByIndex(0);
        await pm.inventoryPage.addProductToCartByIndex(1);
        expect(await pm.inventoryPage.getCartCount()).toBe(2);

        await pm.hamburgerMenuPage.open();
        await pm.hamburgerMenuPage.resetAppStateLink.click();

        await expect(pm.inventoryPage.shoppingCartBadge).not.toBeVisible();
        expect(await pm.inventoryPage.getCartCount()).toBe(0);
    });

    test('Reset App State does not log out', { tag: ['@inventory', '@regression'] }, async ({ page }) => {
        await pm.hamburgerMenuPage.open();
        await pm.hamburgerMenuPage.resetAppStateLink.click();

        await expect(page).toHaveURL(/inventory\.html/);
        await expect(pm.inventoryPage.pageTitle).toHaveText('Products');
    });
});
