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
  readonly pageTitle: string;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators using data-test attributes (most stable)
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessageContainer = page.locator('[data-test="error"]');
    this.logoImage = page.locator('.login_logo');
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
   * Get the current page URL
   * @returns Current URL string
   */
  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get the page header title text
   * @returns Title text from the page header
   */
  async getPageHeaderTitle(): Promise<string> {
    const titleElement = this.page.locator('.title');
    await titleElement.waitFor({ state: 'visible' });
    return await titleElement.innerText();
  }

  /**
   * Get the error message text displayed on login failure
   * @returns The error message text, or null if not visible
   */
  async getErrorMessage(): Promise<string> {
    return await this.errorMessageContainer.innerText();
  }

  /**
   * Check if error message is displayed
   * @returns true if error message is visible, false otherwise
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.errorMessageContainer.isVisible();
  }

  /**
   * Check if login button is enabled
   * @returns true if enabled, false if disabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.loginButton.isEnabled();
  }

  /**
   * Clear all input fields
   */
  async clearInputFields(): Promise<void> {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Get the page title
   * @returns Page title text
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}