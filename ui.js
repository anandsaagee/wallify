/**
 * ui.js — Wallify Store
 * Premium UI components & DOM manipulation.
 */


function showToast(message, type = 'success') {
    let toast = document.getElementById('wallify-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'wallify-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `show ${type}`;
    
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/**
 * renderNavbar — Injects the premium navbar
 */
function renderNavbar(activePage = 'home') {
    const nav = document.querySelector('.navbar');
    if (!nav) return;

    const totals = calculateTotals();
    
    nav.innerHTML = `
        <div class="container nav-content">
            <a href="index.html" class="logo">Wallify<span>.</span></a>
            <div class="nav-links">
                <a href="index.html" class="nav-link ${activePage === 'home' ? 'active' : ''}">Home</a>
                <a href="collections.html" class="nav-link ${activePage === 'collections' ? 'active' : ''}">Collections</a>
                <a href="shop.html" class="nav-link ${activePage === 'shop' ? 'active' : ''}">Shop</a>
            </div>
            <button class="cart-trigger" id="cartToggleBtn">
                <i class="fas fa-shopping-bag"></i>
                <span class="cart-badge">${totals.totalItems}</span>
            </button>
        </div>
    `;

    document.getElementById('cartToggleBtn')?.addEventListener('click', () => toggleCart(true));
    
    // Sticky effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    });
}

/**
 * createPosterCard — Premium poster card component
 */
function createPosterCard(product, delay = 0) {
    const card = document.createElement('div');
    card.className = 'poster-card reveal';
    card.style.animationDelay = `${delay * 0.05}s`;
    
    card.innerHTML = `
        <div class="card-img-wrap" onclick="window.openProductModal('${product.id}')">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
            <div class="card-overlay">
                <div class="quick-actions">
                    <button class="btn btn-primary" style="padding: 10px 20px; font-size: 0.8rem;" onclick="window.openProductModal('${product.id}')">View Details</button>
                </div>
            </div>
        </div>
        <div class="card-info" onclick="window.openProductModal('${product.id}')" style="cursor: pointer;">
            <h3 class="card-title">${product.title}</h3>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="card-price">Starts at ₹${SIZES['A6'].price}</span>
                <span style="font-size: 0.75rem; color: var(--text-dim);">${product.category}</span>
            </div>
        </div>
    `;

    return card;
}

/**
 * renderCartPanel — Premium side cart panel
 */
function renderCartPanel() {
    let panel = document.getElementById('cartPanel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'cartPanel';
        panel.className = 'cart-panel';
        document.body.appendChild(panel);
    }

    const totals = calculateTotals();

    panel.innerHTML = `
        <div style="padding: 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass);">
            <h2 style="font-size: 1.25rem;">Your Bag (${totals.totalItems})</h2>
            <button id="closeCartBtn" style="font-size: 1.5rem; color: var(--text-muted); cursor: pointer;">&times;</button>
        </div>
        
        <div style="flex-grow: 1; overflow-y: auto; padding: 24px;">
            ${totals.items.length === 0 ? `
                <div style="text-align: center; margin-top: 40px; color: var(--text-muted);">
                    <i class="fas fa-shopping-bag" style="font-size: 3rem; opacity: 0.2; margin-bottom: 16px;"></i>
                    <p>Your bag is empty.</p>
                </div>
            ` : totals.items.map(item => `
                <div style="display: flex; gap: 16px; margin-bottom: 24px; align-items: center;">
                    <img src="${item.image}" style="width: 60px; height: 80px; object-fit: cover; border-radius: 8px;">
                    <div style="flex-grow: 1;">
                        <h4 style="font-size: 0.9rem; margin-bottom: 4px;">${item.title}</h4>
                        <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px;">${item.size} • ₹${item.price}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.05); padding: 4px 12px; border-radius: 20px;">
                                <button class="qty-btn" data-id="${item.variantId}" data-delta="-1">-</button>
                                <span style="font-size: 0.8rem;">${item.quantity}</span>
                                <button class="qty-btn" data-id="${item.variantId}" data-delta="1">+</button>
                            </div>
                            <span style="font-weight: 700; font-size: 0.9rem;">₹${item.price * item.quantity}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>

        ${totals.totalItems > 0 ? `
            <div style="padding: 24px; border-top: 1px solid var(--border-glass); background: rgba(0,0,0,0.3);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem; color: var(--text-muted);">
                    <span>Subtotal</span>
                    <span>₹${totals.subtotal}</span>
                </div>
                ${totals.discount > 0 ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem; color: #10B981;">
                        <span>Bundle Discount (${totals.freeCount} free)</span>
                        <span>-₹${totals.discount}</span>
                    </div>
                ` : ''}
                <div style="display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 1.25rem; font-weight: 800; color: var(--secondary);">
                    <span>Total</span>
                    <span>₹${totals.finalTotal}</span>
                </div>
                <button class="btn btn-primary" style="width: 100%;" onclick="window.location.href='checkout.html'">
                    Review Order & Checkout
                </button>
            </div>
        ` : ''}
    `;

    document.getElementById('closeCartBtn')?.addEventListener('click', () => toggleCart(false));
    panel.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            updateQuantity(btn.dataset.id, parseInt(btn.dataset.delta));
            renderCartPanel();
            updateNavbarBadge();
        });
    });
}

