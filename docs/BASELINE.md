# Baseline — Captured Before Any Cleanup

Recorded on branch `cleanup/organize-repo`, from commit `8dc8e95` on `main`.

## Stack

| Item | Value |
|---|---|
| Framework | React 18 + TypeScript + Vite 5 |
| Styling | Tailwind CSS 3 |
| Package manager | npm |
| Deploy target | Vercel |
| Node scripts | CommonJS (.cjs) for product/SEO data management |

## How to Run / Build / Lint

```bash
npm install          # install dependencies
npm run dev          # dev server (Vite HMR)
npm run build        # generate sitemap → vite build → dist/
npm run lint         # eslint (ts,tsx files)
npm run preview      # preview production build locally
```

## Baseline Build Result

**Exit code: 0 (success)**

```
> node scripts/generate-sitemap.js && vite build

Generating sitemap...
Generated sitemap with 1448 products (with image entries) and 10 categories.
Generated robots.txt.
vite v5.4.21 building for production...
✓ 1508 modules transformed.
✓ built in 2.49s
```

### Output File List & Sizes

| File | Size (raw) | Size (gzip) |
|---|---|---|
| `dist/index.html` | 2,467 B | 1,010 B |
| `dist/assets/index-B2J9cCdh.css` | 39,785 B | 7,600 B |
| `dist/assets/icons-BLU0ygt6.js` | 15,993 B | 4,820 B |
| `dist/assets/react-vendor-DCuTklp_.js` | 133,962 B | 43,130 B |
| `dist/assets/index-CPVbSH72.js` | 722,624 B | 66,020 B |
| `dist/404.html` | 3,507 B | — |
| `dist/favicon.jpg` | 32,257 B | — |
| `dist/google4e7741b3fade07da.html` | 53 B | — |
| `dist/robots.txt` | 69 B | — |
| `dist/sitemap.xml` | 583,281 B | — |
| `dist/wallify-logo.jpg` | 32,257 B | — |

### MD5 Hashes of Built Assets (baseline fingerprints)

```
39f01eb8ca8c88696be910274ba6960a  dist/assets/icons-BLU0ygt6.js
907c30ef3af3cc6929872d97b9a334eb  dist/assets/index-B2J9cCdh.css
6887aceacc09a715522574198ef328f1  dist/assets/index-CPVbSH72.js
fdf6cd738d7fe8a9b70b81cdefe578b4  dist/assets/react-vendor-DCuTklp_.js
```

> NOTE: Vite hashes chunk filenames based on content. After any source change, 
> the filenames WILL differ. Verification must compare functional behaviour, 
> not filenames. Compare gzip sizes and rendered HTML instead.

## Baseline Lint Result

**Exit code: 1 (pre-existing failures — not introduced by cleanup)**

```
src/components/FAQ.tsx
  9:14  warning  Fast refresh only works when a file only exports components

src/components/Header.tsx
  12:49  error  'currentView' is defined but never used

src/components/Hero.tsx
  1:38  error  'useRef' is defined but never used

src/components/ProductPreview.tsx
  1:40  error  'useEffect' is defined but never used

src/components/SEO.tsx
  9:27  error  Unexpected any. Specify a different type

✖ 5 problems (4 errors, 1 warning)
```

These errors existed BEFORE the cleanup branch. They are documented in `docs/FINDINGS.md`.

## Key Routes (must not change)

| Route | Behaviour |
|---|---|
| `/` | Home → Hero → Best Sellers → Categories → All products |
| `/posters/:category/:slug` | Deep-link to a specific product (opens ProductPreview bottom sheet) |
| `/category/:category` | Filtered product grid by category (via CategoryFilter) |
| `/?search=...` | Search action (SearchAction schema) |

## Key HTML IDs (must not change)

| ID | Used by |
|---|---|
| `collection` | Scroll target from Hero/Categories "Shop Now" |
| `collection-header` | Scroll target from Header |
| `pricing` | Pricing section anchor |
