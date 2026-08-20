'use client';

import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  amount: number;
  itemTitle: string;
  itemType?: 'COURSE' | 'SESSION';
  onPaymentSuccess: (utr: string) => void;
}

export default function UpiPaymentModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  amount,
  itemTitle,
  itemType = 'COURSE',
  onPaymentSuccess,
}: UpiPaymentModalProps) {
  const [utrNumber, setUtrNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const upiId = 'muna937634@ybl';
  const payeeName = 'Mahipal Choudhary';

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // UPI Deep link for Mobile Devices
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(orderNumber)}`;

  // WhatsApp verification message
  const whatsappMessage = encodeURIComponent(
    `Hi Munna Bhai, I have paid ₹${amount} for "${itemTitle}".\nOrder ID: ${orderNumber}\nMy UPI UTR: ${
      utrNumber || '[Please check my screenshot]'
    }\nPlease verify my access.`
  );
  const whatsappUrl = `https://wa.me/919376343629?text=${whatsappMessage}`;

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 6) {
      setErrorMessage('Please enter a valid 12-digit UPI UTR / Transaction ID from your payment app.');
      return;
    }

    setIsVerifying(true);

    try {
      const res = await fetch('/api/checkout/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          razorpayPaymentId: `UPI-UTR-${cleanUtr}`,
          razorpayOrderId: orderNumber,
          razorpaySignature: 'upi_qr_verified',
          paymentMethod: 'PHONEPE_UPI_QR',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onPaymentSuccess(cleanUtr);
      } else {
        setErrorMessage(data.error || 'Failed to verify transaction. Please check the UTR number or contact support.');
      }
    } catch {
      setErrorMessage('Verification network error. You can also send your screenshot on WhatsApp.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#07111F] text-slate-900 dark:text-white rounded-3xl border-2 border-slate-200 dark:border-[#D6A84F]/40 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Gradient Banner */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] p-5 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D6A84F]/20 border border-[#D6A84F]/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#F0C96A]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black">Official UPI Payment</h3>
              <p className="text-[11px] text-slate-300">Scan & Pay to Unlock Instant Access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          {/* Order Summary Pill */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="min-w-0 pr-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block truncate">
                {itemType === 'COURSE' ? 'Course Enrollment' : '1:1 Mentorship'} • {orderNumber}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {itemTitle}
              </h4>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 block">Total Amount</span>
              <span className="text-xl font-black text-[#C49339] dark:text-[#F0C96A]">
                ₹{amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* PhonePe Native Style QR Card */}
          <div className="flex flex-col items-center justify-center p-5 rounded-3xl bg-[#0F081D] border-2 border-[#5F259F]/60 text-white shadow-2xl relative overflow-hidden">
            {/* PhonePe Brand Header Pill */}
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5F259F]/40 border border-[#8A3FFC]/40 text-xs font-bold text-[#D4BBFF] mb-3">
              <span>PhonePe • GPay • Paytm • Any UPI</span>
            </div>

            {/* Crisp Cropped QR Scanner Image */}
            <div className="w-full max-w-[260px] sm:max-w-[280px] rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center bg-black">
              <img
                src="/images/payment-qr.png"
                alt="PhonePe UPI QR Scanner - Mahipal Choudhary"
                className="w-full h-auto object-contain select-none"
              />
            </div>

            <div className="text-center mt-3 space-y-1.5 w-full">
              <div className="inline-flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-white/10 border border-white/10 text-xs w-full max-w-[280px]">
                <span className="font-mono text-[#F0C96A] font-extrabold select-all truncate">{upiId}</span>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white flex items-center gap-1 font-bold text-[11px] shrink-0 transition-colors"
                  title="Copy UPI ID"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy UPI</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Direct Mobile UPI App Button (Hidden on large screens, shown on mobile) */}
            <div className="w-full sm:hidden pt-1">
              <a
                href={upiDeepLink}
                className="w-full py-2.5 rounded-xl bg-[#D6A84F] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#C49339] transition-colors"
              >
                <Smartphone className="w-4 h-4" />
                <span>Tap to Pay via UPI App</span>
              </a>
            </div>
          </div>

          {/* Verification Step Form */}
          <form onSubmit={handleSubmitUtr} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900 dark:text-white">
                Step 2: Enter 12-Digit UPI Ref / UTR Number
              </label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                After making the payment, enter the 12-digit UTR/Transaction number from PhonePe/GPay/Paytm to instantly unlock access.
              </p>
              <input
                type="text"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                placeholder="e.g. 423891048291"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono font-bold tracking-wider placeholder-slate-400 focus:border-[#D6A84F] focus:outline-none"
                required
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying || !utrNumber.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] hover:from-[#E0B45C] hover:to-[#D6A84F] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#D6A84F]/30 hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>{isVerifying ? 'Verifying Transaction...' : 'Confirm Payment & Unlock Access →'}</span>
            </button>
          </form>

          {/* WhatsApp Support Alternative */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
              <MessageCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] font-semibold">Need manual help or want to send screenshot?</span>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition-colors shrink-0 flex items-center gap-1"
            >
              <span>WhatsApp</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <Lock className="w-3.5 h-3.5 text-[#D6A84F]" />
            <span>Encrypted Direct Peer-to-Peer UPI Payment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
