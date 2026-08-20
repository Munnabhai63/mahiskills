import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
      <div className="space-y-2 border-b border-slate-200 dark:border-white/10 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white">Terms & Conditions</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Last updated: January 2026 • MAHI SKILLS</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Agreement to Terms</h2>
        <p>
          By accessing and enrolling in courses on MAHI SKILLS (mahiskills.in), you agree to be bound by these Terms and Conditions and all applicable laws and regulations.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Intellectual Property & License</h2>
        <p>
          All course materials, video lectures, downloadable cheatsheets, and blueprints are the intellectual property of MAHI SKILLS and Munna Bhai. You are granted a single, non-transferable personal license to view the materials. Redistribution, recording, or unauthorized reselling is strictly prohibited.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. 1:1 Mentorship Sessions</h2>
        <p>
          Bookings for 1:1 mentorship sessions are confirmed upon successful payment. Students are expected to join on time via the provided Google Meet link. Rescheduling must be requested at least 24 hours prior to the scheduled slot.
        </p>
      </section>
    </div>
  );
}
