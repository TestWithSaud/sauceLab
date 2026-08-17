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
    readonly sortDropdown: Locator;

    /**
     * Seed backing every random product selection on this instance.
     * Set TEST_SEED to replay a previous run's exact selection.
     */
    readonly randomSeed: number;
    private rngState: number;

    /**
     * Constructor to initialize the Inventory Page
     * @param page - Playwright Page object
     */
    constructor(page: Page) {
        this.page = page;

        const envSeed = process.env.TEST_SEED;
        this.randomSeed = envSeed ? Number(envSeed) : Math.floor(Math.random() * 0xffffffff);
        this.rngState = this.randomSeed;

        // Initialize locators
        this.pageTitle = page.locator('.title');
        this.productCards = page.locator('.inventory_item');
        this.productNames = page.locator('.inventory_item_name');
        this.productPrices = page.locator('.inventory_item_price');
        this.addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
        this.shoppingCartBadge = page.locator('.shopping_cart_badge');
        this.shoppingCartLink = page.locator('.shopping_cart_link');
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    }

    /**
     * Select a sort option from the dropdown
     * @param value - Sort option value: 'az', 'za', 'lohi', 'hilo'
     */
    async selectSortOption(value: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
        await this.sortDropdown.selectOption(value);
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
    private toKebabCase(name: string): string {
        return name.toLowerCase().replace(/\s+/g, '-');
    }

    async addProductToCartByIndex(index: number): Promise<void> {
        const productName = await this.productNames.nth(index).innerText();
        const kebab = this.toKebabCase(productName);
        await this.page.locator(`[data-test="add-to-cart-${kebab}"]`).click();
    }

    async getProductButtonLocators(index: number): Promise<{ add: import('@playwright/test').Locator; remove: import('@playwright/test').Locator }> {
        const productName = await this.productNames.nth(index).innerText();
        const kebab = this.toKebabCase(productName);
        return {
            add: this.page.locator(`[data-test="add-to-cart-${kebab}"]`),
            remove: this.page.locator(`[data-test="remove-${kebab}"]`),
        };
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
     * Deterministic PRNG (mulberry32) driven by randomSeed, so a failing run
     * can be replayed exactly via TEST_SEED.
     * @returns Float in [0, 1)
     */
    private nextRandom(): number {
        this.rngState = (this.rngState + 0x6d2b79f5) >>> 0;
        let t = this.rngState;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
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
            const randomIndex = Math.floor(this.nextRandom() * max);
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
        const isVisible = await this.shoppingCartBadge.isVisible();
        if (!isVisible) return 0;
        const badgeText = await this.shoppingCartBadge.innerText();
        return parseInt(badgeText, 10);
    }

    /**
     * Click on the shopping cart to go to cart page
     */
    async goToCart(): Promise<void> {
        await this.shoppingCartLink.click();
    }

}