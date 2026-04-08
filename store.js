/**
 * store.js — Wallify Store
 * Logic for shop page: Filtering, Sorting, Pagination, and Dynamic Grid.
 */


function initializeStore({  products, ...rest }) {
    console.log("STORE INIT");
    console.log(products);
    products,
    gridContainerId,
    paginationContainerId,
    resultsCountId,
    filterSelector,
    searchInputId,
    sortSelectId,
    itemsPerPage = 16
} {
    let currentCategory = 'All';
    let searchQuery = '';
    let currentSort = 'default';
    let currentPage = 1;

    const grid = document.getElementById(gridContainerId);
    const pagination = document.getElementById(paginationContainerId);
    const resultsCount = document.getElementById(resultsCountId);
    const filters = document.querySelectorAll(filterSelector);
    const searchInput = document.getElementById(searchInputId);
    const sortSelect = document.getElementById(sortSelectId);

    if (!grid) return;

    function render() {
        // Filter
        let filtered = products.filter(p => {
            const matchCat = currentCategory === 'All' || p.category === currentCategory;
            const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCat && matchSearch;
        });

        // Sort & Randomize
        if (currentSort === 'low') {
            filtered.sort((a, b) => a.basePrice - b.basePrice);
        } else if (currentSort === 'high') {
            filtered.sort((a, b) => b.basePrice - a.basePrice);
        } else if (currentSort === 'az') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else {
            // Default: True Fisher-Yates Randomness on every load
            filtered = shuffleArray(filtered);
        }

        // Update Results Count
        if (resultsCount) {
            resultsCount.textContent = `${filtered.length} products found`;
        }

        // Paginate
        const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = 1;
        
        const start = (currentPage - 1) * itemsPerPage;
        const pageItems = filtered.slice(start, start + itemsPerPage);

        // Render Grid
        grid.innerHTML = '';
        if (pageItems.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 80px 20px; color: var(--text-muted);">
                    <i class="fas fa-search" style="font-size: 3rem; opacity: 0.2; margin-bottom: 24px;"></i>
                    <h3>No posters found for your criteria.</h3>
                </div>
            `;
        } else {
            pageItems.forEach((p, index) => {
                grid.appendChild(createPosterCard(p, index));
            });
            // Initialize reveal animations for new cards
            initScrollReveal();
        }

        // Render Pagination
        if (pagination) {
            pagination.innerHTML = '';
            if (totalPages > 1) {
                for (let i = 1; i <= totalPages; i++) {
                    const btn = document.createElement('button');
                    btn.className = `filter-pill ${i === currentPage ? 'active' : ''}`;
                    btn.textContent = i;
                    btn.onclick = () => {
                        currentPage = i;
                        render();
                        window.scrollTo({ top: 200, behavior: 'smooth' });
                    };
                    pagination.appendChild(btn);
                }
            }
        }
    }

    // Event Listeners
    filters.forEach(f => {
        f.addEventListener('click', () => {
            currentCategory = f.dataset.category;
            filters.forEach(btn => btn.classList.remove('active'));
            f.classList.add('active');
            currentPage = 1;
            render();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            currentPage = 1;
            render();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            render();
        });
    }

    // Initial Render
    render();
}
