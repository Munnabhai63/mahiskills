'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Clock, ArrowLeft, User, Calendar, Share2, Sparkles, BookOpen } from 'lucide-react';

export default function SingleBlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [post, setPost] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/blog/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.post) {
          setPost(data.post);
          setRelated(data.relatedPosts || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#D6A84F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Article Not Found</h2>
        <Link href="/blog" className="text-xs text-[#C49339] dark:text-[#F0C96A] hover:underline">
          ← Back to All Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>

        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-[#0B1728] border border-[#D6A84F]/30 text-[#C49339] dark:text-[#F0C96A] font-bold">
          {post.category}
        </span>
      </div>

      {/* Article Header */}
      <div className="space-y-4 text-center sm:text-left">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-[#D6A84F]">
              <img src="/images/munna-bhai-founder.jpg" alt="Munna Bhai" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">{post.author || 'Munna Bhai'}</span>
          </div>

          <span>•</span>

          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#D6A84F]" />
            <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <span>•</span>

          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#D6A84F]" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      {/* Featured Cover Image */}
      <div className="aspect-video w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xl">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body Content */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 space-y-6 text-slate-800 dark:text-slate-200 leading-relaxed text-sm sm:text-base shadow-xs">
        <div className="prose dark:prose-invert max-w-none space-y-4 whitespace-pre-line">
          {post.content}
        </div>
      </div>

      {/* Author Card */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#07111F] border border-slate-200 dark:border-[#D6A84F]/30 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#D6A84F] shrink-0">
          <img src="/images/munna-bhai-founder.jpg" alt="Munna Bhai" className="w-full h-full object-cover" />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold text-slate-950 dark:text-white">Written by Munna Bhai</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Founder of MAHI SKILLS. Helping thousands of learners unlock online income streams.
          </p>
        </div>
      </div>

      {/* Related Posts */}
      {related.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/10">
          <h3 className="text-xl font-bold text-slate-950 dark:text-white">Related Insights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/blog/${r.slug}`}
                className="p-4 rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/5 hover:border-[#D6A84F]/40 transition-all space-y-2 block group shadow-xs"
              >
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#C49339] dark:group-hover:text-[#F0C96A] transition-colors truncate">
                  {r.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{r.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
