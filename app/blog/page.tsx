'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
  Search,
  Flame,
  Calendar,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';

export default function BlogListPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) setPosts(data.posts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ['ALL', 'Instagram Growth', 'Freelancing', 'Content Clipping', 'Monetization'];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      post.category?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Content Clipping' && post.title.toLowerCase().includes('whop'));

    const matchesSearch =
      !searchQuery.trim() ||
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts.length > 0 ? posts[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 sm:space-y-16">
      {/* 1. Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0B1728] border border-[#D6A84F]/40 text-xs font-black text-[#C49339] dark:text-[#F0C96A] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#D6A84F]" />
          <span>OFFICIAL MAHI SKILLS KNOWLEDGE HUB</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white tracking-tight">
          Master Modern <span className="text-gold-gradient">Digital Growth & Income</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          In-depth algorithmic breakdowns, viral hook formulas, freelance proposal playbooks, and genuine monetization strategies by Munna Bhai.
        </p>

        {/* Live Search & Filter Bar */}
        <div className="max-w-md mx-auto pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, strategies, blueprints..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:border-[#D6A84F] focus:outline-none shadow-sm transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 2. Featured Hero Post (If Available) */}
      {!loading && featuredPost && !searchQuery && selectedCategory === 'ALL' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0B1728] border-2 border-slate-200 dark:border-[#D6A84F]/30 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group">
          <div className="lg:col-span-7 aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md relative">
            <img
              src={featuredPost.coverImage}
              alt={featuredPost.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md text-xs font-black text-[#F0C96A] border border-white/10 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#D6A84F]" />
              <span>FEATURED MASTERCLASS</span>
            </span>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="px-2.5 py-0.5 rounded-full bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] font-bold text-[11px]">
                {featuredPost.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#D6A84F]" />
                <span>{featuredPost.readTime || '6 min read'}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white group-hover:text-[#C49339] dark:group-hover:text-[#F0C96A] transition-colors leading-tight">
              <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
              {featuredPost.excerpt}
            </p>

            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-[#D6A84F]">
                  <img src="/images/munna-bhai-founder.jpg" alt="Munna Bhai" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">{featuredPost.author || 'Munna Bhai'}</span>
              </div>

              <Link
                href={`/blog/${featuredPost.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-extrabold text-xs shadow-md shadow-[#D6A84F]/20 hover:scale-105 transition-transform"
              >
                <span>Read Full Blueprint</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white shadow-md shadow-[#D6A84F]/20 scale-105'
                : 'bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-[#D6A84F]/50 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat === 'ALL' ? 'All Guides' : cat}
          </button>
        ))}
      </div>

      {/* 4. Article Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 rounded-3xl bg-slate-100 dark:bg-[#0B1728] animate-pulse" />
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Guides Match Your Search</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try searching for another keyword or select &quot;All Guides&quot; to see all published articles.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-[#D6A84F] text-white text-xs font-bold hover:bg-[#C49339] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 hover:border-[#D6A84F]/50 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-xl group transition-all"
            >
              <div>
                <div className="aspect-video w-full overflow-hidden bg-slate-900 relative">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[11px] font-black text-[#F0C96A] border border-white/10">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D6A84F]" />
                      <span>{post.readTime || '5 min read'}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#D6A84F]" />
                      <span>
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-[#C49339] dark:group-hover:text-[#F0C96A] transition-colors line-clamp-2 leading-snug">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 dark:border-white/5 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-[#D6A84F]">
                    <img src="/images/munna-bhai-founder.jpg" alt="Munna Bhai" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{post.author || 'Munna Bhai'}</span>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#C49339] dark:text-[#F0C96A] hover:underline transition-colors"
                >
                  <span>Read Guide</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 5. Bottom Newsletter / Mentorship CTA */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0B1728] to-slate-900 border-2 border-[#D6A84F]/40 shadow-2xl text-white text-center space-y-4 max-w-4xl mx-auto relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D6A84F]/20 text-[#F0C96A] text-xs font-black uppercase">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>START LEARNING TODAY</span>
        </div>

        <h3 className="text-2xl sm:text-4xl font-black leading-tight text-white">
          Want Direct Mentorship From Munna Bhai?
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Book a 1-on-1 private strategy session to review your reels, YouTube scripts, client outreach, or Whop clipping campaigns.
        </p>

        <div className="pt-2">
          <Link
            href="/session"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-extrabold text-xs shadow-lg shadow-[#D6A84F]/30 hover:scale-105 transition-transform"
          >
            <span>Book 1:1 Mentorship Call (₹899) →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
