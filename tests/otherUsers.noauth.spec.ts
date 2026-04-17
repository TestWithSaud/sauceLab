import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const OTHER_USERS = [
    { username: 'problem_user',             password: 'secret_sauce' },
    { username: 'performance_glitch_user',  password: 'secret_sauce' },
    { username: 'error_user',               password: 'secret_sauce' },
    { username: 'visual_user',              password: 'secret_sauce' },
];

test.describe('Other User Logins', () => {
    for (const user of OTHER_USERS) {
        test(`${user.username} can log in successfully`, { tag: ['@login', '@regression'] }, async ({ page }) => {
            const loginPage = new LoginPage(page);
            await loginPage.open();
            await loginPage.login(user.username, user.password);

            await page.waitForURL(/inventory\.html/, { timeout: 30000 });
            await expect(page).toHaveURL(/inventory\.html/);
            await expect(loginPage.headerTitle).toHaveText('Products');
        });
    }
});
