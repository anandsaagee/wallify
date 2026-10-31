import React from 'react';

/**
 * FanArtNotice — reusable single-line disclosure shown on product pages and
 * in the cart/checkout summary. Keeps the disclaimer wording in one place so
 * it never drifts out of sync across the site.
 */
export const FanArtNotice: React.FC = () => (
  <p className="text-[11px] text-black/50 font-body leading-relaxed">
    Unofficial fan-art / poster merchandise. Not officially licensed or endorsed
    by any studio or rights holder.{' '}
    <a
      href="/content-policy"
      onClick={(e) => {
        e.preventDefault();
        window.history.pushState({}, '', '/content-policy');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }}
      className="underline decoration-primary decoration-[1.5px] underline-offset-2 hover:text-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-sm"
    >
      Read our Copyright &amp; Content Policy
    </a>
    .
  </p>
);
