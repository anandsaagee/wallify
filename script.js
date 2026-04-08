// script.js

// Function to initialize the shop page
function initializeShopPage() {
    // Fetch products data
    fetchProducts();
}

// Function to fetch products from an API or local source
function fetchProducts() {
    // Placeholder for fetching products
    console.log('Fetching products...');
    // Call renderProducts() with fetched data here
}

// Function to search products by name
function searchProducts(searchTerm) {
    // Placeholder for filtering products based on search term
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    renderProducts(filteredProducts);
}

// Function to filter products by category
function filterByCategory(category) {
    // Placeholder for filtering products based on category
    const filteredProducts = products.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
    );
    renderProducts(filteredProducts);
}

// Function to sort products
function sortProducts(criteria) {
    let sortedProducts = [...products]; // Copy of products array
    if (criteria === 'price') {
        sortedProducts.sort((a, b) => a.price - b.price);
    }
    renderProducts(sortedProducts);
}

// Function for pagination
function paginateProducts(pageNumber, pageSize) {
    const start = (pageNumber - 1) * pageSize;
    const paginatedProducts = products.slice(start, start + pageSize);
    renderProducts(paginatedProducts);
}

// Function to render products
function renderProducts(products) {
    // Placeholder for rendering product elements to the DOM
    console.log('Rendering products:', products);
}

// Function to shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

// Call initialize function on page load
document.addEventListener('DOMContentLoaded', initializeShopPage);