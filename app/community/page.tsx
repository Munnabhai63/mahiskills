'use client';

import React from 'react';
import Link from 'next/link';
import { Send, MessageCircle, Users, Sparkles, CheckCircle2, Trophy, ArrowRight } from 'lucide-react';

export default function CommunityPage() {
  const successStories = [
    {
      name: 'Priya Verma',
      skill: 'Instagram Reels & Brand Deals',
      result: 'Grew from 1.2K to 48K followers in 75 days & closed 3 brand retainers.',
      comment: 'Munna Bhai’s hook frameworks and DM funnel strategies completely changed my trajectory!',
    },
    {
      name: 'Aditya Mehta',
      skill: 'International Freelancing',
      result: 'Closed $1,800/month client on Upwork in month 2.',
      comment: 'The cold pitching templates and proposal secrets in the course are worth 10x the price.',
    },
    {
      name: 'Vikram Joshi',
      skill: 'WhatsApp Marketing & Chatbots',
      result: 'Generated ₹3.4 Lakhs in course sales with WhatsApp automated broadcast funnels.',
      comment: 'Open rates shot up to 96% and conversions doubled instantly.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0B1728] border border-[#D6A84F]/40 text-xs font-bold text-[#C49339] dark:text-[#F0C96A] shadow-xs">
          <Users className="w-3.5 h-3.5 text-[#D6A84F]" />
          <span>JOIN 10,000+ CREATORS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white">
          The <span className="text-gold-gradient">MAHI SKILLS</span> Community
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Connect, collaborate, exchange strategies, and grow with thousands of ambitious digital creators and freelancers.
        </p>
      </div>

      {/* Official Groups Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Telegram Group */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#0B1728] border-2 border-sky-400/40 dark:border-sky-500/30 flex flex-col justify-between gap-6 shadow-md hover:border-sky-500 transition-all">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Send className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">Official Telegram Channel</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Get daily growth tips, algorithm updates, freelance client job leads, and announcements directly from Munna Bhai.
            </p>
          </div>

          <a
            href="https://t.me/mahiskills"
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 transition-all"
          >
            <span>Join Telegram Community</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* WhatsApp VIP Club */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#0B1728] border-2 border-emerald-400/40 dark:border-emerald-500/30 flex flex-col justify-between gap-6 shadow-md hover:border-emerald-500 transition-all">
          <div className="space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <MessageCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">VIP Student WhatsApp Group</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Exclusive group for enrolled students with direct Q&A, weekly masterclass reminders, and peer feedback on your work.
            </p>
          </div>

          <Link
            href="/courses"
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
          >
            <span>Enroll In A Course For Access</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Student Success Showcase */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-[#C49339] dark:text-[#F0C96A] uppercase tracking-wider">
            REAL STUDENT OUTCOMES
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
            Student Success Stories
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {successStories.map((s, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C49339] dark:text-[#F0C96A]">
                  <Trophy className="w-4 h-4 text-[#D6A84F]" />
                  <span>{s.skill}</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{s.name}</h4>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{s.result}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic pt-1">&quot;{s.comment}&quot;</p>
              </div>

              <span className="text-[10px] text-slate-400 dark:text-slate-500">Verified Mahi Skills Student</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
