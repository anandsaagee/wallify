#!/usr/bin/env node
/**
 * update-sitemaps.js
 * Run automatically during build via package.json `prebuild` script.
 * Updates <lastmod> in all sitemap XML files to today's date (YYYY-MM-DD).
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const SITEMAP_DIR = new URL('../public-deploy', import.meta.url).pathname;
const TODAY = new Date().toISOString().split('T')[0];
const LASTMOD_RE = /<lastmod>[0-9]{4}-[0-9]{2}-[0-9]{2}<\/lastmod>/g;

const files = readdirSync(SITEMAP_DIR).filter(
  (f) => f.startsWith('sitemap') && f.endsWith('.xml')
);

let updated = 0;
for (const file of files) {
  const full = join(SITEMAP_DIR, file);
  const original = readFileSync(full, 'utf8');
  const replaced = original.replace(LASTMOD_RE, `<lastmod>${TODAY}</lastmod>`);
  if (replaced !== original) {
    writeFileSync(full, replaced, 'utf8');
    updated++;
    console.log(`✓ ${file}`);
  }
}
console.log(`\nSitemap lastmod updated to ${TODAY} in ${updated} file(s).`);
