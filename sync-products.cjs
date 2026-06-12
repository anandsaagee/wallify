const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, 'src/data/products.ts');
const ASSETS_DIR = path.join(__dirname, 'public/assets');

// Utility to title case
function toTitleCase(str) {
  return str
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

async function sync() {
  console.log('🔄 Starting product synchronization...');

  // 1. Read existing products
  let content = fs.readFileSync(PRODUCTS_FILE, 'utf8');
  const match = content.match(/export const products = (\[[\s\S]*?\]);/);
  if (!match) {
    console.error('❌ Could not find products array in products.ts');
    return;
  }

  const existingProducts = JSON.parse(match[1]);
  const existingImages = new Set(existingProducts.map(p => p.image));
  
  // Find highest current ID
  let maxId = 0;
  existingProducts.forEach(p => {
    const num = parseInt(p.id.replace('p', ''));
    if (!isNaN(num) && num > maxId) maxId = num;
  });

  const newProducts = [...existingProducts];
  let addedCount = 0;

  // 2. Scan assets
  const categories = fs.readdirSync(ASSETS_DIR).filter(f => fs.statSync(path.join(ASSETS_DIR, f)).isDirectory());

  for (const catDir of categories) {
    const categoryName = toTitleCase(catDir);
    const fullCatPath = path.join(ASSETS_DIR, catDir);
    const files = fs.readdirSync(fullCatPath).filter(f => f.endsWith('.webp'));

    for (const file of files) {
      const relativePath = `/assets/${catDir}/${encodeURIComponent(file)}`;
      
      if (!existingImages.has(relativePath)) {
        maxId++;
        const title = file.replace('.webp', '');
        
        newProducts.push({
          id: `p${maxId}`,
          title: title,
          category: categoryName,
          basePrice: 49,
          image: relativePath,
          description: `Premium ${categoryName} Posters wall art. ${file}`,
          label: file
        });
        addedCount++;
        existingImages.add(relativePath);
      }
    }
  }

  if (addedCount === 0) {
    console.log('✅ No new products found. Everything is in sync.');
    return;
  }

  // 3. Write back
  const updatedContent = `export const products = ${JSON.stringify(newProducts, null, 4)};\n`;
  fs.writeFileSync(PRODUCTS_FILE, updatedContent);

  console.log(`✅ Success! Added ${addedCount} new products to products.ts`);
}

sync();
