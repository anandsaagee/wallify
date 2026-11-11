/**
 * Fix Automotive Batch — Move from sub-folders to flat automotive/
 *
 * Renames Cloudinary assets:
 *   wallify/assets/automotive/a1/a1-001  →  wallify/assets/automotive/a1-001
 *   wallify/assets/automotive/a2/a2-001  →  wallify/assets/automotive/a2-001
 *   wallify/assets/automotive/a3/a3-001  →  wallify/assets/automotive/a3-001
 *
 * Then updates:
 *   - cloudinary-urls.json  (re-keys entries)
 *   - src/data/products.ts  (fixes image paths)
 *
 * Usage:
 *   node scripts/fix-auto-paths.cjs
 */

const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UPLOAD_FOLDER = 'wallify';
const CONCURRENCY = 5;
const SOURCE_BASE = '/home/anand-saagee/auto ';
const SUBFOLDERS = ['a1', 'a2', 'a3'];
const IMAGE_EXTENSIONS = new Set(['.webp', '.jpg', '.jpeg', '.png', '.avif']);

function pLimit(concurrency) {
  let active = 0;
  const queue = [];
  function next() {
    if (active >= concurrency || queue.length === 0) return;
    active++;
    const { fn, resolve, reject } = queue.shift();
    fn().then(resolve, reject).finally(() => { active--; next(); });
  }
  return function limit(fn) {
    return new Promise((resolve, reject) => { queue.push({ fn, resolve, reject }); next(); });
  };
}

async function renameAsset(oldPublicId, newPublicId) {
  try {
    const result = await cloudinary.uploader.rename(oldPublicId, newPublicId, {
      overwrite: false,
      invalidate: true,
    });
    return { success: true, oldPublicId, newPublicId, url: result.secure_url };
  } catch (err) {
    // If it already exists at destination (already renamed), treat as success
    if (err?.http_code === 409 || err?.message?.includes('already exists')) {
      return { success: true, oldPublicId, newPublicId, alreadyMoved: true };
    }
    // If source not found — might have been renamed already
    if (err?.http_code === 404 || err?.message?.includes('not found')) {
      return { success: true, oldPublicId, newPublicId, alreadyMoved: true };
    }
    return { success: false, oldPublicId, newPublicId, error: err.message };
  }
}

async function main() {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error('❌ Missing Cloudinary credentials'); process.exit(1);
  }

  // Collect all files
  const allFiles = [];
  for (const sub of SUBFOLDERS) {
    const dir = path.join(SOURCE_BASE, sub);
    if (!fs.existsSync(dir)) { console.error(`❌ Not found: ${dir}`); process.exit(1); }
    const files = fs.readdirSync(dir).sort();
    for (const file of files) {
      if (IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase())) {
        allFiles.push({ subfolder: sub, filename: file });
      }
    }
  }

  console.log(`\n🔄 Renaming ${allFiles.length} Cloudinary assets (sub-folder → flat)`);
  console.log(`☁️  Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`⚡ Concurrency: ${CONCURRENCY}\n`);

  const limit = pLimit(CONCURRENCY);
  let moved = 0, alreadyMoved = 0, failed = 0;
  const errors = [];
  const startTime = Date.now();

  const tasks = allFiles.map((item, index) =>
    limit(async () => {
      const filenameNoExt = path.basename(item.filename, path.extname(item.filename));
      const oldPublicId = `${UPLOAD_FOLDER}/assets/automotive/${item.subfolder}/${filenameNoExt}`;
      const newPublicId = `${UPLOAD_FOLDER}/assets/automotive/${filenameNoExt}`;

      const result = await renameAsset(oldPublicId, newPublicId);
      const tag = `[${index + 1}/${allFiles.length}]`;

      if (result.success) {
        if (result.alreadyMoved) {
          alreadyMoved++;
          process.stdout.write(`\r⏭️  ${tag} Already flat: ${item.subfolder}/${item.filename}            `);
        } else {
          moved++;
          process.stdout.write(`\r✅ ${tag} Moved: ${item.subfolder}/${item.filename} → automotive/${item.filename}            `);
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
  console.log(`📊 Rename Summary`);
  console.log(`────────────────────────────────────────`);
  console.log(`   ✅ Moved:        ${moved}`);
  console.log(`   ⏭️  Already flat: ${alreadyMoved}`);
  console.log(`   ❌ Failed:       ${failed}`);
  console.log(`   ⏱️  Time:         ${elapsed}s`);
  console.log(`────────────────────────────────────────\n`);

  if (errors.length > 0) {
    console.log('❌ Failed renames:');
    errors.forEach(e => console.log(`   - ${e.oldPublicId}: ${e.error}`));
    console.log('');
  }

  const projectRoot = path.resolve(__dirname, '..');

  // ── Fix cloudinary-urls.json ─────────────────────────────────────────────
  const mappingPath = path.join(projectRoot, 'cloudinary-urls.json');
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  let jsonFixed = 0;

  for (const item of allFiles) {
    const oldKey = `assets/automotive/${item.subfolder}/${item.filename}`;
    const newKey = `assets/automotive/${item.filename}`;

    if (mapping[oldKey] && !mapping[newKey]) {
      // Update the URL to reflect flat path
      const oldUrl = mapping[oldKey];
      const newUrl = oldUrl.replace(
        `/automotive/${item.subfolder}/${path.basename(item.filename, path.extname(item.filename))}`,
        `/automotive/${path.basename(item.filename, path.extname(item.filename))}`
      );
      mapping[newKey] = newUrl;
      delete mapping[oldKey];
      jsonFixed++;
    } else if (mapping[oldKey] && mapping[newKey]) {
      // Both exist, just remove the old sub-folder key
      delete mapping[oldKey];
      jsonFixed++;
    }
    // If newKey already exists and oldKey doesn't, nothing to do
  }

  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log(`📝 cloudinary-urls.json — ${jsonFixed} entries re-keyed to flat paths\n`);

  // ── Fix products.ts ───────────────────────────────────────────────────────
  const productsPath = path.join(projectRoot, 'src/data/products.ts');
  let content = fs.readFileSync(productsPath, 'utf8');
  let tsFixed = 0;

  for (const sub of SUBFOLDERS) {
    // Replace /assets/automotive/a1/a1- → /assets/automotive/a1-
    const oldPattern = new RegExp(`/assets/automotive/${sub}/${sub}-`, 'g');
    const newPattern = `/assets/automotive/${sub}-`;
    const before = (content.match(oldPattern) || []).length;
    content = content.replace(oldPattern, newPattern);
    tsFixed += before;
  }

  fs.writeFileSync(productsPath, content);
  console.log(`📦 products.ts — ${tsFixed} image paths updated to flat automotive/\n`);

  if (failed > 0) {
    console.log('⚠️  Some renames failed. Re-run to retry.\n');
    process.exit(1);
  }

  console.log('🎉 Done! All new automotive posters are now in the flat automotive/ folder.\n');
  console.log('   Next steps:');
  console.log('   1. Run `npm run dev` and verify images load correctly');
  console.log('   2. Commit and push to trigger Vercel deploy\n');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
