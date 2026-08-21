'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  ArrowLeft,
  Calendar,
  Share2,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Flame,
  Award,
  ChevronRight,
  Copy,
  Check,
  Send,
  MessageCircle,
  TrendingUp,
  UserCheck,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface BlogPostProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    author?: string | null;
    category?: string | null;
    tags?: string | null;
    readTime?: string | null;
    publishedAt?: string | null;
    createdAt?: string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
  };
  relatedPosts?: any[];
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.3a1.62 1.62 0 0 0-1.63 1.62c0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.62-1.63-1.62z" />
    </svg>
  );
}

export default function BlogArticleView({ post, relatedPosts = [] }: BlogPostProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');

  // Extract headings for Table of Contents
  const headings = React.useMemo(() => {
    if (!post?.content) return [];
    const lines = post.content.split('\n');
    const list: { id: string; text: string; level: number }[] = [];
    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        list.push({ id, text, level });
      }
    });
    return list;
  }, [post?.content]);

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      // Check current active heading
      if (headings.length > 0) {
        for (let i = headings.length - 1; i >= 0; i--) {
          const el = document.getElementById(headings[i].id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 180) {
              setActiveHeading(headings[i].id);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://mahiskills.in/blog/${post.slug}`;
  const shareText = encodeURIComponent(`${post.title} — Read this growth breakdown by Munna Bhai:`);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Parsed tags
  let parsedTags: string[] = [];
  try {
    if (post.tags) {
      parsedTags = typeof post.tags === 'string' ? JSON.parse(post.tags) : post.tags;
    }
  } catch {
    parsedTags = ['Digital Growth', 'Income Strategy', 'Content Strategy'];
  }
  if (!parsedTags || parsedTags.length === 0) {
    parsedTags = ['Algorithm 2026', 'Creator Economy', 'Monetization', 'Viral Growth'];
  }

  // Render Rich Formatted Markdown Content
  const renderFormattedContent = () => {
    if (!post?.content) return null;
    const paragraphs = post.content.split('\n\n');

    return paragraphs.map((block, index) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // H2 or H3 Headings
      if (trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
        const isH2 = trimmed.startsWith('## ');
        const headingText = trimmed.replace(/^#{2,3}\s+/, '').trim();
        const headingId = headingText
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        return isH2 ? (
          <div key={index} id={headingId} className="pt-6 pb-2 scroll-mt-24 group">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white flex items-center gap-2 group-hover:text-[#C49339] dark:group-hover:text-[#F0C96A] transition-colors">
              <span className="text-[#D6A84F] text-lg select-none">#</span>
              <span>{headingText}</span>
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-[#D6A84F] to-transparent rounded-full mt-2" />
          </div>
        ) : (
          <div key={index} id={headingId} className="pt-4 pb-1 scroll-mt-24">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D6A84F] shrink-0" />
              <span>{headingText}</span>
            </h3>
          </div>
        );
      }

      // Blockquote or Pro Tip Callout
      if (trimmed.startsWith('> ')) {
        const quoteText = trimmed.replace(/^>\s+/, '').trim();
        return (
          <div
            key={index}
            className="my-6 p-6 rounded-2xl bg-gradient-to-r from-[#D6A84F]/10 via-[#D6A84F]/5 to-transparent border-l-4 border-[#D6A84F] space-y-2 shadow-xs"
          >
            <div className="flex items-center gap-2 text-xs font-black text-[#C49339] dark:text-[#F0C96A] uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>Munna Bhai&apos;s Pro Tip & Golden Rule</span>
            </div>
            <p className="text-sm sm:text-base font-semibold italic text-slate-900 dark:text-slate-100 leading-relaxed">
              &quot;{quoteText}&quot;
            </p>
          </div>
        );
      }

      // Bullet Lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').filter((l) => l.startsWith('- ') || l.startsWith('* '));
        return (
          <ul key={index} className="my-4 space-y-2.5">
            {items.map((item, itemIdx) => {
              const text = item.replace(/^[-*]\s+/, '').trim();
              return (
                <li key={itemIdx} className="flex items-start gap-3 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-[#D6A84F] shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              );
            })}
          </ul>
        );
      }

      // Standard Rich Paragraph
      return (
        <p key={index} className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed sm:leading-8 my-4">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05080D] transition-colors duration-300">
      {/* 1. Top Real-Time Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200 dark:bg-white/5 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#D6A84F] via-[#F0C96A] to-[#B3862D] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* 2. Top Breadcrumbs & Back Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <nav className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/blog" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Blog & Insights
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#C49339] dark:text-[#F0C96A] font-bold truncate max-w-xs sm:max-w-sm">
              {post.category || 'Guide'}
            </span>
          </nav>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-bold hover:border-[#D6A84F] transition-all shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Articles</span>
          </Link>
        </div>

        {/* 3. Hero Article Header */}
        <header className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0B1728] border border-[#D6A84F]/40 text-xs font-black text-[#C49339] dark:text-[#F0C96A] shadow-xs">
            <Flame className="w-3.5 h-3.5 text-[#D6A84F]" />
            <span>{post.category?.toUpperCase() || 'PRO GROWTH BLUEPRINT'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 dark:text-white leading-[1.15] tracking-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author Metadata Bar */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#D6A84F] shadow-sm">
                <img
                  src="/images/munna-bhai-founder.jpg"
                  alt={post.author || 'Munna Bhai'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-slate-900 dark:text-white">{post.author || 'Munna Bhai'}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 fill-sky-500/20" />
                </div>
                <span className="text-[11px] text-slate-400">Founder @ MAHI SKILLS</span>
              </div>
            </div>

            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#D6A84F]" />
              <span>
                {new Date(post.publishedAt || post.createdAt || Date.now()).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>

            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#D6A84F]" />
              <span>{post.readTime || '6 min read'}</span>
            </div>

            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>

            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <TrendingUp className="w-4 h-4" />
              <span>100% Practical</span>
            </div>
          </div>
        </header>

        {/* 4. Featured Cover Image */}
        <div className="relative aspect-video max-h-[520px] w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 5. Main 2-Column Grid (Content 8-Cols + Sticky Sidebar 4-Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Article Body (8 Cols) */}
          <article className="lg:col-span-8 space-y-8">
            {/* Quick Key Takeaways Callout Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-[#D6A84F]/40 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#D6A84F] text-slate-950 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-wider">
                  Key Takeaways From This Masterclass
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Learn the exact step-by-step algorithms, hook psychology, outreach templates, and monetization frameworks used by top creators and freelancers to build verifiable online income.
              </p>
            </div>

            {/* In-Article Table of Contents (Mobile & Tablet) */}
            {headings.length > 0 && (
              <div className="block lg:hidden p-5 rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-[#D6A84F]" />
                  <span>Table of Contents</span>
                </div>
                <ul className="space-y-1.5 text-xs">
                  {headings.map((h, i) => (
                    <li key={i}>
                      <a
                        href={`#${h.id}`}
                        className="text-[#C49339] dark:text-[#F0C96A] hover:underline font-semibold flex items-center gap-1.5"
                      >
                        <span>•</span>
                        <span>{h.text}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Article Content Wrapper */}
            <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
              {renderFormattedContent()}
            </div>

            {/* Contextual High-Converting Course / Mentorship CTA Banner */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0B1728] to-slate-900 border-2 border-[#D6A84F] shadow-2xl text-white space-y-5 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#D6A84F]/20 rounded-full blur-3xl" />

              <div className="relative space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D6A84F]/20 text-[#F0C96A] text-xs font-black uppercase">
                  <Award className="w-3.5 h-3.5" />
                  <span>MASTER DIGITAL SKILLS WITH MUNNA BHAI</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                  Ready to Turn These Strategies Into High Online Income?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  Get full step-by-step video training, downloadable Notion templates, cold outreach scripts, and direct 1:1 mentorship from Munna Bhai.
                </p>
              </div>

              <div className="relative flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Link
                  href="/courses"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#D6A84F]/30 hover:scale-[1.02] transition-transform"
                >
                  <span>Explore Masterclass Courses →</span>
                </Link>
                <Link
                  href="/session"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition-colors"
                >
                  <span>Book 1:1 Mentorship (₹899)</span>
                </Link>
              </div>
            </div>

            {/* Social Sharing Footer Bar */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#D6A84F]" />
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Share this Article:
                </span>
              </div>

              <div className="flex items-center flex-wrap gap-2">
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>

                {/* Twitter / X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <TwitterIcon />
                  <span>X (Twitter)</span>
                </a>

                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-[#0077b5] hover:bg-[#00669c] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <LinkedInIcon />
                  <span>LinkedIn</span>
                </a>

                {/* Telegram */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${shareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram</span>
                </a>

                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-white text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-white/10"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>

            {/* Tags Cloud */}
            {parsedTags.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Topics & Keywords:</span>
                <div className="flex flex-wrap gap-2">
                  {parsedTags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Profile Spotlight Box */}
            <div className="p-8 rounded-3xl bg-white dark:bg-[#0B1728] border-2 border-slate-200 dark:border-[#D6A84F]/30 shadow-md flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#F0C96A] via-[#D6A84F] to-[#B3862D] p-1 shadow-xl shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-900">
                  <img
                    src="/images/munna-bhai-founder.jpg"
                    alt="Munna Bhai"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-lg font-black text-slate-950 dark:text-white">Munna Bhai</h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] text-[10px] font-extrabold uppercase">
                    Lead Mentor
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Founder of MAHI SKILLS & active digital creator with over 100K+ followers across social channels. Dedicated to teaching genuine, high-paying monetization skills.
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-3 pt-1">
                  <a
                    href="https://youtube.com/@munnabhai7-h3l?si=HBdlfyDrZFAi4jPV"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-rose-500 hover:underline"
                  >
                    YouTube Channel →
                  </a>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <a
                    href="https://www.instagram.com/munnabhai6375?igsh=emVreWRmb3c2NDRz"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-pink-500 hover:underline"
                  >
                    Instagram →
                  </a>
                </div>
              </div>
            </div>
          </article>

          {/* Sticky Sidebar (4 Cols on Desktop) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            {/* Desktop Table of Contents */}
            {headings.length > 0 && (
              <div className="hidden lg:block p-6 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-[#D6A84F]" />
                  <span>Table of Contents</span>
                </div>
                <nav className="space-y-1.5 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar text-xs">
                  {headings.map((h, i) => {
                    const isActive = activeHeading === h.id;
                    return (
                      <a
                        key={i}
                        href={`#${h.id}`}
                        className={`block py-1.5 px-2.5 rounded-lg transition-all line-clamp-1 ${
                          isActive
                            ? 'bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] font-extrabold border-l-2 border-[#D6A84F]'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        {h.text}
                      </a>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* Sidebar Widget 1: 1:1 Mentorship Session */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0B1728] to-slate-950 border-2 border-[#D6A84F]/50 shadow-xl text-white space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#D6A84F]/20 text-[#F0C96A] text-[10px] font-black uppercase">
                  LIMITED SLOTS
                </span>
                <span className="text-base font-black text-[#F0C96A]">₹899 / hr</span>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-black text-white">Book 1:1 Call with Munna Bhai</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Personal audit of your Instagram reels, Whop clipping campaigns, and freelance client proposals.
                </p>
              </div>

              <Link
                href="/session"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#D6A84F]/20 hover:scale-[1.02] transition-transform"
              >
                <span>Reserve Your Time Slot →</span>
              </Link>
            </div>

            {/* Sidebar Widget 2: Official Telegram Channel */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1728] border border-sky-400/40 dark:border-sky-500/30 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-950 dark:text-white">Join 10,000+ Creators</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Get daily algorithmic shifts, freelance lead alerts, and monetization blueprints in our Telegram group.
              </p>
              <a
                href="https://t.me/mahiskills"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Join Official Telegram</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </aside>
        </div>

        {/* 6. Related Articles Grid */}
        {relatedPosts.length > 0 && (
          <section className="space-y-6 pt-12 border-t border-slate-200 dark:border-white/10">
            <div className="space-y-1">
              <span className="text-xs font-black text-[#C49339] dark:text-[#F0C96A] uppercase tracking-wider">
                RECOMMENDED BLUEPRINTS
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
                More In-Depth Guides You Might Like
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((r) => (
                <article
                  key={r.id}
                  className="rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 hover:border-[#D6A84F]/50 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-xl group transition-all"
                >
                  <div>
                    <div className="aspect-video w-full overflow-hidden bg-slate-900 relative">
                      <img
                        src={r.coverImage}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[11px] font-black text-[#F0C96A] border border-white/10">
                        {r.category}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-[#D6A84F]" />
                        <span>{r.readTime || '5 min read'}</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white group-hover:text-[#C49339] dark:group-hover:text-[#F0C96A] transition-colors line-clamp-2">
                        <Link href={`/blog/${r.slug}`}>{r.title}</Link>
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {r.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href={`/blog/${r.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C49339] dark:text-[#F0C96A] hover:underline"
                    >
                      <span>Read Full Guide</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
