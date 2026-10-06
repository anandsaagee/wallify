import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://wallifystore.in';
const PRODUCTS_FILE = path.join(__dirname, '../src/data/products.ts');
const SITEMAP_FILE = path.join(__dirname, '../public/sitemap.xml');
const ROBOTS_FILE = path.join(__dirname, '../public/robots.txt');

function generateSitemap() {
  console.log('Generating sitemap...');
  const content = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
  
  // Extract products via regex
  const products = [];
  const regex = /"title":\s*"([^"]+)",\s*"category":\s*"([^"]+)",[\s\S]*?"image":\s*"([^"]+)"/g;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    products.push({
      title: match[1],
      category: match[2],
      image: match[3],
    });
  }

  // Fallback if image regex didn't catch all
  if (products.length === 0) {
    const fallbackRegex = /"title":\s*"([^"]+)",\s*"category":\s*"([^"]+)"/g;
    while ((match = fallbackRegex.exec(content)) !== null) {
      products.push({
        title: match[1],
        category: match[2],
        image: ''
      });
    }
  }

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category))];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <!-- Homepage -->
  <url>
    <loc>${BASE_URL}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

  // Categories
  categories.forEach(cat => {
    xml += `
  <url>
    <loc>${BASE_URL}/category/${cat.toLowerCase()}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // Products with Image Sitemap extensions
  products.forEach(p => {
    const cleanTitle = p.title
      .replace(/\s+Minimalist\s+[A-Za-z0-9\s]+Poster\s+–\s+Premium\s+Matte\s+Finish/gi, '')
      .replace(/\s+Poster\s+–\s+Premium\s+Matte\s+Finish/gi, '')
      .trim();
    const slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const catSlug = p.category.toLowerCase();
    const imgUrl = p.image ? `${BASE_URL}${p.image}` : '';

    xml += `
  <url>
    <loc>${BASE_URL}/posters/${catSlug}/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>${imgUrl ? `
    <image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:title>${cleanTitle.replace(/&/g, '&amp;')} Poster</image:title>
      <image:caption>${cleanTitle.replace(/&/g, '&amp;')} ${p.category} wall art print</image:caption>
    </image:image>` : ''}
  </url>`;
  });

  xml += '\n</urlset>';

  fs.writeFileSync(SITEMAP_FILE, xml);
  console.log(`Generated sitemap with ${products.length} products (with image entries) and ${categories.length} categories.`);

  // Generate robots.txt
  const robots = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
  fs.writeFileSync(ROBOTS_FILE, robots);
  console.log('Generated robots.txt.');
}

generateSitemap();
