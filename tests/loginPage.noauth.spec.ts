import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TEST_USERS } from '../test-data/testData';

/**
 * Test Suite: Login Functionality
 * This suite covers login scenarios for the Sauce Demo application
 */
test.describe('Login Page - Positive Scenarios', () => {
    let loginPage: LoginPage;
    /**
     * Before each test, initialize a new LoginPage instance and navigate
     */
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.open();
    });

    test('should successfully login with valid standard_user credentials', async ({ page }) => {
        await loginPage.login(TEST_USERS.STANDARD.username, TEST_USERS.STANDARD.password);
        await loginPage.waitForInventoryPage();
        expect(await loginPage.getCurrentURL()).toContain('inventory.html');
        expect(await loginPage.getPageHeaderTitle()).toBe('Products');
    });

    /**
     * Test Case: Verify login page loads correctly
     * 
     * Objective: Validate that the login page displays all required elements
     * 
     * Preconditions:
     * - Browser is open
     * - User navigates to https://www.saucedemo.com/
     * 
     * Priority: High
     * 
     * Test Steps:
     * 1. Load the login page
     * 2. Verify username input field is visible
     * 3. Verify password input field is visible
     * 4. Verify login button is visible
     * 
     * Expected Results:
     * - All login form elements are visible and interactive
     * - Login button is enabled
     */
    test('should display all login page elements correctly', async () => {
        // Expected Results: Verify all elements are visible
        await expect(loginPage.usernameInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
        await expect(loginPage.logoImage).toBeVisible();
    });


    /**
     * Test Case: Verify login page title
     * 
     * Objective: Validate that the login page has the correct title
     * 
     * Preconditions:
     * - Browser is open
     * - User navigates to https://www.saucedemo.com/
     * 
     * Priority: Low
     * 
     * Test Steps:
     * 1. Load the login page
     * 2. Get the page title
     * 
     * Expected Results:
     * - Page title is "Swag Labs"
     */
    test('should have correct page title', async () => {
        const title = await loginPage.pageTitle;
        expect(title).toBe('Swag Labs');
    });
});

/**
 * Test Suite: Login Functionality - Negative Scenarios
 * This suite covers error handling and validation for the Sauce Demo login page
 */
