import React, { useState, useRef, useMemo } from 'react';
import { Upload, X, ShoppingBag, Zap, Type, AlignLeft, AlignCenter, AlignRight, Layout, Palette } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { OptimizedImage } from './OptimizedImage';
import { SIZES } from '../data/config';

const FONTS = [
  { id: 'Inter', label: 'Modern', family: '"Inter", sans-serif' },
  { id: 'serif', label: 'Elegant', family: 'serif' },
  { id: 'mono', label: 'Typewriter', family: 'monospace' },
  { id: 'system-ui', label: 'Classic', family: 'system-ui' },
];

const COLORS = ['#ffffff', '#000000', '#facb15', '#ff6b6b', '#74c7ec'];

const POSITIONS = [
  'top-left', 'top-center', 'top-right',
  'mid-left', 'mid-center', 'mid-right',
  'bot-left', 'bot-center', 'bot-right',
];

export const Customize: React.FC = () => {
  const { addToCart } = useCart();
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [quote, setQuote] = useState('');
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [position, setPosition] = useState('mid-center');
  const [selectedSize, setSelectedSize] = useState('A5');
  const [quantity, setQuantity] = useState(5);
  const [addedState, setAddedState] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (prev) => setImage(prev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const currentSize = useMemo(() => SIZES.find(s => s.id === selectedSize) || SIZES[1], [selectedSize]);
  
  const totals = useMemo(() => {
    const subtotal = currentSize.price * quantity;
    // Buy 5 Get 1 Free mystery poster — no price discount, just free items
    const freeCount = Math.floor(quantity / 5);
    return { subtotal, total: subtotal, freeCount };
  }, [currentSize, quantity]);

  const handleAddToBag = () => {
    // For custom posters, we'd ideally upload the image and store the design
    // Here we'll simulate adding a "Custom Poster" product
    const customProduct = {
      id: `custom-${Date.now()}`,
      title: title || 'My Custom Poster',
      image: image || '',
      category: 'Custom',
    };
    
    addToCart(customProduct, selectedSize);
    setAddedState(true);
    setTimeout(() => setAddedState(false), 2000);
  };

  const getPositionStyles = (pos: string) => {
    const parts = pos.split('-');
    const styles: React.CSSProperties = {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      padding: '8%',
      width: '100%',
    };

    if (parts[0] === 'top') styles.top = 0;
    else if (parts[0] === 'bot') styles.bottom = 0;
    else styles.top = '50%', styles.transform = 'translateY(-50%)';

    if (parts[1] === 'left') styles.alignItems = 'flex-start', styles.textAlign = 'left';
    else if (parts[1] === 'right') styles.alignItems = 'flex-end', styles.textAlign = 'right';
    else styles.alignItems = 'center', styles.textAlign = 'center';

    return styles;
  };

  return (
    <div id="customize" className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
          Customize Your Poster
        </h2>
        <p className="text-primary font-bold mt-3 uppercase tracking-widest text-sm sm:text-base">
          Poster Customization is available at NO EXTRA CHARGE!
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      
      {/* ══ PREVIEW PANEL (Sticky on Desktop) ══ */}
      <div className="lg:sticky lg:top-24 order-1 lg:order-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted mb-4 block">Live Preview</label>
        <div className="relative aspect-[3/4.2] w-full max-w-[400px] mx-auto bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {image ? (
            <div className="w-full h-full relative">
              <OptimizedImage src={image} alt="Custom Preview" containerClassName="w-full h-full" className="w-full h-full object-cover" />
              <div 
                style={{ 
                  ...getPositionStyles(position),
                  color: selectedColor,
                  fontFamily: selectedFont.family,
                  textAlign: textAlign,
                }}
              >
                {title && <h3 className="text-xl md:text-2xl font-black leading-tight drop-shadow-lg">{title}</h3>}
                {subtitle && <p className="text-sm md:text-base font-bold opacity-90 mt-1 drop-shadow-md">{subtitle}</p>}
                {quote && <p className="text-xs md:text-sm opacity-80 mt-2 leading-relaxed drop-shadow-md italic">{quote}</p>}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white/20 gap-4 p-12 text-center">
              <Upload size={48} className="opacity-50" />
              <p className="text-sm font-medium">Upload an image to start designing your poster</p>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-muted font-bold px-2">
          <span>{currentSize.label} · {currentSize.dim}</span>
          <span>{quantity} posters</span>
        </div>
      </div>

      {/* ══ CONTROL PANEL ══ */}
      <div className="order-2 lg:order-1 space-y-8 pb-20">
        
        {/* Step 1: Image */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-6 rounded-full bg-primary text-black text-[10px] font-black flex items-center justify-center">01</span>
            <h2 className="text-xs font-black uppercase tracking-widest">Your Image</h2>
          </div>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all outline-none focus-within:border-primary/50"
          >
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            {image ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                <OptimizedImage src={image} alt="Custom Artwork" containerClassName="w-full h-full" className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setImage(null); }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full hover:bg-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload size={24} className="text-muted group-hover:text-primary transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white">Tap to upload your artwork</p>
                  <p className="text-[10px] text-muted mt-1 uppercase tracking-wider">Supports JPG, PNG, WEBP (Max 10MB)</p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Step 2: Content */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-6 rounded-full bg-primary text-black text-[10px] font-black flex items-center justify-center">02</span>
            <h2 className="text-xs font-black uppercase tracking-widest">Custom Text</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-muted mb-2 block">Main Title</label>
              <input 
                value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. STAY HARD"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-muted mb-2 block">Subtitle</label>
              <input 
                value={subtitle} onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. — DAVID GOGGINS"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-muted mb-2 block">Quote / Message</label>
              <textarea 
                value={quote} onChange={(e) => setQuote(e.target.value)}
                placeholder="Add a meaningful message..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>
          </div>
        </section>

        {/* Step 3: Style */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-6 rounded-full bg-primary text-black text-[10px] font-black flex items-center justify-center">03</span>
            <h2 className="text-xs font-black uppercase tracking-widest">Visual Style</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black uppercase text-muted mb-3 flex items-center gap-2"><Type size={12}/> Typography</label>
              <div className="flex flex-wrap gap-2">
                {FONTS.map(f => (
                  <button 
                    key={f.id} onClick={() => setSelectedFont(f)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedFont.id === f.id ? 'bg-primary text-black border-primary' : 'bg-white/5 border-white/10 text-white hover:border-white/20'}`}
                    style={{ fontFamily: f.family }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-muted mb-3 flex items-center gap-2"><Palette size={12}/> Text Color</label>
              <div className="flex gap-3">
                {COLORS.map(c => (
                  <button 
                    key={c} onClick={() => setSelectedColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c ? 'border-primary' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase text-muted mb-3 flex items-center gap-2"><Layout size={12}/> Layout & Alignment</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10">
                  <button onClick={() => setTextAlign('left')} className={`p-2 rounded-lg transition-all ${textAlign === 'left' ? 'bg-white/10 text-primary' : 'text-muted'}`}><AlignLeft size={18}/></button>
                  <button onClick={() => setTextAlign('center')} className={`p-2 rounded-lg transition-all ${textAlign === 'center' ? 'bg-white/10 text-primary' : 'text-muted'}`}><AlignCenter size={18}/></button>
                  <button onClick={() => setTextAlign('right')} className={`p-2 rounded-lg transition-all ${textAlign === 'right' ? 'bg-white/10 text-primary' : 'text-muted'}`}><AlignRight size={18}/></button>
                </div>
                <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-xl border border-white/10 w-max">
                  {POSITIONS.map(p => (
                    <button 
                      key={p} onClick={() => setPosition(p)}
                      className={`w-7 h-7 rounded-md transition-all ${position === p ? 'bg-primary' : 'bg-white/10 border border-white/5'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 4: Size & Quantity */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-6 rounded-full bg-primary text-black text-[10px] font-black flex items-center justify-center">04</span>
            <h2 className="text-xs font-black uppercase tracking-widest">Final Details</h2>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SIZES.map(s => (
                <button 
                  key={s.id} onClick={() => setSelectedSize(s.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${selectedSize === s.id ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                >
                  <span className={`font-black text-sm ${selectedSize === s.id ? 'text-primary' : 'text-white'}`}>{s.label}</span>
                  <span className="text-[10px] text-muted mt-0.5">{s.price}₹</span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
              <div>
                <label className="text-[10px] font-black uppercase text-muted block mb-1">Quantity</label>
                <p className="text-[10px] text-primary/80 font-bold uppercase tracking-tighter">* Minimum 5 posters</p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setQuantity(q => Math.max(5, q - 1))} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold active:scale-95 transition-transform">-</button>
                <span className="font-black text-xl w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold active:scale-95 transition-transform">+</button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Summary & Checkout */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="space-y-2 text-sm text-muted font-medium">
              <div className="flex justify-between"><span>Unit Price ({currentSize.label})</span><span className="text-white">₹{currentSize.price}</span></div>
              <div className="flex justify-between"><span>Subtotal ({quantity} items)</span><span className="text-white">₹{totals.subtotal}</span></div>
              {totals.freeCount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>🎁 Free Mystery Posters</span>
                  <span>+{totals.freeCount} free</span>
                </div>
              )}
            </div>
          <div className="pt-4 border-t border-white/10 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black uppercase text-muted mb-1 tracking-widest">Total cost</p>
              <h3 className="text-3xl font-black text-primary tracking-tighter">₹{totals.total}</h3>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleAddToBag}
                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${addedState ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10 active:scale-95'}`}
              >
                {addedState ? <ShoppingBag size={20} fill="currentColor" /> : <ShoppingBag size={20} />}
              </button>
              <button 
                onClick={handleAddToBag}
                className="px-8 h-14 bg-primary text-black font-black text-sm rounded-2xl flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-[0_8px_24px_rgba(250,203,21,0.2)]"
              >
                <Zap size={18} fill="currentColor" />
                BUY NOW
              </button>
            </div>
          </div>
        </div>

        {/* Car Frame Customization CTA */}
        <div className="mt-8 bg-[#25D366]/5 border border-[#25D366]/20 rounded-3xl p-6 text-center">
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
            Want a Custom Poster or Car Frame?
          </h3>
          <p className="text-sm text-muted font-medium mb-6">
            Get a custom poster at no extra charge, or add a premium frame! A4 framed for ₹499, A5 framed for ₹349.
          </p>
          <a
            href="https://wa.me/917736497186?text=Hi!%20I%27d%20like%20to%20customize%20my%20own%20poster%20or%20car%20frame%20%F0%9F%9A%97%F0%9F%96%BC%EF%B8%8F"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-col sm:flex-row items-center gap-3 px-6 py-4 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 hover:bg-[#25D366]/20 active:scale-95 transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-8 h-8 shrink-0"
              aria-hidden="true"
            >
              <circle cx="24" cy="24" r="24" fill="#25D366" />
              <path
                fill="#fff"
                d="M34.6 13.4A14.9 14.9 0 0 0 24 9C16.3 9 10 15.3 10 23c0 2.5.7 4.9 1.9 7L10 39l9.3-1.9a15 15 0 0 0 4.7.8C31.7 38 38 31.7 38 24c0-4-1.6-7.8-3.4-10.6zM24 35.7c-2.1 0-4.2-.6-6-1.6l-.4-.3-4.4.9.9-4.3-.3-.5A12.1 12.1 0 0 1 12 23c0-6.6 5.4-12 12-12 3.2 0 6.2 1.2 8.5 3.5A11.9 11.9 0 0 1 36 23c0 6.6-5.4 12-12 12zm6.6-9c-.4-.2-2.1-1-2.4-1.1-.3-.1-.6-.2-.8.2-.3.4-1 1.1-1.2 1.3-.2.2-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1-2-2.3-2.2-2.7-.2-.4 0-.6.2-.8l.6-.7c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6-.1-.2-.8-2-1.1-2.7-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.8 5.1.8.4 1.4.6 1.9.7.8.3 1.5.2 2.1.1.6-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6z"
              />
            </svg>
            <div className="flex flex-col text-center sm:text-left">
              <span className="text-[#25D366] font-bold text-sm sm:text-base transition-colors duration-200">
                Order Custom Poster or Frame via WhatsApp
              </span>
            </div>
          </a>
        </div>

      </div>
    </div>
    </div>
  );
};
