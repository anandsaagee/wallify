# Cleanup Plan — Wallify Store

> **Phase 2: Proposed changes for human review. DO NOT proceed until you reply "approved".**
> Each step is independently committable and revertible.

---

## Summary of Proposed Changes

**What this plan does:**
- Creates missing docs (README, architecture, codemap, findings)
- Adds file-level header comments to every source file
- Adds `.env.example` with variable names but no values
- Moves all root-level one-off scripts into `scripts/` (safe restructure)
- Moves hard-coded constants that exist in `config.ts` but are DUPLICATED inline into just `config.ts` (e.g. `BULK_OFFERS_INLINE` in ProductPreview)
- Adds short "what/why" comments above non-obvious code blocks

**What this plan does NOT do (by rule):**
- No logic changes
- No bug fixes
- No dependency changes
- No UI changes
- No algorithm rewrites
- Does not delete `public/` dir, `js/store.js`, or any other dead files (flagged only)

---

## Open Questions (need your answer before executing)

> [!IMPORTANT]
> **Q1**: The `public/` directory is NOT Vite's `publicDir` (which is `public-deploy/`). Its contents (duplicate images, old sitemap etc.) are never served in production. Should I:
> - (a) Leave `public/` completely untouched ← **safest default**
> - (b) Move `public/` to `_archive/public/` so it's out of the way

> [!IMPORTANT]
> **Q2**: `js/store.js` and the file named `h` (accidentally committed git log) are dead files. Should I:
> - (a) Leave them in place and just flag them in FINDINGS.md ← **safest default**
> - (b) Move them to `_archive/`

> [!IMPORTANT]
> **Q3**: Five root-level scripts (`fix-products.cjs`, `regenerate-products.cjs`, `sync-products.cjs`, `updateAutomotiveSEO.cjs`, `updateProductsSEO.cjs`) are one-off data tools that live in root alongside config files. Should I:
> - (a) Leave them at root ← **safest**
> - (b) Move them to `scripts/` alongside the other scripts (would need a note in README)

> [!CAUTION]
> **Q4 (SECURITY)**: `.env` contains live Cloudinary API Key and Secret. These appear to be committed to the repo. I will add `.env.example` and ensure `.gitignore` has `.env` listed, but **you should rotate your Cloudinary API credentials immediately**. Do you want me to flag this loudly in FINDINGS.md only (no code change)?

---

## Proposed Steps

### GROUP A — Documentation only (zero risk)
No source files modified. Build result unchanged.

#### Step A1 — Add `README.md` · SAFE
Create `README.md` at root with: what the project is, stack, install/run/build/deploy instructions, env var names.

#### Step A2 — Add `docs/ARCHITECTURE.md` · SAFE
Document how pieces fit together (data flow, routing, state, Cloudinary, WhatsApp), with a Mermaid diagram.

#### Step A3 — Add `docs/CODEMAP.md` · SAFE
Table: "I want to change X → edit this file". Covers hero text, prices, categories, shipping, WhatsApp phone, colors, fonts, SEO, footer, etc.

#### Step A4 — Add `docs/FINDINGS.md` · SAFE
Bugs, dead code, duplicates, security issues, and future improvements — none fixed, all listed.

