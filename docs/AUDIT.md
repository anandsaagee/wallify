# Audit — Wallify Store

> Phase 1: Read-only analysis. No files changed.

---

## 1. Project Overview

**Wallify Store** is a React + TypeScript single-page e-commerce app that sells printed wall posters.
It does NOT have a backend — orders are submitted via WhatsApp deeplink. Product images are hosted on Cloudinary. The entire product catalogue is a static TypeScript file baked into the bundle.

---

## 2. Folder Tree — What Each Item Actually Does

```
wallify-store/
│
├── src/                          ← React/TS application source
│   ├── App.tsx                   ← Root layout, routing state, product click handler (432 lines — LARGE)
│   ├── main.tsx                  ← ReactDOM.render entry point
│   ├── components/               ← UI components (all flat — no sub-folders)
│   │   ├── Hero.tsx              ← Landing section with tagline, live stats, CTAs (203 lines)
│   │   ├── Header.tsx            ← Top nav bar with logo, cart icon, Instagram link (105 lines)
│   │   ├── Footer.tsx            ← Footer with social links, policy text (67 lines)
│   │   ├── HeroBestSellers.tsx   ← Horizontal scroll strip of "best seller" products (72 lines)
│   │   ├── FeaturedCategories.tsx← Category card grid (94 lines)
│   │   ├── CategoryFilter.tsx    ← Horizontal pill filter for categories (42 lines)
│   │   ├── SizeFilter.tsx        ← Size pill selector (43 lines)
│   │   ├── ProductGrid.tsx       ← Infinite-scroll product card grid (202 lines)
│   │   ├── ProductPreview.tsx    ← Product detail bottom-sheet (520 lines — LARGE)
│   │   ├── BottomSheet.tsx       ← Reusable animated modal/sheet (123 lines)
│   │   ├── Checkout.tsx          ← Order form + WhatsApp submit (477 lines — LARGE)
│   │   ├── Pricing.tsx           ← Static pricing table (41 lines)
│   │   ├── BulkOffers.tsx        ← Bulk discount display (36 lines)
│   │   ├── FAQ.tsx               ← Accordion FAQ section (125 lines)
│   │   ├── SEO.tsx               ← Injects <title>, <meta>, JSON-LD via React portals (84 lines)
│   │   ├── OptimizedImage.tsx    ← Lazy image with Cloudinary URL transform (81 lines)
│   │   └── LoadingSkeleton.tsx   ← Skeleton pulse placeholder (28 lines)
│   ├── data/
│   │   ├── products.ts           ← 1448-product static array (13,697 lines — VERY LARGE)
│   │   ├── config.ts             ← SIZES, FRAME_SIZES, BULK_OFFERS, CATEGORIES, ITEMS_PER_PAGE (62 lines)
│   │   └── categorySeo.ts        ← SEO copy (h1, meta title/desc, snippet) per category (121 lines)
│   ├── hooks/
│   │   ├── useCart.tsx           ← Cart state: Context, Provider, CartItem type (221 lines)
│   │   └── useProductFilters.ts  ← Filtering/search logic (95 lines)
│   ├── utils/
│   │   ├── seoHelpers.ts         ← Title, slug, alt-text, description generators (117 lines)
│   │   ├── imageUrl.ts           ← Cloudinary URL builder with transforms (87 lines)
│   │   └── bestSellerTracker.ts  ← localStorage click-count tracker for trending (≈50 lines)
│   └── styles/
│       └── index.css             ← Tailwind directives + custom animations/keyframes
│
├── scripts/                      ← Node/Python one-off data scripts
│   ├── generate-sitemap.js       ← Reads products.ts, writes public/sitemap.xml + robots.txt (109 lines)
│   ├── upload-to-cloudinary.cjs  ← Batch upload local images to Cloudinary (216 lines)
│   ├── generateAutomotiveVisionSEO.cjs ← GPT/Vision-based SEO tag generator for Automotive (100 lines)
│   ├── generateAutomotiveVisionSEO.py  ← Python equivalent of above (103 lines)
│   └── generate_sitemap.py       ← Older Python sitemap generator (60 lines — DUPLICATE)
│
├── public-deploy/                ← Vite's publicDir (NOT public/) — static assets copied to dist/
│   ├── 404.html                  ← SPA fallback page
│   ├── favicon.jpg               ← Favicon
│   ├── wallify-logo.jpg          ← Brand logo
│   ├── google4e7741b3fade07da.html ← Google Search Console verification
│   ├── robots.txt                ← Overwritten on each build by generate-sitemap.js
│   └── sitemap.xml               ← Overwritten on each build by generate-sitemap.js
│
├── public/                       ← NOT used by Vite build (publicDir = 'public-deploy')
│   ├── 404.html                  ← DUPLICATE of public-deploy/404.html
│   ├── assets/                   ← Local product images (NOT served — images are on Cloudinary)
│   │   ├── MUSIC/                ← 76 MUSIC-*.webp images
│   │   └── SPIRITUAL/            ← 7 SPIRITUAL-*.webp images
│   ├── custom-posters/webp/      ← 20 custom poster webp files
│   ├── favicon.jpg               ← DUPLICATE of public-deploy/favicon.jpg
│   ├── wallify-logo.jpg          ← DUPLICATE of public-deploy/wallify-logo.jpg
│   ├── google4e7741b3fade07da.html ← DUPLICATE
│   ├── robots.txt                ← DUPLICATE (outdated — not used in build)
│   └── sitemap.xml               ← DUPLICATE (outdated — not used in build)
│
├── seo/
│   ├── SEO-REPORT.md             ← Manual SEO audit notes
│   └── keyword-map.md            ← Keyword strategy doc
│
├── delivery-calc/
│   └── index.html                ← Standalone HTML delivery calculator (NOT part of app)
│
├── shipping-calculator/
│   └── index.html                ← Another standalone HTML shipping tool (NOT part of app)
│
├── js/
│   └── store.js                  ← LEGACY vanilla JS store (127 lines) — NOT imported by React app
│
├── h                             ← Git log output accidentally committed as a file (95 lines of git log)
│
├── cloudinary-urls.json          ← JSON mapping of all Cloudinary upload URLs
├── fix-products.cjs              ← One-off script: fixes product data format (178 lines)
├── regenerate-products.cjs       ← One-off script: rebuilds products.ts (99 lines)
├── sync-products.cjs             ← One-off script: syncs products (81 lines)
├── updateAutomotiveSEO.cjs       ← One-off script: patches Automotive SEO fields (63 lines)
├── updateProductsSEO.cjs         ← One-off script: patches all product SEO fields (64 lines)
│
├── index.html                    ← Vite HTML entry point
├── vite.config.ts                ← Build config (publicDir, chunks, targets)
├── tailwind.config.js            ← Theme (custom colors, fonts, animations)
├── tsconfig.json                 ← TypeScript config (strict=false, noEmit)
├── postcss.config.js             ← PostCSS (tailwind + autoprefixer)
├── .eslintrc.cjs                 ← ESLint (TS + react-hooks + react-refresh)
├── .env                          ← Cloudinary credentials (see FINDINGS — COMMITTED SECRET)
├── vercel.json                   ← SPA rewrite rules + cache headers
├── .gitignore                    ← Standard Vite gitignore
├── .replit                       ← Replit config (project also used on Replit)
└── .github/workflows/codeql.yml  ← GitHub CodeQL security scan
```

