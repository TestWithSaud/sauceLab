import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TEST_USERS } from '../test-data/testData';
import path from 'path';

setup('authenticate', async ({ page, browserName }) => {
    const authFile = path.join(__dirname, `../playwright/.auth/${browserName}.json`);

    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(TEST_USERS.STANDARD.username, TEST_USERS.STANDARD.password);
    await expect(page).toHaveURL(/inventory\.html/);

    await page.context().storageState({ path: authFile });
});
