/* =======================
   CART & WHATSAPP LOGIC
======================= */

// ✅ FIXED: Updated to correct WhatsApp business number
const WA_BUSINESS_PHONE = "917736497186";

function getCart() {
    const cartData = localStorage.getItem('wallifyCart');
    return cartData ? JSON.parse(cartData) : [];
}

function saveCart(cart) {
    localStorage.setItem('wallifyCart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-count');
    badges.forEach(badge => {
        badge.textContent = count;
        badge.style.transform = 'scale(1.2)';
        setTimeout(() => badge.style.transform = 'scale(1)', 200);
    });
}

function addToCart(product, quantity = 1) {
    const cart = getCart();
    const variantId = product.id;
    const existing = cart.find(item => item.variantId === variantId);
    if(existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            variantId,
            productId: product.id,
            title: product.title,
            image: product.image,
            price: product.basePrice || 33,
            quantity: quantity,
            category: product.category
        });
    }
    saveCart(cart);
}

function updateCartItemQty(variantId, change) {
    let cart = getCart();
    const item = cart.find(i => i.variantId === variantId);
    if(item) {
        item.quantity += change;
        if(item.quantity <= 0) {
            cart = cart.filter(i => i.variantId !== variantId);
        }
        saveCart(cart);
    }
    return cart;
}

function removeFromCart(variantId) {
    let cart = getCart();
    cart = cart.filter(i => i.variantId !== variantId);
    saveCart(cart);
    return cart;
}

function clearCart() {
    localStorage.removeItem('wallifyCart');
    updateCartCount();
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function formatPrice(value) {
    return `₹${parseFloat(value).toFixed(2)}`;
}

// =======================
// WHATSAPP GENERATORS
// =======================

function redirectToWhatsApp(text) {
    try {
        const encoded = encodeURIComponent(text);
        const url = `https://wa.me/${WA_BUSINESS_PHONE}?text=${encoded}`;
        console.log("Opening WhatsApp URL:", url);
        const newWin = window.open(url, '_blank');
        if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
            window.location.href = url;
        }
    } catch (err) {
        console.error('[Wallify] Failed to open WhatsApp:', err);
    }
}

function generateWaLinkSingle(productTitle, category, name, address, phone, pincode) {
    const text = `NEW ORDER

Product Details:
- Name: ${productTitle}
- Category: ${category}

Customer Details:
- Name: ${name}
- Phone: ${phone}
- Address: ${address}
- Pincode: ${pincode}`;
    
    redirectToWhatsApp(text);
}

function generateWaLinkCart(cart, name, address, phone, pincode) {
    let itemsText = cart.map((i, idx) => `${idx + 1}. ${i.title}${i.quantity > 1 ? ` (x${i.quantity})` : ''}`).join('\n');
    
    const text = `NEW ORDER

Products:
${itemsText}

Customer Details:
- Name: ${name}
- Phone: ${phone}
- Address: ${address}
- Pincode: ${pincode}`;

    redirectToWhatsApp(text);
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Inject Floating WhatsApp Button
    const waFloat = document.createElement('a');
    waFloat.href = `https://wa.me/${WA_BUSINESS_PHONE}?text=${encodeURIComponent("Hello! I have a question about Wallify Store prints.")}`;
    waFloat.target = "_blank";
    waFloat.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #25D366;
        color: white;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
        z-index: 1000;
        transition: transform 0.3s ease;
        text-decoration: none;
    `;
    waFloat.innerHTML = '<i class="fab fa-whatsapp"></i>';
    waFloat.onmouseover = () => waFloat.style.transform = 'scale(1.1)';
    waFloat.onmouseout = () => waFloat.style.transform = 'scale(1)';
    document.body.appendChild(waFloat);

    // Initialise Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

// =======================
// UI COMPONENTS
// =======================

function createImageCard(product, indexDelay = 0) {
    return `
        <div class="product-card" style="animation:revealItem 0.6s cubic-bezier(0.2,0.8,0.2,1) forwards;opacity:0;animation-delay:${indexDelay * 0.04}s" oncontextmenu="return false;" ondragstart="return false;">
            <a href="javascript:void(0)" onclick="openProductModal('${product.id}')" class="card-img-wrapper" style="display:block;">
                <img src="${product.image || ''}" loading="lazy" alt="${product.title || 'Product'}" draggable="false" style="pointer-events:none;">
            </a>
            <div class="card-content">
                <span class="card-category">${product.category || 'Uncategorized'}</span>
                <h3 class="card-title">${product.title || 'Unknown Title'}</h3>
                <div class="card-footer">
                    <span class="card-price">Starts at ₹${product.basePrice || 33}</span>
                    <button onclick="openProductModal('${product.id}')" class="btn-primary" style="padding:9px 18px;font-size:0.85rem; border:none; border-radius:30px; cursor:pointer;">View <i class="fas fa-arrow-right"></i></button>
                </div>
            </div>
        </div>
    `;
}

function renderImageGrid(productsArray, containerId, categoryName = 'All') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!productsArray || productsArray.length === 0) {
        console.warn(`[Wallify Shop] No products found for the ${categoryName} category!`);
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 80px 20px;">
                <i class="fas fa-search" style="font-size:3rem;margin-bottom:16px;color:var(--border-color)"></i>
                <h3>No artworks found</h3>
                <p>No posters available in ${categoryName} category</p>
            </div>
        `;
        return;
    }

    console.log(`[Wallify Shop] Rendering ${productsArray.length} items for ${categoryName}...`);
    container.innerHTML = productsArray.map((p, i) => createImageCard(p, i)).join('');
}

