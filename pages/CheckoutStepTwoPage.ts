import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for Sauce Demo Checkout Step Two Page (Overview)
 * URL: https://www.saucedemo.com/checkout-step-two.html
 */
export class CheckoutStepTwoPage {
    readonly page: Page;

    // Locators
    readonly pageTitle: Locator;
    readonly cartItems: Locator;
    readonly cartItemNames: Locator;
    readonly cartItemPrices: Locator;
    readonly cartItemQuantities: Locator;
    readonly paymentInformation: Locator;
    readonly shippingInformation: Locator;
    readonly subtotalLabel: Locator;
    readonly taxLabel: Locator;
    readonly totalLabel: Locator;
    readonly finishButton: Locator;

    /**
     * Constructor to initialize the Checkout Step Two Page
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
        this.paymentInformation = page.locator('[data-test="payment-info-value"]');
        this.shippingInformation = page.locator('[data-test="shipping-info-value"]');
        this.subtotalLabel = page.locator('.summary_subtotal_label');
        this.taxLabel = page.locator('.summary_tax_label');
        this.totalLabel = page.locator('.summary_total_label');
        this.finishButton = page.getByRole('button', { name: 'Finish' });
    }

    /**
     * Get the number of items in the order
     * @returns Number of items
     */
    async getItemCount(): Promise<number> {
        return await this.cartItems.count();
    }

    /**
     * Get all item names in the order
     * @returns Array of item names
     */
    async getAllItemNames(): Promise<string[]> {
        return await this.cartItemNames.allInnerTexts();
    }

    /**
     * Get subtotal price (before tax)
     * @returns Subtotal as number
     */
    async getSubtotal(): Promise<number> {
        const subtotalText = await this.subtotalLabel.innerText();
        // Extract number from "Item total: $29.99"
        const match = subtotalText.match(/\$(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
    }

    /**
     * Get tax amount
     * @returns Tax as number
     */
    async getTax(): Promise<number> {
        const taxText = await this.taxLabel.innerText();
        // Extract number from "Tax: $2.40"
        const match = taxText.match(/\$(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
    }

    /**
     * Get total price (subtotal + tax)
     * @returns Total as number
     */
    async getTotal(): Promise<number> {
        const totalText = await this.totalLabel.innerText();
        // Extract number from "Total: $32.39"
        const match = totalText.match(/\$(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
    }

    /**
     * Get complete price summary
     * @returns Object with subtotal, tax, and total
     */
    async getPriceSummary(): Promise<{ subtotal: number; tax: number; total: number }> {
        const subtotal = await this.getSubtotal();
        const tax = await this.getTax();
        const total = await this.getTotal();

        return { subtotal, tax, total };
    }

    /**
     * Verify price calculation is correct
     * @returns true if subtotal + tax = total, false otherwise
     */
    async isPriceCalculationCorrect(): Promise<boolean> {
        const { subtotal, tax, total } = await this.getPriceSummary();
        const calculatedTotal = subtotal + tax;

        // Use toFixed to handle floating point precision
        return calculatedTotal.toFixed(2) === total.toFixed(2);
    }

    /**
     * Click the Finish button to complete the order
     */
    async clickFinish(): Promise<void> {
        await this.finishButton.click();
    }

    /**
     * Verify if specific items are in the order
     * @param expectedItems - Array of product names to verify
     * @returns true if all items are present, false otherwise
     */
    async areItemsInOrder(expectedItems: string[]): Promise<boolean> {
        const orderItems = await this.getAllItemNames();
        return expectedItems.every(item => orderItems.includes(item));
    }
}