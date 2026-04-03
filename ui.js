/**
 * =======================
 * UI COMPONENTS & RENDERING
 * =======================
 * This module handles the premium rendering of poster cards and the side cart panel.
 */

import { getCart, calculateCartTotals, updateQuantity, removeFromCart, addToCart } from './cart.js';

/**
 * Fisher-Yates Shuffle Algorithm
 * Ensures a high-quality random distribution on every refresh.
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Creates a premium poster card with inline size selection.
 */
export function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card reveal';
    card.setAttribute('data-id', product.id);

    // Initial default size A5
    let selectedSize = 'A5';
    const prices = { 'A6': 17, 'A5': 33, 'A4': 49, 'A3': 99 };

    card.innerHTML = `
        <div class="card-img-wrapper" onclick="window.location.href='product.html?id=${product.id}'">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
            ${product.id.includes('p1') ? '<span class="premium-badge">PREMIUM</span>' : ''}
            <div class="card-overlay">
                <span>View Details</span>
            </div>
        </div>
        <div class="card-content">
            <span class="card-category">${product.category}</span>
            <h3 class="card-title">${product.label || product.title}</h3>
            
            <div class="size-selector">
                <button class="size-btn" data-size="A6" title="A6 (Small)">A6</button>
                <button class="size-btn active" data-size="A5" title="A5 (Medium)">A5</button>
                <button class="size-btn" data-size="A4" title="A4 (Large)">A4</button>
                <button class="size-btn" data-size="A3" title="A3 (Extra Large)">A3</button>
            </div>

            <div class="card-footer">
                <span class="card-price" id="price-${product.id}">₹${prices[selectedSize]}</span>
                <button class="btn-primary add-to-cart-btn" data-id="${product.id}">
                    <i class="fas fa-shopping-bag"></i> Add
                </button>
            </div>
        </div>
    `;

    // Size switching logic
    const sizeBtns = card.querySelectorAll('.size-btn');
    const priceDisplay = card.querySelector(`#price-${product.id}`);
    
    sizeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            sizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedSize = btn.getAttribute('data-size');
            priceDisplay.textContent = `₹${prices[selectedSize]}`;
        });
    });

    // Add to cart logic
    card.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(product, selectedSize);
    });

    return card;
}

/**
 * Renders the slide-in cart panel.
 */
export function renderCartPanel(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const cart = getCart();
    const totals = calculateCartTotals();

    container.innerHTML = `
        <div class="cart-panel-header">
            <h3>Shopping Bag (${totals.totalItems})</h3>
            <button class="close-cart" id="closeCartBtn">&times;</button>
        </div>
        
        <div class="cart-items-container">
            ${cart.length === 0 ? '<p class="empty-msg">Your bag is empty.</p>' : cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="item-info">
                        <h4>${item.title}</h4>
                        <p class="item-meta">${item.category} | Size: ${item.size}</p>
                        <div class="item-controls">
                            <div class="qty-stepper">
                                <button onclick="window.wallify.updateQty('${item.variantId}', -1)">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="window.wallify.updateQty('${item.variantId}', 1)">+</button>
                            </div>
                            <span class="item-price">₹${item.price * item.quantity}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="cart-summary">
            ${totals.numFree > 0 ? `
                <div class="bundle-alert animated-glitter">
                    You got ${totals.numFree} posters FREE 🎉
                </div>
            ` : ''}
            
            <div class="summary-line">
                <span>Subtotal</span>
                <span>₹${totals.subtotal}</span>
            </div>
            <div class="summary-line discount">
                <span>Offer Discount</span>
                <span>- ₹${totals.discount}</span>
            </div>
            <div class="summary-line total">
                <span>Total Payable</span>
                <span>₹${totals.totalPayable}</span>
            </div>

            ${!totals.canCheckout ? `
                <div class="min-order-msg">
                    Select minimum ${totals.minPostersNeeded} posters to checkout.
                </div>
            ` : ''}

            <button class="checkout-btn" ${!totals.canCheckout ? 'disabled' : ''} onclick="window.location.href='checkout.html'">
                Proceed to Checkout
            </button>
        </div>
    `;

    document.getElementById('closeCartBtn')?.addEventListener('click', toggleCart);
}

export function toggleCart() {
    const panel = document.getElementById('cartPanel');
    const overlay = document.getElementById('cartOverlay');
    if (panel && overlay) {
        panel.classList.toggle('open');
        overlay.classList.toggle('open');
    }
}
