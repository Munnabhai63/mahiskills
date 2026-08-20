'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export interface CourseCardProps {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  price: number;
  originalPrice?: number | null;
  discount?: number | null;
  thumbnail: string;
  badge?: string | null;
  rating?: number;
  reviewCount?: number;
  totalStudents?: number;
  duration?: string;
  category?: string;
}

function getCourseGraphic(slug: string) {
  if (slug === 'instagram-growth-mastery') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#2D0B40] via-[#1F0A30] to-[#0D0517] relative flex items-center justify-between p-6 overflow-hidden">
        <div className="space-y-1 relative z-10">
          <span className="px-2.5 py-0.5 rounded-full bg-pink-600 text-white font-bold text-[10px] uppercase">
            Bestseller
          </span>
          <h4 className="text-base font-extrabold text-white leading-tight">
            Instagram Growth <br />Mastery
          </h4>
        </div>
        <div className="relative z-10 flex items-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#405DE6] flex items-center justify-center text-white shadow-xl shadow-pink-500/30 border border-white/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
          </div>
          <div className="flex items-end gap-1 h-10">
            <div className="w-1.5 h-3 bg-purple-400/80 rounded-t" />
            <div className="w-1.5 h-5 bg-purple-400/80 rounded-t" />
            <div className="w-1.5 h-8 bg-purple-300 rounded-t" />
            <div className="w-1.5 h-10 bg-amber-400 rounded-t" />
          </div>
        </div>
      </div>
    );
  }

  if (slug === 'youtube-growth-monetization') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#400B0B] via-[#2A0707] to-[#120303] relative flex items-center justify-between p-6 overflow-hidden">
        <div className="space-y-1 relative z-10">
          <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px] uppercase">
            Bestseller
          </span>
          <h4 className="text-base font-extrabold text-white leading-tight">
            YouTube Growth & <br />Monetization
          </h4>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-16 h-12 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 flex items-center justify-center text-white shadow-xl shadow-red-600/30 border border-white/20">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <div className="text-emerald-400 font-black text-xl animate-pulse">↗</div>
        </div>
      </div>
    );
  }

  if (slug === 'whatsapp-marketing-mastery') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#06331C] via-[#042413] to-[#02140A] relative flex items-center justify-between p-6 overflow-hidden">
        <div className="space-y-1 relative z-10">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px] uppercase">
            Bestseller
          </span>
          <h4 className="text-base font-extrabold text-white leading-tight">
            WhatsApp Marketing <br />Mastery
          </h4>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-[#05080D] shadow-xl shadow-emerald-500/30 border border-white/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
          </div>
          <div className="text-emerald-400 font-black text-xl">↗</div>
        </div>
      </div>
    );
  }

  // Freelancing & default
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#0B2545] via-[#07192F] to-[#040E1B] relative flex items-center justify-between p-6 overflow-hidden">
      <div className="space-y-1 relative z-10">
        <span className="px-2.5 py-0.5 rounded-full bg-sky-600 text-white font-bold text-[10px] uppercase">
          Bestseller
        </span>
        <h4 className="text-base font-extrabold text-white leading-tight">
          Freelancing & <br />Online Earning
        </h4>
      </div>
      <div className="relative z-10 flex items-center gap-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-sky-500/30 border border-white/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <rect width="20" height="14" x="2" y="3" rx="2"/>
            <line x1="8" x2="16" y1="21" y2="21"/>
            <line x1="12" x2="12" y1="17" y2="21"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function CourseCard({
  id,
  title,
  slug,
  shortDescription,
  price,
  originalPrice,
  discount,
  thumbnail,
  badge,
  rating = 4.8,
  reviewCount = 320,
  totalStudents,
  duration,
  category,
}: CourseCardProps) {
  return (
    <div className="group rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200/90 dark:border-white/10 hover:border-[#D6A84F]/60 dark:hover:border-[#D6A84F]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1">
      <div>
        {/* Top Graphic Card */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {getCourseGraphic(slug)}
        </div>

        {/* Course Info */}
        <div className="p-5 flex flex-col gap-2">
          {/* Short description */}
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
            {shortDescription}
          </p>

          {/* Star Rating & Reviews */}
          <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold pt-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-slate-900 dark:text-white font-black">{rating.toFixed(1)}</span>
            <span className="text-slate-400 dark:text-slate-500 font-medium">({reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Footer Price & CTA */}
      <div className="p-5 pt-0 border-t border-slate-100 dark:border-white/5 mt-2 flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-black text-slate-900 dark:text-white">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {originalPrice && (
            <span className="text-xs text-slate-400 line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <Link
          href={`/courses/${slug}`}
          className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-[#D6A84F] dark:bg-white/10 dark:hover:bg-[#D6A84F] text-white dark:hover:text-slate-950 font-bold text-xs transition-all shadow-xs group/btn"
        >
          <span>View Course</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
