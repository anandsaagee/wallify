/**
 * fix-products.cjs
 * 
 * Comprehensive fix for products.ts:
 * 1. Regenerate from actual public/assets files (single source of truth)
 * 2. Remove duplicates (entries pointing to same file via different naming)
 * 3. Fix poster names: use category + sequential number for clean display
 * 4. Normalize category names: MUSIC → Music, SPIRITUAL → Spiritual
 * 5. Sort products by category (alphabetical), then by file number within each category
 * 6. Assign clean sequential IDs (p1, p2, p3, ...)
 */

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'public/assets');
const PRODUCTS_FILE = path.join(__dirname, 'src/data/products.ts');

// Category directory name → display name mapping
const CATEGORY_MAP = {
  'abstract': 'Abstract',
  'aesthetic': 'Aesthetic',
  'anime': 'Anime',
  'automotive': 'Automotive',
  'classic cars': 'Classic Cars',
  'football': 'Football',
  'hollywood': 'Hollywood',
  'mollywood': 'Mollywood',
  'MUSIC': 'Music',
  'SPIRITUAL': 'Spiritual',
  'tamil': 'Tamil',
};

/**
 * Clean up a poster title from its filename.
 * For old numbered files ("1. Vintage Green", "10. FERRARI F40") → keep the car name
 * For generic numbered files ("anime_001", "mollywood 042") → "Category Poster 001"
 * For blank numbered files ("1. ") → "Category Poster 001"
 */
function cleanTitle(filename, categoryDisplayName) {
  let name = filename.replace(/\.webp$/i, '');

  // Check if name is just a number prefix like "1. " or "10. " (blank name)
  if (/^\d+\.\s*$/.test(name)) {
    const num = name.match(/^(\d+)/)[1];
    return `${categoryDisplayName} Poster ${num.padStart(3, '0')}`;
  }

  // Check if it's an old-style named file like "10. FERRARI F40" → keep "Ferrari F40"
  const numberedNameMatch = name.match(/^\d+\.\s+(.+)$/);
  if (numberedNameMatch) {
    return titleCase(numberedNameMatch[1].trim());
  }

  // Generic numbered format: category_NNN, category-NNN, or category NNN
  // These all become "Category Poster NNN"  
  const genericMatch = name.match(/^([a-zA-Z\s]+)[_\s-](\d{1,3})$/);
  if (genericMatch) {
    const numPart = genericMatch[2];
    // Always use the display category name (handles aesthetic/ containing "abstract 001")
    return `${categoryDisplayName} Poster ${numPart.padStart(3, '0')}`;
  }

  // For anything else, just title-case
  name = name.replace(/_/g, ' ').replace(/-/g, ' ');
  return titleCase(name.trim());
}

function titleCase(str) {
  return str
    .split(/\s+/)
    .filter(w => w.length > 0)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Extract the primary number from a filename for sorting purposes.
 * Handles: "anime_001.webp" → 1, "mollywood 042.webp" → 42, "14. Ford.webp" → 14
 */
function extractSortNumber(filename) {
  // Try to get the number after category prefix
  const m = filename.match(/[_\s-](\d+)\.webp$/i);
  if (m) return parseInt(m[1], 10);
  // Fallback: first number in the filename
  const m2 = filename.match(/(\d+)/);
  return m2 ? parseInt(m2[1], 10) : 999999;
}

function main() {
  console.log('🔧 Starting comprehensive product fix...\n');

  const allProducts = [];
  const seenImages = new Set();

  // Read all category directories from public/assets
  const categories = fs.readdirSync(ASSETS_DIR)
    .filter(f => fs.statSync(path.join(ASSETS_DIR, f)).isDirectory())
    .sort();

  for (const catDir of categories) {
    const categoryName = CATEGORY_MAP[catDir];
    if (!categoryName) {
      console.log(`⚠️  Unknown category directory: "${catDir}" — skipping`);
      continue;
    }

    const fullCatPath = path.join(ASSETS_DIR, catDir);
    const files = fs.readdirSync(fullCatPath)
      .filter(f => f.endsWith('.webp'))
      .sort((a, b) => extractSortNumber(a) - extractSortNumber(b));

    let addedCount = 0;
    for (const file of files) {
      const relativePath = `/assets/${catDir}/${encodeURIComponent(file)}`;

      if (seenImages.has(relativePath)) {
        console.log(`  ⚠️  Duplicate image skipped: ${relativePath}`);
        continue;
      }
      seenImages.add(relativePath);

      const title = cleanTitle(file, categoryName);

      allProducts.push({
        title,
        category: categoryName,
        basePrice: 33,
        image: relativePath,
        description: `Premium ${categoryName} wall art poster`,
        label: file,
      });
      addedCount++;
    }

    console.log(`  ✅ ${categoryName}: ${addedCount} posters`);
  }

  // Sort products: by category alphabetically, then by sort number within each category
  allProducts.sort((a, b) => {
    const catCmp = a.category.localeCompare(b.category);
    if (catCmp !== 0) return catCmp;
    return extractSortNumber(a.label) - extractSortNumber(b.label);
  });

  // Now assign sequential numbers within each category to avoid duplicate titles
  // For posters with generic "Category Poster NNN" names, renumber them sequentially
  const catCounters = {};
  const seenTitles = {};
  allProducts.forEach(p => {
    const key = p.category;
    if (!catCounters[key]) {
      catCounters[key] = 1;
      seenTitles[key] = new Set();
    }
    
    // Check if this is a generic "Category Poster NNN" title
    const genericPattern = new RegExp(`^${escapeRegex(p.category)} Poster \\d+$`);
    if (genericPattern.test(p.title)) {
      // Renumber sequentially within category
      const num = String(catCounters[key]).padStart(3, '0');
      p.title = `${p.category} Poster ${num}`;
      catCounters[key]++;
    } else {
      // Non-generic title — check for duplicates and append number if needed
      if (seenTitles[key].has(p.title)) {
        let suffix = 2;
        while (seenTitles[key].has(`${p.title} ${suffix}`)) suffix++;
        p.title = `${p.title} ${suffix}`;
      }
    }
    seenTitles[key].add(p.title);
  });

  // Assign sequential IDs
  allProducts.forEach((p, i) => {
    p.id = `p${i + 1}`;
  });

  // Write out
  const output = `export const products = ${JSON.stringify(allProducts, null, 4)};\n`;
  fs.writeFileSync(PRODUCTS_FILE, output);

  console.log(`\n✅ Done! Total: ${allProducts.length} products`);
  console.log('\nCategory breakdown:');
  const cats = {};
  allProducts.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
  Object.entries(cats).sort().forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));
  
  // Verify no duplicate titles within category
  let dupTitles = 0;
  const titleCheck = {};
  allProducts.forEach(p => {
    const k = p.category + '|||' + p.title;
    if (titleCheck[k]) dupTitles++;
    titleCheck[k] = true;
  });
  console.log('\nDuplicate titles within category:', dupTitles);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

main();
