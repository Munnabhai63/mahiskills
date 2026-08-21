'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  status?: string;
  isReadyToSell?: boolean;
  rating?: number;
  reviewCount?: number;
  totalStudents?: number;
  duration?: string;
  category?: string;
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
  status = 'LIVE',
  isReadyToSell = true,
  rating = 4.8,
  reviewCount = 320,
  totalStudents,
  duration,
  category,
}: CourseCardProps) {
  const isExternal = thumbnail?.startsWith('http');
  const isUpcoming = status === 'UPCOMING' || isReadyToSell === false;

  return (
    <div className="group rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200/90 dark:border-white/10 hover:border-[#D6A84F]/60 dark:hover:border-[#D6A84F]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1">
      <div>
        {/* Course Thumbnail Image */}
        <Link href={`/courses/${slug}`} className="block relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
          {isExternal ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <Image
              src={thumbnail || '/images/placeholder-course.jpg'}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          )}

          {/* Status / Discount Badge */}
          {isUpcoming ? (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px] uppercase shadow-lg z-10 flex items-center gap-1">
              <span>⏳ UPCOMING</span>
            </span>
          ) : badge ? (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-black text-[10px] uppercase shadow-lg z-10">
              {badge}
            </span>
          ) : null}

          {discount && discount > 0 && !isUpcoming && (
            <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-red-500 text-white font-black text-[10px] uppercase shadow-lg z-10">
              {discount}% OFF
            </span>
          )}
        </Link>

        {/* Course Info */}
        <div className="p-5 flex flex-col gap-2">
          {/* Course Title */}
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight line-clamp-2">
            {title}
          </h3>

          {/* Star Rating & Reviews */}
          <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-semibold pt-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-slate-900 dark:text-white font-black">{rating.toFixed(1)}</span>
            <span className="text-slate-400 dark:text-slate-500 font-medium">({reviewCount})</span>
            {isUpcoming && (
              <span className="ml-auto text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                Pre-Launch
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-white/5 mt-auto flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-extrabold text-[#C49339] dark:text-[#F0C96A]">
            ₹{price.toLocaleString('en-IN')}
          </span>
          {originalPrice && (
            <span className="text-[11px] text-slate-400 line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <Link
          href={`/courses/${slug}`}
          className={`inline-flex items-center gap-1 px-4 py-2 rounded-xl font-bold text-[11px] transition-all group/btn ${
            isUpcoming
              ? 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white hover:bg-amber-500 hover:text-slate-950'
              : 'bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-[#05080D] hover:shadow-md hover:shadow-[#D6A84F]/30'
          }`}
        >
          <span>{isUpcoming ? 'Explore Course' : 'Enroll Now'}</span>
          <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
