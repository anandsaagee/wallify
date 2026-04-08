// main.js

// Initialization function
function initializeShop() {
    // Fetch products and initialize the shop page
    fetchProducts();
}

// Function to fetch products
function fetchProducts() {
    // Code to fetch products from server or local storage
    console.log("Fetching products...");
}

// Shuffle function to reorder products
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

// Utility function to format currency
function formatCurrency(amount) {
    return '$' + parseFloat(amount).toFixed(2);
}

// Call initialization on document load
document.addEventListener('DOMContentLoaded', initializeShop);