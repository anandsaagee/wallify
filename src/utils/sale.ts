// ── Anniversary Sale Config ───────────────────────────────────────────────────
// Active: Nov 15 2026 → Dec 31 2026
export const SALE = {
  name: '1st Anniversary Sale 🎉',
  discountPct: 10,         // 10% off poster subtotal
  freeDelivery: true,      // shipping waived completely
  start: new Date('2026-11-15T00:00:00+05:30'),
  end:   new Date('2026-12-31T23:59:59+05:30'),
} as const;

export function isSaleActive(): boolean {
  const now = new Date();
  return now >= SALE.start && now <= SALE.end;
}

/** Returns whole-number discount amount on a given subtotal */
export function getSaleDiscount(subtotal: number): number {
  if (!isSaleActive()) return 0;
  return Math.round(subtotal * SALE.discountPct / 100);
}

/** Days remaining in the sale (rounded up), or 0 if not active */
export function saleDaysLeft(): number {
  if (!isSaleActive()) return 0;
  const msLeft = SALE.end.getTime() - Date.now();
  return Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
}
