# Code Map — "I want to change X, where do I go?"

Quick reference for common edits. Find what you want to change in the left column, then go to the file(s) on the right.

---

## 🏠 Homepage / Hero

| What to change | File | Where |
|---|---|---|
| Tagline / headline text | [`src/components/Hero.tsx`](../src/components/Hero.tsx) | `<h1>` near top of JSX |
| Live stats (X orders, X products) | [`src/components/Hero.tsx`](../src/components/Hero.tsx) | `stats` array, lines ~30–40 |
| Hero CTA button text or WhatsApp link | [`src/components/Hero.tsx`](../src/components/Hero.tsx) | Button JSX near bottom |
| WhatsApp phone number | [`src/components/Hero.tsx`](../src/components/Hero.tsx), [`src/components/Checkout.tsx`](../src/components/Checkout.tsx) | Hard-coded — see `FINDINGS.md F-DUP-07` |
| Best sellers strip | [`src/components/HeroBestSellers.tsx`](../src/components/HeroBestSellers.tsx) | Whole file |

---

## 💰 Pricing

| What to change | File | Where |
|---|---|---|
| **Poster prices (A6/A5/A4/A3)** | [`src/data/config.ts`](../src/data/config.ts) | `SIZES` array — `price` field |
| **Strike-through prices** | [`src/data/config.ts`](../src/data/config.ts) | `SIZES` array — `strikePrice` field |
| **Frame prices** | [`src/data/config.ts`](../src/data/config.ts) | `FRAME_SIZES` array |
| **Bulk offer tiers** (Buy 5 Get 1…) | [`src/data/config.ts`](../src/data/config.ts) | `BULK_OFFERS` array |
| Pricing display table | [`src/components/Pricing.tsx`](../src/components/Pricing.tsx) | Whole file |
| FAQ pricing text | [`src/components/FAQ.tsx`](../src/components/FAQ.tsx) | `FAQS` array — hard-coded strings ⚠️ not auto-synced with config |

---

## 📦 Products

| What to change | File | Where |
|---|---|---|
| All product data | [`src/data/products.ts`](../src/data/products.ts) | Generated file — edit via scripts instead |
| **Add new products** | Run `node scripts/regenerate-products.cjs` after adding images to `public/assets/` | — |
| **Fix a product title/SEO** | [`src/data/products.ts`](../src/data/products.ts) | Find by `id` or `title` and edit inline |
| Product categories list | [`src/data/config.ts`](../src/data/config.ts) | `CATEGORIES` array |
| Items per page (grid pagination) | [`src/data/config.ts`](../src/data/config.ts) | `ITEMS_PER_PAGE` |
| Product card layout / price display | [`src/components/ProductGrid.tsx`](../src/components/ProductGrid.tsx) | `ProductCard` component |
| Product bottom sheet / detail view | [`src/components/ProductPreview.tsx`](../src/components/ProductPreview.tsx) | Whole file |

---

## 🗂️ Categories

| What to change | File | Where |
|---|---|---|
| Category names/order | [`src/data/config.ts`](../src/data/config.ts) | `CATEGORIES` array |
| Category SEO (h1, meta title, meta description) | [`src/data/categorySeo.ts`](../src/data/categorySeo.ts) | `CATEGORY_SEO` record — one entry per category |
| Featured category cards (homepage) | [`src/components/FeaturedCategories.tsx`](../src/components/FeaturedCategories.tsx) | Whole file |
| Category filter pills | [`src/components/CategoryFilter.tsx`](../src/components/CategoryFilter.tsx) | Whole file |

---

## 🚚 Shipping

| What to change | File | Where |
|---|---|---|
| Shipping zone charges (Kerala/South/Remote/All India) | [`src/components/Checkout.tsx`](../src/components/Checkout.tsx) | `useEffect` near top — `zone` objects with `charge` field |
| Pincode prefix ranges | [`src/components/Checkout.tsx`](../src/components/Checkout.tsx) | Same `useEffect` — `prefix >= X && prefix <= Y` conditions |
| Bulk surcharge threshold | [`src/components/Checkout.tsx`](../src/components/Checkout.tsx) | `bulkSurcharge = totals.totalPaidItems > 25 ? 10 : 0` |

---

## 🎨 Design / Theme

