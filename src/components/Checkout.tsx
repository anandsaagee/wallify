import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronLeft, CreditCard, Truck, ShieldCheck, MapPin, Phone, User, CheckCircle2, Info, Gift } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedImage } from './OptimizedImage';

interface CheckoutProps {
  onBack: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onBack }) => {
  const { cart, totals, clearCart, updateQuantity, removeFromCart } = useCart();
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
  });

  const [shippingError, setShippingError] = useState<string | null>(null);
  const [shippingZone, setShippingZone] = useState<{name: string, charge: number, days: string} | null>(null);

  useEffect(() => {
    const pin = formData.pincode.replace(/\D/g, '');
    if (pin.length < 6) {
      setShippingZone(null);
      setShippingError(null);
      return;
    }
    
    if (pin.length === 6) {
      const prefix = parseInt(pin.substring(0, 3), 10);
      
      if (prefix < 100 || prefix > 855) {
        setShippingError('Delivery unavailable to this PIN code.');
        setShippingZone(null);
        return;
      }
      
      let zone;
      if (prefix >= 670 && prefix <= 699) {
        zone = { name: 'Kerala', charge: 50, days: '5–7 days' };
      } else if (prefix >= 500 && prefix <= 699) {
        zone = { name: 'South India', charge: 60, days: '5–7 days' };
      } else if (prefix === 194 || prefix === 744 || (prefix >= 780 && prefix <= 799)) {
        zone = { name: 'Remote Area', charge: 120, days: '8–10 days' };
      } else {
        zone = { name: 'All India', charge: 80, days: '6–9 days' };
      }
      
      setShippingZone(zone);
      setShippingError(null);
    }
  }, [formData.pincode]);

  const bulkSurcharge = totals.totalPaidItems > 25 ? 10 : 0;
  const shippingCharge = shippingZone ? shippingZone.charge + bulkSurcharge : 0;
  const finalTotalWithShipping = totals.finalTotal + shippingCharge;

  const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'details') {
      if (formData.pincode.length !== 6 || !shippingZone) {
        alert('Please enter a valid 6-digit pincode for delivery.');
        return;
      }
      
      setStep('processing');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Generate WhatsApp message
      const orderId = Math.random().toString(36).substring(2, 9).toUpperCase();
      
      let message = `🛍️ *NEW ORDER: #${orderId}*\n`;
      message += `--------------------------\n`;
      message += `👤 *CUSTOMER DETAILS:*\n`;
      message += `Name: ${formData.name}\n`;
      message += `Phone: ${formData.phone}\n`;
      message += `Address: ${formData.address}\n`;
      message += `City: ${formData.city}\n`;
      message += `Pincode: ${formData.pincode}\n\n`;
      
      message += `🖼️ *ORDER SUMMARY:*\n`;
      let itemNum = 1;
      paidItems.forEach(item => {
        message += `${itemNum++}. ${item.title} (${item.size}) x ${item.quantity} — ₹${item.price * item.quantity}\n`;
      });
      
      if (totals.eligibleFreeGifts > 0) {
        message += `\n🎁 *FREE GIFTS:*\n`;
        message += `${itemNum}. ${totals.eligibleFreeGifts}x Mystery Poster${totals.eligibleFreeGifts > 1 ? 's' : ''} — FREE\n`;
      }
      
      message += `\n💰 *SUBTOTAL: ₹${totals.finalTotal}*\n`;
      message += `🚚 *DELIVERY (${shippingZone?.name}): ₹${shippingZone?.charge}${bulkSurcharge > 0 ? ` + ₹${bulkSurcharge} bulk surcharge` : ''}*\n`;
      message += `💰 *TOTAL AMOUNT: ₹${finalTotalWithShipping}*\n`;
      message += `--------------------------\n`;
      message += `_Sent via Wallify Store_`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/917736497186?text=${encodedMessage}`;
      
      clearCart();
      
      // Redirect to WhatsApp
      setTimeout(() => {
        setStep('success');
        window.location.href = whatsappUrl;
      }, 1500);
    }
  };

  const paidItems = cart.filter((item) => !item.isFreeGift);
  const freeItems = cart.filter((item) => item.isFreeGift);

  if (step === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-6"
        />
        <h2 className="text-2xl font-black tracking-tighter mb-2 uppercase">Processing Order</h2>
        <p className="text-muted text-sm max-w-[280px]">
          Please wait while we redirect you to WhatsApp to complete your order...
        </p>
      </div>
    );
  }

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
    <div className="max-w-2xl mx-auto px-4 py-6 pb-32 min-h-screen flex flex-col">
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
        <div className="grid grid-cols-1 gap-8 flex-1">
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
                      <OptimizedImage src={item.image} alt={item.title} containerClassName="w-full h-full" className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{item.title}</p>
                      <p className="text-[10px] text-muted font-medium mt-0.5">{item.category} · {item.size}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => {
                            if (item.quantity <= 1) {
                              removeFromCart(item.variantId);
                            } else {
                              updateQuantity(item.variantId, -1);
                            }
                          }}
                          aria-label="Decrease quantity"
                          className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:bg-red-500/20 hover:text-red-400 active:scale-95 transition-all text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="text-sm font-black text-white w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, 1)}
                          aria-label="Increase quantity"
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

          {/* Mystery Free Poster Notice */}
          <AnimatePresence>
            {totals.eligibleFreeGifts > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-primary/[0.04] border border-primary/10 rounded-2xl p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-5 h-5 text-primary" />
                  <h2 className="text-sm font-black text-primary uppercase tracking-widest">
                    Mystery Rewards Unlocked!
                  </h2>
                </div>

                <p className="text-xs text-muted font-medium leading-relaxed">
                  You've unlocked <span className="text-primary font-black">{totals.eligibleFreeGifts}</span> FREE mystery poster{totals.eligibleFreeGifts > 1 ? 's' : ''}! 
                  These will be carefully selected and added to your package automatically.
                </p>
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

            <div className="flex justify-between text-sm font-bold">
              <span className="text-muted">Delivery</span>
              <span className="text-white">
                {!shippingZone
                  ? 'Enter pincode below'
                  : bulkSurcharge > 0
                  ? `₹${shippingZone.charge} + ₹${bulkSurcharge}`
                  : `₹${shippingZone.charge}`}
              </span>
            </div>
            {bulkSurcharge > 0 && (
              <div className="flex justify-between text-xs font-bold">
                <span className="text-amber-400/80">Bulk surcharge (&gt;25 posters)</span>
                <span className="text-amber-400">+₹10</span>
              </div>
            )}

            <div className="pt-3 border-t border-white/10 flex justify-between items-end">
              <span className="text-sm font-black text-muted uppercase tracking-wider">Total</span>
              <span className="text-2xl font-black text-primary">₹{finalTotalWithShipping}</span>
            </div>
          </div>

          {/* Delivery notice */}
          {shippingZone ? (
            <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
              <div className="shrink-0 w-8 h-8 rounded-xl bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-green-400">Delivery to {formData.pincode} ({shippingZone.name})</p>
                <p className="text-[11px] text-green-400/80 mt-0.5 leading-relaxed">
                  Estimated delivery in {shippingZone.days}
                </p>
              </div>
            </div>
          ) : shippingError ? (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
              <div className="shrink-0 w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Info className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-red-400">Delivery Unavailable</p>
                <p className="text-[11px] text-red-400/80 mt-0.5 leading-relaxed">
                  {shippingError}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 bg-white/[0.03] border border-white/[0.04] rounded-2xl p-4">
              <div className="shrink-0 w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Info className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/80">Delivery Charges Apply</p>
                <p className="text-[11px] text-muted mt-0.5 leading-relaxed">
                  Enter your pincode to calculate delivery charges. Orders above 25 posters incur an extra ₹10 surcharge.
                </p>
              </div>
            </div>
          )}

          {/* Checkout form */}
          <form onSubmit={handleSubmit} className="space-y-8 pb-12">
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

            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex gap-4 items-start mt-6">
              <div className="p-2 bg-primary/20 rounded-lg text-primary">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight">Direct WhatsApp Order</h3>
                <p className="text-xs text-muted mt-1 font-medium">We'll verify and process your order securely via WhatsApp.</p>
              </div>
            </div>

            {/* CTA - Keyboard aware sticky */}
            <div className="sticky bottom-4 left-0 right-0 z-40 mt-12">
              <button
                type="submit"
                disabled={paidItems.length === 0}
                className="w-full h-14 bg-primary text-black font-black rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(250,203,21,0.3)] uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed border border-primary/20"
              >
                <Truck size={16} />
                Order via WhatsApp — ₹{finalTotalWithShipping}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
