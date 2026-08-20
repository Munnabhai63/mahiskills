'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/courses${query ? `?search=${encodeURIComponent(query)}` : ''}`);
        const data = await res.json();
        setCourses(data.courses || []);
      } catch {
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchCourses, 200);
    return () => clearTimeout(timer);
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div
        className="fixed inset-0 bg-slate-950/60 dark:bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative mx-auto max-w-2xl transform rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 p-5 shadow-2xl transition-all animate-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
          <Search className="w-5 h-5 text-[#C49339] dark:text-[#F0C96A]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Instagram, YouTube, WhatsApp, Freelancing..."
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none font-medium"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 max-h-96 overflow-y-auto space-y-2">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-500">Searching skills...</div>
          ) : courses.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No courses found for &quot;{query}&quot;
            </div>
          ) : (
            courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent hover:border-[#D6A84F]/30 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-[#D6A84F] shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#C49339] dark:group-hover:text-[#F0C96A] transition-colors truncate">
                      {course.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{course.shortDescription}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-black text-slate-900 dark:text-[#F0C96A]">
                    ₹{course.price.toLocaleString('en-IN')}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
