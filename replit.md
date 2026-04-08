# Wallify Store

A premium digital art poster e-commerce platform built as a static web application.

## Overview

Wallify Store is a static HTML/CSS/JavaScript website for buying and customizing digital art posters. It features categories like Automotive, Anime, Cinematic, and Minimalist art, plus a Custom Poster Engine that lets users upload images and add custom text/filters.

## Tech Stack

- **Frontend:** Pure HTML5, CSS3, Vanilla JavaScript
- **Icons:** Font Awesome 6.4 (CDN)
- **Fonts:** Google Fonts - Outfit (CDN)
- **Order Integration:** WhatsApp Business API (wa.me links)
- **Product DB:** Static `data.js` auto-generated from assets

## Project Structure

```
/                     - Root (serves as publicDir)
├── index.html        - Homepage (hero, featured collections)
├── shop.html         - Product browsing with filters/sorting
├── product.html      - Individual product detail view
├── customize.html    - Custom poster design engine
├── cart.html         - Shopping cart
├── checkout.html     - Order summary + WhatsApp redirect
├── collections.html  - Collections overview
├── style.css         - Global styles and CSS variables
├── data.js           - Auto-generated product database
├── store.js          - Store/filter/sort logic
├── cart.js           - Cart management
├── customize.js      - Custom poster engine logic
├── ui.js             - UI animations and interactions
├── script.js         - General scripts
├── main.js           - Core initialization
├── assets/           - Product images organized by category
│   ├── aesthe/       - Aesthetic category
│   ├── anime/        - Anime category
│   ├── automotive/   - Automotive category
│   ├── classic-cars/ - Classic Cars category
│   ├── football/     - Football category
│   └── Mollywood/    - Mollywood category
├── img/              - UI images and thumbnails
├── generate_db.py    - Generates data.js from assets directory
├── bulk_import.py    - Batch import of image assets
└── generate_catalog.py - Generates HTML catalog metadata
```

## Bug Fixes Applied (April 2026)

- **shop.html** — Full rewrite: now loads `cart.js` + `ui.js`, uses `createPosterCard()` from `ui.js`, proper cart panel/overlay HTML, all 6 category filter buttons with correct `data-category` attributes, URL param `?category=X` support, case-insensitive filtering, randomized default sort (Fisher-Yates), fully working pagination
- **ui.js** — Added `shuffleArray()` as a shared utility (needed by collections.html)
- **store.js** — Removed duplicate `shuffleArray` declaration and removed conflicting DOMContentLoaded auto-init
- **cart.js** — Fixed Buy 20 bundle rule: was giving 6 free, corrected to 5 free
- **main.js** / **script.js** — Replaced placeholder stubs with clean utility helpers
- **style.css** — Added proper toast notification CSS (`.show` class was missing), added shop page header styles

## Running the App

The app is served as a static site using Python's built-in HTTP server:

```
python3 -m http.server 5000 --bind 0.0.0.0
```

Visit: http://localhost:5000

## Deployment

Configured as a **static** deployment with `publicDir: "."`.

## Key Features

- Product catalog dynamically loaded from `data.js`
- Fisher-Yates shuffle for randomized product display
- Client-side filtering and pagination
- Custom poster engine with text overlays, fonts, and CSS filters
- LocalStorage persistence for cart and custom design drafts
- WhatsApp Business integration for order placement
