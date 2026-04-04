/**
 * UI COMPONENTS & RENDERING
 */
import { getCart, calculateTotals, updateQuantity, addToCart } from './cart.js';

export function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Renders a premium poster card
 */
export function createPosterCard(product) {
    const card = document.createElement('div');
    card.className = 'poster-card reveal';
    card.setAttribute('data-id', product.id);

    // Default sizes for the card quick-select
    const prices = { 'A6': 17, 'A5': 33, 'A4': 49, 'A3': 99 };
    let selectedSize = 'A5';

    card.innerHTML = `
        <div class="card-img-wrapper" style="cursor: pointer;">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
        </div>
        <div class="card-body">
            <span class="card-category">${product.category}</span>
            <h3 class="card-title">${product.label || product.title}</h3>
            
            <div class="card-footer">
                <span class="card-price">₹${prices[selectedSize]}</span>
                <button class="btn-primary" data-action="add-to-cart">Add</button>
            </div>
        </div>
    `;

    // Click on image goes to product details
    card.querySelector('.card-img-wrapper').addEventListener('click', () => {
        window.location.href = `product.html?id=${product.id}`;
    });

    // Add to cart click
    card.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(product, selectedSize, prices[selectedSize]);
        toggleCart(true); // Open cart immediately
    });

    return card;
}

/**
 * Renders the slide-in cart panel
 */
export function renderCartPanel(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const cart = getCart();
    const totals = calculateTotals();

    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2>Your Bag (${totals.totalItems})</h2>
            <button class="close-cart" style="font-size: 2rem; color: #FFF;">&times;</button>
        </div>
        
        <div style="flex-grow: 1; overflow-y: auto;">
            ${cart.length === 0 ? '<p style="color: var(--text-muted); opacity: 0.6;">Your bag is currently empty.</p>' : cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div style="flex-grow: 1;">
                        <h4 style="font-size: 0.95rem; margin-bottom: 0.25rem;">${item.title}</h4>
                        <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem;">${item.category} | ${item.size}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 20px;">
                                <button data-action="qty-down" data-id="${item.variantId}" style="color: #FFF;">-</button>
                                <span style="font-size: 0.85rem;">${item.quantity}</span>
                                <button data-action="qty-up" data-id="${item.variantId}" style="color: #FFF;">+</button>
                            </div>
                            <span style="font-size: 0.9rem; font-weight: 600;">₹${item.price * item.quantity}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>

        <div style="margin-top: auto; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="color: var(--text-muted);">Subtotal</span>
                <span>₹${totals.subtotal}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; color: #50fa7b;">
                <span>Discounts (Bundle Free)</span>
                <span>- ₹${totals.discount}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 700; color: var(--accent-color); margin-bottom: 2rem;">
                <span>Total Payable</span>
                <span>₹${totals.totalPayable}</span>
            </div>

            ${!totals.canCheckout ? `
                <p style="color: #ff5555; font-size: 0.8rem; text-align: center; margin-bottom: 1rem;">
                    Minimum ${totals.minNeeded} posters required for checkout. (Order at least ${totals.minNeeded - totals.totalItems} more)
                </p>
            ` : ''}

            <button class="btn-primary" ${!totals.canCheckout ? 'disabled opacity: 0.5; cursor: not-allowed;' : ''} 
                    style="width: 100%; padding: 16px; font-size: 1rem; border-radius: 30px;"
                    onclick="window.location.href='checkout.html'">
                Complete Order
            </button>
        </div>
    `;

    // Internal click listeners
    container.querySelector('.close-cart')?.addEventListener('click', () => toggleCart(false));
    
    container.querySelectorAll('[data-action="qty-down"]').forEach(btn => {
        btn.addEventListener('click', () => {
            updateQuantity(btn.dataset.id, -1);
            renderCartPanel(containerId);
        });
    });

    container.querySelectorAll('[data-action="qty-up"]').forEach(btn => {
        btn.addEventListener('click', () => {
            updateQuantity(btn.dataset.id, 1);
            renderCartPanel(containerId);
        });
    });
}

/**
 * Toggle cart visibility
 */
export function toggleCart(forceState = null) {
    const overlay = document.getElementById('cartOverlay');
    const panel = document.getElementById('cartPanel');
    if (!overlay || !panel) return;

    const isOpen = forceState !== null ? forceState : !overlay.classList.contains('open');
    overlay.classList.toggle('open', isOpen);
    panel.classList.toggle('open', isOpen);
}
