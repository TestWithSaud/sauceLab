# SauceLab Test Automation

A Playwright test automation project for the [Sauce Demo](https://www.saucedemo.com) application, demonstrating modern testing patterns and best practices.

## Tech Stack

- [Playwright](https://playwright.dev) — test framework and browser automation
- TypeScript
- dotenv — environment variable management
- GitHub Actions — CI/CD

## Features

- Page Object Model with a centralized `PageManager`
- Semantic locators (`getByRole`, `getByPlaceholder`, `getByText`, `getByAltText`)
- Per-browser authentication — each browser authenticates independently and stores its own session
- Visual regression testing with OS-aware screenshot baselines (Linux for CI, macOS for local)
- Test tagging for selective test execution (`@smoke`, `@login`, `@checkout`, `@regression`, `@visual`)
- Cross-browser support: Chromium, Firefox, WebKit
- CI-optimized: 2 workers, chromium-only on GitHub Actions, browser caching

## Project Structure

```
├── pages/                    # Page Object Model classes
│   ├── PageManager.ts        # Central access point for all pages
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutStepOnePage.ts
│   ├── CheckoutStepTwoPage.ts
│   └── CheckoutCompletePage.ts
├── tests/
│   ├── auth.setup.ts         # Authentication setup (runs before authenticated tests)
│   ├── loginPage.noauth.spec.ts   # Login page tests (no auth required)
│   ├── checkout.spec.ts      # End-to-end checkout flow tests
│   └── visual.spec.ts        # Visual regression tests
├── test-data/
│   └── testData.ts           # Test users, checkout info, constants
├── playwright/.auth/         # Stored browser auth states (gitignored)
│   ├── chromium.json
│   ├── firefox.json
│   └── webkit.json
├── .github/workflows/
│   ├── playwright.yml        # Main CI — runs on push/PR (chromium only)
│   └── update-snapshots.yml  # Manual workflow to regenerate visual baselines on Linux
└── playwright.config.ts
```

## Setup

**Prerequisites:** Node.js 18+

1. Clone the repository and install dependencies:
   ```bash
   git clone <repository-url>
   cd sauceLab
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

3. Create a `.env` file in the root directory:
   ```
   BASE_URL=https://www.saucedemo.com/
   STANDARD_USERNAME=standard_user
   STANDARD_PASSWORD=secret_sauce
   ```

## Running Tests

### All tests (all browsers)
```bash
npx playwright test
```

### Chromium only (matches CI)
```bash
npx playwright test --project=setup-chromium --project=chromium --project=chromium-noauth
```

### Specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### By tag
```bash
npx playwright test --grep "@smoke"
npx playwright test --grep "@login"
npx playwright test --grep "@checkout"
npx playwright test --grep "@regression"
npx playwright test --grep "@visual"
```

### Skip visual tests
```bash
npx playwright test --grep-invert "@visual"
```

### UI mode (interactive)
```bash
npx playwright test --ui
```

### View HTML report
```bash
npx playwright show-report
```

## Visual Regression

Screenshot baselines are stored in `tests/visual.spec.ts-snapshots/` with OS-specific filenames (e.g. `inventory-chromium-linux.png`, `inventory-chromium-darwin.png`).

- **Local (macOS):** baselines are generated and compared automatically
- **CI (Linux):** uses the linux baselines committed via the update-snapshots workflow

To regenerate baselines after an intentional UI change, trigger the **Update Visual Snapshots** workflow manually from GitHub Actions. It runs on Linux, updates the snapshots, and commits them back to the repo.

## CI

The main workflow (`.github/workflows/playwright.yml`) runs on every push and pull request to `main`:

- Installs chromium only (faster install)
- Caches the browser binary between runs
- Runs `setup-chromium`, `chromium`, and `chromium-noauth` projects
- Uploads the HTML report as an artifact (retained 30 days)
- Uploads screenshot diffs as an artifact on failure (retained 7 days)

Required GitHub secrets: `BASE_URL`, `STANDARD_USERNAME`, `STANDARD_PASSWORD`

## Authentication

Tests that require a logged-in session depend on a setup project (`auth.setup.ts`) that runs first. Each browser authenticates independently and saves its session to `playwright/.auth/<browser>.json`. Authenticated tests load this state via `storageState` in the project config — no login step needed in the tests themselves.

Tests in `*.noauth.spec.ts` files bypass authentication entirely and run directly against the login page.
