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
          {/* Subtle gradient overlay at bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Badge */}
          {badge && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#D6A84F] text-[#05080D] font-black text-[10px] uppercase tracking-wider shadow-lg shadow-[#D6A84F]/30 z-10">
              {badge}
            </span>
          )}

          {/* Discount Badge */}
          {discount && discount > 0 && (
            <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-red-500 text-white font-black text-[10px] uppercase shadow-lg z-10">
              {discount}% OFF
            </span>
          )}

          {/* Course Title on image */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <h3 className="text-sm sm:text-base font-extrabold text-white leading-tight drop-shadow-lg line-clamp-2">
              {title}
            </h3>
          </div>
        </Link>

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