---

## 3. Entry Points, Routing & State

### Entry Point
`index.html` → `src/main.tsx` → `<App />` wrapped in `<CartProvider>`

### Routing
**No router library.** Routing is simulated with:
- `window.history.pushState()` for deep links to products (`/posters/:category/:slug`)
- `window.location.pathname` parsed on mount to restore product state
- A `view` state (`'store' | 'checkout'`) that switches between main store and checkout

### State
| State | Location | Mechanism |
|---|---|---|
| Cart items | `useCart.tsx` | React Context + localStorage (`wallify_cart_v4`) |
| Active category filter | `useProductFilters.ts` | Local state |
| Search query | `useProductFilters.ts` | Local state |
| Size filter | `useProductFilters.ts` | Local state |
| Selected product | `App.tsx` | Local state |
| Current view (store/checkout) | `App.tsx` | Local state |
| Shipping zone | `Checkout.tsx` | Local state derived from pincode |

### API Calls
**None** — no backend or API. All data is:
- Products: static TypeScript array in `src/data/products.ts`
- Images: Cloudinary CDN (URLs built by `src/utils/imageUrl.ts`)
- Orders: WhatsApp deeplink (`https://wa.me/917736497186`)

### Data Sources
| Source | Where used |
|---|---|
| `src/data/products.ts` | `App.tsx`, `FeaturedCategories`, `HeroBestSellers`, `scripts/generate-sitemap.js` |
| `src/data/config.ts` | `useCart`, `Pricing`, `SizeFilter`, `ProductPreview`, `FeaturedCategories` |
| `src/data/categorySeo.ts` | `App.tsx` only |
| Cloudinary CDN | `OptimizedImage` via `imageUrl.ts` |
| localStorage | `useCart` (cart persistence), `bestSellerTracker` (click counts) |

