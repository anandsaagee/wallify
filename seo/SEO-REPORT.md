# SEO Audit & Implementation Report

## 1. Initial State Audit
- **Framework & Structure**: React + Vite (Single Page Application). No routing library is present, meaning all views (category toggle, product modal) happened on a single URL (`/`).
- **Head Tags**: Default `index.html` contained generic title ("Premium Wall Posters – Film, Anime & Car Art | Wallifystore") and meta descriptions. No dynamic updates.
- **Structured Data**: None.
- **Images**: Using `OptimizedImage.tsx` which is good for WebP and Cloudinary, but `alt` texts were generic or just the product title. No semantic `<figure>` tags.
- **URLs**: Posters were rendered in a `BottomSheet` without changing the browser URL.
- **Sitemap/Robots**: Missing.

## 2. Implementations (What Changed)

### A. Dynamic SEO Component (`src/components/SEO.tsx`)
Built a custom, dependency-free `<SEO>` component that injects and updates:
- `<title>` and `<meta name="description">`
- Canonical URL (`<link rel="canonical">`)
- Open Graph & Twitter tags (for social sharing)
- **JSON-LD Structured Data** (Product Schema and WebSite SearchAction)

### B. URL & History Management (`src/components/ProductPreview.tsx`)
- Added `window.history.pushState` when a user opens a poster in the modal.
  - Example: `https://wallifystore.com/posters/anime/naruto-uzumaki-poster`
- On close, the URL reverts back using `window.history.back()`.
- Added the `<SEO>` component to inject specific `Product` schema, unique titles, and descriptions dynamically when viewed.
- Upgraded HTML to use semantic tags: wrapped the product content in `<article>`, the image in `<figure>`, and added a screen-reader-only `<figcaption>`.
- Enhanced `alt` text to be highly descriptive (e.g., "Premium Naruto wall poster in Anime style printed on high quality matte paper").

### C. Homepage SEO (`src/App.tsx`)
- Added `<SEO>` with the `WebSite` structured data schema to the main App wrapper, including a `SearchAction` structure so Google can eventually show a search box in search results.

### D. Automated Sitemap & Robots (`scripts/generate-sitemap.js` & `package.json`)
- Wrote a Node script that parses `products.ts` directly.
- It automatically generates `sitemap.xml` (with all categories and products) and `robots.txt` in the `/public` folder.
- Hooked this script into the `"build"` command in `package.json` so it runs natively on Vercel on every deployment.

## 3. SEO Checklist For Adding Future Posters
Because the SEO tags are dynamically generated using the product data, you **only** need to follow these rules when adding to `src/data/products.ts`:
1. **Title**: Include the subject clearly (e.g., "Attack on Titan Levi Ackerman").
2. **Category**: Ensure it matches existing ones or create a new clear one.
3. The `<SEO>` component will automatically generate the clean URL slug, the alt text, the Product JSON-LD, and the Title/Description tags.

## 4. Next Actions (Highest Impact)
1. **Google Search Console**: Go to [Google Search Console](https://search.google.com/search-console/about), verify `wallifystore.com`, and submit the new `https://wallifystore.com/sitemap.xml`.
2. **Google Merchant Center**: If running Google Shopping ads or wanting free product listings, create a Merchant Center account and provide the URL.
3. **SSR / Pre-rendering setup**: Since this is a client-side React app, Googlebot *can* execute JavaScript, but it's slower. Long term, consider migrating to Next.js or adding `prerender-spa-plugin` to serve static HTML to search engines.
4. **Category Descriptions**: Add a short 1-2 sentence paragraph at the top of the grid when a specific category (e.g., Anime) is selected to boost keyword relevance.
5. **Backlink Outreach**: Reach out to aesthetic room decor blogs or anime/movie forums and share the link to WallifyStore.
