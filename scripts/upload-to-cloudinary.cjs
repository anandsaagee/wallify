/**
 * Bulk Upload Script — Cloudinary
 * 
 * Uploads all images from public/assets/ and public/custom-posters/ to Cloudinary,
 * preserving directory structure under the "wallify" folder.
 * 
 * Usage:
 *   1. Create a .env file in the project root with your Cloudinary credentials:
 *        CLOUDINARY_CLOUD_NAME=your_cloud_name
 *        CLOUDINARY_API_KEY=your_api_key
 *        CLOUDINARY_API_SECRET=your_api_secret
 *   
 *   2. Install dependencies:
 *        npm install cloudinary dotenv p-limit
 *   
 *   3. Run the script:
 *        node scripts/upload-to-cloudinary.cjs
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

const UPLOAD_FOLDER = 'wallify'; // Root folder on Cloudinary
const CONCURRENCY = 5;           // Parallel uploads (be nice to free-tier rate limits)
const IMAGE_EXTENSIONS = new Set(['.webp', '.jpg', '.jpeg', '.png', '.avif']);

// Directories to upload (relative to project root)
const UPLOAD_DIRS = [
  'public/assets',
  'public/custom-posters',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (IMAGE_EXTENSIONS.has(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  }
  return arrayOfFiles;
}

// Simple concurrency limiter (avoids needing p-limit if not installed)
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

// ─── Upload Logic ────────────────────────────────────────────────────────────

async function uploadFile(filePath, projectRoot) {
  // Convert: public/assets/anime/anime-001.webp → assets/anime/anime-001.webp
  const relativePath = path.relative(path.join(projectRoot, 'public'), filePath);
  
  // Cloudinary public_id: wallify/assets/anime/anime-001 (no extension)
  const withoutExt = relativePath.replace(/\.[^.]+$/, '');
  const publicId = `${UPLOAD_FOLDER}/${withoutExt}`;
  
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: false,        // Skip if already uploaded
      resource_type: 'image',
      use_filename: false,     // We set public_id explicitly
      unique_filename: false,
    });
    return { success: true, path: relativePath, url: result.secure_url };
  } catch (err) {
    // If error is "already exists", treat as success
    if (err?.http_code === 409 || err?.message?.includes('already exists')) {
      return { success: true, path: relativePath, skipped: true };
    }
    return { success: false, path: relativePath, error: err.message };
  }
}

async function main() {
  // Validate config
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('\n❌ Missing Cloudinary credentials!');
    console.error('   Create a .env file in the project root with:');
    console.error('     CLOUDINARY_CLOUD_NAME=your_cloud_name');
    console.error('     CLOUDINARY_API_KEY=your_api_key');
    console.error('     CLOUDINARY_API_SECRET=your_api_secret\n');
    process.exit(1);
  }

  const projectRoot = path.resolve(__dirname, '..');
  
  // Collect all image files
  let allFiles = [];
  for (const dir of UPLOAD_DIRS) {
    const fullDir = path.join(projectRoot, dir);
    const files = getAllFiles(fullDir);
    allFiles = allFiles.concat(files);
  }

  console.log(`\n📦 Found ${allFiles.length} images to upload`);
  console.log(`☁️  Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`📁 Folder: ${UPLOAD_FOLDER}/`);
  console.log(`⚡ Concurrency: ${CONCURRENCY}\n`);

  const limit = pLimit(CONCURRENCY);
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;
  const errors = [];
  const startTime = Date.now();

  const tasks = allFiles.map((filePath, index) =>
    limit(async () => {
      const result = await uploadFile(filePath, projectRoot);
      
      if (result.success) {
        if (result.skipped) {
          skipped++;
          process.stdout.write(`\r⏭️  [${index + 1}/${allFiles.length}] Skipped (exists): ${result.path}`);
        } else {
          uploaded++;
          process.stdout.write(`\r✅ [${index + 1}/${allFiles.length}] Uploaded: ${result.path}          `);
        }
      } else {
        failed++;
        errors.push(result);
        process.stdout.write(`\r❌ [${index + 1}/${allFiles.length}] Failed: ${result.path}          `);
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
    errors.forEach((e) => console.log(`   - ${e.path}: ${e.error}`));
    console.log('');
  }

  // Save URL mapping for reference
  const mapping = {};
  results.forEach((r) => {
    if (r.success && r.url) {
      mapping[r.path] = r.url;
    }
  });

  const mappingPath = path.join(projectRoot, 'cloudinary-urls.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log(`📝 URL mapping saved to: cloudinary-urls.json\n`);
  
  if (failed > 0) {
    console.log('⚠️  Some uploads failed. Re-run the script to retry (existing uploads will be skipped).\n');
    process.exit(1);
  }
  
  console.log('🎉 All images uploaded successfully! Next steps:');
  console.log('   1. Update CLOUDINARY_CLOUD_NAME in src/utils/imageUrl.ts');
  console.log('   2. Run `npm run dev` and verify images load');
  console.log('   3. Commit and push to trigger Vercel deploy\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
