/**
 * loadImage — Centralized image handler with fallback
 */
function loadImage(src, alt = 'Poster') {
    const placeholder = 'https://images.unsplash.com/photo-1598128558393-70ff22444bb0?auto=format&fit=crop&q=80&w=800';
    return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${placeholder}';">`;
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
 * renderNavbar — Injects the premium navbar with mobile hamburger menu
 */
function renderNavbar(activePage = 'home') {
    const nav = document.querySelector('.navbar');
    if (!nav) return;

    const totals = calculateTotals();
    
    nav.innerHTML = `
        <div class="container nav-content">
            <a href="index.html" class="logo">Wallify<span>.</span></a>
            <div class="nav-links" id="navLinks">
                <a href="index.html" class="nav-link ${activePage === 'home' ? 'active' : ''}">Home</a>
                <a href="collections.html" class="nav-link ${activePage === 'collections' ? 'active' : ''}">Collections</a>
                <a href="shop.html" class="nav-link ${activePage === 'shop' ? 'active' : ''}">Shop</a>
            </div>
            <button class="cart-trigger" id="cartToggleBtn" aria-label="Open shopping bag">
                <i class="fas fa-shopping-bag"></i>
                <span class="cart-badge">${totals.totalItems}</span>
            </button>
            <button class="nav-toggle" id="navToggle" aria-label="Open navigation menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
        <div class="mobile-nav-overlay" id="mobileNavOverlay"></div>
    `;

    // Cart toggle
    document.getElementById('cartToggleBtn')?.addEventListener('click', () => toggleCart(true));
    
    // Hamburger menu toggle
    const toggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const mobileOverlay = document.getElementById('mobileNavOverlay');

    function openMobileNav() {
        toggle.classList.add('active');
        navLinks.classList.add('mobile-open');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
        toggle.classList.remove('active');
        navLinks.classList.remove('mobile-open');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggle?.addEventListener('click', () => {
        if (navLinks.classList.contains('mobile-open')) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    });

    mobileOverlay?.addEventListener('click', closeMobileNav);

    // Close mobile nav on link click
    navLinks?.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });

    // Expose closeMobileNav globally for Escape key handler
    window._closeMobileNav = closeMobileNav;

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
        <div class="card-info" style="display: flex; flex-direction: column; gap: 4px;">
            <h3 class="card-title" style="margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; font-size: clamp(0.9rem, 2.5vw, 1.05rem); font-weight: 700;">${product.title}</h3>
            <span class="card-price" style="font-size: 0.95rem; font-weight: 800; color: var(--secondary);">₹${SIZES['A6'].price} <span style="font-size:0.75rem; color:var(--text-muted); font-weight:500;">(base)</span></span>
            <span style="font-size: 0.7rem; color: var(--text-muted); background: rgba(255,255,255,0.08); padding: 4px 8px; border-radius: 4px; align-self: flex-start; margin-top: 4px; letter-spacing: 0.05em; text-transform: uppercase;">${product.category}</span>
        </div>
    `;

    return card;
}

/**
 * renderCartPanel — Premium side cart panel with improved item visibility
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
                <button id="closeCartBtn" aria-label="Close shopping bag" style="width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #FFFFFF; cursor: pointer; background: rgba(255,255,255,0.08); border: 1px solid var(--border-glass); transition: 0.2s;">&times;</button>
            </div>
            
            <div style="flex-grow: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 20px;">
                ${totals.items.length === 0 ? `
                    <div style="text-align: center; margin: auto 0; padding: 40px 0;">
                        <div class="empty-bag-icon" style="width: 80px; height: 80px; background: rgba(255,255,255,0.03); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
                            <i class="fas fa-shopping-bag" style="font-size: 2rem; opacity: 0.2;"></i>
                        </div>
                        <h3 style="font-size: 1.1rem; margin-bottom: 8px; color: #FFFFFF;">Your bag is empty</h3>
                        <p style="font-size: 0.85rem; color: var(--text-dim);">Looks like you haven't added any posters yet.</p>
                        <button onclick="window.toggleCart(false)" class="btn btn-primary" style="margin-top: 24px; padding: 12px 24px; font-size: 0.85rem;">Continue Shopping</button>
                    </div>
                ` : totals.items.map(item => `
                    <div style="display: flex; gap: 16px; align-items: flex-start; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.06);">
                        <div style="width: 80px; height: 100px; border-radius: 10px; overflow: hidden; background: #000; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
                            <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        <div style="flex-grow: 1;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <h4 style="font-size: 1rem; font-weight: 700; color: #FFFFFF; margin-bottom: 4px; line-height: 1.3;">${item.title}</h4>
                                <button class="remove-btn" data-id="${item.variantId}" aria-label="Remove ${item.title}" style="color: var(--error); opacity: 0.7; cursor: pointer; font-size: 0.85rem; padding: 4px; min-width: 28px; min-height: 28px; display: flex; align-items: center; justify-content: center;"><i class="fas fa-trash-alt"></i></button>
                            </div>
                            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px; font-weight: 600;">${item.size} • ₹${item.price} each</p>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div style="display: flex; align-items: center; gap: 14px; background: rgba(255,255,255,0.06); padding: 6px 12px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.1);">
                                    <button class="qty-btn" data-id="${item.variantId}" data-delta="-1" aria-label="Decrease quantity" style="color: #FFFFFF; font-weight: bold; width: 28px; height: 28px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">−</button>
                                    <span style="font-size: 0.9rem; font-weight: 800; min-width: 20px; text-align: center;">${item.quantity}</span>
                                    <button class="qty-btn" data-id="${item.variantId}" data-delta="1" aria-label="Increase quantity" style="color: #FFFFFF; font-weight: bold; width: 28px; height: 28px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">+</button>
                                </div>
                                <span style="font-weight: 800; font-size: 1.05rem; color: var(--secondary);">₹${item.price * item.quantity}</span>
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

    // Setup swipe-to-close on mobile
    setupCartSwipe(panel);
}

