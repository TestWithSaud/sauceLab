import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Sauce Demo Checkout Step One Page
 * URL: https://www.saucedemo.com/checkout-step-one.html
 */
export class CheckoutStepOnePage {
    readonly page: Page;

    // Locators - Only essential ones
    readonly pageTitle: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;

    /**
     * Constructor to initialize the Checkout Step One Page
     * @param page - Playwright Page object
     */
    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.pageTitle = page.locator('.title');
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
    }

    /**
     * Wait for the checkout page to load
     * This wait is necessary as we navigate from cart to checkout
     */
    async waitForPageLoad(): Promise<void> {
        await this.page.waitForURL(/.*checkout-step-one.html/, { timeout: 10000 });
    }

    /**
     * Get the page title text
     * @returns Page title (should be "Checkout: Your Information")
     */
    async getPageTitle(): Promise<string> {
        return await this.pageTitle.innerText();
    }

    /**
     * Fill in all checkout information fields
     * @param info - Object containing firstName, lastName, and postalCode
     */
    async fillCheckoutInformation(info: { firstName: string; lastName: string; postalCode: string }): Promise<void> {
        await this.firstNameInput.fill(info.firstName);
        await this.lastNameInput.fill(info.lastName);
        await this.postalCodeInput.fill(info.postalCode);
    }

    /**
     * Click the Continue button
     */
    async clickContinue(): Promise<void> {
        await this.continueButton.click();
    }

    /**
     * Complete checkout step one with provided information
     * @param info - Object containing firstName, lastName, and postalCode
     */
    async completeCheckoutStepOne(info: { firstName: string; lastName: string; postalCode: string }): Promise<void> {
        await this.fillCheckoutInformation(info);
        await this.clickContinue();
    }

    /**
     * Get current page URL
     * @returns Current URL
     */
    async getCurrentURL(): Promise<string> {
        return this.page.url();
    }
}