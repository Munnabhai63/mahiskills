import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
      <div className="space-y-2 border-b border-slate-200 dark:border-white/10 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Last updated: January 2026 • MAHI SKILLS (mahiskills.in)</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Information We Collect</h2>
        <p>
          At MAHI SKILLS, we collect personal information you provide when registering, purchasing courses, or booking 1:1 sessions, including your name, email address, phone number, and transaction identifiers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. How We Use Your Data</h2>
        <p>
          We use your information exclusively to deliver course content, issue completion certificates, schedule personal mentorship calls, process transactions securely, and notify you of curriculum updates.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Payment Security</h2>
        <p>
          We do not store your complete credit card, debit card, or net banking credentials on our servers. All financial transactions are processed through encrypted, PCI-DSS certified payment gateways (Razorpay).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Contact Us</h2>
        <p>
          If you have any questions regarding this Privacy Policy, contact us at{' '}
          <a href="mailto:support@mahiskills.in" className="text-[#C49339] dark:text-[#F0C96A] font-bold underline">
            support@mahiskills.in
          </a>.
        </p>
      </section>
    </div>
  );
}
