/**
 * regenerate-products.cjs
 * Fully regenerates src/data/products.ts from the actual files in public/assets/
 * Maps folder names to correct display category names.
 * Adds Quotes category and fixes all mismatches.
 */
const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, 'src/data/products.ts');
const ASSETS_DIR = path.join(__dirname, 'public/assets');

// Map folder name → category display name (preserving exact casing as per config)
const FOLDER_TO_CATEGORY = {
  'abstract':   'Abstract',
  'anime':      'Anime',
  'automotive': 'Automotive',
  'football':   'Football',
  'hollywood':  'Hollywood',
  'mollywood':  'Mollywood',
  'MUSIC':      'Music',
  'SPIRITUAL':  'Spiritual',
  'quotes':     'Quotes',
  'tamil':      'Tamil',
};

// Map folder name → base price
const FOLDER_TO_PRICE = {
  'abstract':   49,
  'anime':      49,
  'automotive': 49,
  'football':   49,
  'hollywood':  49,
  'mollywood':  49,
  'MUSIC':      49,
  'SPIRITUAL':  49,
  'quotes':     49,
  'tamil':      49,
};

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function generateProducts() {
  console.log('🔄 Regenerating products.ts from disk...\n');

  const products = [];
  let idCounter = 1;

  // Get folders in a fixed order matching CATEGORIES order
  const orderedFolders = [
    'abstract', 'anime', 'automotive', 'football',
    'hollywood', 'mollywood', 'MUSIC', 'SPIRITUAL', 'quotes', 'tamil'
  ];

  for (const folder of orderedFolders) {
    const folderPath = path.join(ASSETS_DIR, folder);
    
    if (!fs.existsSync(folderPath)) {
      console.warn(`⚠️  Folder not found, skipping: ${folder}`);
      continue;
    }

    const category = FOLDER_TO_CATEGORY[folder];
    const basePrice = FOLDER_TO_PRICE[folder] || 49;
    
    // Read all .webp files, sort naturally
    const files = fs.readdirSync(folderPath)
      .filter(f => f.toLowerCase().endsWith('.webp'))
      .sort(naturalSort);

    console.log(`📁 ${folder} → "${category}": ${files.length} files`);

    for (const file of files) {
      const imagePath = `/assets/${folder}/${file}`;
      const title = file.replace(/\.webp$/i, '');
      
      products.push({
        id: `p${idCounter}`,
        title: title,
        category: category,
        basePrice: basePrice,
        image: imagePath,
        description: `Premium ${category} wall art poster`,
        label: file,
      });
      idCounter++;
    }
  }

  console.log(`\n✅ Total products: ${products.length}`);

  const output = `export const products = ${JSON.stringify(products, null, 4)};\n`;
  fs.writeFileSync(PRODUCTS_FILE, output, 'utf8');
  console.log(`✅ Written to ${PRODUCTS_FILE}`);
}

generateProducts();
