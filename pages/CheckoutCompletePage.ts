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
        this.completeHeader = page.getByRole('heading', { name: 'Thank you for your order!' });
        this.completeText = page.getByText('Your order has been dispatched', { exact: false });
        this.ponyExpressImage = page.getByAltText('Pony Express');
        this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
    }

}