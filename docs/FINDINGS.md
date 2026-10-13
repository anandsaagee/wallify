# Findings — Wallify Store

> Bugs, dead code, duplicates, security issues, and suggested future improvements.
> Nothing is fixed here — all items are listed only.
> Fix each item in a separate, explicitly approved PR.

---

## 🔴 CRITICAL — Security

### F-SEC-01 · `.env` committed with live Cloudinary secrets
**File**: `.env`
**Detail**: `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are committed in plaintext.
Even though `.env` is listed in `.gitignore`, it is already tracked by git (it was committed before being added to `.gitignore`). Anyone with repo access can read these secrets via `git log`, `git show`, or the GitHub UI.
**Risk**: Full read/write/delete access to the Cloudinary account — all product images could be destroyed or replaced.
**Action required**:
1. Rotate credentials at https://cloudinary.com/console immediately.
2. Run `git rm --cached .env` and commit to stop tracking it.
3. Use `.env.example` (already added in this cleanup) for documentation.
4. Audit git history for prior exposure: `git log --all --full-history -- .env`

---

## 🟠 HIGH — Bugs / Broken Features

### F-BUG-01 · SizeFilter is a complete no-op
**Files**: `src/components/SizeFilter.tsx`, `src/hooks/useProductFilters.ts`
**Detail**: The size filter UI renders correctly and maintains state (`selectedSize`), but `filteredProducts` in `useProductFilters.ts` never reads `selectedSize` — it only filters by `selectedCategory` and `searchQuery`. Selecting A4 or A5 has zero effect on the product grid.
**Suggested fix**: Add `selectedSize` to the filter predicate in `useProductFilters.ts`.

### F-BUG-02 · Pincode validation gap (invalid ranges accepted)
**File**: `src/components/Checkout.tsx:34-54`
**Detail**: The pincode validation accepts prefixes 100–855 as valid. However, prefixes 644–669 (gap between Tamil Nadu and Kerala), 700–779 (gap), and 800–779 do not map to any zone and silently fall through to "All India". Indian pincodes for Lakshadweep (682) are also not specifically handled.

### F-BUG-03 · `shuffleArray` re-runs on every search keystroke
**File**: `src/hooks/useProductFilters.ts:63`
**Detail**: `filteredProducts` calls `shuffleArray(filtered)` inside `useMemo`, meaning the card order randomises every time the user types a character in the search box. Cards jump around while typing.
**Suggested fix**: Use a stable sort seed, or only shuffle once per category change (not on search).

### F-BUG-04 · `LoadingSkeleton` shimmer duration mismatch
**File**: `src/components/LoadingSkeleton.tsx:25`
**Detail**: Uses `animate-[shimmer_1.5s_infinite]` (1.5 s) while `tailwind.config.js` defines the named `shimmer` animation at 2 s. These differ because the inline arbitrary class bypasses the Tailwind config value. The named class `animate-shimmer` would use the configured 2 s duration.

### F-BUG-05 · `delivey-calc/index.html` references different brand & pricing
**File**: `delivery-calc/index.html`
**Detail**: This prototype page shows brand name "ArtPoster Store", uses Unsplash placeholder images, price ₹399, coupon code `ARTFREE`, and its shipping zone lookup uses an exhaustive prefix array (safe, but out of sync with `Checkout.tsx`'s range-based approach). Not linked from the app — harmless but confusing if found.

---

## 🟡 MEDIUM — Duplicate / Scattered Code

### F-DUP-01 · `shuffleArray` implemented in 3 files
**Files**: `src/hooks/useProductFilters.ts:28-35`, `src/utils/bestSellerTracker.ts:4-11`, `js/store.js:~48`
**Suggested fix**: Move to `src/utils/arrayHelpers.ts` and import from there.

### F-DUP-02 · `BULK_OFFERS_INLINE` duplicates `BULK_OFFERS` in config
**Files**: `src/components/ProductPreview.tsx:62-67`, `src/data/config.ts:22-27`
**Detail**: Identical array (buy/free pairs) defined twice. If offers change in `config.ts`, the ProductPreview inline copy must be updated manually.
**Suggested fix**: Import `BULK_OFFERS` from `../data/config` in ProductPreview and remove the local copy. *(Approved in Step C1 — executed.)*

### F-DUP-03 · Sitemap generator duplicated in JS and Python
**Files**: `scripts/generate-sitemap.js` (used in build), `scripts/generate_sitemap.py` (unused)
**Suggested fix**: Delete `generate_sitemap.py`; it is fully superseded.

### F-DUP-04 · Title-clean + slug logic duplicated between seoHelpers and sitemap generator
**Files**: `src/utils/seoHelpers.ts:13-16`, `scripts/generate-sitemap.js:73-76`
**Detail**: The regex to strip "Minimalist … Poster – Premium Matte Finish" from titles and the slug generation pattern are copy-pasted. If the title format changes, both must be updated.

### F-DUP-05 · Three redundant product-data management scripts
**Files**: `scripts/fix-products.cjs`, `scripts/regenerate-products.cjs`, `scripts/sync-products.cjs`
**Detail**: All three write to `src/data/products.ts` from `public/assets/`. Each was added for a different one-off task and none were removed. It's unclear which is the "canonical" script.

### F-DUP-06 · `public/` directory mirrors `public-deploy/`
**Files**: `public/404.html`, `public/favicon.jpg`, `public/wallify-logo.jpg`, `public/google*.html`, `public/robots.txt`, `public/sitemap.xml`
**Detail**: Vite's `publicDir` is set to `public-deploy/`, not `public/`. Files in `public/` are never served in production. They are stale duplicates.

### F-DUP-07 · WhatsApp phone number in 3 places
**Files**: `src/components/Hero.tsx:169`, `src/components/Checkout.tsx:110`, `delivery-calc/index.html`
**Suggested fix**: Extract to `src/data/config.ts` as `WHATSAPP_PHONE = '917736497186'` and import.

### F-DUP-08 · Site URL `wallifystore.in` hard-coded 15+ times
**Files**: `src/App.tsx` (7×), `src/components/ProductPreview.tsx` (5×), `src/components/SEO.tsx` (2×), `src/components/Footer.tsx`, `scripts/generate-sitemap.js`
**Suggested fix**: Extract to `src/data/config.ts` as `SITE_URL = 'https://wallifystore.in'` and import.

### F-DUP-09 · Instagram URL duplicated in Header and Footer
**Files**: `src/components/Header.tsx:49`, `src/components/Footer.tsx:50`

### F-DUP-10 · Keyframes `shimmer` and `pulseDot` defined twice
**Files**: `src/styles/index.css:145-153`, `tailwind.config.js:39-46`

---

## 🟡 MEDIUM — Dead / Unused Code

### F-DEAD-01 · `js/store.js` — orphaned legacy vanilla JS
**File**: `js/store.js`
**Detail**: References `shuffleArray`, `createPosterCard`, and `initScrollReveal` which are never defined in the file. Not imported anywhere in the React app. Would throw `ReferenceError` if executed. Moved to `_archive/` in this cleanup.

### F-DEAD-02 · File `h` — git log accidentally committed
**File**: `h` (root)
**Detail**: Contains output of `git log --oneline` from the project's early history. Not code. Moved to `_archive/` in this cleanup.

### F-DEAD-03 · `public/assets/` — local image copies never served
**Files**: `public/assets/MUSIC/` (76 files), `public/assets/SPIRITUAL/` (7 files)
**Detail**: All product images are served from Cloudinary. These local copies are never referenced in production.

### F-DEAD-04 · `public/custom-posters/webp/` — 20 unreferenced images
**Files**: `public/custom-posters/webp/*.webp`
**Detail**: No product in `products.ts` references these paths.

### F-DEAD-05 · `scripts/generate_sitemap.py` — unused Python duplicate
**File**: `scripts/generate_sitemap.py`
**Detail**: Not called from any npm script or CI step.

### F-DEAD-06 · `scripts/generateAutomotiveVisionSEO.py` — unused Python script
**File**: `scripts/generateAutomotiveVisionSEO.py`
**Detail**: A Python equivalent of `generateAutomotiveVisionSEO.cjs`. Neither is called from npm scripts.

### F-DEAD-07 · `tailwind.config.js` animations never used
**File**: `tailwind.config.js:46-69`
**Detail**: `slideUp`, `slideDown`, `fadeIn`, `fadeOut` are configured but never referenced in any component. `BottomSheet.tsx` implements its own transitions via inline styles.

### F-DEAD-08 · Unused `titleCase()` function in `fix-products.cjs`
**File**: `scripts/fix-products.cjs:42-48`
**Detail**: Function is declared but never called within the file.

### F-DEAD-09 · `delivery-calc/` and `shipping-calculator/` standalone pages
**Files**: `delivery-calc/index.html`, `shipping-calculator/index.html`
**Detail**: Not linked from the app. Not served via Vite build. They are standalone prototype pages.

### F-DEAD-10 · `cloudinary-urls.json` — output artifact not used at runtime
**File**: `cloudinary-urls.json`
**Detail**: Output of `scripts/upload-to-cloudinary.cjs`. Not imported by any source file. Safe to archive once Cloudinary upload history is no longer needed.

---

## 🟡 MEDIUM — Accessibility Issues

### F-A11Y-01 · `aria-pressed` on `<a>` element
**File**: `src/components/CategoryFilter.tsx:29`
**Detail**: `aria-pressed` is a valid ARIA attribute only on elements with `role="button"` or `<button>`. Using it on `<a>` is invalid per WAI-ARIA spec.

### F-A11Y-02 · Non-semantic clickable `<div>` in HeroBestSellers
**File**: `src/components/HeroBestSellers.tsx:36-43`
**Detail**: Uses `<div role="button" tabIndex={0}>` with manual `onKeyDown`. Should be `<button>`.

---

## 🔵 LOW — Code Quality / Maintainability

### F-QUAL-01 · `strict: false` in TypeScript config
**File**: `tsconfig.json:14`
**Detail**: Disables null checks, implicit any, and other safety checks. Many latent bugs are likely hidden.

### F-QUAL-02 · `noUnusedLocals` and `noUnusedParameters` disabled
**File**: `tsconfig.json:15-16`
**Detail**: The 4 ESLint errors in the baseline (unused `useRef`, `useEffect`, `currentView`) would be caught at compile time with these enabled.

### F-QUAL-03 · FAQ prices hard-coded as text, out of sync with config
**File**: `src/components/FAQ.tsx:9-40`
**Detail**: Prices (₹29, ₹49, ₹79, ₹149) and bulk offer tiers are typed as literal strings in FAQ answers. If `config.ts` values change, FAQ becomes incorrect with no compile-time warning.

### F-QUAL-04 · Cloudinary cloud name hard-coded in source and `.env`
**Files**: `src/utils/imageUrl.ts:11`, `.env`
**Detail**: Inconsistent: runtime code has it hard-coded; scripts read it from env. Should use `import.meta.env.VITE_CLOUDINARY_CLOUD_NAME` (requires adding a `VITE_` prefix to the env var).

### F-QUAL-05 · `generate-sitemap.js` parses TypeScript with regex
**File**: `scripts/generate-sitemap.js:24-46`
**Detail**: Reads `products.ts` as raw text and extracts data via regex instead of importing it. Fragile — will break if the array formatting changes.

### F-QUAL-06 · `sync-products.cjs` parses `products.ts` with regex
**File**: `scripts/sync-products.cjs:20`
**Detail**: Same issue as above — `content.match(/export const products = (\[[\s\S]*?\]);/)` — brittle regex extraction.

### F-QUAL-07 · `@ts-expect-error` suppressor in OptimizedImage
**File**: `src/components/OptimizedImage.tsx:62`
**Detail**: Used for `fetchpriority` prop. This will become a lint error once React types are updated. Should be replaced with a proper type assertion.

### F-QUAL-08 · `SEO.tsx` does imperative DOM mutation instead of declarative head management
**File**: `src/components/SEO.tsx`
**Detail**: Manually creates/updates `<meta>`, `<link>`, `<script>` tags in `document.head` via `useEffect`. Library `react-helmet-async` or React 19's native `<title>` / `<meta>` support would be cleaner and SSR-safe.

### F-QUAL-09 · Cart localStorage key versioned by hand
**File**: `src/hooks/useCart.tsx:45`
**Detail**: `'wallify_cart_v4'` — the version suffix means previous carts are silently abandoned. No migration path. If the cart schema changes again, old users lose their cart.

### F-QUAL-10 · `seo/` directory contents not linked from anywhere
**Files**: `seo/SEO-REPORT.md`, `seo/keyword-map.md`
**Detail**: Valuable SEO strategy docs that are not referenced from README or any other doc.
