/**
 * store.js — Wallify Store (Fully Functional)
 */

console.log("STORE LOADED");

/* ------------------ UTILITIES ------------------ */

// Fisher-Yates shuffle
function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Create product card
function createPosterCard(p) {
    const div = document.createElement("div");
    div.className = "poster-card";

    div.innerHTML = `
        <img src="${p.image}" alt="${p.title}" style="width:100%; border-radius:8px;">
        <h3>${p.title}</h3>
        <p>₹${p.basePrice}</p>
        <button class="add-btn">Add to Cart</button>
    `;

    return div;
}

/* ------------------ MAIN STORE ------------------ */

function initializeStore({
    products = [],
    gridContainerId = "products",
    paginationContainerId = "pagination",
    resultsCountId = "results-count",
    filterSelector = ".filter-pill",
    searchInputId = "search",
    sortSelectId = "sort",
    itemsPerPage = 16
}) {

    let currentCategory = "All";
    let searchQuery = "";
    let currentSort = "default";
    let currentPage = 1;

    const grid = document.getElementById(gridContainerId);
    const pagination = document.getElementById(paginationContainerId);
    const resultsCount = document.getElementById(resultsCountId);
    const filters = document.querySelectorAll(filterSelector);
    const searchInput = document.getElementById(searchInputId);
    const sortSelect = document.getElementById(sortSelectId);

    if (!grid) {
        console.error("Grid container not found");
        return;
    }

    function render() {

        // FILTER
        let filtered = products.filter(p => {
            const matchCat = currentCategory === "All" || p.category === currentCategory;
            const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCat && matchSearch;
        });

        // SORT
        if (currentSort === "low") {
            filtered.sort((a, b) => a.basePrice - b.basePrice);
        } else if (currentSort === "high") {
            filtered.sort((a, b) => b.basePrice - a.basePrice);
        } else if (currentSort === "az") {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else {
            filtered = shuffleArray(filtered);
        }

        // RESULTS COUNT
        if (resultsCount) {
            resultsCount.textContent = `${filtered.length} products found`;
        }

        // PAGINATION
        const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = 1;

        const start = (currentPage - 1) * itemsPerPage;
        const pageItems = filtered.slice(start, start + itemsPerPage);

        // GRID RENDER
        grid.innerHTML = "";

        if (pageItems.length === 0) {
            grid.innerHTML = `<p style="text-align:center;">No products found</p>`;
        } else {
            pageItems.forEach(p => {
                grid.appendChild(createPosterCard(p));
            });
        }

        // PAGINATION BUTTONS
        if (pagination) {
            pagination.innerHTML = "";

            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement("button");
                btn.textContent = i;

                if (i === currentPage) {
                    btn.style.fontWeight = "bold";
                }

                btn.onclick = () => {
                    currentPage = i;
                    render();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                };

                pagination.appendChild(btn);
            }
        }
    }

    /* ------------------ EVENTS ------------------ */

    filters.forEach(f => {
        f.addEventListener("click", () => {
            currentCategory = f.dataset.category || "All";
            currentPage = 1;

            filters.forEach(btn => btn.classList.remove("active"));
            f.classList.add("active");

            render();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value;
            currentPage = 1;
            render();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            currentSort = e.target.value;
            render();
        });
    }

    render();
}

/* ------------------ INIT ------------------ */

document.addEventListener("DOMContentLoaded", () => {

    if (typeof products === "undefined") {
        console.error("products not found. Check data.js");
        return;
    }

    initializeStore({
        products: products,
        gridContainerId: "products",
        paginationContainerId: "pagination",
        resultsCountId: "results-count",
        filterSelector: ".filter-pill",
        searchInputId: "search",
        sortSelectId: "sort",
        itemsPerPage: 12
    });

});
