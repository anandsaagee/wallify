import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://wallifystore.in';
const PRODUCTS_FILE = path.join(__dirname, '../src/data/products.ts');
const OUTPUT_DIRS = [
  path.join(__dirname, '../public'),
  path.join(__dirname, '../public-deploy'),
];

const TODAY = new Date().toISOString().split('T')[0];

function extractProducts() {
  const content = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
  const products = [];
  const regex = /"id":\s*"([^"]+)",\s*"title":\s*"([^"]+)",\s*"category":\s*"([^"]+)",[\s\S]*?"image":\s*"([^"]+)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    products.push({ id: match[1], title: match[2], category: match[3], image: match[4] });
  }
  if (products.length === 0) {
    const fallback = /"title":\s*"([^"]+)",\s*"category":\s*"([^"]+)"/g;
    while ((match = fallback.exec(content)) !== null) {
      products.push({ id: '', title: match[1], category: match[2], image: '' });
    }
  }
  return products;
}

function toSlug(rawTitle) {
  return rawTitle
    .replace(/\s+Minimalist\s+[A-Za-z0-9\s]+Poster\s+[\u2013-]\s+Premium\s+Matte\s+Finish/gi, '')
    .replace(/\s+Poster\s+[\u2013-]\s+Premium\s+Matte\s+Finish/gi, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function writeToAll(filename, content) {
  for (const dir of OUTPUT_DIRS) {
    fs.writeFileSync(path.join(dir, filename), content, 'utf-8');
  }
}

function buildSitemapIndex(categoryNames) {
  const lines = [];
  lines.push('  <sitemap>');
  lines.push(`    <loc>${BASE_URL}/sitemap-core.xml</loc>`);
  lines.push(`    <lastmod>${TODAY}</lastmod>`);
  lines.push('  </sitemap>');
  for (const cat of categoryNames) {
    lines.push('  <sitemap>');
    lines.push(`    <loc>${BASE_URL}/sitemap-${cat.toLowerCase()}.xml</loc>`);
    lines.push(`    <lastmod>${TODAY}</lastmod>`);
    lines.push('  </sitemap>');
  }
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...lines,
    '</sitemapindex>',
  ].join('\n');
}

function buildCoreSitemap(categoryNames) {
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  lines.push('  <!-- Homepage -->');
  lines.push('  <url>');
  lines.push(`    <loc>${BASE_URL}</loc>`);
  lines.push(`    <lastmod>${TODAY}</lastmod>`);
  lines.push('    <changefreq>daily</changefreq>');
  lines.push('    <priority>1.0</priority>');
  lines.push('  </url>');
  lines.push('  <!-- Category landing pages -->');
  for (const cat of categoryNames) {
    lines.push('  <url>');
    lines.push(`    <loc>${BASE_URL}/category/${cat.toLowerCase()}</loc>`);
    lines.push(`    <lastmod>${TODAY}</lastmod>`);
    lines.push('    <changefreq>daily</changefreq>');
    lines.push('    <priority>0.9</priority>');
    lines.push('  </url>');
  }
  lines.push('</urlset>');
  return lines.join('\n');
}

function buildCategorySitemap(categoryName, products) {
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
  lines.push('        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">');
  for (const p of products) {
    const slug = toSlug(p.title);
    const cleanTitle = p.title
      .replace(/\s+Minimalist\s+[A-Za-z0-9\s]+Poster\s+[\u2013-]\s+Premium\s+Matte\s+Finish/gi, '')
      .replace(/\s+Poster\s+[\u2013-]\s+Premium\s+Matte\s+Finish/gi, '')
      .trim();
    const escapedTitle = cleanTitle.replace(/&/g, '&amp;');
    const catSlug = categoryName.toLowerCase();
    const imgUrl = p.image ? `${BASE_URL}${p.image}` : '';
    lines.push('  <url>');
    lines.push(`    <loc>${BASE_URL}/posters/${catSlug}/${slug}</loc>`);
    lines.push(`    <lastmod>${TODAY}</lastmod>`);
    lines.push('    <changefreq>weekly</changefreq>');
    lines.push('    <priority>0.7</priority>');
    if (imgUrl) {
      lines.push('    <image:image>');
      lines.push(`      <image:loc>${imgUrl}</image:loc>`);
      lines.push(`      <image:title>${escapedTitle} Poster</image:title>`);
      lines.push(`      <image:caption>${escapedTitle} ${categoryName} wall art print</image:caption>`);
      lines.push('    </image:image>');
    }
    lines.push('  </url>');
  }
  lines.push('</urlset>');
  return lines.join('\n');
}

function buildRobotsTxt(categoryNames) {
  const lines = [];
  lines.push(`# WallifyStore robots.txt - Generated: ${TODAY}`);
  lines.push('');
  lines.push('User-agent: *');
  lines.push('Allow: /');
  lines.push('Disallow: /api/');
  lines.push('');
  lines.push('User-agent: Googlebot');
  lines.push('Allow: /');
  lines.push('Allow: /category/');
  lines.push('Allow: /posters/');
  lines.push('Disallow: /api/');
  lines.push('');
  lines.push('User-agent: Googlebot-Image');
  lines.push('Allow: /assets/');
  lines.push('Allow: /wallify-logo.jpg');
  lines.push('');
  lines.push(`Sitemap: ${BASE_URL}/sitemap.xml`);
  lines.push(`Sitemap: ${BASE_URL}/sitemap-core.xml`);
  for (const cat of categoryNames) {
    lines.push(`Sitemap: ${BASE_URL}/sitemap-${cat.toLowerCase()}.xml`);
  }
  lines.push('');
  return lines.join('\n');
}

function generateAll() {
  console.log('Generating sitemaps...');
  const products = extractProducts();
  if (products.length === 0) {
    console.error('No products found. Check regex in generate-sitemap.js');
    process.exit(1);
  }
  const byCategory = {};
  for (const p of products) {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push(p);
  }
  const categoryNames = Object.keys(byCategory).sort();

  writeToAll('sitemap.xml', buildSitemapIndex(categoryNames));
  console.log('sitemap.xml (index) - written');

  writeToAll('sitemap-core.xml', buildCoreSitemap(categoryNames));
  console.log('sitemap-core.xml (homepage + ' + categoryNames.length + ' categories) - written');

  for (const cat of categoryNames) {
    const filename = 'sitemap-' + cat.toLowerCase() + '.xml';
    writeToAll(filename, buildCategorySitemap(cat, byCategory[cat]));
    console.log(filename + ' (' + byCategory[cat].length + ' products) - written');
  }

  writeToAll('robots.txt', buildRobotsTxt(categoryNames));
  console.log('robots.txt - written');

  const total = products.length + categoryNames.length + 1;
  console.log('Done! ' + total + ' total URLs across ' + categoryNames.length + ' categories.');
}

generateAll();