function updateNavbarBadge() {
    const totals = calculateTotals();
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.textContent = totals.totalItems;
        badge.style.transform = 'scale(1.3)';
        setTimeout(() => badge.style.transform = 'scale(1)', 200);
    }
}

function toggleCart(show) {
    const panel = document.getElementById('cartPanel');
    const overlay = document.getElementById('cartOverlay');
    if (!panel) renderCartPanel();
    
    if (show) {
        document.getElementById('cartPanel').classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        document.getElementById('cartPanel').classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * renderProductModal — Core product display component
 */
function openProductModal(productId) {
    if (typeof products === 'undefined') return;
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let modal = document.getElementById('productModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'productModal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }

    let selectedSize = 'A5';

    const renderInner = () => {
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="window.closeProductModal()"></div>
            <div class="modal-content">
                <button style="position: absolute; top: 20px; right: 20px; z-index: 10; font-size: 1.5rem; cursor: pointer; color: white;" onclick="window.closeProductModal()">&times;</button>
                <div style="display: grid; grid-template-columns: 1fr 1fr; @media(max-width: 768px){ grid-template-columns: 1fr; }">
                    <div style="aspect-ratio: 3/4; overflow: hidden;">
                        <img src="${product.image}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div style="padding: 40px; display: flex; flex-direction: column; gap: 24px;">
                        <div>
                            <span style="font-size: 0.8rem; color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;">${product.category}</span>
                            <h2 style="font-size: 2rem; margin-top: 8px;">${product.title}</h2>
                        </div>
                        
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <label style="font-size: 0.9rem; font-weight: 600; color: var(--text-muted);">Select Size</label>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                                ${Object.keys(SIZES).map(s => `
                                    <button class="filter-pill size-selector ${selectedSize === s ? 'active' : ''}" data-size="${s}">
                                        ${SIZES[s].label} — ₹${SIZES[s].price}
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <div style="padding: 16px; background: rgba(59, 130, 246, 0.1); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.2);">
                            <p style="font-size: 0.85rem; color: var(--primary); font-weight: 600;">
                                <i class="fas fa-gift"></i> Bundle Offer: Buy 5, Get 1 Free!
                            </p>
                            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Discount applied automatically at checkout.</p>
                        </div>

                        <div style="margin-top: auto; display: flex; gap: 16px;">
                            <button id="modalAddToCart" class="btn btn-primary" style="flex: 1;">Add to Bag</button>
                            <button id="modalBuyNow" class="btn" style="border: 1px solid var(--border-glass);">Buy Now</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.querySelectorAll('.size-selector').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedSize = btn.dataset.size;
                renderInner();
            });
        });

        document.getElementById('modalAddToCart')?.addEventListener('click', () => {
            addProduct(product, selectedSize);
            showToast(`"${product.title}" (${selectedSize}) added to bag!`);
            updateNavbarBadge();
            window.closeProductModal();
            toggleCart(true);
        });

        document.getElementById('modalBuyNow')?.addEventListener('click', () => {
            addProduct(product, selectedSize);
            window.location.href = 'checkout.html';
        });
    };

    renderInner();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

window.openProductModal = openProductModal;
window.closeProductModal = function() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

// Scroll Reveal Observer
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Auto-sync cart badge across tabs/events
window.addEventListener('cart_updated', () => {
    updateNavbarBadge();
    const panel = document.getElementById('cartPanel');
    if (panel && panel.classList.contains('active')) {
        renderCartPanel();
    }
});

// Button Glow Effect
document.addEventListener('mousemove', (e) => {
    const glows = document.querySelectorAll('.btn-glow');
    glows.forEach(glow => {
        const rect = glow.parentElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        glow.style.setProperty('--x', `${x}px`);
        glow.style.setProperty('--y', `${y}px`);
    });
});

/**
 * shuffle — Utility to randomize arrays
 */
function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
