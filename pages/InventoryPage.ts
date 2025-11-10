import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Sauce Demo Inventory Page
 * URL: https://www.saucedemo.com/inventory.html
 */
export class InventoryPage {
    readonly page: Page;

    // Locators
    readonly pageTitle: Locator;
    readonly productCards: Locator;
    readonly productNames: Locator;
    readonly productPrices: Locator;
    readonly addToCartButtons: Locator;
    readonly shoppingCartBadge: Locator;
    readonly shoppingCartLink: Locator;
    /**
     * Constructor to initialize the Inventory Page
     * @param page - Playwright Page object
     */
    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.pageTitle = page.locator('.title');
        this.productCards = page.locator('.inventory_item');
        this.productNames = page.locator('.inventory_item_name');
        this.productPrices = page.locator('.inventory_item_price');
        this.addToCartButtons = page.locator('button[data-test^="add-to-cart"]');
        this.shoppingCartBadge = page.locator('.shopping_cart_badge');
        this.shoppingCartLink = page.locator('.shopping_cart_link');
    }

    /**
     * Navigate directly to the inventory page
     * Note: User should be logged in first
     * Playwright's goto() waits for 'load' event, no explicit wait needed
     */
    async open(): Promise<void> {
        await this.page.goto('/inventory.html');
    }

    /**
     * Get the page title text
     * @returns Page title (should be "Products")
     */
    async getPageTitle(): Promise<string> {
        return await this.pageTitle.innerText();
    }

    /**
     * Get the total number of products displayed
     * @returns Number of products
     */
    async getProductCount(): Promise<number> {
        return await this.productCards.count();
    }

    /**
     * Get product details by index
     * @param index - Product index (0-based)
     * @returns Object with product name and price
     */
    async getProductDetails(index: number): Promise<{ name: string; price: string }> {
        const name = await this.productNames.nth(index).innerText();
        const price = await this.productPrices.nth(index).innerText();
        return { name, price };
    }

    /**
     * Add a product to cart by index
     * @param index - Product index (0-based)
     */
    async addProductToCartByIndex(index: number): Promise<void> {
        // Get product name first to build correct data-test selector
        const productName = await this.productNames.nth(index).innerText();
        const productNameKebabCase = productName.toLowerCase().replace(/\s+/g, '-');

        // Use the specific data-test attribute for this product
        const addButton = this.page.locator(`[data-test="add-to-cart-${productNameKebabCase}"]`);
        await addButton.click();
    }

    /**
     * Add multiple random products to cart
     * @param count - Number of random products to add
     * @returns Array of product details that were added
     */
    async addRandomProductsToCart(count: number): Promise<Array<{ name: string; price: string }>> {
        const totalProducts = await this.getProductCount();

        if (count > totalProducts) {
            throw new Error(`Cannot add ${count} products. Only ${totalProducts} products available.`);
        }

        // Generate random unique indices
        const randomIndices = this.generateRandomUniqueIndices(totalProducts, count);
        const addedProducts: Array<{ name: string; price: string }> = [];

        // Add products by random indices
        for (const index of randomIndices) {
            const productDetails = await this.getProductDetails(index);
            await this.addProductToCartByIndex(index);
            addedProducts.push(productDetails);
        }

        return addedProducts;
    }

    /**
     * Generate random unique indices
     * @param max - Maximum value (exclusive)
     * @param count - Number of unique indices needed
     * @returns Array of unique random indices
     */
    private generateRandomUniqueIndices(max: number, count: number): number[] {
        const indices: number[] = [];
        while (indices.length < count) {
            const randomIndex = Math.floor(Math.random() * max);
            if (!indices.includes(randomIndex)) {
                indices.push(randomIndex);
            }
        }
        return indices;
    }

    /**
     * Get the shopping cart badge count
     * @returns Cart count as number, or 0 if badge not visible
     */
    async getCartCount(): Promise<number> {
        try {
            const badgeText = await this.shoppingCartBadge.innerText();
            return parseInt(badgeText, 10);
        } catch {
            return 0; // Badge not visible means cart is empty
        }
    }

    /**
     * Check if cart badge is visible
     * @returns true if badge is visible, false otherwise
     */
    async isCartBadgeVisible(): Promise<boolean> {
        return await this.shoppingCartBadge.isVisible();
    }

    /**
     * Click on the shopping cart to go to cart page
     */
    async goToCart(): Promise<void> {
        await this.shoppingCartLink.click();
    }

    /**
     * Get current page URL
     * @returns Current URL
     */
    async getCurrentURL(): Promise<string> {
        return this.page.url();
    }
}