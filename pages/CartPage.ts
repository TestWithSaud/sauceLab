import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Sauce Demo Cart Page
 * URL: https://www.saucedemo.com/cart.html
 */
export class CartPage {
    readonly page: Page;

    // Locators
    readonly pageTitle: Locator;
    readonly cartItems: Locator;
    readonly cartItemNames: Locator;
    readonly cartItemPrices: Locator;
    readonly cartItemQuantities: Locator;
    readonly removeButtons: Locator;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;

    /**
     * Constructor to initialize the Cart Page
     * @param page - Playwright Page object
     */
    constructor(page: Page) {
        this.page = page;
        // Initialize locators
        this.pageTitle = page.locator('.title');
        this.cartItems = page.locator('.cart_item');
        this.cartItemNames = page.locator('.inventory_item_name');
        this.cartItemPrices = page.locator('.inventory_item_price');
        this.cartItemQuantities = page.locator('.cart_quantity');
        this.removeButtons = page.getByRole('button', { name: 'Remove' });
        this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    }

    /**
     * Get the number of items in cart
     * @returns Number of cart items
     */
    async getCartItemCount(): Promise<number> {
        return await this.cartItems.count();
    }

    /**
     * Get all item names in cart
     * @returns Array of item names
     */
    async getAllItemNames(): Promise<string[]> {
        return await this.cartItemNames.allInnerTexts();
    }

    /**
     * Remove an item from cart by index
     * @param index - Item index (0-based)
     */
    async removeItemByIndex(index: number): Promise<void> {
        await this.removeButtons.nth(index).click();
    }

    /**
     * Verify if multiple items are in the cart
     * @param productNames - Array of product names to verify
     * @returns true if all items are in cart, false otherwise
     */
    async areItemsInCart(productNames: string[]): Promise<boolean> {
        const itemNames = await this.getAllItemNames();
        return productNames.every(name => itemNames.includes(name));
    }

    /**
     * Click Checkout button to proceed to checkout
     */
    async proceedToCheckout(): Promise<void> {
        await this.checkoutButton.click();
    }

    /**
     * Click Continue Shopping button to return to inventory
     */
    async continueShopping(): Promise<void> {
        await this.continueShoppingButton.click();
    }

}