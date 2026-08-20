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
  rating = 4.8,
  reviewCount = 320,
  totalStudents,
  duration,
  category,
}: CourseCardProps) {
  const isExternal = thumbnail?.startsWith('http');

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
          {/* Discount Badge */}
          {discount && discount > 0 && (
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
          </div>
        </div>
      </div>

      {/* Premium Footer Price & CTA */}
      <div className="p-4 pt-3 mx-3 mb-3 rounded-2xl bg-gradient-to-r from-[#0B1728] to-[#112240] dark:from-[#07111F] dark:to-[#0D1B2A] border border-[#D6A84F]/20">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white tracking-tight">
                ₹{price.toLocaleString('en-IN')}
              </span>
              {originalPrice && (
                <span className="text-[11px] text-slate-400 line-through font-medium">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {originalPrice && originalPrice > price && (
              <p className="text-[10px] font-bold text-emerald-400">
                You save ₹{(originalPrice - price).toLocaleString('en-IN')}
              </p>
            )}
          </div>

          <Link
            href={`/courses/${slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] hover:from-[#F0C96A] hover:to-[#D6A84F] text-[#05080D] font-black text-xs transition-all shadow-md shadow-[#D6A84F]/25 hover:shadow-lg hover:shadow-[#D6A84F]/40 group/btn"
          >
            <span>Enroll Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
