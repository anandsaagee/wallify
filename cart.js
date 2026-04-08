/**
 * cart.js — Wallify Store
 * Core e-commerce logic: Cart state, Pricing, Bundle Discounts.
 */

const WA_BUSINESS_PHONE = "917736497186";

const SIZES = {
    'A6': { label: 'A6', price: 17 },
    'A5': { label: 'A5', price: 33 },
    'A4': { label: 'A4', price: 49 },
    'A3': { label: 'A3', price: 99 }
};

function getCart() {
    try {
        return JSON.parse(localStorage.getItem('wallify_cart')) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('wallify_cart', JSON.stringify(cart));
    // Dispatch event for UI sync
    window.dispatchEvent(new CustomEvent('cart_updated', { detail: cart }));
}

/**
 * addProduct — Adds or updates an item in the cart
 * variantId is a combination of productId and size
 */
function addProduct(product, size = 'A5', quantity = 1) {
    const cart = getCart();
    const variantId = `${product.id}-${size}`;
    const existing = cart.find(item => item.variantId === variantId);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            variantId,
            productId: product.id,
            title: product.title,
            image: product.image,
            category: product.category,
            size: size,
            price: SIZES[size].price,
            quantity: quantity
        });
    }
    saveCart(cart);
}

function updateQuantity(variantId, delta) {
    let cart = getCart();
    const item = cart.find(i => i.variantId === variantId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.variantId !== variantId);
        }
        saveCart(cart);
    }
}

function removeFromCart(variantId) {
    const cart = getCart().filter(i => i.variantId !== variantId);
    saveCart(cart);
}

/**
 * calculateTotals — Computes subtotal, bundle discounts, and final total.
 * Bundle Rules:
 * Buy 5 Get 1 Free | Buy 7 Get 2 Free | Buy 10 Get 3 Free
 */
function calculateTotals() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create a flat list of all item prices to find the cheapest ones
    let allPrices = [];
    cart.forEach(item => {
        for(let i=0; i<item.quantity; i++) {
            allPrices.push(item.price);
        }
    });
    allPrices.sort((a, b) => a - b);

    let freeCount = 0;
    if (totalItems >= 20) freeCount = 5;
    else if (totalItems >= 10) freeCount = 3;
    else if (totalItems >= 7) freeCount = 2;
    else if (totalItems >= 5) freeCount = 1;

    const isMinOrderMet = totalItems >= 3;

    const discount = allPrices.slice(0, freeCount).reduce((sum, p) => sum + p, 0);
    const finalTotal = subtotal - discount;

    return {
        totalItems,
        subtotal,
        discount,
        finalTotal,
        freeCount,
        isMinOrderMet,
        items: cart
    };
}

function formatWhatsAppMessage(customerDetails) {
    const totals = calculateTotals();
    const itemsList = totals.items.map((item, idx) => 
        `${idx + 1}. ${item.title} (${item.size}) x${item.quantity} — ₹${item.price * item.quantity}`
    ).join('\n');

    const message = `*NEW ORDER FROM WALLIFY STORE* 🛍️\n\n` +
        `*Items:*\n${itemsList}\n\n` +
        `*Pricing Summary:*\n` +
        `Subtotal: ₹${totals.subtotal}\n` +
        `Bundle Discount: -₹${totals.discount} (${totals.freeCount} free)\n` +
        `*Total Payable: ₹${totals.finalTotal}*\n\n` +
        `*Customer Details:*\n` +
        `Name: ${customerDetails.name}\n` +
        `Phone: ${customerDetails.phone}\n` +
        `Address: ${customerDetails.address}\n` +
        `Pincode: ${customerDetails.pincode}\n\n` +
        `_Order generated via Wallify Store Web_`;

    return `https://wa.me/${WA_BUSINESS_PHONE}?text=${encodeURIComponent(message)}`;
}
