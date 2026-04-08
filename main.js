// main.js — Wallify Store shared init helpers

// Updates the navbar cart badge count
function refreshCartBadge() {
    if (typeof updateNavbarBadge === 'function') {
        updateNavbarBadge();
    }
}

// Sync badge whenever cart changes
window.addEventListener('cart_updated', function () {
    refreshCartBadge();
});