/**
 * CategorySelector Component Setup
 * Connects UI filter elements and manages state/pagination.
 */
function initializeCategorySystem({
    allProducts,
    gridContainerId,
    paginationContainerId,
    resultsCountId,
    sidebarFilterSelector,
    tabFilterSelector,
    searchInputId,
    sortSelectId,
    itemsPerPage = 15
}) {
    let currentCategory = 'Automotive Posters';
    let searchQuery = '';
    let currentSort = 'default';
    let currentPage = 1;

    const sidebarFilters = document.querySelectorAll(sidebarFilterSelector);
    const tabFilters = document.querySelectorAll(tabFilterSelector);
    const searchInput = document.getElementById(searchInputId);
    const sortSelect = document.getElementById(sortSelectId);
    const resultsCount = document.getElementById(resultsCountId);
    const paginationContainer = document.getElementById(paginationContainerId);

    // Compute Category Item Counts
    const counts = { 'All': allProducts.length };
    allProducts.forEach(p => {
        counts[p.category] = (counts[p.category] || 0) + 1;
    });

    document.querySelectorAll('.cat-count').forEach(el => {
        const catId = el.id.replace('count-', '');
        if (counts[catId] !== undefined) {
            el.textContent = counts[catId];
        }
    });

    function renderState() {
        let filtered = allProducts.filter(p => {
            const matchCat = currentCategory === 'All' || p.category === currentCategory;
            const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCat && matchSearch;
        });

        if (currentSort === 'low') filtered.sort((a,b) => a.basePrice - b.basePrice);
        if (currentSort === 'high') filtered.sort((a,b) => b.basePrice - a.basePrice);

        if (resultsCount) {
            resultsCount.textContent = `Showing ${filtered.length} poster${filtered.length !== 1 ? 's' : ''}`;
        }

        const totalPages = Math.ceil(filtered.length / itemsPerPage);
        if (currentPage > totalPages) currentPage = 1;
        const start = (currentPage - 1) * itemsPerPage;
        const pageItems = filtered.slice(start, start + itemsPerPage);

        renderImageGrid(pageItems, gridContainerId, currentCategory);

        // Render Pagination
        if (paginationContainer) {
            if (totalPages > 1) {
                let btns = '';
                if (currentPage > 1) btns += `<button class="page-btn" onclick="window.goToPage(${currentPage-1})"><i class="fas fa-chevron-left"></i></button>`;
                for (let i=1; i<=totalPages; i++) {
                    btns += `<button class="page-btn${i===currentPage?' active':''}" onclick="window.goToPage(${i})">${i}</button>`;
                }
                if (currentPage < totalPages) btns += `<button class="page-btn" onclick="window.goToPage(${currentPage+1})"><i class="fas fa-chevron-right"></i></button>`;
                paginationContainer.innerHTML = btns;
            } else {
                paginationContainer.innerHTML = '';
            }
        }
    }

    function setActiveCategory(cat) {
        currentCategory = cat;
        currentPage = 1;

        sidebarFilters.forEach(f => f.classList.toggle('active', f.dataset.cat === cat));
        tabFilters.forEach(t => t.classList.toggle('active', t.dataset.cat === cat));

        const activeTab = document.querySelector(`${tabFilterSelector}[data-cat="${cat}"]`);
        if (activeTab) activeTab.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'center' });

        renderState();
    }

    window.goToPage = function(page) {
        currentPage = page;
        renderState();
        window.scrollTo({ top: 250, behavior:'smooth' });
    };

    sidebarFilters.forEach(f => f.addEventListener('click', () => setActiveCategory(f.dataset.cat)));
    tabFilters.forEach(t => t.addEventListener('click', () => setActiveCategory(t.dataset.cat)));
    
    if (searchInput) {
        searchInput.addEventListener('input', e => {
            searchQuery = e.target.value;
            currentPage = 1;
            renderState();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', e => {
            currentSort = e.target.value;
            currentPage = 1;
            renderState();
        });
    }

    // Initialize formatting based on URL if provided
    const urlParams = new URLSearchParams(window.location.search);
    const urlCategory = urlParams.get('category');
    if (urlCategory) {
        setActiveCategory(urlCategory);
    } else {
        renderState();
    }
}

// =======================
// MODAL CONTROLS
// =======================
let currentModalProduct = null;
window.openProductModal = function(id) {
    if (typeof products === 'undefined') return;
    const product = products.find(p => p.id === id);
    if (!product) return;
    currentModalProduct = product;
    
    document.getElementById('modalImage').src = product.image || '';
    document.getElementById('modalCategory').textContent = product.category || '';
    document.getElementById('modalTitle').textContent = product.title || '';
    document.getElementById('modalPrice').textContent = `₹${parseFloat(product.basePrice || 33).toFixed(2)}`;
    
    const modal = document.getElementById('productModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => modal.classList.add('show'), 10);
};

window.closeProductModal = function() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(() => modal.classList.remove('active'), 300);
};

window.buyNowFromModal = function() {
    if(!currentModalProduct) return;
    window.location.href = `checkout.html?buyNow=${currentModalProduct.id}`;
};

window.addToCartFromModal = function() {
    if(!currentModalProduct) return;
    addToCart(currentModalProduct, 1);
    closeProductModal();
    updateCartCount();
    alert('Added to cart!');
};
