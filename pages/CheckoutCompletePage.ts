import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Sauce Demo Checkout Complete Page
 * URL: https://www.saucedemo.com/checkout-complete.html
 */
export class CheckoutCompletePage {
    readonly page: Page;

    // Locators
    readonly pageTitle: Locator;
    readonly completeHeader: Locator;
    readonly completeText: Locator;
    readonly ponyExpressImage: Locator;
    readonly backHomeButton: Locator;

    /**
     * Constructor to initialize the Checkout Complete Page
     * @param page - Playwright Page object
     */
    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.pageTitle = page.locator('.title');
        this.completeHeader = page.locator('.complete-header');
        this.completeText = page.locator('.complete-text');
        this.ponyExpressImage = page.locator('.pony_express');
        this.backHomeButton = page.locator('[data-test="back-to-products"]');
    }

    /**
     * Navigate directly to the checkout complete page
     */
    async open(): Promise<void> {
        await this.page.goto('https://www.saucedemo.com/checkout-complete.html');
    }

    /**
     * Get the page title text
     * @returns Page title (should be "Checkout: Complete!")
     */
    async getPageTitle(): Promise<string> {
        return await this.pageTitle.innerText();
    }

    /**
     * Get the completion header text
     * @returns Header text (e.g., "Thank you for your order!")
     */
    async getCompleteHeader(): Promise<string> {
        return await this.completeHeader.innerText();
    }

    /**
     * Get the completion message text
     * @returns Message text (e.g., "Your order has been dispatched...")
     */
    async getCompleteText(): Promise<string> {
        return await this.completeText.innerText();
    }

    /**
     * Check if the pony express image is displayed
     * @returns true if image is visible, false otherwise
     */
    async isPonyExpressImageVisible(): Promise<boolean> {
        return await this.ponyExpressImage.isVisible();
    }

    /**
     * Click the Back Home button to return to inventory
     */
    async clickBackHome(): Promise<void> {
        await this.backHomeButton.click();
    }

    /**
     * Navigate back to inventory page
     */
    async goBackToInventory(): Promise<void> {
        await this.clickBackHome();
    }

    /**
     * Check if back home button is enabled
     * @returns true if enabled, false otherwise
     */
    async isBackHomeButtonEnabled(): Promise<boolean> {
        return await this.backHomeButton.isEnabled();
    }

    /**
     * Get current page URL
     * @returns Current URL
     */
    async getCurrentURL(): Promise<string> {
        return this.page.url();
    }

    /**
     * Verify checkout completion success elements are present
     * @returns true if all success elements are visible
     */
    async isCheckoutSuccessful(): Promise<boolean> {
        const headerVisible = await this.completeHeader.isVisible();
        const textVisible = await this.completeText.isVisible();
        const imageVisible = await this.ponyExpressImage.isVisible();
        const buttonVisible = await this.backHomeButton.isVisible();

        return headerVisible && textVisible && imageVisible && buttonVisible;
    }

    /**
     * Wait for navigation to inventory page after clicking back home
     */
    async waitForInventoryPage(): Promise<void> {
        await this.page.waitForURL(/.*inventory.html/, { timeout: 10000 });
    }
}