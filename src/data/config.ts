export const SIZES = [
  { id: 'A6', label: 'A6', dim: '10.5 x 14.8 cm', price: 17 },
  { id: 'A5', label: 'A5', dim: '14.8 x 21 cm', price: 33 },
  { id: 'A4', label: 'A4', dim: '21 x 29.7 cm', price: 49 },
  { id: 'A3', label: 'A3', dim: '29.7 x 42 cm', price: 99 },
];

export const BULK_OFFERS = [
  { buy: 5, getFree: 1, label: 'Buy 5, Get 1 FREE' },
  { buy: 7, getFree: 2, label: 'Buy 7, Get 2 FREE' },
  { buy: 10, getFree: 3, label: 'Buy 10, Get 3 FREE' },
  { buy: 20, getFree: 7, label: 'Buy 20, Get 7 FREE' },
];

export function getEligibleFreeItems(paidCount: number): number {
  let best = 0;
  for (const offer of BULK_OFFERS) {
    if (paidCount >= offer.buy) {
      best = offer.getFree;
    }
  }
  return best;
}

export const ITEMS_PER_PAGE = 24;

export const CATEGORIES = [
  'All',
  'Aesthetic',
  'Anime',
  'Automotive',
  'Classic Cars',
  'Football',
  'Mollywood',
  'Music',
  'Spiritual',
  'Abstract',
  'Hollywood',
  'Tamil',
] as const;

export type Category = (typeof CATEGORIES)[number];

export const FALLBACK_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><rect fill="#1a1a1a" width="300" height="400"/><text x="150" y="200" text-anchor="middle" fill="#555" font-family="sans-serif" font-size="14">Wallify</text></svg>'
  );
