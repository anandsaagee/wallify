import React, { useState, useMemo } from 'react';
import { ShoppingBag, ChevronLeft, CreditCard, Truck, ShieldCheck, MapPin, Phone, User, CheckCircle2, Info, Gift, X, Plus } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { SIZES, getEligibleFreeItems } from '../data/config';
import { products } from '../data/products';
import { motion, AnimatePresence } from 'framer-motion';

interface CheckoutProps {
  onBack: () => void;
  onProductClick: (product: { id: string; title: string; image: string; category: string }) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onBack, onProductClick }) => {
  const { cart, totals, clearCart, selectFreePoster, removeFreePoster, freeSlots } = useCart();
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
  });
  const [freePosterSize, setFreePosterSize] = useState('A5');
  const [showFreePosterPicker, setShowFreePosterPicker] = useState(false);
  const [freeSearch, setFreeSearch] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'details') setStep('payment');
    else if (step === 'payment') {
      setTimeout(() => {
        setStep('success');
        clearCart();
      }, 1500);
    }
  };

  const paidItems = cart.filter((item) => !item.isFreeGift);
  const freeItems = cart.filter((item) => item.isFreeGift);

  const filteredFreePosters = useMemo(() => {
    const q = freeSearch.toLowerCase().trim();
    return products.filter(
      (p) =>
        !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [freeSearch]);

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-black tracking-tighter mb-2">ORDER PLACED!</h2>
        <p className="text-muted text-sm max-w-[280px] mb-8">
          Thank you for your order. We'll send you a confirmation on WhatsApp shortly.
        </p>
        <button
          onClick={onBack}
          className="w-full max-w-xs h-14 bg-white text-black font-black rounded-2xl active:scale-95 transition-all uppercase tracking-widest text-xs"
        >
          Back to Store
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-muted hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-black tracking-tighter uppercase">Your Bag</h1>
        {totals.totalPaidItems > 0 && (
          <span className="text-sm text-muted font-bold">
            {totals.totalPaidItems} item{totals.totalPaidItems > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {paidItems.length === 0 && freeItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShoppingBag className="w-16 h-16 text-white/10 mb-4" />
          <p className="text-white font-bold text-base">Your bag is empty</p>
          <p className="text-muted text-sm mt-1">Add some posters to get started</p>
          <button
            onClick={onBack}
            className="mt-6 px-6 py-3 bg-primary text-black font-bold rounded-full active:scale-95 transition-transform text-sm"
          >
            Browse Posters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {/* Paid Items */}
          {paidItems.length > 0 && (
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-white mb-4">
                Selected Posters
              </h2>
              <div className="space-y-3">
                {paidItems.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-3"
                  >
                    <div className="shrink-0 w-16 h-20 rounded-xl overflow-hidden bg-surface">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{item.title}</p>
                      <p className="text-[10px] text-muted font-medium mt-0.5">{item.category} · {item.size}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => {
                            /* quantity change handled by parent */
                          }}
                          className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 active:scale-95 transition-all text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="text-sm font-black text-white w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => {
                            /* quantity change handled by parent */
                          }}
                          className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 active:scale-95 transition-all text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-black text-white">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Free Poster Section */}
          <AnimatePresence>
            {totals.eligibleFreeGifts > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-primary/[0.04] border border-primary/10 rounded-2xl p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Gift className="w-5 h-5 text-primary" />
                  <h2 className="text-sm font-black text-primary uppercase tracking-widest">
                    Choose Your Free Posters
                  </h2>
                </div>

                <p className="text-xs text-muted font-medium mb-3">
                  You unlocked <span className="text-primary font-black">{totals.eligibleFreeGifts}</span> free poster
                  {totals.eligibleFreeGifts > 1 ? 's' : ''}.
                  {freeSlots > 0 && (
                    <span className="text-white font-bold"> {freeSlots} remaining to pick.</span>
                  )}
                  {freeSlots === 0 && totals.freeGiftCount > 0 && (
                    <span className="text-white/40"> All free posters selected.</span>
                  )}
                </p>

                {/* Already selected free items */}
                {freeItems.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {freeItems.map((item) => (
                      <div
                        key={item.variantId}
                        className="flex items-center gap-3 bg-white/[0.05] rounded-xl p-2"
                      >
                        <div className="shrink-0 w-10 h-14 rounded-lg overflow-hidden bg-surface">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{item.title}</p>
                          <p className="text-[10px] text-muted">{item.size}</p>
                        </div>
                        <span className="text-xs font-black text-green-400">FREE</span>
                        <button
                          onClick={() => removeFreePoster(item.variantId)}
                          className="shrink-0 w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:bg-red-500/20 hover:text-red-400 active:scale-95 transition-all"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Free poster picker button */}
                {freeSlots > 0 && (
                  <button
                    onClick={() => setShowFreePosterPicker(!showFreePosterPicker)}
                    className="w-full py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-sm hover:bg-primary/15 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    Pick a Free Poster ({freeSlots} left)
                  </button>
                )}

                {/* Free poster picker */}
                <AnimatePresence>
                  {showFreePosterPicker && freeSlots > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4"
                    >
                      {/* Size selector for free poster */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold text-muted uppercase">Size:</span>
                        <div className="flex gap-1">
                          {SIZES.map((s) => (
                            <button
                              key={s.id}
                              onClick={() => setFreePosterSize(s.id)}
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                freePosterSize === s.id
                                  ? 'bg-primary/20 text-primary'
                                  : 'bg-white/5 text-muted hover:bg-white/10'
                              }`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Search */}
                      <input
                        type="search"
                        placeholder="Search posters..."
                        value={freeSearch}
                        onChange={(e) => setFreeSearch(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-muted focus:outline-none focus:border-primary/30 transition-colors mb-3"
                      />

                      {/* Poster grid */}
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
                        {filteredFreePosters.slice(0, 24).map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              selectFreePoster(p, freePosterSize);
                              setShowFreePosterPicker(false);
                              setFreeSearch('');
                            }}
                            className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-surface border border-white/5 hover:border-primary/30 transition-all active:scale-95"
                          >
                            <img src={p.image} alt={p.title} loading="lazy" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                              <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                + Free
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Free items (legacy view if no picker shown) */}
          {freeItems.length === 0 && totals.eligibleFreeGifts === 0 && paidItems.length > 0 && (
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-muted" />
                <p className="text-xs font-bold text-muted">
                  Add {5 - totals.totalPaidItems} more poster{5 - totals.totalPaidItems > 1 ? 's' : ''} to unlock free picks
                </p>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 space-y-3">
            <h3 className="text-[10px] font-black uppercase text-muted tracking-widest">Order Summary</h3>

            <div className="flex justify-between text-sm font-bold">
              <span className="text-muted">Subtotal ({totals.totalPaidItems} items)</span>
              <span className="text-white">₹{totals.subtotal}</span>
            </div>

            {totals.freeGiftCount > 0 && (
              <div className="flex justify-between text-sm font-bold">
                <span className="text-green-400">Free Posters ({totals.freeGiftCount})</span>
                <span className="text-green-400">₹0</span>
              </div>
            )}

            <div className="pt-3 border-t border-white/10 flex justify-between items-end">
              <span className="text-sm font-black text-muted uppercase tracking-wider">Total</span>
              <span className="text-2xl font-black text-primary">₹{totals.finalTotal}</span>
            </div>
          </div>

          {/* Delivery notice */}
          <div className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.04] rounded-2xl p-4">
            <div className="shrink-0 w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Info className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-white/80">Delivery Charges</p>
              <p className="text-[11px] text-muted mt-0.5 leading-relaxed">
                Delivery charges will be calculated based on your pincode.
              </p>
            </div>
          </div>

          {/* Checkout form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 'details' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                  <MapPin size={18} className="text-primary" />
                  <h2 className="text-sm font-black uppercase tracking-widest">Delivery Address</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-muted ml-1">Full Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/50" />
                      <input
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-muted ml-1">Phone</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/50" />
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-muted ml-1">Address</label>
                  <textarea
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors resize-none"
                    placeholder="Door No, Street, Landmark..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-muted ml-1">City</label>
                    <input
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors"
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-muted ml-1">Pincode</label>
                    <input
                      required
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors"
                      placeholder="682001"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                  <CreditCard size={18} className="text-primary" />
                  <h2 className="text-sm font-black uppercase tracking-widest">Payment</h2>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex gap-4 items-start">
                  <div className="p-2 bg-primary/20 rounded-lg text-primary">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight">Cash on Delivery</h3>
                    <p className="text-xs text-muted mt-1 font-medium">Verify your order via WhatsApp after placing.</p>
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-background/0 lg:static lg:p-0 z-40">
              <button
                type="submit"
                disabled={paidItems.length === 0}
                className="w-full max-w-2xl mx-auto h-14 bg-primary text-black font-black rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_8px_32px_rgba(250,203,21,0.3)] uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === 'details' ? (
                  'Continue to Payment'
                ) : (
                  <>
                    <Truck size={16} />
                    Place Order — ₹{totals.finalTotal}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
