import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Sauce Demo Login Page
 * URL: https://www.saucedemo.com/
 */
export class LoginPage {
  readonly page: Page;

  // Locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessageContainer: Locator;
  readonly logoImage: Locator;
  readonly headerTitle: Locator;
  readonly pageTitle: string;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators using data-test attributes (most stable)
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessageContainer = page.locator('[data-test="error"]');
    this.logoImage = page.getByText('Swag Labs');
    this.headerTitle = page.locator('.title');
    this.pageTitle = 'Swag Labs';
  }
  async open(): Promise<void> {
    await this.page.goto('/');
  }
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Fill only the username field
   * @param username - Username to enter
   */
  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  /**
   * Fill only the password field
   * @param password - Password to enter
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Click the login button
   */
  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Wait for successful navigation to inventory page after login
   * This method only waits, does not assert - let tests handle assertions
   */
  async waitForInventoryPage(): Promise<void> {
    await this.page.waitForURL(/.*inventory.html/);
  }

  /**
   * Check if error message is displayed
   * @returns true if error message is visible, false otherwise
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.errorMessageContainer.isVisible();
  }
}