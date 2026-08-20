import React from 'react';

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
      <div className="space-y-2 border-b border-slate-200 dark:border-white/10 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white">Refund Policy</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Last updated: January 2026 • MAHI SKILLS</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Course Purchase Refunds</h2>
        <p>
          At MAHI SKILLS, we are committed to delivering exceptional quality in every digital masterclass. Due to the immediate digital delivery and downloadable intellectual property included with enrollment, requests for refunds must be made within 7 days of purchase and are subject to verification that less than 20% of the curriculum has been viewed.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. 1:1 Personal Sessions</h2>
        <p>
          1:1 Personal Session fees (₹899) are refundable if cancelled with at least 24 hours prior notice before the scheduled appointment. Completed sessions or no-shows are non-refundable.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. How to Request a Refund</h2>
        <p>
          To submit a refund inquiry, email us at{' '}
          <a href="mailto:support@mahiskills.in" className="text-[#C49339] dark:text-[#F0C96A] font-bold underline">
            support@mahiskills.in
          </a>{' '}
          with your Order ID and registered email.
        </p>
      </section>
    </div>
  );
}
