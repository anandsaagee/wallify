import React, { useState, useCallback, useEffect } from 'react';
import { ShoppingBag, Zap, Check, Gift, Frame, Share2 } from 'lucide-react';
import { SIZES, getFramePrice } from '../data/config';
import { useCart } from '../hooks/useCart';
import { OptimizedImage } from './OptimizedImage';
import { SEO } from './SEO';
import {
  getCleanPosterName,
  buildPosterMetaTitle,
  buildPosterMetaDescription,
  generatePosterAltText,
  generatePosterCaption,
  generatePosterProductDescription,
} from '../utils/seoHelpers';

interface Product {
  id: string;
  title: string;
  category: string;
  image: string;
}

interface ProductPreviewProps {
  product: Product;
  /** If provided (e.g. from SizeFilter), pre-selects this size on open */
  initialSizeId?: string;
  onClose?: () => void;
  onAddedToCart?: (product: Product, sizeLabel: string) => void;
}

const SizeButton: React.FC<{
  size: (typeof SIZES)[number];
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ size, isSelected, onSelect }) => (
  <button
    onClick={() => onSelect(size.id)}
    aria-pressed={isSelected}
    className={`flex flex-col items-center justify-center min-h-[56px] px-2 py-3 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
      isSelected
        ? 'border-primary bg-primary/10 shadow-[0_0_16px_rgba(250,203,21,0.15)]'
        : 'border-white/8 bg-white/[0.03] hover:border-white/20'
    }`}
  >
    <span className={`text-base font-black leading-none ${isSelected ? 'text-primary' : 'text-white'}`}>
      {size.label}
    </span>
    <span className="text-[9px] font-semibold text-white/40 mt-1">{size.dim}</span>
    <span className={`text-[11px] font-black mt-1 ${isSelected ? 'text-primary' : 'text-white/60'}`}>
      ₹{size.price}
    </span>
  </button>
);

const BULK_OFFERS_INLINE = [
  { buy: 5, free: 1 },
  { buy: 7, free: 2 },
  { buy: 10, free: 3 },
  { buy: 20, free: 7 },
] as const;

