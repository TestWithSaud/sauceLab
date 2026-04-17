import { Page, Locator } from '@playwright/test';

export class HamburgerMenuPage {
    readonly page: Page;

    readonly openButton: Locator;
    readonly closeButton: Locator;
    readonly allItemsLink: Locator;
    readonly aboutLink: Locator;
    readonly logoutLink: Locator;
    readonly resetAppStateLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.openButton = page.locator('#react-burger-menu-btn');
        this.closeButton = page.locator('#react-burger-cross-btn');
        this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
        this.aboutLink = page.locator('[data-test="about-sidebar-link"]');
        this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
        this.resetAppStateLink = page.locator('[data-test="reset-sidebar-link"]');
    }

    async open(): Promise<void> {
        await this.openButton.click();
        await this.page.waitForFunction(
            () => {
                const wrap = document.querySelector('.bm-menu-wrap');
                return wrap !== null
                    && wrap.getAttribute('aria-hidden') === 'false'
                    && !wrap.hasAttribute('hidden');
            }
        );
    }

    async close(): Promise<void> {
        await this.closeButton.click();
    }
}
