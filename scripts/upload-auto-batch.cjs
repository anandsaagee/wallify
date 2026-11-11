/**
 * Upload Script — New Automotive Batch (a1, a2, a3)
 *
 * Uploads all images from /home/anand-saagee/auto /a1, a2, a3
 * to Cloudinary under wallify/assets/automotive/a1/, a2/, a3/
 * preserving filenames exactly as-is.
 *
 * After upload:
 *  - Updates cloudinary-urls.json with new entries
 *  - Appends new product entries to src/data/products.ts
 *
 * Usage:
 *   node scripts/upload-auto-batch.cjs
 */

const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// ─── Configuration ───────────────────────────────────────────────────────────

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UPLOAD_FOLDER = 'wallify';
const CONCURRENCY = 5;
const IMAGE_EXTENSIONS = new Set(['.webp', '.jpg', '.jpeg', '.png', '.avif']);

// Source folders (the new batch)
const SOURCE_BASE = '/home/anand-saagee/auto ';
const SUBFOLDERS = ['a1', 'a2', 'a3'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pLimit(concurrency) {
  let active = 0;
  const queue = [];

  function next() {
    if (active >= concurrency || queue.length === 0) return;
    active++;
    const { fn, resolve, reject } = queue.shift();
    fn().then(resolve, reject).finally(() => {
      active--;
      next();
    });
  }

  return function limit(fn) {
    return new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      next();
    });
  };
}

// ─── Upload Logic ─────────────────────────────────────────────────────────────

