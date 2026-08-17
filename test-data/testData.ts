/**
 * Read a required environment variable, failing loudly at import time rather
 * than surfacing later as an opaque fill() error.
 */
function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}. Set it in .env locally, or as a CI secret.`);
    }
    return value;
}

export const TEST_USERS = {
    STANDARD: {
        username: requireEnv('STANDARD_USERNAME'),
        password: requireEnv('STANDARD_PASSWORD'),
    },
    LOCKED_OUT: {
        username: 'locked_out_user',
        password: requireEnv('STANDARD_PASSWORD'),
    },
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

export const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
    USERNAME_REQUIRED: 'Epic sadface: Username is required',
    PASSWORD_REQUIRED: 'Epic sadface: Password is required',
    LOCKED_OUT: 'Epic sadface: Sorry, this user has been locked out.',
    FIRST_NAME_REQUIRED: 'Error: First Name is required',
    LAST_NAME_REQUIRED: 'Error: Last Name is required',
    POSTAL_CODE_REQUIRED: 'Error: Postal Code is required'
} as const;
