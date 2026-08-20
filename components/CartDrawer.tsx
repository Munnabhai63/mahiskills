'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { X, Trash2, Tag, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

import UpiPaymentModal from '@/components/UpiPaymentModal';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    subtotal,
    totalDiscount,
    finalTotal,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // UPI Payment Modal State
  const [upiModalData, setUpiModalData] = useState<{
    isOpen: boolean;
    orderId: string;
    orderNumber: string;
    amount: number;
    itemTitle: string;
  }>({
    isOpen: false,
    orderId: '',
    orderNumber: '',
    amount: 0,
    itemTitle: '',
  });

  if (!isOpen && !upiModalData.isOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setCouponLoading(true);
    setCouponMessage(null);
    const res = await applyCoupon(couponCodeInput);
    setCouponLoading(false);

    if (res.success) {
      setCouponMessage({ text: res.message, isError: false });
      setCouponCodeInput('');
    } else {
      setCouponMessage({ text: res.message, isError: true });
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      setIsOpen(false);
      router.push(`/login?redirect=/courses`);
      return;
    }

    if (items.length === 0) return;

    setIsCheckingOut(true);

    try {
      const targetItem = items[0];

      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: targetItem.itemType === 'COURSE' ? targetItem.id : undefined,
          couponCode: appliedCoupon?.code || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to initialize checkout');
        setIsCheckingOut(false);
        return;
      }

      // Open UPI QR Payment Modal
      setUpiModalData({
        isOpen: true,
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        amount: data.amount,
        itemTitle: targetItem.title,
      });
    } catch {
      alert('Checkout error occurred. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handlePaymentSuccess = () => {
    const targetItem = items[0];
    clearCart();
    setUpiModalData((prev) => ({ ...prev, isOpen: false }));
    setIsOpen(false);
    if (targetItem?.slug) {
      router.push(`/learn/${targetItem.slug}`);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#07111F] text-slate-900 dark:text-white border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Your Cart</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] text-xs font-bold">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4">
                  <Tag className="w-8 h-8" />
                </div>
                <h3 className="text-slate-900 dark:text-white font-bold text-base mb-1">Your cart is empty</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-6 leading-relaxed">
                  Explore our practical courses to level up your digital skills and online income.
                </p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/courses');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-bold text-xs shadow-md"
                >
                  Browse Courses →
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-slate-200 dark:border-white/5 flex gap-3 relative group shadow-xs"
                >
                  <div className="w-20 h-16 rounded-lg overflow-hidden bg-slate-900 shrink-0 relative">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">{item.title}</h4>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm sm:text-base font-black text-[#C49339] dark:text-[#F0C96A]">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{item.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <span className="inline-block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Lifetime Access • Includes Certificate
                    </span>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50/90 dark:bg-[#05080D]/90 space-y-4">
              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="p-3 rounded-xl bg-[#D6A84F]/10 border border-[#D6A84F]/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white uppercase">{appliedCoupon.code}</span>
                      <span className="text-[#C49339] dark:text-[#F0C96A] font-bold ml-2">(-₹{appliedCoupon.discountAmount})</span>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-rose-500 hover:text-rose-600 font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    placeholder="Coupon code (e.g. MAHI20)"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:border-[#D6A84F] focus:outline-none uppercase font-semibold"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponCodeInput}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white/10 dark:hover:bg-white/15 text-white font-bold text-xs transition-colors disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </form>
              )}

              {couponMessage && (
                <div
                  className={`text-xs flex items-center gap-1.5 ${
                    couponMessage.isError ? 'text-rose-500' : 'text-emerald-600 dark:text-[#F0C96A]'
                  }`}
                >
                  {couponMessage.isError ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{couponMessage.text}</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-white/5">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-900 dark:text-white font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-[#F0C96A] font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{totalDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-white/10">
                  <span>Total Amount</span>
                  <span className="text-[#C49339] dark:text-[#F0C96A]">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#D6A84F]/25 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {isCheckingOut ? (
                  'Processing Order...'
                ) : (
                  <>
                    <span>Proceed to Instant Access</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D6A84F]" />
                <span>100% Secure Payment • Instant Course Access</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Official UPI Payment Modal */}
      <UpiPaymentModal
        isOpen={upiModalData.isOpen}
        onClose={() => setUpiModalData((prev) => ({ ...prev, isOpen: false }))}
        orderId={upiModalData.orderId}
        orderNumber={upiModalData.orderNumber}
        amount={upiModalData.amount}
        itemTitle={upiModalData.itemTitle}
        itemType="COURSE"
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
