/**
 * =======================
 * CART & BUNDLE LOGIC
 * =======================
 * This module handles the persistent cart state, pricing variants (A6-A3),
 * and automatic bundle offers (5+1, 7+2, 10+3).
 */

const CART_KEY = 'wallifyCart';
const MIN_POSTERS = 5;

// Pricing per size
const SIZE_PRICES = {
    'A6': 17,
    'A5': 33,
    'A4': 49,
    'A3': 99
};

// Bundle rules: [qty_threshold, num_free]
const BUNDLE_RULES = [
    { qty: 10, free: 3 },
    { qty: 7,  free: 2 },
    { qty: 5,  free: 1 }
];

export function getCart() {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
}

export function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // Dispatch a custom event so UI can update reactively
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
}

/**
 * Adds a poster to the cart with a specific size.
 * Unique combo is (productId + size).
 */
export function addToCart(product, size = 'A5') {
    const cart = getCart();
    const variantId = `${product.id}-${size}`;
    const price = SIZE_PRICES[size] || 33;
    
    const existing = cart.find(item => item.variantId === variantId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            variantId,
            productId: product.id,
            title: product.title,
            image: product.image,
            category: product.category,
            size: size,
            price: price,
            quantity: 1
        });
    }
    saveCart(cart);
}

export function updateQuantity(variantId, change) {
    let cart = getCart();
    const item = cart.find(i => i.variantId === variantId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.variantId !== variantId);
        }
        saveCart(cart);
    }
}

export function removeFromCart(variantId) {
    let cart = getCart();
    cart = cart.filter(i => i.variantId !== variantId);
    saveCart(cart);
}

/**
 * Calculates the total, free items, and final amount.
 * Logic: The cheapest items in the cart are marked as FREE based on quantity.
 */
export function calculateCartTotals() {
    const cart = getCart();
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    // Determine how many items are free based on total count
    let numFree = 0;
    for (const rule of BUNDLE_RULES) {
        if (totalItems >= rule.qty) {
            numFree = rule.free;
            break;
        }
    }

    // Flatten items to apply discounts to individual units
    const allUnits = [];
    cart.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
            allUnits.push({ price: item.price, variantId: item.variantId });
        }
    });

    // Sort by price (cheapest first) to mark cheapest as free
    allUnits.sort((a, b) => a.price - b.price);

    let subtotal = 0;
    let discount = 0;
    
    allUnits.forEach((unit, index) => {
        subtotal += unit.price;
        if (index < numFree) {
            discount += unit.price;
        }
    });

    return {
        totalItems,
        numFree,
        subtotal,
        discount,
        totalPayable: subtotal - discount,
        canCheckout: totalItems >= MIN_POSTERS,
        minPostersNeeded: MIN_POSTERS
    };
}
