import React, { useState } from 'react';
import { ShoppingBag, ChevronLeft, CreditCard, Truck, ShieldCheck, MapPin, Phone, User, CheckCircle2, Info, Gift } from 'lucide-react';
import { useCart } from '../hooks/useCart';

export const Checkout: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { cart, totals, clearCart } = useCart();
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const paidItems = cart.filter(item => !item.isFreeGift);
  const freeItems = cart.filter(item => item.isFreeGift);

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center animate-in fade-in zoom-in duration-500">
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
        <h1 className="text-2xl font-black tracking-tighter uppercase">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {step === 'details' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                <MapPin size={18} className="text-primary" />
                <h2 className="text-sm font-black uppercase tracking-widest">Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-muted ml-1">Full Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/50" />
                    <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors" placeholder="Anand Saagee" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-muted ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/50" />
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors" placeholder="+91 98765 43210" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-muted ml-1">Full Address</label>
                <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors resize-none" placeholder="Door No, Street Name, Landmark..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-muted ml-1">City</label>
                  <input required name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors" placeholder="Kochi" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-muted ml-1">Pincode</label>
                  <input required name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 outline-none transition-colors" placeholder="682001" />
                </div>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 pb-2 border-b border-white/5">
                <CreditCard size={18} className="text-primary" />
                <h2 className="text-sm font-black uppercase tracking-widest">Payment Method</h2>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex gap-4 items-start">
                <div className="p-2 bg-primary/20 rounded-lg text-primary">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight">Postpay / Cash on Delivery</h3>
                  <p className="text-xs text-muted mt-1 font-medium">Verify your order via WhatsApp after placing.</p>
                </div>
                <div className="ml-auto">
                  <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center p-1">
                    <div className="w-full h-full bg-primary rounded-full" />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                <h3 className="text-[10px] font-black uppercase text-muted tracking-widest">Order Summary</h3>
                <div className="space-y-3">
                  {paidItems.slice(0, 4).map(item => (
                    <div key={item.variantId} className="flex justify-between text-xs font-bold">
                      <span className="text-muted truncate mr-2">{item.title} ({item.size}) <span className="text-white/30 ml-1">×{item.quantity}</span></span>
                      <span className="shrink-0">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  {paidItems.length > 4 && <p className="text-[10px] text-muted font-bold italic">+ {paidItems.length - 4} more items</p>}

                  {/* Free gifts */}
                  {freeItems.map(item => (
                    <div key={item.variantId} className="flex justify-between text-xs font-bold">
                      <span className="text-green-400 flex items-center gap-1.5">
                        <Gift className="w-3 h-3" />
                        {item.title} ({item.size}) <span className="text-green-400/40 ml-1">×{item.quantity}</span>
                      </span>
                      <span className="text-green-400">FREE</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <div className="flex justify-between text-sm font-black uppercase tracking-tighter">
                    <span>Total Amount</span>
                    <span className="text-primary text-xl">₹{totals.finalTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delivery charge notice */}
          <div className="flex items-start gap-3 bg-white/[0.03] border border-white/5 rounded-2xl p-4">
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

          {/* Sticky CTA */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-background/0 lg:static lg:p-0">
            <button
              type="submit"
              disabled={cart.length === 0}
              className="w-full max-w-2xl mx-auto h-14 bg-primary text-black font-black rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_8px_32px_rgba(250,203,21,0.3)] uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 'details' ? 'Next: Payment' : `Place Order — ₹${totals.finalTotal}`}
            </button>
            <div className="flex items-center justify-center gap-6 mt-4 opacity-40 grayscale pointer-events-none lg:mt-6">
              <Truck size={14} />
              <ShieldCheck size={14} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Wallify Secure Checkout</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
