import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

/**
 * PageManager - Centralized Page Object Management
 * 
 * This class instantiates and manages all page objects in one place.
 * 
 * Usage:
 * ```typescript
 * const pm = new PageManager(page);
 * await pm.loginPage.login('user', 'pass');
 * await pm.inventoryPage.addRandomProductsToCart(3);
 * ```
 * 
 * Note: This is OPTIONAL for small projects.
 * Only use when you have 10+ page objects or 20+ tests.
 */
export class PageManager {
    private readonly page: Page;

    // Page Objects
    readonly loginPage: LoginPage;
    readonly inventoryPage: InventoryPage;
    readonly cartPage: CartPage;
    readonly checkoutStepOnePage: CheckoutStepOnePage;
    readonly checkoutStepTwoPage: CheckoutStepTwoPage;
    readonly checkoutCompletePage: CheckoutCompletePage;

    /**
     * Constructor - Instantiates all page objects
     * @param page - Playwright Page object
     */
    constructor(page: Page) {
        this.page = page;

        // Initialize all page objects
        this.loginPage = new LoginPage(this.page);
        this.inventoryPage = new InventoryPage(this.page);
        this.cartPage = new CartPage(this.page);
        this.checkoutStepOnePage = new CheckoutStepOnePage(this.page);
        this.checkoutStepTwoPage = new CheckoutStepTwoPage(this.page);
        this.checkoutCompletePage = new CheckoutCompletePage(this.page);
    }
}