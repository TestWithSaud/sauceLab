import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TEST_USERS } from '../test-data/testData';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
    // Perform authentication steps. Replace these actions with your own.
    // Login as standard_user
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(TEST_USERS.STANDARD.username, TEST_USERS.STANDARD.password);

    // Wait for successful login (redirect to inventory)
    await page.waitForURL(/.*inventory.html/);
    console.log('✅ Login successful');

    // End of authentication steps.

    await page.context().storageState({ path: authFile });
});