### Environment Variables
| Var | Used by | Purpose |
|---|---|---|
| `CLOUDINARY_CLOUD_NAME` | `scripts/upload-to-cloudinary.cjs` | Cloudinary upload |
| `CLOUDINARY_API_KEY` | `scripts/upload-to-cloudinary.cjs` | Cloudinary upload |
| `CLOUDINARY_API_SECRET` | `scripts/upload-to-cloudinary.cjs` | Cloudinary upload |

> NOTE: The cloud name is ALSO hard-coded in `src/utils/imageUrl.ts:11` as `'dkwx4bacj'`.
> The API key and secret are only needed for upload scripts (not at runtime).

---

## 4. Giant Files / Files Doing Multiple Jobs

| File | Lines | Problem |
|---|---|---|
| `src/data/products.ts` | 13,697 | Single huge static data array — not editable by humans, must be generated |
| `src/components/ProductPreview.tsx` | 520 | Does: SEO injection, size selection, frame toggle, cart add, share, bulk offers display, product description — **6 jobs** |
| `src/components/Checkout.tsx` | 477 | Does: cart display, shipping zone calculation, form handling, WhatsApp message building, order state — **5 jobs** |
| `src/App.tsx` | 432 | Does: deep-link routing, SEO JSON-LD, cart toast, floating cart button, all layout orchestration — **5 jobs** |
| `src/hooks/useCart.tsx` | 221 | Exports both `CartProvider` component AND cart types — mixing concerns (flagged by ESLint) |

---

## 5. Duplicate / Near-Duplicate Code

| Issue | Files |
|---|---|
| Shipping zone ranges duplicated | `Checkout.tsx` inline + `delivery-calc/index.html` + `shipping-calculator/index.html` — 3 separate implementations |
| Sitemap generator duplicated | `scripts/generate-sitemap.js` (JS) + `scripts/generate_sitemap.py` (Python) — same output, two implementations |
| `BULK_OFFERS_INLINE` array in `ProductPreview.tsx` duplicates `BULK_OFFERS` in `config.ts` — same values hard-coded twice |
| Bulk offer display duplicated | `BulkOffers.tsx` (used on main page) + inline block inside `ProductPreview.tsx` |
| `public/` directory mirrors `public-deploy/` | `404.html`, `favicon.jpg`, `wallify-logo.jpg`, `google*.html`, `robots.txt`, `sitemap.xml` all duplicated |
| WhatsApp phone number | Hard-coded in 3 places: `Hero.tsx`, `Checkout.tsx`, `delivery-calc/index.html` |
| `wallifystore.in` domain | Hard-coded across 8+ files; no single constant |

---

## 6. Inconsistent Naming

| Problem | Examples |
|---|---|
| Mix of kebab-case, PascalCase, camelCase in scripts | `generate-sitemap.js` vs `generateAutomotiveVisionSEO.cjs` vs `fix-products.cjs` |
| Two sitemap scripts with different names | `generate-sitemap.js` (used in build) vs `generate_sitemap.py` (unused) |
| `HeroBestSellers` is not a "Hero" sub-component — it's a product row | Naming misleads about what it does |
| `useCart.tsx` exports both a Context Provider (component) and a hook | Should be `.tsx` for the provider, `.ts` for the hook — it's mixed |
| Scripts at root vs in `scripts/` | `fix-products.cjs`, `regenerate-products.cjs`, `sync-products.cjs`, `updateAutomotiveSEO.cjs`, `updateProductsSEO.cjs` are all at root; `generate-sitemap.js` is in `scripts/` |
| `h` file | No extension, no name. Contains git log output accidentally committed |

---

## 7. Hard-Coded Values Scattered Across Files