async function uploadFile(filePath, subfolder, filename) {
  const filenameNoExt = path.basename(filename, path.extname(filename));
  // Cloudinary public_id: wallify/assets/automotive/a1/a1-001
  const publicId = `${UPLOAD_FOLDER}/assets/automotive/${subfolder}/${filenameNoExt}`;
  // Key for cloudinary-urls.json
  const urlKey = `assets/automotive/${subfolder}/${filename}`;

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: false,
      resource_type: 'image',
      use_filename: false,
      unique_filename: false,
    });
    return { success: true, urlKey, url: result.secure_url, skipped: false };
  } catch (err) {
    if (err?.http_code === 409 || err?.message?.includes('already exists')) {
      // Build the expected URL for skipped files
      const ext = path.extname(filename).replace('.', '');
      const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${UPLOAD_FOLDER}/assets/automotive/${subfolder}/${filenameNoExt}.${ext}`;
      return { success: true, urlKey, url, skipped: true };
    }
    return { success: false, urlKey, error: err.message };
  }
}

// ─── Products.ts Update ───────────────────────────────────────────────────────

function buildProductEntry(id, subfolder, filename) {
  const num = filename.replace(/\.[^.]+$/, ''); // e.g. "a1-001"
  const title = `Automotive ${num.toUpperCase()}`;
  return `    {
        "id": "p${id}",
        "title": "${title}",
        "category": "Automotive",
        "basePrice": 49,
        "image": "/assets/automotive/${subfolder}/${filename}",
        "description": "High-quality automotive poster – ${title}.",
        "label": "${filename}"
    }`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('\n❌ Missing Cloudinary credentials in .env\n');
    process.exit(1);
  }

  // Collect all files
  const allFiles = [];
  for (const sub of SUBFOLDERS) {
    const dir = path.join(SOURCE_BASE, sub);
    if (!fs.existsSync(dir)) {
      console.error(`❌ Folder not found: ${dir}`);
      process.exit(1);
    }
    const files = fs.readdirSync(dir).sort();
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (IMAGE_EXTENSIONS.has(ext)) {
        allFiles.push({ filePath: path.join(dir, file), subfolder: sub, filename: file });
      }
    }
  }

  console.log(`\n📦 Found ${allFiles.length} images to upload`);
  console.log(`   a1: ${allFiles.filter(f => f.subfolder === 'a1').length} files`);
  console.log(`   a2: ${allFiles.filter(f => f.subfolder === 'a2').length} files`);
  console.log(`   a3: ${allFiles.filter(f => f.subfolder === 'a3').length} files`);
  console.log(`☁️  Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`📁 Target: ${UPLOAD_FOLDER}/assets/automotive/{a1,a2,a3}/`);
  console.log(`⚡ Concurrency: ${CONCURRENCY}\n`);

  const limit = pLimit(CONCURRENCY);
  let uploaded = 0, skipped = 0, failed = 0;
  const errors = [];
  const startTime = Date.now();

  const tasks = allFiles.map((item, index) =>
    limit(async () => {
      const result = await uploadFile(item.filePath, item.subfolder, item.filename);
      const tag = `[${index + 1}/${allFiles.length}]`;

      if (result.success) {
        if (result.skipped) {
          skipped++;
          process.stdout.write(`\r⏭️  ${tag} Skipped: ${item.subfolder}/${item.filename}            `);
        } else {
          uploaded++;
          process.stdout.write(`\r✅ ${tag} Uploaded: ${item.subfolder}/${item.filename}            `);
        }
      } else {
        failed++;
        errors.push(result);
        process.stdout.write(`\r❌ ${tag} Failed: ${item.subfolder}/${item.filename}            `);
      }
      return result;
    })
  );

  const results = await Promise.all(tasks);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n\n────────────────────────────────────────`);
  console.log(`📊 Upload Summary`);
  console.log(`────────────────────────────────────────`);
  console.log(`   ✅ Uploaded:  ${uploaded}`);
  console.log(`   ⏭️  Skipped:   ${skipped}`);
  console.log(`   ❌ Failed:    ${failed}`);
  console.log(`   ⏱️  Time:      ${elapsed}s`);
  console.log(`────────────────────────────────────────\n`);

  if (errors.length > 0) {
    console.log('❌ Failed uploads:');
    errors.forEach(e => console.log(`   - ${e.urlKey}: ${e.error}`));
    console.log('');
  }

  // ── Update cloudinary-urls.json ──────────────────────────────────────────
  const projectRoot = path.resolve(__dirname, '..');
  const mappingPath = path.join(projectRoot, 'cloudinary-urls.json');
  let existingMapping = {};
  if (fs.existsSync(mappingPath)) {
    existingMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  }

  let newEntries = 0;
  for (const r of results) {
    if (r.success && r.url && !existingMapping[r.urlKey]) {
      existingMapping[r.urlKey] = r.url;
      newEntries++;
    }
  }

  fs.writeFileSync(mappingPath, JSON.stringify(existingMapping, null, 2));
  console.log(`📝 cloudinary-urls.json updated — ${newEntries} new entries added\n`);

  // ── Append to products.ts ─────────────────────────────────────────────────
  const productsPath = path.join(projectRoot, 'src/data/products.ts');
  const productsContent = fs.readFileSync(productsPath, 'utf8');

  // Find last product ID
  const idMatches = [...productsContent.matchAll(/"id":\s*"p(\d+)"/g)];
  let lastId = 1448;
  for (const m of idMatches) {
    const num = parseInt(m[1], 10);
    if (num > lastId) lastId = num;
  }

  // Find insertion point: just before the closing ]; of the products array
  // Insert after the last automotive entry (automotive-221), before Football section
  const insertMarker = '"category": "Football"';
  const insertIdx = productsContent.indexOf(insertMarker);
  if (insertIdx === -1) {
    console.error('❌ Could not find insertion point in products.ts (looked for Football category)');
    process.exit(1);
  }

  // Go back to find the opening { of the first Football entry
  const beforeFootball = productsContent.lastIndexOf('    {\n', insertIdx);
  if (beforeFootball === -1) {
    console.error('❌ Could not locate the Football block start');
    process.exit(1);
  }

  // Build new entries only for successfully uploaded files
  const newProductEntries = [];
  let currentId = lastId + 1;
  for (const item of allFiles) {
    const matched = results.find(r => r.urlKey === `assets/automotive/${item.subfolder}/${item.filename}`);
    if (matched && matched.success) {
      newProductEntries.push(buildProductEntry(currentId, item.subfolder, item.filename));
      currentId++;
    }
  }

  if (newProductEntries.length === 0) {
    console.log('⚠️  No new products to add to products.ts');
    return;
  }

  const newBlock = newProductEntries.join(',\n') + ',\n';
  const updatedContent =
    productsContent.slice(0, beforeFootball) +
    newBlock +
    productsContent.slice(beforeFootball);

  fs.writeFileSync(productsPath, updatedContent);
  console.log(`📦 products.ts updated — ${newProductEntries.length} new Automotive products added (IDs p${lastId + 1}–p${currentId - 1})\n`);

  if (failed > 0) {
    console.log('⚠️  Some uploads failed. Re-run to retry (existing uploads will be skipped).\n');
    process.exit(1);
  }

  console.log('🎉 Done! All new automotive posters uploaded and registered.\n');
  console.log('   Next steps:');
  console.log('   1. Run `npm run dev` and verify the new images appear in the Automotive section');
  console.log('   2. Commit and push to trigger Vercel deploy\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
