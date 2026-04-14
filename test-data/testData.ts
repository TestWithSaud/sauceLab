export const TEST_USERS = {
    STANDARD: {
        username: process.env.STANDARD_USERNAME,
        password: process.env.STANDARD_PASSWORD,
    },
    LOCKED_OUT: {
        username: 'locked_out_user',
        password: process.env.STANDARD_PASSWORD,
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
