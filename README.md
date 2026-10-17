# WallifyStore

> Premium wall posters — Anime, Automotive, Hollywood, Mollywood, Tamil, Football, Quotes, Abstract, Spiritual, Music.  
> Printed on 300 GSM matte art paper. Orders via WhatsApp.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Images | Cloudinary CDN |
| Routing | Custom (no router library — `history.pushState`) |
| Orders | WhatsApp deeplink |
| Deploy | Vercel |

---

## Getting Started

```bash
# 1. Clone and install
git clone https://github.com/anandsaagee/wallify.git
cd wallify-store
npm install

# 2. Set up environment (Cloudinary — only needed to run upload scripts)
cp .env.example .env
# Fill in your Cloudinary credentials in .env

# 3. Start dev server
npm run dev          # http://localhost:5173

# 4. Build for production
npm run build        # generates dist/

# 5. Preview production build locally
npm run preview
```

---

## Environment Variables

See [`.env.example`](.env.example) for required variable names.  
**Never commit `.env`** — it is listed in `.gitignore`.

These variables are only needed by the scripts in `scripts/` for uploading images to Cloudinary. They are **not used at runtime** by the React app (the Cloudinary cloud name is currently hard-coded in `src/utils/imageUrl.ts` — see `FINDINGS.md F-QUAL-04`).

---

## Project Structure

```
wallify-store/
├── src/                    ← React/TypeScript app
│   ├── App.tsx             ← Root layout, routing, SEO JSON-LD
│   ├── components/         ← UI components (all flat, no sub-folders)
│   ├── data/               ← products.ts (1448 items), config.ts, categorySeo.ts
│   ├── hooks/              ← useCart.tsx, useProductFilters.ts
│   ├── utils/              ← imageUrl.ts, seoHelpers.ts, bestSellerTracker.ts
│   └── styles/index.css    ← Tailwind directives + custom keyframes
├── scripts/                ← Node/Python build & data management tools
├── public-deploy/          ← Vite publicDir (favicon, 404, sitemap, robots)
├── public/                 ← NOT served by Vite — local image copies (see FINDINGS.md F-DUP-06)
├── docs/                   ← Project documentation
│   ├── BASELINE.md         ← Pre-cleanup build hashes and routes
│   ├── AUDIT.md            ← Phase 1 codebase audit
│   ├── FINDINGS.md         ← Bugs, dead code, security issues (read this!)
│   └── CLEANUP_PLAN.md     ← Approved cleanup steps
├── _archive/               ← Dead files kept for history (not served)
├── delivery-calc/          ← Standalone delivery calculator prototype (not in app)
├── seo/                    ← SEO strategy docs
├── .env.example            ← Env var names (no values)
└── vercel.json             ← SPA rewrite rules + cache headers
```

---

## Key Routes

| URL | What renders |
|---|---|
| `/` | Home — Hero, Best Sellers, Categories, All Products |
| `/category/:category` | Filtered grid (e.g. `/category/anime`) |
| `/posters/:category/:slug` | Deep-link to product (opens bottom sheet) |

---

## npm Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Generates sitemap → Vite production build |
| `npm run lint` | ESLint (TypeScript + React rules) |
| `npm run preview` | Preview production build locally |

---

## Data Management Scripts (in `scripts/`)

These are run manually — **not part of the build**:

| Script | Purpose |
|---|---|
| `generate-sitemap.js` | Auto-runs during `npm run build` |
| `upload-to-cloudinary.cjs` | Batch upload local images to Cloudinary |
| `regenerate-products.cjs` | Rebuild `src/data/products.ts` from `public/assets/` |
| `fix-products.cjs` | One-off: fix product data format issues |
| `sync-products.cjs` | One-off: sync new files from `public/assets/` into products.ts |
| `updateAutomotiveSEO.cjs` | One-off: patch Automotive SEO fields |
| `updateProductsSEO.cjs` | One-off: patch all product SEO fields |

---

## Important Notes

- ⚠️ **Read [`docs/FINDINGS.md`](docs/FINDINGS.md)** before making changes — it lists known bugs, security issues, and dead code.
- 🔴 The `.env` file contains live Cloudinary credentials that were committed to git history. **Rotate them** at [cloudinary.com/console](https://cloudinary.com/console).
- The `public/` directory is **not** Vite's `publicDir` (which is `public-deploy/`). Files in `public/` are not served in production.
- Products are a static TypeScript array (`src/data/products.ts`). Adding products requires re-running a data script and rebuilding.
