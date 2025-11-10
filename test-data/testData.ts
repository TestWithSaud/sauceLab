const dotenv = require('dotenv');
export const TEST_USERS = {
    STANDARD: {
        username: process.env.STANDARD_USERNAME,
        password: process.env.STANDARD_PASSWORD,
    }
} as const;

export const INVALID_CREDENTIALS = {
    INVALID_USERNAME: {
        username: 'invalid_user',
        password: process.env.STANDARD_PASSWORD,
        expectedError: 'Username and password do not match'
    },
    INVALID_PASSWORD: {
        username: process.env.STANDARD_USERNAME,
        password: 'wrong_password',
        expectedError: 'Username and password do not match'
    },
    EMPTY_USERNAME: {
        username: '',
        password: process.env.STANDARD_PASSWORD,
        expectedError: 'Username is required'
    },
    EMPTY_PASSWORD: {
        username: process.env.STANDARD_USERNAME,
        password: '',
        expectedError: 'Password is required'
    },
    BOTH_EMPTY: {
        username: '',
        password: '',
        expectedError: 'Username is required'
    }
} as const;

export const EDGE_CASE_DATA = {
    SPECIAL_CHARS: {
        username: 'user@#$%^&*()',
        password: 'secret_sauce',
        description: 'Username with special characters'
    },
    WRONG_CASE: {
        username: 'STANDARD_USER',
        password: 'secret_sauce',
        description: 'Username in wrong case'
    },
    WITH_SPACES: {
        username: ' standard_user ',
        password: 'secret_sauce',
        description: 'Username with leading/trailing spaces'
    },
    VERY_LONG: {
        username: 'a'.repeat(500),
        password: 'secret_sauce',
        description: 'Very long username (500 chars)'
    },
    UNICODE: {
        username: 'user123你好',
        password: 'secret_sauce',
        description: 'Username with unicode characters'
    }
} as const;

export const APP_URLS = {
    BASE_URL: 'https://www.saucedemo.com/',
    LOGIN_PAGE: 'https://www.saucedemo.com/',
    INVENTORY_PAGE: 'https://www.saucedemo.com/inventory.html',
    CART_PAGE: 'https://www.saucedemo.com/cart.html',
    CHECKOUT_STEP_ONE: 'https://www.saucedemo.com/checkout-step-one.html',
    CHECKOUT_STEP_TWO: 'https://www.saucedemo.com/checkout-step-two.html',
    CHECKOUT_COMPLETE: 'https://www.saucedemo.com/checkout-complete.html'
} as const;

export const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
    USERNAME_REQUIRED: 'Epic sadface: Username is required',
    PASSWORD_REQUIRED: 'Epic sadface: Password is required',
    LOCKED_OUT: 'Epic sadface: Sorry, this user has been locked out.',
    FIRST_NAME_REQUIRED: 'Error: First Name is required',
    LAST_NAME_REQUIRED: 'Error: Last Name is required',
    POSTAL_CODE_REQUIRED: 'Error: Postal Code is required'
} as const;

export const CHECKOUT_INFO = {
    VALID: {
        firstName: 'John',
        lastName: 'Doe',
        postalCode: '12345'
    },
    VALID_ALTERNATIVE: {
        firstName: 'Jane',
        lastName: 'Smith',
        postalCode: '90210'
    }
} as const;

/**
 * Helper function to get a random valid user (excludes locked_out_user)
 */
export function getRandomValidUser() {
    const validUsers = [
        TEST_USERS.STANDARD,
        TEST_USERS.PROBLEM,
        TEST_USERS.PERFORMANCE_GLITCH,
        TEST_USERS.ERROR,
        TEST_USERS.VISUAL
    ];
    return validUsers[Math.floor(Math.random() * validUsers.length)];
}

/**
 * Helper function to generate random checkout information
 */
export function generateRandomCheckoutInfo() {
    const firstNames = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];
    const postalCodes = ['12345', '90210', '10001', '60601', '94102', '02101'];

    return {
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
        postalCode: postalCodes[Math.floor(Math.random() * postalCodes.length)]
    };
}