test.describe('Login Page - Negative Scenarios', () => {
    let loginPage: LoginPage;

    /**
     * Before each test, initialize a new LoginPage instance and navigate
     */
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.open();
    });

    /**
     * Test Case: Verify login fails with invalid username
     * 
     * Objective: Validate that the system rejects login attempts with incorrect username
     * 
     * Preconditions:
     * - Browser is open
     * - User navigates to https://www.saucedemo.com/
     * 
     * Priority: Critical
     * 
     * Test Steps:
     * 1. Enter invalid username "invalid_user"
     * 2. Enter valid password "secret_sauce"
     * 3. Click the Login button
     * 
     * Expected Results:
     * - Login fails
     * - Error message is displayed
     * - Error message contains "Username and password do not match"
     * - User remains on login page
     */
    test('should display error message with invalid username', async ({ page }) => {
        // Step 1-3: Attempt login with invalid username
        await loginPage.login('invalid_user', 'secret_sauce');

        // Expected Results: Verify error handling
        const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
        expect(isErrorDisplayed).toBeTruthy();

        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Username and password do not match');

        // Verify user stays on login page
        expect(page.url()).toContain('saucedemo.com');
        expect(loginPage.getCurrentURL()).not.toContain('inventory.html');
        expect(loginPage.pageTitle).toBe('Swag Labs');
    });


    /**
     * Test Case: Verify login fails with invalid password
     * 
     * Objective: Validate that the system rejects login attempts with incorrect password
     * 
     * Preconditions:
     * - Browser is open
     * - User navigates to https://www.saucedemo.com/
     * 
     * Priority: Critical
     * 
     * Test Steps:
     * 1. Enter valid username "standard_user"
     * 2. Enter invalid password "wrong_password"
     * 3. Click the Login button
     * 
     * Expected Results:
     * - Login fails
     * - Error message is displayed
     * - Error message contains "Username and password do not match"
     * - User remains on login page
     */
    test('should display error message with invalid password', async ({ page }) => {
        // Step 1-3: Attempt login with invalid password
        await loginPage.login('standard_user', 'wrong_password');

        // Expected Results: Verify error handling
        expect(await loginPage.isErrorMessageDisplayed()).toBeTruthy();

        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Username and password do not match');
    });

    /**
     * Test Case: Verify login fails with empty username
     * 
     * Objective: Validate that the system requires username input
     * 
     * Preconditions:
     * - Browser is open
     * - User navigates to https://www.saucedemo.com/
     * 
     * Priority: High
     * 
     * Test Steps:
     * 1. Leave username field empty
     * 2. Enter valid password "secret_sauce"
     * 3. Click the Login button
     * 
     * Expected Results:
     * - Login fails
     * - Error message is displayed
     * - Error message contains "Username is required"
     * - User remains on login page
     */
    test('should display error message when username is empty', async ({ page }) => {
        // Step 1-3: Attempt login without username
        await loginPage.fillPassword('secret_sauce');
        await loginPage.clickLoginButton();

        // Expected Results: Verify validation error
        expect(await loginPage.isErrorMessageDisplayed()).toBeTruthy();

        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Username is required');
    });

    /**
     * Test Case: Verify login fails with empty password
     * 
     * Objective: Validate that the system requires password input
     * 
     * Preconditions:
     * - Browser is open
     * - User navigates to https://www.saucedemo.com/
     * 
     * Priority: High
     * 
     * Test Steps:
     * 1. Enter valid username "standard_user"
     * 2. Leave password field empty
     * 3. Click the Login button
     * 
     * Expected Results:
     * - Login fails
     * - Error message is displayed
     * - Error message contains "Password is required"
     * - User remains on login page
     */
    test('should display error message when password is empty', async ({ page }) => {
        // Step 1-3: Attempt login without password
        await loginPage.fillUsername('standard_user');
        await loginPage.clickLoginButton();

        // Expected Results: Verify validation error
        expect(await loginPage.isErrorMessageDisplayed()).toBeTruthy();

        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toContain('Password is required');

        // Verify user stays on login page
        expect(page.url()).not.toContain('inventory.html');
    });

    /**
     * Test Case: Verify error message can be dismissed
     * 
     * Objective: Validate that users can close error messages
     * 
     * Preconditions:
     * - Browser is open
     * - User navigates to https://www.saucedemo.com/
     * - Error message is displayed from previous failed login
     * 
     * Priority: Medium
     * 
     * Test Steps:
     * 1. Trigger an error by attempting invalid login
     * 2. Verify error message is displayed
     * 3. Click the error message close button (X)
     * 
     * Expected Results:
     * - Error message is no longer visible
     * - Login form remains functional
     */
    test('should be able to dismiss error message', async ({ page }) => {
        // Step 1: Trigger error
        await loginPage.login('invalid_user', 'invalid_pass');

        // Step 2: Verify error is displayed
        expect(await loginPage.isErrorMessageDisplayed()).toBeTruthy();

        // Step 3: Click close button
        const closeButton = page.locator('[data-test="error-button"]');
        await closeButton.click();

        // Expected Results: Error should be hidden
        expect(await loginPage.isErrorMessageDisplayed()).toBeFalsy();
    });

    /**
     * Test Case: Verify whitespace handling in credentials
     * 
     * Objective: Validate system behavior with leading/trailing spaces
     * 
     * Preconditions:
     * - Browser is open
     * - User navigates to https://www.saucedemo.com/
     * 
     * Priority: Medium
     * 
     * Test Steps:
     * 1. Enter username with spaces
     * 2. Enter valid password
     * 3. Click the Login button
     * 
     * Expected Results:
     * - Login fails (spaces not trimmed) OR succeeds (spaces trimmed)
     * - Behavior is consistent with application design
     */
    test('should handle whitespace in username', async ({ page }) => {
        // Step 1-3: Attempt login with spaces
        await loginPage.login(`${TEST_USERS.STANDARD.username} `, TEST_USERS.STANDARD.password);

        // Expected Results: Verify error (assuming spaces not trimmed)
        const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();

        if (isErrorDisplayed) {
            // If spaces are not trimmed, login should fail
            expect(page.url()).not.toContain('inventory.html');
        } else {
            // If spaces are trimmed, login might succeed
            // Document this behavior for the team
            expect(page.url()).toContain('inventory.html');
        }
    });
});