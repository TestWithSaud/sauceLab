# SauceDemo - Gap Test Plan

## Application Overview

SauceDemo (https://www.saucedemo.com) is a reference e-commerce application used for test automation practice. It consists of a login page, an inventory listing page, a product detail page, a shopping cart, a two-step checkout flow, and a post-checkout confirmation page. A persistent hamburger menu is available on all authenticated pages.

This plan covers **only the scenarios not addressed** by the existing test suite. All scenarios assume a fresh browser state (no stored session, no cookies) unless stated otherwise. Authenticated scenarios use `standard_user` / `secret_sauce` unless stated otherwise.

---

## Test Scenarios

### 1. Product Detail Page

**Seed:** `tests/seed.spec.ts`

#### 1.1 Display of Product Details

**Preconditions:** User is logged in and on the inventory page.

**Steps:**
1. Click the product image of the first item in the inventory list.
2. Observe the product detail page.

**Expected Results:**
- URL changes to `inventory-item.html` with a query parameter identifying the product.
- Product name is displayed and matches the name shown on the inventory card.
- Product description text is visible and non-empty.
- Product price is visible and matches the price shown on the inventory card.
- Product image is visible.

---

#### 1.2 Navigate to Product Detail via Image Link

**Preconditions:** User is logged in and on the inventory page.

**Steps:**
1. Click the product image (not the product name) of any item.

**Expected Results:**
- Navigation goes to the product detail page for the clicked item.
- URL matches `inventory-item.html`.
- Product name, price, description, and image are all visible.

---

#### 1.3 Add Item to Cart from Product Detail Page

**Preconditions:** User is logged in. Cart is empty. User is on the product detail page of any item.

**Steps:**
1. Navigate to the inventory page.
2. Click the product name of the first item to open its detail page.
3. Click the "Add to cart" button on the detail page.

**Expected Results:**
- The "Add to cart" button changes to a "Remove" button.
- The shopping cart badge appears in the header showing "1".
- User remains on the product detail page (no automatic redirect).

---

#### 1.4 Remove Item from Cart on Product Detail Page

**Preconditions:** User is logged in. One item has been added to the cart via the inventory page. User is on the product detail page for that same item.

**Steps:**
1. Navigate to the inventory page.
2. Add the first item to the cart using the "Add to cart" button on the inventory card.
3. Click the product name of that item to open its detail page.
4. Click the "Remove" button on the detail page.

**Expected Results:**
- The "Remove" button changes back to "Add to cart".
- The shopping cart badge disappears (or decrements to 0).
- User remains on the product detail page.

---

#### 1.5 Back Button Returns to Inventory

**Preconditions:** User is logged in and has navigated to a product detail page from the inventory.

**Steps:**
1. Navigate to the inventory page.
2. Click the product name of any item to open its detail page.
3. Click the "Back to products" button.

**Expected Results:**
- User is returned to the inventory page (`inventory.html`).
- The page title reads "Products".
- All 6 product cards are displayed.

---

### 2. Inventory Page — Untested Interactions

**Seed:** `tests/seed.spec.ts`

#### 2.1 Add to Cart Button Toggles to Remove

**Preconditions:** User is logged in and on the inventory page. Cart is empty.

**Steps:**
1. Locate any product card.
2. Confirm the button on that card reads "Add to cart".
3. Click the "Add to cart" button on that card.

**Expected Results:**
- The button text on that specific card changes to "Remove".
- All other cards still show "Add to cart".
- The cart badge shows "1".

---

#### 2.2 Remove Button on Inventory Card Removes Item

**Preconditions:** User is logged in. One item has already been added to the cart from the inventory page (button now reads "Remove").

**Steps:**
1. Click the "Remove" button on the product card that was previously added.

**Expected Results:**
- The button text changes back to "Add to cart".
- The cart badge count decrements by 1 (or disappears if the cart is now empty).
- No page navigation occurs.

---

### 3. Cart Page — Empty State and Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 3.1 Empty Cart Displays No Items and Correct Labels

**Preconditions:** User is logged in. Cart is empty.

**Steps:**
1. Navigate directly to `/cart.html`.

**Expected Results:**
- Page title reads "Your Cart".
- No cart items are listed.
- The "Continue Shopping" button is visible.
- The "Checkout" button is visible.

---

#### 3.2 Clicking Checkout from an Empty Cart

**Preconditions:** User is logged in. Cart is empty.

**Steps:**
1. Navigate to `/cart.html`.
2. Click the "Checkout" button.

**Expected Results:**
- The application navigates to the checkout step one page (`checkout-step-one.html`).

> Note: SauceDemo does not block checkout for an empty cart. This test documents the actual behavior so it can be flagged as a bug if the requirement is that checkout should be blocked when the cart is empty.

---

#### 3.3 Cart Item Name is a Clickable Link to Product Detail

**Preconditions:** User is logged in. At least one item has been added to the cart.

**Steps:**
1. Add any item to the cart from the inventory page.
2. Navigate to the cart page.
3. Click the item name in the cart.

**Expected Results:**
- Navigation goes to the product detail page for that item (`inventory-item.html`).
- The correct product name, price, and description are displayed.

---

### 4. Hamburger Menu / Sidebar Navigation

**Seed:** `tests/seed.spec.ts`

#### 4.1 Hamburger Menu Opens and Closes

**Preconditions:** User is logged in and on the inventory page.

**Steps:**
1. Click the hamburger menu icon (three horizontal lines) in the top-left corner.
2. Observe the sidebar.
3. Click the "X" (close) button inside the sidebar.

**Expected Results:**
- After step 2: A sidebar appears containing at minimum the links: "All Items", "About", "Logout", and "Reset App State".
- After step 3: The sidebar closes and is no longer visible.

---

#### 4.2 "All Items" Link Returns to Inventory

**Preconditions:** User is logged in and on any authenticated page (e.g., the cart page).

**Steps:**
1. Navigate to the cart page.
2. Click the hamburger menu icon.
3. Click "All Items" in the sidebar.

**Expected Results:**
- User is navigated to the inventory page (`inventory.html`).
- The page title reads "Products".
- All 6 product cards are visible.
- The sidebar is closed.

---

#### 4.3 "About" Link Navigates to Sauce Labs Website

**Preconditions:** User is logged in and on the inventory page.

**Steps:**
1. Click the hamburger menu icon.
2. Click "About" in the sidebar.

**Expected Results:**
- The browser navigates to the Sauce Labs website (URL contains `saucelabs.com`).

---

#### 4.4 "Logout" Ends the Session

**Preconditions:** User is logged in and on the inventory page.

**Steps:**
1. Click the hamburger menu icon.
2. Click "Logout" in the sidebar.

**Expected Results:**
- User is redirected to the login page (root URL `/`).
- The username and password fields are visible and empty.
- Attempting to navigate back to `/inventory.html` redirects to the login page (session is invalidated).

---

#### 4.5 "Reset App State" Clears Cart Contents

**Preconditions:** User is logged in. Two or more items have been added to the cart.

**Steps:**
1. Navigate to the inventory page.
2. Add two items to the cart (cart badge shows "2").
3. Click the hamburger menu icon.
4. Click "Reset App State" in the sidebar.
5. Close the sidebar by clicking the "X" button or clicking away.

**Expected Results:**
- The cart badge disappears (count resets to 0).
- All "Remove" buttons on inventory cards revert to "Add to cart".
- Navigating to the cart page shows no items.

---

#### 4.6 "Reset App State" Does Not Log Out the User

**Preconditions:** User is logged in and on the inventory page.

**Steps:**
1. Click the hamburger menu icon.
2. Click "Reset App State".
3. Close the sidebar.

**Expected Results:**
- User remains on the inventory page.
- The page title still reads "Products".
- User is still authenticated (no redirect to login page).

---

### 5. Checkout — Cancel Flows

**Seed:** `tests/seed.spec.ts`

#### 5.1 Cancel on Checkout Step One Returns to Cart

**Preconditions:** User is logged in. One item is in the cart. User is on the checkout step one page.

**Steps:**
1. Add any item to the cart from the inventory page.
2. Navigate to the cart page.
3. Click "Checkout".
4. On the "Checkout: Your Information" page, click the "Cancel" button without filling in any fields.

**Expected Results:**
- User is navigated back to the cart page (`cart.html`).
- The page title reads "Your Cart".
- The previously added item is still present in the cart.

---

#### 5.2 Cancel on Checkout Step Two Returns to Inventory

**Preconditions:** User is logged in. One item is in the cart. User has completed step one and is on the checkout overview page.

**Steps:**
1. Add any item to the cart from the inventory page.
2. Navigate to the cart, click "Checkout".
3. Fill in valid information (First Name: "John", Last Name: "Doe", Postal Code: "12345") and click "Continue".
4. On the "Checkout: Overview" page, click the "Cancel" button.

**Expected Results:**
- User is navigated back to the inventory page (`inventory.html`).
- The page title reads "Products".

---

#### 5.3 Error Message on Checkout Step One Can Be Dismissed

**Preconditions:** User is logged in. At least one item is in the cart. User is on the checkout step one page with a validation error displayed (e.g., clicked Continue without filling any fields).

**Steps:**
1. Add any item to the cart from the inventory page.
2. Navigate to the cart and click "Checkout".
3. Click the "Continue" button without filling in any fields.
4. Verify the error message is visible.
5. Click the "X" (close) button on the error message container.

**Expected Results:**
- The error message is no longer visible.
- The form fields remain on the page and are interactable.
- User is still on the checkout step one page.

---

### 6. Checkout Complete Page — Post-Order Navigation

**Seed:** `tests/seed.spec.ts`

#### 6.1 "Back Home" Button Returns to Inventory

**Preconditions:** User is logged in. A checkout has been completed successfully (user is on the `checkout-complete.html` page).

**Steps:**
1. Complete a full checkout (add item, go to cart, checkout, fill info, finish).
2. On the "Checkout: Complete!" page, click the "Back Home" button.

**Expected Results:**
- User is navigated to the inventory page (`inventory.html`).
- The page title reads "Products".
- The cart badge is absent (cart is empty after completing the order).

---

### 7. Authentication — Other User Types (Login)

**Seed:** `tests/seed.spec.ts` (no-auth context)

#### 7.1 problem_user Can Log In

**Preconditions:** Browser is open on the login page. No session exists.

**Steps:**
1. Enter username "problem_user".
2. Enter password "secret_sauce".
3. Click "Login".

**Expected Results:**
- User is redirected to the inventory page (`inventory.html`).
- The page title reads "Products".

---

#### 7.2 performance_glitch_user Can Log In

**Preconditions:** Browser is open on the login page. No session exists.

**Steps:**
1. Enter username "performance_glitch_user".
2. Enter password "secret_sauce".
3. Click "Login".

**Expected Results:**
- User is eventually redirected to the inventory page (`inventory.html`) even if there is a noticeable delay.
- The page title reads "Products".

---

#### 7.3 error_user Can Log In

**Preconditions:** Browser is open on the login page. No session exists.

**Steps:**
1. Enter username "error_user".
2. Enter password "secret_sauce".
3. Click "Login".

**Expected Results:**
- User is redirected to the inventory page (`inventory.html`).
- The page title reads "Products".

---

#### 7.4 visual_user Can Log In

**Preconditions:** Browser is open on the login page. No session exists.

**Steps:**
1. Enter username "visual_user".
2. Enter password "secret_sauce".
3. Click "Login".

**Expected Results:**
- User is redirected to the inventory page (`inventory.html`).
- The page title reads "Products".

---

### 8. Direct URL Access While Unauthenticated

**Seed:** `tests/seed.spec.ts` (no-auth context)

#### 8.1 Accessing Inventory Page Without Login Redirects to Login

**Preconditions:** No active session. User has not logged in.

**Steps:**
1. Navigate directly to `https://www.saucedemo.com/inventory.html` in the browser.

**Expected Results:**
- User is redirected to the login page (root `/`).
- The login form is displayed.
- User is not granted access to the inventory.

---

#### 8.2 Accessing Cart Page Without Login Redirects to Login

**Preconditions:** No active session. User has not logged in.

**Steps:**
1. Navigate directly to `https://www.saucedemo.com/cart.html`.

**Expected Results:**
- User is redirected to the login page.
- The login form is displayed.

---

#### 8.3 Accessing Checkout Step One Without Login Redirects to Login

**Preconditions:** No active session. User has not logged in.

**Steps:**
1. Navigate directly to `https://www.saucedemo.com/checkout-step-one.html`.

**Expected Results:**
- User is redirected to the login page.
- The login form is displayed.

---

#### 8.4 Accessing Checkout Complete Without Login Redirects to Login

**Preconditions:** No active session. User has not logged in.

**Steps:**
1. Navigate directly to `https://www.saucedemo.com/checkout-complete.html`.

**Expected Results:**
- User is redirected to the login page.
- The login form is displayed.

---

### 9. Cart Page — Item Quantity Display

**Seed:** `tests/seed.spec.ts`

#### 9.1 Cart Item Quantity Displays as 1 for Each Item Added Once

**Preconditions:** User is logged in. Cart is empty.

**Steps:**
1. Add two different items to the cart from the inventory page.
2. Navigate to the cart page.

**Expected Results:**
- Each cart item row displays a quantity of "1".
- Two separate line items are shown (SauceDemo does not aggregate duplicate quantities; each add is a separate item, but this verifies the quantity column value for standard single additions).

---

### 10. Visual Regression — Gap Pages

**Seed:** `tests/seed.spec.ts`

#### 10.1 Product Detail Page Visual Snapshot

**Preconditions:** User is logged in.

**Steps:**
1. Navigate to the inventory page.
2. Click the name of the first product.
3. Wait for the product detail page to load.
4. Take a full-page screenshot and compare against the baseline.

**Expected Results:**
- The screenshot matches the approved baseline with no unexpected visual differences (within the configured `maxDiffPixels` threshold of 100).

---

#### 10.2 Empty Cart Page Visual Snapshot

**Preconditions:** User is logged in. Cart is empty.

**Steps:**
1. Navigate directly to `/cart.html`.
2. Take a full-page screenshot and compare against the baseline.

**Expected Results:**
- The screenshot matches the approved baseline with no unexpected visual differences.

---