| Value | Locations |
|---|---|
| WhatsApp phone `917736497186` | `Hero.tsx:169`, `Checkout.tsx:110`, `delivery-calc/index.html` |
| Site URL `https://wallifystore.in` | `App.tsx` (7×), `ProductPreview.tsx` (5×), `SEO.tsx` (2×), `Footer.tsx` (1×) |
| Cloudinary cloud name `dkwx4bacj` | `imageUrl.ts:11` (code) + `.env` (env var) — inconsistent |
| Instagram URL `instagram.com/wallifystore.in` | `Header.tsx:49`, `Footer.tsx:50` |
| Bulk surcharge threshold `25 posters / ₹10` | `Checkout.tsx:58`, mentioned in UI text at line 361 |
| Shipping zones (Kerala, South India, etc.) | `Checkout.tsx` (inline logic), `delivery-calc/index.html`, `shipping-calculator/index.html` |
| `BULK_OFFERS_INLINE` array | `ProductPreview.tsx:62-67` — duplicates `config.ts:22-27` |
| localStorage key `wallify_cart_v4` | `useCart.tsx:45` only — OK, but undocumented |

---

## 8. Dead / Unused Files (flagged, not deleted)

| File | Why it's dead |
|---|---|
| `js/store.js` | Legacy vanilla JS store from v1; not imported anywhere in React app |
| `h` | Git log accidentally committed as a file |
| `public/` directory | Vite's `publicDir` is `public-deploy/`; contents of `public/` are never served in production |
| `public/assets/MUSIC/` (76 webp) | Images on Cloudinary; local copies unused |
| `public/assets/SPIRITUAL/` (7 webp) | Same as above |
| `public/custom-posters/webp/` (20 webp) | Not referenced in any `products.ts` entry |
| `scripts/generate_sitemap.py` | Python duplicate of `scripts/generate-sitemap.js`; not in npm scripts |
| `scripts/generateAutomotiveVisionSEO.py` | Python duplicate of `.cjs` version; not called from anywhere |
| `delivery-calc/index.html` | Standalone HTML tool, not linked from app |
| `shipping-calculator/index.html` | Standalone HTML tool, not linked from app |
| `cloudinary-urls.json` | Output of upload script; not imported by any source file |
| `regenerate-products.cjs` | One-off data management script; not in npm scripts |
| `fix-products.cjs` | One-off data fix; not in npm scripts |
| `sync-products.cjs` | One-off sync; not in npm scripts |
| `updateAutomotiveSEO.cjs` | One-off SEO patcher; not in npm scripts |
| `updateProductsSEO.cjs` | One-off SEO patcher; not in npm scripts |
| `seo/` directory | Markdown notes; not referenced in build |

---

## 9. Secrets / Security Issues

| Issue | Severity | Detail |
|---|---|---|
| **Cloudinary API Secret in `.env`** | 🔴 CRITICAL | `.env` contains `CLOUDINARY_API_SECRET=BoUqI5pFDkA_B7fyx1cKm0Z6nmM`. If `.env` is in git history or `.gitignore` ever missed it, this is a live exposed secret. Rotate immediately. |
| **Cloudinary API Key in `.env`** | 🟠 HIGH | `CLOUDINARY_API_KEY=731255274874364` — same risk as above |
| **Cloudinary cloud name hard-coded in source** | 🟡 MEDIUM | `imageUrl.ts:11` — cloud name is not sensitive, but inconsistent with env var approach |
| **WhatsApp phone visible in source** | 🟡 MEDIUM | `917736497186` — not a secret (phone numbers are public), but it's scattered across files |

---

## 10. Missing Comments / Docs

| File | Problem |
|---|---|
| `src/data/products.ts` | No header explaining format, how to add products, or that it's auto-generated |
| `src/components/Checkout.tsx` | Shipping zone logic (pincode prefix ranges) has no comment explaining the mapping |
| `src/utils/bestSellerTracker.ts` | Purpose and localStorage key undocumented at file level |
| `src/hooks/useProductFilters.ts` | No header comment |
| `scripts/upload-to-cloudinary.cjs` | Purpose and usage instructions not in file |
| `fix-products.cjs`, `regenerate-products.cjs`, `sync-products.cjs` | No instructions for when/why to run |
| Root directory | No `README.md` |
| Root directory | No `.env.example` |

---

## 11. Pre-existing ESLint Errors (Baseline)

These existed before this branch was created:

| File | Error |
|---|---|
| `FAQ.tsx:9` | `react-refresh/only-export-components` warning (exports non-component constant) |
| `Header.tsx:12` | `@typescript-eslint/no-unused-vars` — `currentView` prop declared but never used |
| `Hero.tsx:1` | `@typescript-eslint/no-unused-vars` — `useRef` imported but not used |
| `ProductPreview.tsx:1` | `@typescript-eslint/no-unused-vars` — `useEffect` imported but not used |
| `SEO.tsx:9` | `@typescript-eslint/no-explicit-any` — JSON-LD typed as `any` |
