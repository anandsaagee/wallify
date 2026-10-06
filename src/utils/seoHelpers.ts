/**
 * Technical SEO Helper Utilities for WallifyStore
 * 
 * Provides automated, data-driven title generation, alt text, 
 * rich product descriptions, and schema helpers.
 */

/**
 * Cleans raw product titles that might contain legacy repetitive suffixes.
 * E.g. "Abstract 001 Minimalist Abstract Poster – Premium Matte Finish" -> "Abstract 001"
 */
export function getCleanPosterName(rawTitle: string): string {
  if (!rawTitle) return '';
  return rawTitle
    .replace(/\s+Minimalist\s+[A-Za-z0-9\s]+Poster\s+–\s+Premium\s+Matte\s+Finish/gi, '')
    .replace(/\s+Poster\s+–\s+Premium\s+Matte\s+Finish/gi, '')
    .trim();
}

/**
 * Builds standard On-Page <title> (50-60 characters, primary keyword first, brand last).
 * Pattern: "[Poster Name] Poster – [Size/Type] Wall Art | WallifyStore"
 */
export function buildPosterMetaTitle(rawTitle: string, category: string, sizeLabel: string): string {
  const cleanName = getCleanPosterName(rawTitle);
  const base = `${cleanName} Poster – ${sizeLabel} Wall Art | WallifyStore`;
  if (base.length <= 60) return base;
  return `${cleanName} Wall Poster – ${sizeLabel} | WallifyStore`;
}

/**
 * Builds high-converting, benefit-driven Meta Description (140-160 characters).
 */
export function buildPosterMetaDescription(rawTitle: string, category: string): string {
  const cleanName = getCleanPosterName(rawTitle);
  return `Buy ${cleanName} ${category} wall poster online in India. Printed on thick 300 GSM matte art paper with fade-resistant inks. Fast delivery. Order now!`;
}

/**
 * Generates descriptive image alt text (8 to 15 words, under 125 characters).
 * Describes what is visibly depicted + primary keyword naturally without "image of".
 */
export function generatePosterAltText(rawTitle: string, category: string, customAlt?: string): string {
  if (customAlt && customAlt.trim().length > 0) return customAlt;
  const cleanName = getCleanPosterName(rawTitle);
  return `${cleanName} ${category.toLowerCase()} wall poster printed on high quality glare-free matte art paper`;
}

/**
 * Generates human-friendly caption line for <figure><figcaption>.
 */
export function generatePosterCaption(rawTitle: string, category: string, sizeLabel: string): string {
  const cleanName = getCleanPosterName(rawTitle);
  return `${cleanName} • ${category} Wall Art • Available in ${sizeLabel} & Custom Sizes`;
}

/**
 * Generates unique, natural product description (80-130 words).
 * Covers subject, art style, 300 GSM paper, archival inks, framing, and ideal room placement.
 */
export function generatePosterProductDescription(rawTitle: string, category: string): string {
  const cleanName = getCleanPosterName(rawTitle);
  const cat = category.toLowerCase();

  let roomPlacement = 'bedroom, living room, study area, or modern workspace';
  let vibe = 'contemporary aesthetic';

  if (cat.includes('anime')) {
    roomPlacement = 'bedroom, gaming setup, college hostel, or creative studio';
    vibe = 'vibrant anime aesthetic with crisp linework';
  } else if (cat.includes('auto')) {
    roomPlacement = 'garage, bedroom, home office, or lounge';
    vibe = 'high-octane automotive energy and precision styling';
  } else if (cat.includes('movie') || cat.includes('hollywood') || cat.includes('mollywood') || cat.includes('tamil')) {
    roomPlacement = 'home theater, entertainment corner, bedroom, or living room';
    vibe = 'cinematic nostalgia and iconic visual storytelling';
  } else if (cat.includes('football')) {
    roomPlacement = 'sports corner, bedroom, gym, or game room';
    vibe = 'stadium adrenaline and legendary sporting legacy';
  } else if (cat.includes('quote')) {
    roomPlacement = 'study desk, home office, workstation, or personal gym';
    vibe = 'focused, minimalist motivation and clean typography';
  }

  return `Transform your walls with the ${cleanName} ${category} wall poster from WallifyStore. Precision-printed on premium 300 GSM thick archival art paper, this print delivers vivid colors, deep contrast, and a glare-free matte finish designed to resist fading for years. Perfect for styling your ${roomPlacement}, it brings a ${vibe} to any interior. Available in A6, A5, A4, and A3 formats with optional crystal-clear acrylic framing for instant, hassle-free display.`;
}
