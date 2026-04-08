// script.js — Wallify Store utility helpers

// Case-insensitive category match helper
function categoryMatches(productCategory, filterCategory) {
    if (!filterCategory || filterCategory === 'All') return true;
    return productCategory.toLowerCase() === filterCategory.toLowerCase();
}

// Format a price number to Indian Rupee string
function formatPrice(amount) {
    return '₹' + Number(amount).toFixed(0);
}
