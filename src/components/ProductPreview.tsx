import React, { useState, useCallback, useEffect } from 'react';
import { ShoppingBag, Zap, Check, Gift, Frame, Share2 } from 'lucide-react';
import { SIZES, getFramePrice } from '../data/config';
import { useCart } from '../hooks/useCart';
import { OptimizedImage } from './OptimizedImage';
import { SEO } from './SEO';

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

export const ProductPreview: React.FC<ProductPreviewProps> = ({ product, initialSizeId, onClose }) => {
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
    const slug = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const fullUrl = `https://wallifystore.com/posters/${product.category.toLowerCase()}/${slug}`;
    const shareData = {
      title: `${product.title} Poster | WallifyStore`,
      text: `Check out this ${product.title} ${product.category} poster on Wallify!`,
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

    // Close window and return to main page after adding
    setTimeout(() => {
      onClose?.();
      setCartState('idle');
    }, 600);
  }, [addToCart, product, selectedSize, withFrame, onClose]);

  // Handle History & URL changes
  useEffect(() => {
    const slug = product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
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
  const seoTitle = `${product.title} Poster – ${currentSize.label} Wall Art | WallifyStore`;
  const seoDesc = `Buy the premium ${product.title} ${product.category} poster online. High-quality, fade-resistant print perfect for your bedroom or hostel. Order now!`;
  const seoUrl = `https://wallifystore.com/posters/${product.category.toLowerCase()}/${product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`;
  const seoImage = `https://wallifystore.com${product.image}`;
  const altText = `Premium ${product.title} wall poster in ${product.category} style printed on high quality matte paper`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": `${product.title} Poster`,
        "image": [seoImage],
        "description": seoDesc,
        "sku": product.id,
        "brand": {
          "@type": "Brand",
          "name": "WallifyStore"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "148"
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
            "item": "https://wallifystore.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": `${product.category} Posters`,
            "item": `https://wallifystore.com/category/${product.category.toLowerCase()}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": `${product.title} Poster`,
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
        {/* Product Image */}
        <div className="px-4 pt-1 flex justify-center">
          <figure className="w-full max-h-[45dvh] max-w-[320px] aspect-[3/4] overflow-hidden rounded-xl border border-white/5 bg-black/40 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <OptimizedImage
              src={product.image}
              alt={altText}
              priority={true}
              containerClassName="w-full h-full"
              className="w-full h-full"
            />
            <figcaption className="sr-only">
              {product.title} - {product.category} Wall Art ({currentSize.label})
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
              <h2 className="text-lg font-black text-white leading-tight mt-1 tracking-tight">
                {product.title}
              </h2>
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
          aria-label={cartState === 'added' ? 'Added to cart' : 'Add to cart'}
          className={`shrink-0 w-[52px] h-[52px] rounded-2xl border-[1.5px] flex items-center justify-center transition-all duration-200 active:scale-90 ${
            cartState === 'added'
              ? 'bg-green-500 text-black border-green-500'
              : 'bg-white text-black border-white hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.15)]'
          }`}
        >
          {cartState === 'added' ? (
            <Check className="w-[20px] h-[20px] stroke-[3px]" />
          ) : (
            <ShoppingBag className="w-[20px] h-[20px] stroke-[2.5px]" />
          )}
        </button>

        <button
          onClick={handleAddToCart}
          className="flex-1 h-[52px] rounded-2xl bg-primary text-black font-black text-[15px] flex items-center justify-center gap-2 transition-transform duration-150 active:scale-95 hover:brightness-110 shadow-[0_8px_20px_rgba(250,203,21,0.2)]"
        >
          <Zap className="w-[18px] h-[18px]" aria-hidden="true" />
          {withFrame ? `Add Framed — ₹${totalPrice}` : `Add to Cart — ₹${totalPrice}`}
        </button>
      </div>
    </article>
  );
};
