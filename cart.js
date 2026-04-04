/**
 * CART & BUNDLE STATE MANAGEMENT
 */
const STORAGE_KEY = 'wallify_cart_v1';
const MIN_POSTERS = 5;

// Bundle rules: [qty_threshold, num_free]
const BUNDLE_RULES = [
    { qty: 10, free: 3 },
    { qty: 7,  free: 2 },
    { qty: 5,  free: 1 }
];

export function getCart() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

export function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    // Trigger update on any listeners
    window.dispatchEvent(new CustomEvent('cart_sync', { detail: cart }));
}

/**
 * Add or increment item with specific ID and Size
 */
export function addToCart(product, size = 'A5', price = 33) {
    const cart = getCart();
    const variantId = `${product.id}-${size}`;
    
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
            size,
            price,
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

/**
 * Core calculation logic for price and free posters
 */
export function calculateTotals() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    let numFree = 0;
    for (const rule of BUNDLE_RULES) {
        if (totalItems >= rule.qty) {
            numFree = rule.free;
            break;
        }
    }

    // Mark cheapest units as free
    const allUnits = [];
    cart.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
            allUnits.push({ price: item.price });
        }
    });

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
        minNeeded: MIN_POSTERS
    };
}
