# SauceLab Test Automation

This is a personal project to demonstrate Playwright skills by automating tests for the Sauce Demo application. The Sauce Demo is a sample e-commerce website provided by Sauce Labs for testing purposes.

## Features

- End-to-end testing of login, inventory, cart, and checkout functionalities
- Page Object Model implementation for maintainable test code
- Cross-browser testing support (Chromium, Firefox, WebKit)
- Authentication setup for logged-in tests
- Test data management

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd saucelab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and set the base URL:
   ```
   BASE_URL=https://www.saucedemo.com
   ```

## Project Structure

- `pages/` - Page Object Model classes for different application pages
- `tests/` - Test specifications organized by functionality
- `test-data/` - Test data and constants
- `playwright/` - Authentication state storage
- `playwright-report/` - Generated test reports
- `test-results/` - Test execution results

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run tests in a specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run specific test file
```bash
npx playwright test tests/loginPage.noauth.spec.ts
```

### Run tests with UI mode
```bash
npx playwright test --ui
```

### Generate and view HTML report
```bash
npx playwright show-report
```

## Test Configuration

The tests are configured in `playwright.config.ts` with the following features:
- Parallel test execution
- Automatic retries on CI
- Trace collection on failures
- Authentication setup for dependent tests

## Contributing

1. Follow the Page Object Model pattern for new page interactions
2. Add test data to `test-data/testData.ts`
3. Ensure tests are independent and can run in parallel
4. Update this README if adding new features or changing setup

## Troubleshooting

- Ensure the `.env` file is properly configured with the correct BASE_URL
- For authentication-related tests, the setup project runs first to establish login state
- Check the HTML report in `playwright-report/` for detailed test results and screenshots