# SauceLab Test Automation

A Playwright test automation project for the [Sauce Demo](https://www.saucedemo.com) application, demonstrating modern testing patterns and best practices.

## Tech Stack

- [Playwright](https://playwright.dev) — test framework and browser automation
- TypeScript
- dotenv — environment variable management
- GitHub Actions — CI/CD

## Features

- Page Object Model with a centralized `PageManager`
- User-facing locators (`getByRole`, `getByPlaceholder`), falling back to `data-test` where an element has no accessible name
- Per-browser authentication — each browser authenticates independently and stores its own session
- Visual regression testing with OS-aware screenshot baselines (Linux for CI, macOS for local)
- Reproducible randomized test data — seeded selection replayable via `TEST_SEED`
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
│   ├── CheckoutCompletePage.ts
│   ├── ProductDetailPage.ts
│   └── HamburgerMenuPage.ts
├── tests/
│   ├── auth.setup.ts         # Authentication setup (runs before authenticated tests)
│   ├── *.noauth.spec.ts      # Tests that run logged out (login, unauth access, other users)
│   ├── checkout*.spec.ts     # Checkout flow, cancellation, completion
│   ├── cart*.spec.ts         # Cart contents, quantities, edge cases
│   ├── inventory*.spec.ts    # Product listing, sorting, button interactions
│   └── visual.spec.ts        # Visual regression (chromium only)
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

   All three are required. If a credential is missing, the suite fails immediately at import naming the variable, rather than surfacing later as an unrelated timeout.

## Running Tests

### npm scripts (shortcuts for the common cases)
```bash
npm test                    # all tests, all browsers
npm run test:smoke          # @smoke only
npm run test:regression     # @regression only
npm run test:chromium       # chromium projects only (matches CI)
npm run test:visual         # visual regression
npm run test:visual:update  # regenerate local (macOS) baselines
npm run report              # open the HTML report
```

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

Playwright keys every baseline by **project and operating system**, because font rasterization differs between macOS and Linux — the same page never matches across platforms. Each screenshot therefore needs one baseline per OS:

- **Local (macOS):** compares against the `-darwin` baselines
- **CI (Linux):** compares against the `-linux` baselines, committed by the update-snapshots workflow

Visual tests run on **chromium only** — the `firefox` and `webkit` projects ignore `visual.spec.ts`. Cross-browser visual baselines would mean six sets per screenshot to maintain, mostly catching engine font differences rather than bugs, and CI installs chromium only. Functional coverage still runs on all three browsers.

After an intentional UI change, both platforms need updating:

1. **macOS:** `npm run test:visual:update`, then commit the changed `-darwin` files
2. **Linux:** trigger the **Update Visual Snapshots** workflow from GitHub Actions — it runs on Linux, regenerates the `-linux` baselines, and commits them back

Note that this suite screenshots a live third-party site, so upstream changes to saucedemo will legitimately fail these tests until the baselines are refreshed.

## CI

The main workflow (`.github/workflows/playwright.yml`) runs on every push and pull request to `main`:

- Installs chromium only (faster install)
- Caches the browser binary between runs
- Runs `setup-chromium`, `chromium`, and `chromium-noauth` projects
- Uploads the HTML report as an artifact (retained 30 days)
- Uploads screenshot diffs as an artifact on failure (retained 7 days)

Required GitHub secrets: `BASE_URL`, `STANDARD_USERNAME`, `STANDARD_PASSWORD`

## Reproducing a Failed Run

Several checkout tests pick products at random via `InventoryPage.addRandomProductsToCart()`. Selection is driven by a seeded PRNG rather than `Math.random()`, so any run can be replayed exactly.

The seed is attached to each test as an annotation and appears in the HTML report. To replay that run:

```bash
TEST_SEED=12345 npx playwright test tests/checkout.spec.ts
```

Leave `TEST_SEED` unset for normal runs — a fresh seed is generated each time, preserving randomized coverage. Do not put it in `.env`, or every run pins to the same products.

## Authentication

Tests that require a logged-in session depend on a setup project (`auth.setup.ts`) that runs first. Each browser authenticates independently and saves its session to `playwright/.auth/<browser>.json`. Authenticated tests load this state via `storageState` in the project config — no login step needed in the tests themselves.

Tests in `*.noauth.spec.ts` files bypass authentication entirely and run directly against the login page.
