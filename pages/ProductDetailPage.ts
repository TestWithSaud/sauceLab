import { Page, Locator } from '@playwright/test';

export class ProductDetailPage {
    readonly page: Page;

    readonly productName: Locator;
    readonly productPrice: Locator;
    readonly productDescription: Locator;
    readonly productImage: Locator;
    readonly backToProductsButton: Locator;
    readonly addToCartButton: Locator;
    readonly removeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productName = page.locator('.inventory_details_name');
        this.productPrice = page.locator('.inventory_details_price');
        this.productDescription = page.locator('.inventory_details_desc');
        this.productImage = page.locator('.inventory_details_img');
        this.backToProductsButton = page.locator('[data-test="back-to-products"]');
        this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
        this.removeButton = page.getByRole('button', { name: 'Remove' });
    }
}
