/**
 * loadImage — Centralized image handler with fallback
 */
function loadImage(src, alt = 'Poster') {
    const placeholder = 'https://images.unsplash.com/photo-1598128558393-70ff22444bb0?auto=format&fit=crop&q=80&w=800';
    return `<img src="${src}" alt="${alt}" loading="lazy" onerror="this.onerror=null;this.src='${placeholder}';">`;
}


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
    card.style.cursor = 'pointer';
    card.onclick = () => window.openProductModal(product.id);
    
    card.innerHTML = `
        <div class="card-img-wrap">
            ${loadImage(product.image, product.title)}
            <div class="card-overlay">
                <div class="quick-actions">
                    <button class="btn btn-primary" style="padding: 10px 24px; font-weight: 700; font-size: 0.9rem;">View Poster</button>
                </div>
            </div>
        </div>
        <div class="card-info">
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
        <div style="height: 100%; display: flex; flex-direction: column;">
            <div style="padding: 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); background: rgba(0,0,0,0.2);">
                <h2 style="font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em;">Your Bag <span style="color: var(--primary); opacity: 0.8;">(${totals.totalItems})</span></h2>
                <button id="closeCartBtn" style="width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #FFFFFF; cursor: pointer; background: rgba(255,255,255,0.05); border: 1px solid var(--border-glass);">&times;</button>
            </div>
            
            <div style="flex-grow: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 20px;">
                ${totals.items.length === 0 ? `
                    <div style="text-align: center; margin: auto 0; padding: 40px 0;">
                        <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.03); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                            <i class="fas fa-shopping-bag" style="font-size: 2rem; opacity: 0.2;"></i>
                        </div>
                        <h3 style="font-size: 1.1rem; margin-bottom: 8px; color: #FFFFFF;">Your bag is empty</h3>
                        <p style="font-size: 0.85rem; color: var(--text-dim);">Looks like you haven't added any posters yet.</p>
                        <button onclick="window.toggleCart(false)" class="btn btn-primary" style="margin-top: 24px; padding: 12px 24px; font-size: 0.85rem;">Continue Shopping</button>
                    </div>
                ` : totals.items.map(item => `
                    <div style="display: flex; gap: 16px; align-items: flex-start; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.03);">
                        <div style="width: 70px; height: 90px; border-radius: 8px; overflow: hidden; background: #000; flex-shrink: 0;">
                            <img src="${item.image}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div style="flex-grow: 1;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <h4 style="font-size: 0.95rem; font-weight: 700; color: #FFFFFF; margin-bottom: 2px;">${item.title}</h4>
                                <button class="remove-btn" data-id="${item.variantId}" style="color: var(--error); opacity: 0.6; cursor: pointer; font-size: 0.8rem;"><i class="fas fa-trash-alt"></i></button>
                            </div>
                            <p style="font-size: 0.75rem; color: var(--text-dim); margin-bottom: 12px; font-weight: 600;">${item.size} • ₹${item.price}</p>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div style="display: flex; align-items: center; gap: 14px; background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 50px; border: 1px solid var(--border-glass);">
                                    <button class="qty-btn" data-id="${item.variantId}" data-delta="-1" style="color: #FFFFFF; font-weight: bold; width: 20px; cursor: pointer;">-</button>
                                    <span style="font-size: 0.85rem; font-weight: 800; min-width: 16px; text-align: center;">${item.quantity}</span>
                                    <button class="qty-btn" data-id="${item.variantId}" data-delta="1" style="color: #FFFFFF; font-weight: bold; width: 20px; cursor: pointer;">+</button>
                                </div>
                                <span style="font-weight: 800; font-size: 1rem; color: #FFFFFF;">₹${item.price * item.quantity}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            ${totals.totalItems > 0 ? `
                <div style="padding: 24px; border-top: 1px solid var(--border-glass); background: rgba(0,0,0,0.4); backdrop-filter: blur(10px);">
                    <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text-dim);">
                            <span>Subtotal</span>
                            <span style="color: #FFFFFF; font-weight: 600;">₹${totals.subtotal}</span>
                        </div>
                        ${totals.discount > 0 ? `
                            <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: #10B981; font-weight: 600;">
                                <span>Bundle Discovery (${totals.freeCount} free)</span>
                                <span>-₹${totals.discount}</span>
                            </div>
                        ` : ''}
                        <div style="height: 1px; background: rgba(255,255,255,0.05); margin: 4px 0;"></div>
                        <div style="display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 900; color: var(--secondary);">
                            <span>Total</span>
                            <span>₹${totals.finalTotal}</span>
                        </div>
                    </div>

                    ${!totals.isMinOrderMet ? `
                        <div style="padding: 14px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; margin-bottom: 16px; text-align: center;">
                            <p style="color: #F87171; font-size: 0.85rem; font-weight: 700;">⚠️ Minimum order is 3 posters</p>
                        </div>
                        <button class="btn btn-primary" style="width: 100%; opacity: 0.4; cursor: not-allowed; filter: grayscale(1);" disabled>
                            Review Order & Checkout
                        </button>
                    ` : `
                        <button class="btn btn-primary" style="width: 100%; height: 52px; font-weight: 800; letter-spacing: 0.02em;" onclick="window.location.href='checkout.html'">
                            Proceed to Checkout
                        </button>
                    `}
                </div>
            ` : ''}
        </div>
    `;

    document.getElementById('closeCartBtn')?.addEventListener('click', () => toggleCart(false));
    panel.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            updateQuantity(btn.dataset.id, parseInt(btn.dataset.delta));
            renderCartPanel();
            updateNavbarBadge();
        });
    });
    panel.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromCart(btn.dataset.id);
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

    let selectedSize = null;

    const renderInner = () => {
        const canContinue = selectedSize !== null;
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="window.closeProductModal()"></div>
            <div class="modal-content">
                <!-- Close (X) Button -->
                <button onclick="window.closeProductModal()" style="position: absolute; top: 16px; right: 16px; z-index: 1000; width: 40px; height: 40px; border-radius: 50%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; backdrop-filter: blur(8px); cursor: pointer;">&times;</button>

                <div class="modal-row" style="display: flex; flex-wrap: wrap;">
                    <div class="modal-image-col" style="flex: 1; min-width: 300px; aspect-ratio: 3/4; overflow: hidden; background: #000;">
                        ${loadImage(product.image, product.title)}
                    </div>
                    <div class="modal-info-col" style="flex: 1; min-width: 300px; padding: 40px; display: flex; flex-direction: column; gap: 24px; max-height: 85vh; overflow-y: auto;">
                        <div>
                            <span style="font-size: 0.8rem; color: var(--primary); font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;">${product.category}</span>
                            <h2 style="font-size: 2.25rem; margin-top: 8px; color: #FFFFFF;">${product.title}</h2>
                        </div>
                        
                        <div style="display: flex; flex-direction: column; gap: 12px;">
                            <label style="font-size: 0.95rem; font-weight: 700; color: #FFFFFF;">Select Size <span style="color: var(--error); font-size: 0.8rem;">*</span></label>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                                ${Object.keys(SIZES).map(s => `
                                    <button class="filter-pill size-selector ${selectedSize === s ? 'active' : ''}" data-size="${s}" style="border: 1px solid ${selectedSize === s ? 'var(--primary)' : 'var(--border-glass)'}; height: 44px; display: flex; align-items: center; justify-content: center;">
                                        ${SIZES[s].label} — ₹${SIZES[s].price}
                                    </button>
                                `).join('')}
                            </div>
                            ${!canContinue ? `<p style="font-size: 0.8rem; color: var(--secondary); font-weight: 600;">Select size to continue</p>` : ''}
                        </div>

                        <div style="padding: 16px; background: rgba(250, 204, 21, 0.05); border-radius: 12px; border: 1px solid rgba(250, 204, 21, 0.2);">
                            <p style="font-size: 0.9rem; color: var(--secondary); font-weight: 700;">
                                <i class="fas fa-gift"></i> Bundle Tier Offers:
                            </p>
                            <ul style="font-size: 0.8rem; color: #FFFFFF; margin-top: 8px; display: flex; flex-direction: column; gap: 4px; list-style: none;">
                                <li>✨ Buy 5 -> 1 Free</li>
                                <li>✨ Buy 7 -> 2 Free</li>
                                <li>✨ Buy 10 -> 3 Free</li>
                                <li>✨ Buy 20 -> 6 Free</li>
                            </ul>
                        </div>

                        <div style="margin-top: auto; display: flex; flex-direction: column; gap: 12px;">
                            <button id="modalAddToCart" class="btn btn-primary" style="width: 100%; height: 52px; border-radius: 50px;" ${!canContinue ? 'disabled' : ''}>
                                ${canContinue ? 'Add to Bag' : 'Select Size First'}
                            </button>
                            <button id="modalBuyNow" class="btn btn-buy-now" style="width: 100%;" ${!canContinue ? 'disabled' : ''}>
                                Buy Now
                            </button>
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
 * shuffleArray — Utility to randomize arrays (Fisher-Yates)
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