/**
 * setupCartSwipe — Swipe right to close cart panel on touch devices
 */
function setupCartSwipe(panel) {
    if (panel._swipeSetup) return;
    panel._swipeSetup = true;

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    panel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });

    panel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        if (diff > 0) {
            panel.style.transform = `translateX(${diff}px)`;
            panel.style.transition = 'none';
        }
    }, { passive: true });

    panel.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        const diff = currentX - startX;
        panel.style.transition = '';
        
        if (diff > 100) {
            toggleCart(false);
        } else {
            panel.style.transform = '';
        }
        startX = 0;
        currentX = 0;
    }, { passive: true });
}

function updateNavbarBadge() {
    const totals = calculateTotals();
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.textContent = totals.totalItems;
        // Pulse animation
        badge.classList.remove('pulse');
        void badge.offsetWidth; // force reflow
        badge.classList.add('pulse');
    }
}

function toggleCart(show) {
    const panel = document.getElementById('cartPanel');
    const overlay = document.getElementById('cartOverlay');
    
    if (show) {
        renderCartPanel();
        // Small delay to ensure panel is in DOM before animating
        requestAnimationFrame(() => {
            document.getElementById('cartPanel').classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    } else {
        if (panel) {
            panel.classList.remove('active');
            panel.style.transform = '';
        }
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
                <button onclick="window.closeProductModal()" class="modal-close" aria-label="Close product modal">&times;</button>

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
                                    <button class="filter-pill size-selector ${selectedSize === s ? 'active' : ''}" data-size="${s}" style="border: 1px solid ${selectedSize === s ? 'var(--primary)' : 'var(--border-glass)'}; height: auto; padding: 8px 16px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                                        <span style="font-weight: 700; font-size: 0.95rem;">${SIZES[s].label}</span>
                                        <span style="font-size: 0.75rem; opacity: 0.85; text-decoration: line-through; color: var(--text-muted); margin-top: 2px;">₹${SIZES[s].strikePrice}</span>
                                        <span style="font-weight: 800; color: var(--secondary); margin-top: 2px;">₹${SIZES[s].price}</span>
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
    }, { threshold: 0.05 });

    document.querySelectorAll('.reveal:not(.active)').forEach(el => observer.observe(el));
}

// Auto-sync cart badge across tabs/events
window.addEventListener('cart_updated', () => {
    updateNavbarBadge();
    const panel = document.getElementById('cartPanel');
    if (panel && panel.classList.contains('active')) {
        renderCartPanel();
    }
});

// ── Global Keyboard Shortcuts ──
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close cart panel
        const cartPanel = document.getElementById('cartPanel');
        if (cartPanel && cartPanel.classList.contains('active')) {
            toggleCart(false);
            return;
        }
        // Close product modal
        const modal = document.getElementById('productModal');
        if (modal && modal.classList.contains('active')) {
            window.closeProductModal();
            return;
        }
        // Close mobile nav
        if (typeof window._closeMobileNav === 'function') {
            window._closeMobileNav();
        }
    }
});

// ── Button Glow Effect ──
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
