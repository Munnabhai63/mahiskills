'use client';

import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter } from 'lucide-react';
import CourseCard from '@/components/CourseCard';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Content Clipping & Monetization',
    'Social Media & Growth',
    'Video Creation & Monetization',
    'Digital Marketing & Sales',
    'Freelancing & Career',
  ];

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory !== 'All') params.append('category', selectedCategory);
    if (searchQuery) params.append('search', searchQuery);

    fetch(`/api/courses?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses || []);
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white dark:bg-[#0B1728] border border-[#D6A84F]/40 text-xs font-bold text-[#C49339] dark:text-[#F0C96A] shadow-xs">
          <span>☆</span>
          <span>INCOME-FOCUSED CURRICULUM</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white">
          Explore All <span className="text-[#C49339] dark:text-[#F0C96A]">MAHI SKILLS</span> Courses
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Master real-world digital skills taught step-by-step with practical templates, community access, and verifiable certificates.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-[#0B1728] p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#D6A84F] focus:outline-none font-medium"
          />
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-80 rounded-3xl bg-slate-100 dark:bg-[#0B1728] animate-pulse"
            />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#0B1728] rounded-3xl border border-slate-200 dark:border-white/10 space-y-4">
          <p className="text-lg font-bold text-slate-950 dark:text-white">No courses found matching your criteria</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Try adjusting your search or category filter</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white/10 text-white font-bold text-xs hover:bg-[#D6A84F] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              slug={course.slug}
              shortDescription={course.shortDescription}
              price={course.price}
              originalPrice={course.originalPrice}
              discount={course.discount}
              thumbnail={course.thumbnail}
              badge={course.badge}
              status={course.status}
              isReadyToSell={course.isReadyToSell}
              rating={course.rating}
              reviewCount={course.reviewCount}
              totalStudents={course.totalStudents}
              duration={course.duration}
              category={course.category}
            />
          ))}
        </div>
      )}
    </div>
  );
}
