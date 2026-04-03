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

function addToCart(product, size, frame, finalPrice, quantity = 1) {
    const cart = getCart();
    const variantId = `${product.id}-${size}-${frame}`;
    const existing = cart.find(item => item.variantId === variantId);
    if(existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            variantId,
            productId: product.id,
            title: product.title,
            image: product.image,
            size,
            frame,
            price: finalPrice,
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
    return cart; // Returns updated cart
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

/**
 * ✅ FIXED: Redirects to WhatsApp with pre-filled message.
 * Includes try/catch for graceful error handling.
 */
function redirectToWhatsApp(text) {
    try {
        const encoded = encodeURIComponent(text);
        const url = `https://wa.me/${WA_BUSINESS_PHONE}?text=${encoded}`;
        const newWin = window.open(url, '_blank');
        // Fallback: if popup blocked, navigate in same tab
        if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
            console.warn('[Wallify] Popup blocked — navigating in same tab as fallback.');
            window.location.href = url;
        }
    } catch (err) {
        console.error('[Wallify] Failed to open WhatsApp:', err);
        alert('Could not open WhatsApp. Please contact us at wa.me/917736497186');
    }
}

/**
 * Sends a single product order via WhatsApp.
 * Used by the product page modal form.
 */
function generateWaLinkSingle(productTitle, size, frame, qty, totalAmt, name, address, phone) {
    const text = `Hello, I want to order from Wallify Store:

Product: ${productTitle}
Size: ${size}
Frame: ${frame}
Quantity: ${qty}
Total Price: ₹${totalAmt}

Customer Details:
Name: ${name}
Address: ${address}
Phone: ${phone}

Please confirm my order.`;
    redirectToWhatsApp(text);
}

/**
 * Sends the full cart order via WhatsApp.
 * Used by the cart/checkout page.
 */
function generateWaLinkCart(cart, totalAmt, name, address, phone) {
    let itemsText = cart.map(i => `- ${i.title} (${i.size}, ${i.frame}) x${i.quantity} = ₹${i.price * i.quantity}`).join('\n');
    
    const text = `Hello, I want to place an order from Wallify Store:

Items:
${itemsText}

Grand Total: ₹${totalAmt}

Customer Details:
Name: ${name}
Address: ${address}
Phone: ${phone}

Please confirm my order.`;
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