#### Step A5 — Add `.env.example` · SAFE
```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
No real values.

#### Step A6 — Add `docs/CHANGELOG_CLEANUP.md` · SAFE
Running log of every file moved/renamed during cleanup.

---

### GROUP B — Add header comments to source files · SAFE
No logic changes. Comments added only. Build output will differ slightly (comment content baked into source strings is not part of prod build — Vite strips comments from JS bundles).

#### Step B1 — Header comments for all `src/components/*.tsx` files
Each file gets a top comment: purpose, what it imports, what imports it.

#### Step B2 — Header comments for `src/hooks/*.ts(x)` files

#### Step B3 — Header comments for `src/utils/*.ts` files

#### Step B4 — Header comments for `src/data/*.ts` files

#### Step B5 — Header comments for `scripts/*.js` and `scripts/*.cjs` files

#### Step B6 — Inline `/* what / why */` comments above non-obvious blocks
Examples:
- Shipping zone pincode prefix ranges in `Checkout.tsx`
- `seedRandom()` in `Hero.tsx`
- IntersectionObserver sentinel in `ProductGrid.tsx`
- `STORAGE_KEY = 'wallify_cart_v4'` in `useCart.tsx`

---

### GROUP C — Fix duplicate constant · RISKY (low)

#### Step C1 — Replace `BULK_OFFERS_INLINE` in `ProductPreview.tsx` with import from `config.ts` · RISKY
**Why risky**: Modifies a source file import. Build + visual output must be verified.
**What changes**: `BULK_OFFERS_INLINE` constant in `ProductPreview.tsx` (lines 62–67) is identical to `BULK_OFFERS` in `config.ts`. Replace the local copy with an import: `import { BULK_OFFERS } from '../data/config'` and rename usage.
**What stays identical**: The rendered UI — same 4 bulk offers, same amounts.
**Verification**: Build must succeed; bulk offer display in ProductPreview bottom sheet must look identical.

---

### GROUP D — Move root scripts to `scripts/` (requires your approval from Q3) · RISKY

#### Step D1 — Move 5 root scripts to `scripts/` · RISKY
**Why risky**: If any script references other scripts or paths, those paths would break.
**Files**: `fix-products.cjs`, `regenerate-products.cjs`, `sync-products.cjs`, `updateAutomotiveSEO.cjs`, `updateProductsSEO.cjs`
**Note**: None of these are in `package.json` scripts, so the build is unaffected. They are developer-run manually.
**Mitigation**: Read each file first; check for relative path references before moving.

---

### GROUP E — Remove unused imports causing lint errors · RISKY (low)

#### Step E1 — Remove `useRef` from `Hero.tsx` imports · RISKY (low)
**Why risky**: Modifies source file. Must verify build still passes.
**Change**: Remove `useRef` from import in `Hero.tsx:1`.

#### Step E2 — Remove `useEffect` from `ProductPreview.tsx` imports · RISKY (low)
Same rationale as E1.

#### Step E3 — Remove unused `currentView` prop from `Header.tsx` · RISKY (medium)
**Why risky**: Removing a prop requires checking all call sites. `App.tsx` passes `currentView` to `Header` — that prop destructure and the call site both need updating.
**Change**: Remove `currentView` from `Header` props interface and remove from `App.tsx` usage.
**Not doing**: This is the one step closest to behavior change. Low risk but slightly higher than others. Flag for your decision.

---

## Steps NOT Proposed (reasons)

| What | Why not |
|---|---|
| Split `products.ts` into per-category files | The file is auto-generated by scripts. Splitting would break `regenerate-products.cjs` and the sitemap generator. Not safe. |
| Split `App.tsx` into page components | Would require restructuring routing logic. Out of scope for behavior-preserving cleanup. |
| Split `ProductPreview.tsx` into sub-components | Would change how props flow. Out of scope. |
| Fix shipping zone bug (no validation for prefix 0-99, 856-999) | Per rules: document in FINDINGS.md, do not fix. |
| Add `strict: true` to tsconfig | Could cause new TS errors that halt the build. |
| Move `public/` to `_archive/` | Awaiting Q1 answer. |

---

## Verification Plan (per step)

For each Group C, D, E step:
1. Run `npm run build` — exit code must be 0
2. Compare dist output file count and gzip sizes to baseline (allow ±3% for JS due to added comments in source maps disabled)
3. Confirm no HTML IDs, route paths, or CSS class names changed
4. Run `npm run lint` — error count must not increase vs baseline (4 errors, 1 warning)

For Group A and B (docs + comments only):
1. Run `npm run build` — exit code must be 0 (comments do not affect transpiled output)
2. Verify dist JS/CSS hashes are identical to baseline (docs don't touch JS/CSS source)
