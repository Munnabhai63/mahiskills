'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Target,
  Award,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Send,
  Mail,
  Phone,
} from 'lucide-react';

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.3a1.62 1.62 0 0 0-1.63 1.62c0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.62-1.63-1.62z"/>
    </svg>
  );
}

function PinterestIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" {...props}>
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
    </svg>
  );
}

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#0B1728] border border-[#D6A84F]/40 text-xs font-bold text-[#C49339] dark:text-[#F0C96A] shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OUR MISSION & FOUNDER STORY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 dark:text-white tracking-tight">
          Empowering The Next Generation of Digital Creators & Entrepreneurs
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          At MAHI SKILLS, we believe real education is not about memorizing obsolete theories—it is about mastering practical, income-generating digital skills that create financial independence.
        </p>
      </div>

      {/* 2. Founder Spotlight with Circular Profile Photo */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#0B1728] border border-slate-200/90 dark:border-white/10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-b from-[#F0C96A] via-[#D6A84F] to-[#B3862D] p-1.5 shadow-2xl shadow-[#D6A84F]/30 flex items-center justify-center">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-900">
              <img
                src="/images/munna-bhai-transparent.png"
                alt="Munna Bhai - Founder MAHI SKILLS"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          <div className="text-center mt-4 space-y-1">
            <h3 className="text-xl font-black text-slate-950 dark:text-white">Munna Bhai</h3>
            <p className="text-xs font-bold text-[#C49339] dark:text-[#F0C96A] uppercase tracking-wider">
              Founder & Lead Mentor, MAHI SKILLS
            </p>
          </div>

          {/* Social Channels Row */}
          <div className="flex items-center flex-wrap gap-2 mt-4">
            <a
              href="https://youtube.com/@munnabhai7-h3l?si=HBdlfyDrZFAi4jPV"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-red-500 hover:border-red-500/40 flex items-center justify-center transition-all shadow-xs"
              title="YouTube"
            >
              <YoutubeIcon />
            </a>

            <a
              href="https://www.instagram.com/mahiveres?igsh=aXE0c2dpMDZrbDli"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-pink-500 hover:border-pink-500/40 flex items-center justify-center transition-all shadow-xs"
              title="Instagram"
            >
              <InstagramIcon />
            </a>

            <a
              href="https://www.facebook.com/share/1AUnSCSi7X/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-blue-500 hover:border-blue-500/40 flex items-center justify-center transition-all shadow-xs"
              title="Facebook"
            >
              <FacebookIcon />
            </a>

            <a
              href="https://www.linkedin.com/in/mahipal-choudhary-153ba83b1?utm_source=share_via&utm_content=member_android"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-sky-500 hover:border-sky-500/40 flex items-center justify-center transition-all shadow-xs"
              title="LinkedIn"
            >
              <LinkedInIcon />
            </a>

            <a
              href="https://pin.it/3fhtaOAsI"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-rose-600 hover:border-rose-600/40 flex items-center justify-center transition-all shadow-xs"
              title="Pinterest"
            >
              <PinterestIcon />
            </a>

            <a
              href="https://t.me/mahiskills"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-sky-400 hover:border-sky-400/40 flex items-center justify-center transition-all shadow-xs"
              title="Telegram"
            >
              <Send className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick Direct Contact Links */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <a
              href="mailto:mahiverse.hub@gmail.com"
              className="flex items-center gap-1.5 hover:text-[#C49339] dark:hover:text-[#F0C96A] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#D6A84F]" />
              <span>mahiverse.hub@gmail.com</span>
            </a>
            <span className="hidden sm:inline">•</span>
            <a
              href="tel:9376343629"
              className="flex items-center gap-1.5 hover:text-[#C49339] dark:hover:text-[#F0C96A] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#D6A84F]" />
              <span>+91 9376343629</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
            &quot;The Best Investment You Can Ever Make Is In Your Own Digital Skills.&quot;
          </h2>
          <p>
            Hi, I&apos;m <strong>Munna Bhai</strong>. Over the last several years, I have navigated the dynamic creator economy, testing algorithms, building engaged communities, and executing monetization systems across Instagram, YouTube, WhatsApp, and global freelance platforms.
          </p>
          <p>
            I founded <strong>MAHI SKILLS (mahiskills.in)</strong> with a singular mission: to eliminate the fluff from online education and give Indian students, creators, and professionals a battle-tested roadmap to build high-income digital careers.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-white/5">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5">
              <h4 className="text-xl font-black text-slate-950 dark:text-white">2,500+</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Trained Students</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5">
              <h4 className="text-xl font-black text-[#C49339] dark:text-[#F0C96A]">4.8 / 5.0</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Student Satisfaction Rating</p>
            </div>
          </div>

          <div className="pt-3">
            <Link
              href="/session"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-extrabold text-xs sm:text-sm shadow-md hover:scale-105 transition-transform"
            >
              <span>Book 1:1 Session With Munna Bhai (₹899)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Core Values */}
      <div className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-black text-[#C49339] dark:text-[#F0C96A] uppercase tracking-wider">
            OUR CORE VALUES
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
            What Drives MAHI SKILLS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200/90 dark:border-white/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Actionable Practical Workflows</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Zero fluff. Every lesson contains step-by-step screen recordings, templates, and frameworks that can be applied immediately.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200/90 dark:border-white/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Direct Mentorship & Trust</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We stand behind our students with dedicated 1:1 sessions, an active Telegram community, and responsive customer support.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200/90 dark:border-white/10 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Authentic Recognition</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Earn verified digital credentials with QR verification and unique certificate IDs that showcase your demonstrated competence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