| What to change | File | Where |
|---|---|---|
| **Primary color** (yellow `#FACB15`) | [`tailwind.config.js`](../tailwind.config.js) | `colors.primary` |
| Background color (`#0a0a0a`) | [`tailwind.config.js`](../tailwind.config.js) | `colors.background` |
| Surface/card colors | [`tailwind.config.js`](../tailwind.config.js) | `colors.surface`, `colors.card` |
| Fonts (DM Serif / DM Sans) | [`tailwind.config.js`](../tailwind.config.js) | `fontFamily.display` / `fontFamily.body` |
| Custom animations / keyframes | [`src/styles/index.css`](../src/styles/index.css) or [`tailwind.config.js`](../tailwind.config.js) | Both files have some — see `FINDINGS.md F-DUP-10` |
| Global CSS resets / base styles | [`src/styles/index.css`](../src/styles/index.css) | `@layer base` |

---

## 🔗 Branding / Social

| What to change | File | Where |
|---|---|---|
| Logo image | [`public-deploy/wallify-logo.jpg`](../public-deploy/wallify-logo.jpg) | Replace the file |
| Logo `src` in Header | [`src/components/Header.tsx`](../src/components/Header.tsx) | `<img src="/wallify-logo.jpg" ...>` |
| Logo `src` in Footer | [`src/components/Footer.tsx`](../src/components/Footer.tsx) | `<img src="/wallify-logo.jpg" ...>` |
| Instagram URL | [`src/components/Header.tsx`](../src/components/Header.tsx), [`src/components/Footer.tsx`](../src/components/Footer.tsx) | Hard-coded — see `FINDINGS.md F-DUP-09` |
| Site domain (`wallifystore.in`) | 8+ files | Hard-coded everywhere — see `FINDINGS.md F-DUP-08` |

---

## 📝 Content / Copy

| What to change | File | Where |
|---|---|---|
| FAQ questions & answers | [`src/components/FAQ.tsx`](../src/components/FAQ.tsx) | `FAQS` array |
| Footer tagline | [`src/components/Footer.tsx`](../src/components/Footer.tsx) | `<p>Premium posters at...` |
| Footer SEO text block | [`src/components/Footer.tsx`](../src/components/Footer.tsx) | SEO content `<p>` |
| Footer explore links | [`src/components/Footer.tsx`](../src/components/Footer.tsx) | Hard-coded `<a>` list |

---

## 🔍 SEO

| What to change | File | Where |
|---|---|---|
| Page `<title>` and `<meta description>` | [`src/App.tsx`](../src/App.tsx) | `<SEO>` component props |
| Per-category SEO | [`src/data/categorySeo.ts`](../src/data/categorySeo.ts) | `CATEGORY_SEO[CategoryName]` |
| Per-product SEO title/description | [`src/data/products.ts`](../src/data/products.ts) | `seoTitle`, `metaDescription` fields on each product |
| JSON-LD structured data | [`src/App.tsx`](../src/App.tsx) | `seoJsonLd` object (Organization, WebSite, BreadcrumbList, Product) |
| `<SEO>` component logic | [`src/components/SEO.tsx`](../src/components/SEO.tsx) | Whole file |
| Sitemap generation | [`scripts/generate-sitemap.js`](../scripts/generate-sitemap.js) | Runs automatically on `npm run build` |

---

## 🛒 Cart & Checkout

| What to change | File | Where |
|---|---|---|
| Cart logic (add/remove/update/free gifts) | [`src/hooks/useCart.tsx`](../src/hooks/useCart.tsx) | Whole file |
| Cart localStorage key | [`src/hooks/useCart.tsx`](../src/hooks/useCart.tsx) | `STORAGE_KEY = 'wallify_cart_v4'` |
| Checkout form fields | [`src/components/Checkout.tsx`](../src/components/Checkout.tsx) | `formData` state + JSX |
| WhatsApp order message format | [`src/components/Checkout.tsx`](../src/components/Checkout.tsx) | `handleSubmit` → `message +=` lines |

---

## 🖼️ Images

| What to change | File | Where |
|---|---|---|
| Cloudinary cloud name | [`src/utils/imageUrl.ts`](../src/utils/imageUrl.ts) | `CLOUDINARY_CLOUD_NAME` constant (line 11) |
| Image transform sizes (thumbnail/preview/hero) | [`src/utils/imageUrl.ts`](../src/utils/imageUrl.ts) | `getThumbnailUrl`, `getPreviewUrl`, `getHeroUrl` |
| Upload new images to Cloudinary | Run `node scripts/upload-to-cloudinary.cjs` | Needs `.env` credentials |

---

## ⚙️ Build & Deploy

| What to change | File | Where |
|---|---|---|
| Vite build config (chunks, targets, publicDir) | [`vite.config.ts`](../vite.config.ts) | Whole file |
| Vercel routing rules / cache headers | [`vercel.json`](../vercel.json) | Whole file |
| npm scripts | [`package.json`](../package.json) | `scripts` section |
