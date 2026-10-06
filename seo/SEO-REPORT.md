# Technical SEO & E-Commerce Copywriting Audit & Implementation Report

**Store:** WallifyStore (`https://wallifystore.in`)  
**Target Market:** India (Pan-India & Kerala fast shipping)  
**Catalog Size:** 1,448+ Posters across 10 Categories  
**Framework:** React 18, Vite, Tailwind CSS  
**Audit & Implementation Date:** October 2026  

---

## 1. Initial State Audit vs Implemented State (Before / After)

| Feature / Metric | Before Audit & Implementation | Implemented State |
| :--- | :--- | :--- |
| **Document `<title>`** | Hardcoded title or repetitive titles (`Abstract 001 Poster ... Poster`) | Dynamic, clean pattern `[Poster Name] Poster – [Size] Wall Art \| WallifyStore` (50–60 chars) |
| **Meta Description** | Static or missing unique product value props | Unique, benefit-driven 140–160 chars specifying 300 GSM matte paper, archival inks & fast delivery |
| **Heading Structure (H1)** | Modal poster title used `<h2>`, causing missed keyword weighting | Strict semantic single `<h1>` on every poster view with logical sub-headings below it |
| **Images & Alt Text** | Generic alt text; `alt="... HD wall poster print"` | Data-driven 8–15 words descriptive alt text (<125 chars) describing subject, style & paper quality without keyword stuffing |
| **Image Captions** | Screen-reader only (`sr-only`), invisible to human visitors | Elegant, visible `<figcaption>` beneath the poster image specifying title, art medium, and size options |
| **Responsive Images** | Single image size served from CDN without `srcset` | Responsive `srcSet` (`0.5x`, `1x`, `1.5x`) + `sizes` attribute using Cloudinary server-side transforms |
| **Product Copywriting** | Generic 2-sentence template repeated across items | Dynamic, rich 80–120 word product description covering paper specs, framing, and room decor placement |
| **JSON-LD Schema** | Partial schemas, hardcoded rating data, missing homepage Organization | Complete Schema.org suite: `WebSite` (with `SearchAction`), `Organization`, `BreadcrumbList`, `ItemList`, and compliant `Product` (Offer, INR, availability, shipping) |
| **Sitemap (`sitemap.xml`)** | Basic URL list without Google Images support | Full XML sitemap containing all 1,448 product URLs, 10 categories, AND Google Image tags (`<image:image>`, `<image:loc>`, `<image:title>`, `<image:caption>`) |
| **Internal Linking** | Modal had no direct links back to parent category | Crawlable `<a href="/category/...">` contextual link inside every poster modal for link equity flow |
| **404 Recovery** | Default host 404 (blank or server error) | Custom, branded `public/404.html` with direct crawlable links back to homepage and top category hubs |

---

## 2. File-by-File Changes Summary

1. **`src/utils/seoHelpers.ts` (New File):**
   - Implemented `getCleanPosterName()` to strip repetitive legacy suffixes.
   - Implemented `buildPosterMetaTitle()` adhering to the 50–60 char rule.
   - Implemented `buildPosterMetaDescription()` adhering to the 140–160 char CTA rule.
   - Implemented `generatePosterAltText()` generating 8–15 word descriptive alt text.
   - Implemented `generatePosterCaption()` generating human-friendly visible captions.
   - Implemented `generatePosterProductDescription()` generating 80–120 word unique copy per category and subject.

2. **`src/components/ProductPreview.tsx`:**
   - Switched poster title from `<h2>` to semantic `<h1>`.
   - Wired data-driven SEO title, description, alt text, and visible `<figcaption>`.
   - Added unique "About This Wall Print" copy block and print specs.
   - Added crawlable category anchor link (`/category/:slug`) for internal link equity.
   - Cleaned Product schema structured data to adhere strictly to Google Rich Results guidelines.

3. **`src/components/OptimizedImage.tsx`:**
   - Added automatic `srcSet` generation with multi-resolution breakpoints (`Math.round(w * 0.5)`, `w`, `Math.round(w * 1.5)`).
   - Added standard responsive `sizes` attribute.
   - Preserved explicit `width`, `height`, and aspect-ratio styling to prevent Cumulative Layout Shift (CLS).

4. **`src/App.tsx`:**
   - Added `Organization` JSON-LD schema for homepage entity authority.
   - Added category `ItemList` JSON-LD schema on category views with position indexing.

5. **`scripts/generate-sitemap.js`:**
   - Integrated Google Image Sitemap namespace (`xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`).
   - Added `<image:image>` metadata blocks for all 1,448 posters.
   - Re-generated `public/sitemap.xml` with 14,540 lines of verified XML.

6. **`public/404.html` (New File):**
   - Created dark-themed custom 404 error page.
   - Included clean links to homepage and top category silos (Anime, Automotive, Mollywood, Hollywood, Football, Quotes).

7. **`seo/keyword-map.md` (Updated):**
   - Documented primary site-wide keywords, transactional buying-intent modifiers, category keyword map, and long-tail poster patterns.

---

## 3. Checklist for Adding Future Posters

When introducing new poster art to the catalog:
1. **Title:** Use natural character/subject names (e.g., `Gojo Satoru Hollow Purple`, `Porsche 911 GT3 RS`).
2. **Category:** Assign to one of the 10 catalog categories (`Anime`, `Automotive`, `Mollywood`, `Hollywood`, `Football`, `Quotes`, `Abstract`, `Spiritual`, `Tamil`, `Music`).
3. **Automated Features:**
   - `<title>` is automatically formatted as `[Poster Name] Poster – [Size] Wall Art | WallifyStore`.
   - Meta description and alt text are generated using the data fields.
   - Responsive `srcset` is handled by Cloudinary.
   - Schema.org Product markup is updated in real time.
4. **Build & Deploy:** Run `node scripts/generate-sitemap.js` prior to production deployments to refresh `public/sitemap.xml`.

---

## 4. Highest-Impact Next Actions (Post-Implementation)

1. **Submit Sitemap to Google Search Console:**
   - Visit [search.google.com/search-console](https://search.google.com/search-console).
   - Verify domain ownership for `wallifystore.in`.
   - Submit `https://wallifystore.in/sitemap.xml` to index the 1,448+ poster pages and image sitemaps.

2. **Google Rich Results Validation:**
   - Test `https://wallifystore.in` and sample poster URLs in [Google Rich Results Test](https://search.google.com/test/rich-results) to verify `WebSite`, `Organization`, `ItemList`, and `Product` schemas.

3. **Google Merchant Center Feed (Free Product Listings):**
   - Create a Google Merchant Center account.
   - Enable "Free product listings" using the auto-crawled structured data feed from WallifyStore.

4. **Regional Topical Backlink Outreach:**
   - Partner with Malayalam cinema / Mollywood pop-culture pages, Indian anime fan clubs, and Indian car enthusiast communities for aesthetic room setup features and backlinks.

5. **Monitor Core Web Vitals:**
   - Monitor real-user LCP (< 2.5s) and CLS (< 0.1) in Search Console Page Experience reports.
