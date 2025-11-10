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
    readonly continueShoppingButton: Locator;
    readonly checkoutButton: Locator;
    readonly shoppingCartBadge: Locator;

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
        this.removeButtons = page.locator('button[data-test^="remove"]');
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    }

    /**
     * Navigate directly to the cart page
     */
    async open(): Promise<void> {
        await this.page.goto('https://www.saucedemo.com/cart.html');
    }
    
    /**
     * Get the page title text
     * @returns Page title (should be "Your Cart")
     */
    async getPageTitle(): Promise<string> {
        return await this.pageTitle.innerText();
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
     * Get all item prices in cart
     * @returns Array of item prices
     */
    async getAllItemPrices(): Promise<string[]> {
        return await this.cartItemPrices.allInnerTexts();
    }

    /**
     * Get all item quantities in cart
     * @returns Array of item quantities as numbers
     */
    async getAllItemQuantities(): Promise<number[]> {
        const quantities = await this.cartItemQuantities.allInnerTexts();
        return quantities.map(q => parseInt(q, 10));
    }

    /**
     * Get cart item details by index
     * @param index - Item index (0-based)
     * @returns Object with item name, price, and quantity
     */
    async getItemDetails(index: number): Promise<{ name: string; price: string; quantity: number }> {
        const name = await this.cartItemNames.nth(index).innerText();
        const price = await this.cartItemPrices.nth(index).innerText();
        const quantityText = await this.cartItemQuantities.nth(index).innerText();
        const quantity = parseInt(quantityText, 10);

        return { name, price, quantity };
    }

    /**
     * Remove an item from cart by index
     * @param index - Item index (0-based)
     */
    async removeItemByIndex(index: number): Promise<void> {
        await this.removeButtons.nth(index).click();
    }

    /**
     * Remove an item from cart by name
     * @param productName - Name of the product
     */
    async removeItemByName(productName: string): Promise<void> {
        const productNameKebabCase = productName.toLowerCase().replace(/\s+/g, '-');
        const removeButton = this.page.locator(`[data-test="remove-${productNameKebabCase}"]`);
        await removeButton.click();
    }

    /**
     * Verify if a specific item is in the cart
     * @param productName - Name of the product to verify
     * @returns true if item is in cart, false otherwise
     */
    async isItemInCart(productName: string): Promise<boolean> {
        const itemNames = await this.getAllItemNames();
        return itemNames.includes(productName);
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
     * Click Continue Shopping button to go back to inventory
     */
    async continueShopping(): Promise<void> {
        await this.continueShoppingButton.click();
    }

    /**
     * Click Checkout button to proceed to checkout
     */
    async proceedToCheckout(): Promise<void> {
        await this.checkoutButton.click();
    }

    /**
     * Get the shopping cart badge count
     * @returns Cart count as number, or 0 if badge not visible
     */
    async getCartBadgeCount(): Promise<number> {
        try {
            const badgeText = await this.shoppingCartBadge.innerText();
            return parseInt(badgeText, 10);
        } catch {
            return 0;
        }
    }

    /**
     * Check if cart is empty
     * @returns true if cart is empty, false otherwise
     */
    async isCartEmpty(): Promise<boolean> {
        const itemCount = await this.getCartItemCount();
        return itemCount === 0;
    }

    /**
     * Check if checkout button is enabled
     * @returns true if enabled, false otherwise
     */
    async isCheckoutButtonEnabled(): Promise<boolean> {
        return await this.checkoutButton.isEnabled();
    }

    /**
     * Get current page URL
     * @returns Current URL
     */
    async getCurrentURL(): Promise<string> {
        return this.page.url();
    }

    /**
     * Calculate total price of items in cart
     * @returns Total price as number (without $ sign)
     */
    async calculateTotalPrice(): Promise<number> {
        const prices = await this.getAllItemPrices();
        let total = 0;

        for (const priceStr of prices) {
            // Remove $ sign and convert to number
            const price = parseFloat(priceStr.replace('$', ''));
            total += price;
        }

        return total;
    }

    /**
     * Get all cart items as an array of objects
     * @returns Array of cart items with name, price, quantity
     */
    async getAllCartItems(): Promise<Array<{ name: string; price: string; quantity: number }>> {
        const itemCount = await this.getCartItemCount();
        const items: Array<{ name: string; price: string; quantity: number }> = [];

        for (let i = 0; i < itemCount; i++) {
            const item = await this.getItemDetails(i);
            items.push(item);
        }

        return items;
    }

    /**
     * Remove all items from cart
     */
    async clearCart(): Promise<void> {
        let itemCount = await this.getCartItemCount();

        while (itemCount > 0) {
            await this.removeItemByIndex(0);
            itemCount = await this.getCartItemCount();
        }
    }
}