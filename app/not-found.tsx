import React from 'react';
import Link from 'next/link';
import { Compass, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0B1728] border-2 border-slate-200 dark:border-[#D6A84F]/30 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] flex items-center justify-center mx-auto shadow-inner">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '10s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black text-[#C49339] dark:text-[#F0C96A] tracking-wider uppercase">404 ERROR</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">Page Not Found</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            The page you are looking for might have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-extrabold text-xs shadow-md shadow-[#D6A84F]/20 hover:scale-105 transition-transform"
          >
            <span>Return to Homepage</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