export const ProductPreview: React.FC<ProductPreviewProps> = ({ product, initialSizeId, onClose, onAddedToCart }) => {
  const defaultSize = SIZES.find((s) => s.id === initialSizeId) ?? SIZES[1];
  const [selectedSize, setSelectedSize] = useState(defaultSize.id);
  const [withFrame, setWithFrame] = useState(false);
  const [cartState, setCartState] = useState<'idle' | 'added'>('idle');
  const [copied, setCopied] = useState(false);
  const { addToCart, totals } = useCart();

  const currentSize = SIZES.find((s) => s.id === selectedSize) ?? SIZES[1];
  const framePrice = getFramePrice(selectedSize);
  const frameAvailable = framePrice !== null;

  // Reset frame toggle when switching to a size that doesn't support frames
  const handleSizeSelect = useCallback((id: string) => {
    setSelectedSize(id);
    if (!getFramePrice(id)) {
      setWithFrame(false);
    }
  }, []);

  const totalPrice = currentSize.price + (withFrame && framePrice ? framePrice : 0);

  const handleShare = useCallback(async () => {
    // Use clean title for consistent URL slug (matches routing + SEO)
    const cleanName = getCleanPosterName(product.title);
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const fullUrl = `https://wallifystore.in/posters/${product.category.toLowerCase()}/${slug}`;
    const shareData = {
      title: `${cleanName} Poster | WallifyStore`,
      text: `Check out this ${cleanName} ${product.category} poster on Wallify!`,
      url: fullUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  }, [product]);

  const freeIndicator = React.useMemo(() => {
    const currentTotal = totals.totalPaidItems;
    const thresholds = [5, 7, 10, 20];
    for (const threshold of thresholds) {
      if (currentTotal < threshold) {
        return { away: threshold - currentTotal, threshold };
      }
    }
    return null;
  }, [totals.totalPaidItems]);

  const handleAddToCart = useCallback(() => {
    addToCart(product, selectedSize, withFrame);
    setCartState('added');

    // Optional haptic vibration on mobile
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(40);
      } catch {
        // ignore
      }
    }

    onAddedToCart?.(product, currentSize.label);

    // Smooth exit: close after user sees the success state (450ms)
    setTimeout(() => {
      onClose?.();
      setCartState('idle');
    }, 450);
  }, [addToCart, product, selectedSize, withFrame, onClose, onAddedToCart, currentSize.label]);

  // Handle History & URL changes — use clean title for consistent slug
  useEffect(() => {
    const cleanName = getCleanPosterName(product.title);
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const url = `/posters/${product.category.toLowerCase()}/${slug}`;

    // Push new state
    window.history.pushState({ posterId: product.id }, '', url);

    // On unmount (close), go back if we pushed it
    return () => {
      if (window.history.state?.posterId === product.id) {
        window.history.back();
      }
    };
  }, [product]);

  // SEO values
  const cleanTitle = getCleanPosterName(product.title);
  const seoTitle = buildPosterMetaTitle(product.title, product.category, currentSize.label);
  const seoDesc = buildPosterMetaDescription(product.title, product.category);
  const rawSlug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const seoUrl = `https://wallifystore.in/posters/${product.category.toLowerCase()}/${rawSlug}`;
  const seoImage = `https://wallifystore.in${product.image}`;
  const altText = generatePosterAltText(product.title, product.category);
  const captionText = generatePosterCaption(product.title, product.category, currentSize.label);
  const productDescription = generatePosterProductDescription(product.title, product.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": `${cleanTitle} Poster`,
        "image": [seoImage],
        "description": seoDesc,
        "sku": product.id,
        "brand": {
          "@type": "Brand",
          "name": "WallifyStore"
        },
        "offers": {
          "@type": "Offer",
          "url": seoUrl,
          "priceCurrency": "INR",
          "price": currentSize.price,
          "priceValidUntil": "2027-12-31",
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition",
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": "50",
              "currency": "INR"
            },
            "shippingDestination": {
              "@type": "DefinedRegion",
              "addressCountry": "IN"
            },
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "businessDays": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["https://schema.org/Monday", "https://schema.org/Saturday"]
              },
              "transitTime": {
                "@type": "QuantitativeValue",
                "minValue": 2,
                "maxValue": 5,
                "unitCode": "DAY"
              }
            }
          }
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://wallifystore.in"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": `${product.category} Posters`,
            "item": `https://wallifystore.in/category/${product.category.toLowerCase()}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `${cleanTitle} Poster`,
            "item": seoUrl
          }
        ]
      }
    ]
  };

  return (
    <article className="flex flex-col h-full min-h-0">
      <SEO 
        title={seoTitle}
        description={seoDesc}
        canonicalUrl={seoUrl}
        image={seoImage}
        type="product"
        jsonLd={jsonLd}
      />
      {/* Scrollable Content */}
      <div
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
      >
        {/* Product Image with visible figcaption */}
        <div className="px-4 pt-1 flex justify-center">
          <figure className="w-full max-h-[48dvh] max-w-[320px] aspect-[3/4] overflow-hidden rounded-xl border border-white/5 bg-black/40 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col">
            <div className="flex-1 min-h-0 relative">
              <OptimizedImage
                src={product.image}
                alt={altText}
                priority={true}
                containerClassName="w-full h-full"
                className="w-full h-full"
              />
            </div>
            <figcaption className="text-[10px] text-white/60 text-center py-1.5 px-3 bg-black/70 border-t border-white/5 font-medium tracking-wide">
              {captionText}
            </figcaption>
          </figure>
        </div>

        {/* Title, Category & Price */}
        <div className="px-4 pt-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                {product.category}
              </span>
              <h1 className="text-lg font-black text-white leading-tight mt-1 tracking-tight">
                {cleanTitle}
              </h1>
            </div>
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share poster link"
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all text-xs font-semibold text-white/80"
            >
              <Share2 className="w-3.5 h-3.5 text-primary" />
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
          <div className="flex items-baseline gap-2 mt-2 flex-wrap">
            <span className="text-2xl font-black text-primary">₹{totalPrice}</span>
            <span className="text-sm text-white/40 font-medium">
              {withFrame ? 'Framed poster' : 'Single poster'}
            </span>
          </div>
        </div>

        {/* Size Selection */}
        <div className="px-4 pt-3">
          <p className="text-[11px] font-extrabold text-white/50 uppercase tracking-widest mb-2">
            Select Size
          </p>
          <div className="grid grid-cols-4 gap-2">
            {SIZES.map((size) => (
              <SizeButton
                key={size.id}
                size={size}
                isSelected={selectedSize === size.id}
                onSelect={handleSizeSelect}
              />
            ))}
          </div>
        </div>

        {/* Frame Add-on Toggle */}
        <div className="px-4 pt-3">
          {frameAvailable ? (
            <div
              className="transition-all duration-200"
            >
              <button
                onClick={() => setWithFrame((v) => !v)}
                aria-pressed={withFrame}
                className={`w-full flex items-center justify-between gap-3 p-3.5 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] ${
                  withFrame
                    ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(250,203,21,0.12)]'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    withFrame ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/40'
                  }`}>
                    <Frame className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className={`text-xs font-black uppercase tracking-wide ${withFrame ? 'text-primary' : 'text-white'}`}>
                      Add Frame
                    </p>
                    <p className="text-[10px] text-white/40 font-medium mt-0.5">
                      Premium frame
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-sm font-black ${withFrame ? 'text-primary' : 'text-white/60'}`}>
                    +₹{framePrice}
                  </span>
                  {/* Toggle pill */}
                  <div className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                    withFrame ? 'bg-primary' : 'bg-white/20'
                  }`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      withFrame ? 'translate-x-5' : 'translate-x-0.5'
                    }`} />
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 px-1 transition-opacity duration-150"
            >
              <Frame className="w-3.5 h-3.5 text-white/20" />
              <p className="text-[10px] text-white/25 font-medium">
                Frames available for A5 &amp; A4 only
              </p>
            </div>
          )}
        </div>

        {/* Free Poster Indicator */}
        {freeIndicator && (
          <div
            className="px-4 pt-3 overflow-hidden transition-all duration-300"
          >
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-3 flex items-center gap-3">
              <div className="shrink-0 w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Gift className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  You are <span className="text-primary">{freeIndicator.away}</span>{' '}
                  item{freeIndicator.away > 1 ? 's' : ''} away from a free poster
                </p>
                <p className="text-[10px] text-muted font-medium mt-0.5">
                  Buy {freeIndicator.threshold} posters total to unlock free picks
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Offer Banner */}
        <div className="px-4 pt-3">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Gift className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-black text-primary uppercase tracking-widest">
                Bulk Offers
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {BULK_OFFERS_INLINE.map((o) => (
                <div
                  key={o.buy}
                  className="bg-white/[0.04] rounded-xl p-2 text-center"
                >
                  <p className="text-[10px] font-black text-white">Buy {o.buy}</p>
                  <p className="text-[10px] font-bold text-primary">Get {o.free} FREE</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Unique SEO Product Description & Paper Details */}
        <div className="px-4 pt-3">
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3.5">
            <h2 className="text-[11px] font-black text-white/70 uppercase tracking-wider mb-1.5">
              About This Wall Print
            </h2>
            <p className="text-xs text-white/60 leading-relaxed font-body">
              {productDescription}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/5 text-[10px] text-white/50">
              <div>• 300 GSM Archival Matte Paper</div>
              <div>• Fade-Resistant HD Pigment Inks</div>
              <div>• Glare-Free Smooth Texture</div>
              <div>• Safe Flat-Pack Shipping</div>
            </div>
          </div>
        </div>

        {/* Internal Link to Category — crawlable anchor for link equity */}
        <div className="px-4 pt-3">
          <a
            href={`/category/${product.category.toLowerCase()}`}
            onClick={(e) => { e.preventDefault(); onClose?.(); }}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            Explore more {product.category} Wall Art →
          </a>
        </div>

        {/* Delivery Info */}
        <div className="px-4 pt-2.5 pb-4">
          <p className="text-[10px] font-medium text-white/30 leading-relaxed">
            * Delivery charges will be calculated based on your pincode.
          </p>
        </div>
      </div>

      {/* Sticky CTA Bar — safe-area-inset-bottom ensures it clears home indicator */}
      <div
        className="shrink-0 flex gap-2.5 px-4 pt-3 bg-gradient-to-t from-surface from-80% to-surface/95 border-t border-white/5"
        style={{ paddingBottom: 'max(14px, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={handleAddToCart}
          aria-label={cartState === 'added' ? 'Added to bag' : 'Add to cart'}
          className={`shrink-0 w-[52px] h-[52px] rounded-2xl border-[1.5px] flex items-center justify-center transition-all duration-200 active:scale-90 ${
            cartState === 'added'
              ? 'bg-emerald-500 text-black border-emerald-500 scale-105 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
              : 'bg-white text-black border-white hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.15)]'
          }`}
        >
          {cartState === 'added' ? (
            <Check className="w-[22px] h-[22px] stroke-[3.5px] animate-[pulse_0.4s_ease-in-out]" />
          ) : (
            <ShoppingBag className="w-[20px] h-[20px] stroke-[2.5px]" />
          )}
        </button>

        <button
          onClick={handleAddToCart}
          className={`flex-1 h-[52px] rounded-2xl font-black text-[15px] flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 ${
            cartState === 'added'
              ? 'bg-emerald-400 text-black shadow-[0_8px_25px_rgba(52,211,153,0.4)]'
              : 'bg-primary text-black hover:brightness-110 shadow-[0_8px_20px_rgba(250,203,21,0.2)]'
          }`}
        >
          {cartState === 'added' ? (
            <>
              <Check className="w-[20px] h-[20px] stroke-[3px]" />
              <span>Added to Bag!</span>
            </>
          ) : (
            <>
              <Zap className="w-[18px] h-[18px]" aria-hidden="true" />
              <span>{withFrame ? `Add Framed — ₹${totalPrice}` : `Add to Cart — ₹${totalPrice}`}</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};
