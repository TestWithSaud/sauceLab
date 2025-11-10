import { test, expect } from '@playwright/test';
import { PageManager } from '../pages/PageManager';
import { TEST_USERS, CHECKOUT_INFO } from '../test-data/testData';

/**
 * Test Suite: End-to-End Checkout Flow with PageManager
 * This suite demonstrates the PageManager pattern for centralized page object management
 */
test.describe('E2E Checkout Flow - 3 Random Items (Using PageManager)', () => {
    let pm: PageManager;

    /**
     * Before each test: Navigate to inventory and ensure clean state
     * This prevents cart persistence between tests
     */
    test.beforeEach(async ({ page }) => {
        pm = new PageManager(page);

        // Navigate to inventory page
        await pm.inventoryPage.open();

        // Always go to cart to check if it actually has items
        // (Badge might not be accurate)
        await pm.inventoryPage.goToCart();
        await page.waitForURL(/.*cart.html/);

        // Get actual cart items count
        const itemsInCart = await pm.cartPage.getCartItemCount();

        if (itemsInCart > 0) {
            // Remove each item one by one
            for (let i = 0; i < itemsInCart; i++) {
                await pm.cartPage.removeItemByIndex(i);
            }
        } else {
        }

        // Navigate back to inventory
        await pm.inventoryPage.open();
    });

    /**
     * Test Case: Complete checkout flow with 3 random products
     * 
     * Objective: Validate that a user can successfully complete a purchase 
     * by selecting 3 random items and completing the checkout process
     * 
     * Preconditions:
     * - Browser is open with authenticated session (from auth.setup.ts)
     * - Test user is already logged in as standard user
     * - Sauce Demo application is accessible
     * 
     * Priority: Critical
     * 
     * Test Steps:
     * 1. Navigate directly to inventory page (already authenticated)
     * 2. Verify user is on inventory page
     * 3. Select 3 random products from the inventory
     * 4. Verify cart badge shows correct count (3)
     * 5. Navigate to shopping cart
     * 6. Verify all 3 selected items are in the cart
     * 7. Proceed to checkout
     * 8. Fill in customer information (first name, last name, postal code)
     * 9. Continue to checkout overview
     * 10. Verify order summary displays all items and correct pricing
     * 11. Complete the checkout
     * 12. Verify order confirmation page is displayed
     * 
     * Expected Results:
     * - User is already authenticated (no login needed)
     * - 3 random products are added to cart
     * - Cart displays correct number of items
     * - All selected products appear in cart and checkout
     * - Checkout information is accepted
     * - Order summary shows correct items and pricing
     * - Order completion is confirmed with success message
     * - User sees "Thank you for your order!" message
     */
    test('should successfully complete checkout with 3 random items', async ({ page }) => {
        const itemCountToSelect = 3;
        // PageManager already initialized in beforeEach

        // Step 1: Verify we're on inventory page
        expect(await pm.inventoryPage.getCurrentURL()).toContain('inventory.html');
        expect(await pm.inventoryPage.getPageTitle()).toBe('Products');

        // Step 2: Select 3 random products
        const selectedProducts = await pm.inventoryPage.addRandomProductsToCart(itemCountToSelect);

        selectedProducts.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - ${product.price}`);
        });

        // Step 3: Verify cart badge shows 3 items
        expect(await pm.inventoryPage.getCartCount()).toBe(itemCountToSelect);
        expect(await pm.inventoryPage.isCartBadgeVisible()).toBeTruthy();

        // Step 4: Navigate to cart
        await pm.inventoryPage.goToCart();

        // Step 5: Verify all 3 items are in cart
        expect(await pm.cartPage.getCurrentURL()).toContain('cart.html');
        expect(await pm.cartPage.getPageTitle()).toBe('Your Cart');
        expect(await pm.cartPage.getCartItemCount()).toBe(itemCountToSelect);

        // Verify each selected product is in the cart
        const cartItems = await pm.cartPage.getAllItemNames();
        const selectedProductNames = selectedProducts.map(p => p.name);
        expect(await pm.cartPage.areItemsInCart(selectedProductNames)).toBeTruthy();

        // Step 6: Proceed to checkout
        await pm.cartPage.proceedToCheckout();
        await pm.checkoutStepOnePage.waitForPageLoad();

        // Step 7: Fill in customer information
        expect(await pm.checkoutStepOnePage.getCurrentURL()).toContain('checkout-step-one.html');
        expect(await pm.checkoutStepOnePage.getPageTitle()).toBe('Checkout: Your Information');

        await pm.checkoutStepOnePage.fillCheckoutInformation(CHECKOUT_INFO.VALID);

        // Step 8: Continue to checkout overview
        await pm.checkoutStepOnePage.clickContinue();

        // Step 9: Verify order summary
        expect(await pm.checkoutStepTwoPage.getCurrentURL()).toContain('checkout-step-two.html');
        expect(await pm.checkoutStepTwoPage.getPageTitle()).toBe('Checkout: Overview');

        // Verify all items are in the order
        expect(await pm.checkoutStepTwoPage.getItemCount()).toBe(3);
        expect(await pm.checkoutStepTwoPage.areItemsInOrder(selectedProductNames)).toBeTruthy();

        // Verify payment and shipping information
        const paymentInfo = await pm.checkoutStepTwoPage.getPaymentInformation();
        const shippingInfo = await pm.checkoutStepTwoPage.getShippingInformation();
        expect(paymentInfo).toBeTruthy();
        expect(shippingInfo).toBeTruthy();


        // Verify price calculation
        const priceSummary = await pm.checkoutStepTwoPage.getPriceSummary();

        expect(priceSummary.subtotal).toBeGreaterThan(0);
        expect(priceSummary.tax).toBeGreaterThan(0);
        expect(priceSummary.total).toBeGreaterThan(0);

        // Verify price calculation is correct (subtotal + tax = total)
        expect(await pm.checkoutStepTwoPage.isPriceCalculationCorrect()).toBeTruthy();

        // Step 10: Complete the checkout
        await pm.checkoutStepTwoPage.clickFinish();

        // Step 11: Verify order confirmation
        expect(await pm.checkoutCompletePage.getCurrentURL()).toContain('checkout-complete.html');
        expect(await pm.checkoutCompletePage.getPageTitle()).toBe('Checkout: Complete!');

        const confirmationHeader = await pm.checkoutCompletePage.getCompleteHeader();
        expect(confirmationHeader).toContain('Thank you for your order');

        expect(await pm.checkoutCompletePage.isPonyExpressImageVisible()).toBeTruthy();
        expect(await pm.checkoutCompletePage.isCheckoutSuccessful()).toBeTruthy();

    });

    /**
     * Test Case: Verify cart persistence through checkout flow
     * 
     * Objective: Validate that selected items remain in cart throughout 
     *            the entire checkout process
     * 
     * Preconditions:
     * - Browser is open with authenticated session (from auth.setup.ts)
     * - User is already logged in as standard_user
     * 
     * Priority: High
     * 
     * Test Steps:
     * 1. Navigate to inventory page (already authenticated)
     * 2. Add 3 random products to cart
     * 3. Note the product names
     * 4. Navigate through each checkout step
     * 5. Verify products remain consistent at each step
     * 
     * Expected Results:
     * - Products selected in inventory appear in cart
     * - Same products appear in checkout overview
     * - Product count remains 3 throughout the flow
     */
    test('should maintain cart items consistency through checkout flow', async ({ page }) => {
        // PageManager already initialized in beforeEach
        // Already on inventory page with clean cart

        // Add 3 random products and store their names
        const selectedProducts = await pm.inventoryPage.addRandomProductsToCart(3);
        const selectedProductNames = selectedProducts.map(p => p.name);

        // Verify in cart page
        await pm.inventoryPage.goToCart();
        const cartItems = await pm.cartPage.getAllItemNames();
        expect(cartItems).toEqual(expect.arrayContaining(selectedProductNames));

        // Verify in checkout overview
        await pm.cartPage.proceedToCheckout();
        await pm.checkoutStepOnePage.waitForPageLoad();
        await pm.checkoutStepOnePage.completeCheckoutStepOne(CHECKOUT_INFO.VALID);

        const orderItems = await pm.checkoutStepTwoPage.getAllItemNames();
        expect(orderItems).toEqual(expect.arrayContaining(selectedProductNames));
        expect(await pm.checkoutStepTwoPage.getItemCount()).toBe(3);

    });

    /**
     * Test Case: Verify price calculation accuracy
     * 
     * Objective: Validate that price calculations (subtotal, tax, total) 
     *            are accurate in checkout overview
     * 
     * Preconditions:
     * - Browser is open with authenticated session (from auth.setup.ts)
     * - User is already logged in
     * 
     * Priority: High
     * 
     * Test Steps:
     * 1. Navigate to inventory and add 3 random products
     * 2. Proceed to checkout overview
     * 3. Capture subtotal, tax, and total amounts
     * 4. Verify subtotal + tax equals total
     * 5. Verify all amounts are positive numbers
     * 
     * Expected Results:
     * - Subtotal is the sum of item prices
     * - Tax is calculated correctly
     * - Total equals subtotal plus tax
     * - No negative or zero values (for non-empty cart)
     */
    test('should calculate prices correctly in checkout overview', async ({ page }) => {
        // PageManager already initialized in beforeEach
        // Already on inventory page with clean cart

        // Add products
        const selectedProducts = await pm.inventoryPage.addRandomProductsToCart(3);

        // Calculate expected subtotal from selected products
        let expectedSubtotal = 0;
        selectedProducts.forEach(product => {
            const price = parseFloat(product.price.replace('$', ''));
            expectedSubtotal += price;
        });

        // Navigate to checkout overview
        await pm.inventoryPage.goToCart();
        await pm.cartPage.proceedToCheckout();
        await pm.checkoutStepOnePage.waitForPageLoad();
        await pm.checkoutStepOnePage.completeCheckoutStepOne(CHECKOUT_INFO.VALID);

        // Get price summary
        const priceSummary = await pm.checkoutStepTwoPage.getPriceSummary();

        // Verify subtotal matches expected
        expect(priceSummary.subtotal).toBeCloseTo(expectedSubtotal, 2);

        // Verify all amounts are positive
        expect(priceSummary.subtotal).toBeGreaterThan(0);
        expect(priceSummary.tax).toBeGreaterThan(0);
        expect(priceSummary.total).toBeGreaterThan(0);

        // Verify calculation: subtotal + tax = total
        const calculatedTotal = priceSummary.subtotal + priceSummary.tax;
        expect(calculatedTotal).toBeCloseTo(priceSummary.total, 2);

        expect(await pm.checkoutStepTwoPage.isPriceCalculationCorrect()).toBeTruthy();

    });

    /**
     * Test Case: Verify checkout can be completed with different user
     * 
     * Objective: Validate checkout works with performance_glitch_user
     * 
     * Preconditions:
     * - Browser is open with authenticated session (from auth.setup.ts)
     * - User is already logged in
     * 
     * Priority: Medium
     * 
     * Test Steps:
     * 1. Navigate to inventory (already authenticated)
     * 2. Add 3 random products
     * 3. Complete full checkout flow
     * 4. Verify order completion
     * 
     * Expected Results:
     * - Checkout completes successfully
     * - All steps work as expected
     * 
     * Note: This test uses standard_user authentication.
     * To test with performance_glitch_user, create separate auth state.
     */
    test('should complete checkout successfully', async ({ page }) => {
        // PageManager already initialized in beforeEach
        // Already on inventory page with clean cart

        // Add products and complete checkout
        await pm.inventoryPage.addRandomProductsToCart(3);
        await pm.inventoryPage.goToCart();
        await pm.cartPage.proceedToCheckout();
        await pm.checkoutStepOnePage.waitForPageLoad();
        await pm.checkoutStepOnePage.completeCheckoutStepOne(CHECKOUT_INFO.VALID);
        await pm.checkoutStepTwoPage.clickFinish();

        // Verify completion
        expect(await pm.checkoutCompletePage.getCurrentURL()).toContain('checkout-complete.html');
        expect(await pm.checkoutCompletePage.isCheckoutSuccessful()).toBeTruthy();

    });
});