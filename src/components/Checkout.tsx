import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronLeft, Truck, ShieldCheck, MapPin, Phone, User, CheckCircle2, Info, Gift } from 'lucide-react';
import { useCart } from '../hooks/useCart';
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
        const itemTotal = (item.price + (item.withFrame ? item.framePrice : 0)) * item.quantity;
        const frameLabel = item.withFrame ? ` [FRAMED +₹${item.framePrice}]` : '';
        message += `${itemNum++}. [${item.category}] ${item.title} (ID: ${item.productId}) (${item.size})${frameLabel} x ${item.quantity} — ₹${itemTotal}\n`;
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
        <div
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-6 animate-spin"
        />
        <h2 className="text-2xl font-black tracking-tighter mb-2 uppercase text-black">Processing Order</h2>
        <p className="text-black/70 text-sm max-w-[280px] font-medium">
          Please wait while we redirect you to WhatsApp to complete your order...
        </p>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 text-black">
          <CheckCircle2 size={48} className="text-black" />
        </div>
        <h2 className="text-3xl font-black tracking-tighter mb-2 text-black">ORDER PLACED!</h2>
        <p className="text-black/70 text-sm max-w-[280px] mb-8 font-medium">
          Thank you for your order. We'll send you a confirmation on WhatsApp shortly.
        </p>
        <button
          onClick={onBack}
          className="w-full max-w-xs h-14 bg-primary text-black font-black rounded-2xl active:scale-95 transition-all uppercase tracking-widest text-xs shadow-md shadow-primary/25 hover:brightness-105"
        >
          Back to Store
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-36 min-h-screen flex flex-col"
      style={{
        paddingLeft: 'max(16px, env(safe-area-inset-left))',
        paddingRight: 'max(16px, env(safe-area-inset-right))',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-black hover:opacity-70 transition-opacity">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-black tracking-tighter uppercase text-black">Your Bag</h1>
        {totals.totalPaidItems > 0 && (
          <span className="text-sm text-black/70 font-bold">
            {totals.totalPaidItems} item{totals.totalPaidItems > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {paidItems.length === 0 && freeItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShoppingBag className="w-16 h-16 text-black/10 mb-4" />
          <p className="text-black font-bold text-base">Your bag is empty</p>
          <p className="text-black/60 text-sm mt-1 font-medium">Add some posters to get started</p>
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
              <h2 className="text-sm font-black uppercase tracking-widest text-black mb-4">
                Selected Posters
              </h2>
              <div className="space-y-3">
                {paidItems.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex items-center gap-4 bg-black/[0.03] border border-black/[0.06] rounded-2xl p-3"
                  >
                    <div className="shrink-0 w-16 h-20 rounded-xl overflow-hidden bg-surface">
                      <OptimizedImage src={item.image} alt={item.title} containerClassName="w-full h-full" className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-black truncate">{item.title}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-[10px] text-black/60 font-semibold">{item.category} · {item.size}</p>
                        {item.withFrame && (
                          <span className="text-[9px] font-black text-black bg-primary px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                            Framed
                          </span>
                        )}
                      </div>
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
                          className="w-7 h-7 rounded-lg bg-black/5 flex items-center justify-center text-black/50 hover:bg-red-500/20 hover:text-red-500 active:scale-95 transition-all text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="text-sm font-black text-black w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, 1)}
                          aria-label="Increase quantity"
                          className="w-7 h-7 rounded-lg bg-black/5 flex items-center justify-center text-black/50 hover:bg-black/10 active:scale-95 transition-all text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-black text-black">
                        ₹{(item.price + (item.withFrame ? item.framePrice : 0)) * item.quantity}
                      </p>
                      {item.withFrame && (
                        <p className="text-[9px] text-black/60 font-semibold mt-0.5">
                          incl. frame
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mystery Free Poster Notice */}
          {totals.eligibleFreeGifts > 0 && (
            <div
              className="bg-primary/10 border border-primary/20 rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-black" />
                <h2 className="text-sm font-black text-black uppercase tracking-widest">
                  Mystery Rewards Unlocked!
                </h2>
              </div>

              <p className="text-xs text-black/80 font-medium leading-relaxed">
                You've unlocked <span className="bg-primary/30 text-black px-1.5 py-0.5 rounded font-black">{totals.eligibleFreeGifts}</span> FREE mystery poster{totals.eligibleFreeGifts > 1 ? 's' : ''}! 
                These will be carefully selected and added to your package automatically.
              </p>
            </div>
          )}

          {/* Free items (legacy view if no picker shown) */}
          {freeItems.length === 0 && totals.eligibleFreeGifts === 0 && paidItems.length > 0 && (
            <div className="bg-black/[0.02] border border-black/[0.06] rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-black/60" />
                <p className="text-xs font-bold text-black/70">
                  Add {5 - totals.totalPaidItems} more poster{5 - totals.totalPaidItems > 1 ? 's' : ''} to unlock free picks
                </p>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-black/[0.03] border border-black/[0.06] rounded-2xl p-5 space-y-3">
            <h3 className="text-[10px] font-black uppercase text-black/60 tracking-widest">Order Summary</h3>

            <div className="flex justify-between text-sm font-bold">
              <span className="text-black/70">Subtotal ({totals.totalPaidItems} items)</span>
              <span className="text-black font-black">₹{totals.subtotal}</span>
            </div>

            {totals.freeGiftCount > 0 && (
              <div className="flex justify-between text-sm font-bold">
                <span className="text-emerald-700">Free Posters ({totals.freeGiftCount})</span>
                <span className="text-emerald-700">₹0</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-bold">
              <span className="text-black/70">Delivery</span>
              <span className="text-black font-black">
                {!shippingZone
                  ? 'Enter pincode below'
                  : bulkSurcharge > 0
                  ? `₹${shippingZone.charge} + ₹${bulkSurcharge}`
                  : `₹${shippingZone.charge}`}
              </span>
            </div>
            {bulkSurcharge > 0 && (
              <div className="flex justify-between text-xs font-bold">
                <span className="text-amber-800">Bulk surcharge (&gt;25 posters)</span>
                <span className="text-amber-800">+₹10</span>
              </div>
            )}

            <div className="pt-3 border-t border-black/10 flex justify-between items-end">
              <span className="text-sm font-black text-black/80 uppercase tracking-wider">Total</span>
              <span className="text-2xl font-black text-black">₹{finalTotalWithShipping}</span>
            </div>
          </div>

          {/* Delivery notice */}
          {shippingZone ? (
            <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
              <div className="shrink-0 w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-800">Delivery to {formData.pincode} ({shippingZone.name})</p>
                <p className="text-[11px] text-emerald-700 mt-0.5 leading-relaxed font-medium">
                  Estimated delivery in {shippingZone.days}
                </p>
              </div>
            </div>
          ) : shippingError ? (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
              <div className="shrink-0 w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Info className="w-4 h-4 text-red-700" />
              </div>
              <div>
                <p className="text-xs font-bold text-red-800">Delivery Unavailable</p>
                <p className="text-[11px] text-red-700 mt-0.5 leading-relaxed font-medium">
                  {shippingError}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 bg-black/[0.03] border border-black/[0.04] rounded-2xl p-4">
              <div className="shrink-0 w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Info className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-black/80">Delivery Charges Apply</p>
                <p className="text-[11px] text-black/60 mt-0.5 leading-relaxed font-medium">
                  Enter your pincode to calculate delivery charges. Orders above 25 posters incur an extra ₹10 surcharge.
                </p>
              </div>
            </div>
          )}

          {/* Checkout form */}
          <form onSubmit={handleSubmit} className="space-y-8 pb-12">
            {step === 'details' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-black/8">
                  <MapPin size={18} className="text-black" />
                  <h2 className="text-sm font-black uppercase tracking-widest text-black">Delivery Address</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-black/70 ml-1">Full Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
                      <input
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-black/5 border border-black/10 rounded-xl pl-10 pr-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-black/70 ml-1">Phone</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-black/5 border border-black/10 rounded-xl pl-10 pr-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                        placeholder="0000000000"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-black/70 ml-1">Address</label>
                  <textarea
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
                    placeholder="Door No, Street, Landmark..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-black/70 ml-1">City</label>
                    <input
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-black/70 ml-1">Pincode</label>
                    <input
                      required
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full bg-black/5 border border-black/10 rounded-xl px-4 py-3 text-sm text-black placeholder:text-black/40 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                      placeholder="682001"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex gap-4 items-start mt-6">
              <div className="p-2 bg-primary/20 rounded-lg text-black">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight text-black">Direct WhatsApp Order</h3>
                <p className="text-xs text-black/70 mt-1 font-medium">We'll verify and process your order securely via WhatsApp.</p>
              </div>
            </div>

            {/* CTA — Keyboard-aware sticky with safe-area */}
            <div
              className="sticky bottom-0 left-0 right-0 z-40 mt-12 bg-gradient-to-t from-background to-transparent pt-4"
              style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
            >
              <button
                type="submit"
                disabled={paidItems.length === 0}
                className="w-full h-14 bg-primary text-black font-black rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(250,203,21,0.3)] uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed border border-primary/20"
              >
                <Truck size={16} />
                Order via WhatsApp · ₹{finalTotalWithShipping}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
