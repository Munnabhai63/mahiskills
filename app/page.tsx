'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Play,
  Star,
  Users,
  GraduationCap,
  Sparkles,
  BookOpen,
  Smartphone,
  Headphones,
  Award,
  Clock,
  Target,
  ChevronDown,
  User as UserIcon,
  Send,
} from 'lucide-react';
import CourseCard from '@/components/CourseCard';
import VideoModal from '@/components/VideoModal';

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

export default function HomePage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    fetch('/api/courses?limit=4')
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) setCourses(data.courses);
      })
      .catch(() => {});

    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const headline1 = settings.hero_headline_1 || 'Learn In-Demand Skills.';
  const headline2 = settings.hero_headline_2 || 'Build Your Future.';
  const headline3 = settings.hero_headline_3 || 'Earn Without Limits.';
  const heroDescription =
    settings.hero_description ||
    'Practical courses, real-world strategies and step-by-step learning path to help you grow, earn and achieve freedom.';

  const statStudents = settings.stat_students || '2,500+';
  const statCourses = settings.stat_courses || '25+';
  const statCommunity = settings.stat_community || '10K+';
  const sessionPrice = settings.session_price || '899';

  const benefits = [
    {
      icon: BookOpen,
      title: 'Practical & Easy',
      subtitle: 'To Understand',
    },
    {
      icon: Award,
      title: 'Lifetime Access',
      subtitle: 'To All Courses',
    },
    {
      icon: Smartphone,
      title: 'Learn From Any',
      subtitle: 'Device, Anytime',
    },
    {
      icon: Headphones,
      title: '24/7 Support &',
      subtitle: 'Community Help',
    },
    {
      icon: Award,
      title: 'Certificate Of',
      subtitle: 'Completion',
    },
  ];

  const faqs = [
    {
      q: 'How are MAHI SKILLS courses different from generic LMS tutorials?',
      a: 'Unlike theoretical lectures, MAHI SKILLS focuses 100% on actionable, income-generating workflows. Every strategy taught by Munna Bhai is tested in real-world campaigns and proven to generate followers, client retainers, and digital revenue.',
    },
    {
      q: 'Do I get lifetime access to course updates?',
      a: 'Yes! Once you enroll in any MAHI SKILLS course, you receive lifetime access including all upcoming lesson additions, new algorithm updates, and downloadable resources at zero extra cost.',
    },
    {
      q: 'How does the 1:1 Personal Session work?',
      a: 'You can book a dedicated 1-hour private video session with Munna Bhai for ₹899. You choose your preferred date and time slot, share your discussion topic, and receive direct personalized roadmap and action steps.',
    },
    {
      q: 'Are the payments secure and what payment methods are accepted?',
      a: 'Yes, all payments are processed securely via encrypted gateway protocols. We support UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and digital wallets.',
    },
  ];

  return (
    <div className="flex flex-col gap-14 sm:gap-20 pb-20">
      {/* 1. HERO SECTION WITH OFFICIAL TRANSPARENT PROFILE PHOTO */}
      <section className="relative pt-6 sm:pt-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Headline & Content */}
            <div className="lg:col-span-5 flex flex-col gap-5 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white dark:bg-[#0B1728] border border-[#D6A84F]/40 text-xs font-bold text-[#C49339] dark:text-[#F0C96A] w-fit shadow-xs">
                <span>☆</span>
                <span>WELCOME TO MAHI SKILLS</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-slate-950 dark:text-white leading-[1.12]">
                {headline1} <br />
                <span className="text-slate-900 dark:text-slate-100">{headline2}</span> <br />
                <span className="text-[#C49339] dark:text-[#F0C96A]">{headline3}</span>
              </h1>

              {/* Supporting Description */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                {heroDescription}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  href="/courses"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-black text-sm flex items-center gap-2 shadow-md shadow-[#D6A84F]/30 hover:scale-105 transition-all"
                >
                  <span>Explore Courses</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/session"
                  className="px-5 py-3.5 rounded-xl bg-white dark:bg-[#0B1728] hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white font-bold text-sm flex items-center gap-2 border border-slate-200 dark:border-white/10 shadow-xs transition-all"
                >
                  <span>Connect With Me</span>
                  <Sparkles className="w-4 h-4 text-[#D6A84F]" />
                </Link>
              </div>

              {/* Social Channels Row */}
              <div className="pt-2 flex flex-col gap-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Follow & Connect With Munna Bhai
                </span>
                <div className="flex items-center flex-wrap gap-2">
                  <a
                    href="https://youtube.com/@munnabhai7-h3l?si=HBdlfyDrZFAi4jPV"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-red-500 hover:border-red-500/40 flex items-center justify-center transition-all shadow-xs"
                    title="YouTube Channel"
                  >
                    <YoutubeIcon />
                  </a>

                  <a
                    href="https://www.instagram.com/mahiveres?igsh=aXE0c2dpMDZrbDli"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-pink-500 hover:border-pink-500/40 flex items-center justify-center transition-all shadow-xs"
                    title="Instagram Profile"
                  >
                    <InstagramIcon />
                  </a>

                  <a
                    href="https://www.facebook.com/share/1AUnSCSi7X/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-blue-500 hover:border-blue-500/40 flex items-center justify-center transition-all shadow-xs"
                    title="Facebook Page"
                  >
                    <FacebookIcon />
                  </a>

                  <a
                    href="https://www.linkedin.com/in/mahipal-choudhary-153ba83b1?utm_source=share_via&utm_content=member_android"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-sky-500 hover:border-sky-500/40 flex items-center justify-center transition-all shadow-xs"
                    title="LinkedIn Profile"
                  >
                    <LinkedInIcon />
                  </a>

                  <a
                    href="https://pin.it/3fhtaOAsI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-rose-600 hover:border-rose-600/40 flex items-center justify-center transition-all shadow-xs"
                    title="Pinterest Profile"
                  >
                    <PinterestIcon />
                  </a>

                  <a
                    href="https://t.me/mahiskills"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-sky-400 hover:border-sky-400/40 flex items-center justify-center transition-all shadow-xs"
                    title="Telegram Community"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Center Circular Profile Photo with Luxury Gold Accent Ring */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center relative my-4 lg:my-0">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-gradient-to-b from-[#F0C96A] via-[#D6A84F] to-[#B3862D] p-1.5 shadow-2xl shadow-[#D6A84F]/30 flex items-center justify-center">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-900">
                  <img
                    src="/images/munna-bhai-transparent.png"
                    alt="Munna Bhai - Founder Mahi Skills"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              {/* Floating Intro Badge */}
              <div className="absolute top-3 left-0 sm:-left-4 flex items-center gap-2 z-20">
                <button
                  onClick={() => setVideoModalOpen(true)}
                  className="w-12 h-12 rounded-full bg-white dark:bg-[#0B1728] text-[#D6A84F] shadow-xl border border-slate-200 dark:border-white/10 flex items-center justify-center hover:scale-110 transition-transform"
                  title="Play Intro Video"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>
                <div className="font-serif italic text-xs text-slate-800 dark:text-slate-200 font-bold bg-white/90 dark:bg-[#0B1728]/90 px-2.5 py-1 rounded-full border border-slate-200 dark:border-white/10 shadow-xs">
                  Watch Intro ↗
                </div>
              </div>
            </div>

            {/* Right 3 Floating Stat Cards */}
            <div className="lg:col-span-3 flex flex-col gap-3.5">
              {/* Card 1: Students */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200/90 dark:border-white/10 shadow-md flex items-center gap-3.5 hover:border-[#D6A84F]/40 transition-all">
                <div className="w-11 h-11 rounded-xl bg-slate-900 dark:bg-white/10 text-white flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-[#D6A84F]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-950 dark:text-white leading-tight">{statStudents}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Students Enrolled</p>
                </div>
              </div>

              {/* Card 2: Courses */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200/90 dark:border-white/10 shadow-md flex items-center gap-3.5 hover:border-[#D6A84F]/40 transition-all">
                <div className="w-11 h-11 rounded-xl bg-[#D6A84F] text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-950 dark:text-white leading-tight">{statCourses}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Premium Courses</p>
                </div>
              </div>

              {/* Card 3: Community */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200/90 dark:border-white/10 shadow-md flex items-center gap-3.5 hover:border-[#D6A84F]/40 transition-all">
                <div className="w-11 h-11 rounded-xl bg-slate-900 dark:bg-white/10 text-white flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-[#D6A84F]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-950 dark:text-white leading-tight">{statCommunity}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Community Members</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HORIZONTAL BENEFITS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200/90 dark:border-white/10 shadow-md">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 divide-y sm:divide-y-0 lg:divide-x divide-slate-100 dark:divide-white/5">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className={`flex items-center gap-3 ${i > 0 ? 'pt-3 sm:pt-0 lg:pl-6' : ''}`}>
                  <div className="text-[#C49339] dark:text-[#F0C96A] shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {b.title} <br />
                      <span className="text-slate-500 dark:text-slate-400 font-medium">{b.subtitle}</span>
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. 1:1 PERSONAL SESSION HIGHLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl bg-[#07111F] text-white p-6 sm:p-8 shadow-xl border border-[#D6A84F]/30 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left Header */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-[#D6A84F]/40 flex items-center justify-center text-[#D6A84F] shrink-0">
                <UserIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-[#F0C96A] tracking-wide uppercase">
                  1:1 PERSONAL SESSION
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Get personal guidance. Clear your doubts. Speed up your growth with expert advice.
                </p>
              </div>
            </div>

            {/* Middle Feature Badges */}
            <div className="hidden xl:flex items-center gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D6A84F]" />
                <span>1 Hour Session</span>
              </div>
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-[#D6A84F]" />
                <span>Learn Directly From Expert</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#D6A84F]" />
                <span>100% Focused On Your Goals</span>
              </div>
            </div>

            {/* Right Price & Book Now CTA */}
            <div className="flex items-center gap-5 shrink-0 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-white/10 pt-4 lg:pt-0">
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold text-[#F0C96A] uppercase tracking-wider">
                  PRICE
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white">
                  ₹{Number(sessionPrice).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400">Per 1 Hour Session</span>
              </div>

              <Link
                href="/session"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-[#D6A84F]/30 hover:scale-105 transition-transform"
              >
                <span>Book Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. POPULAR COURSES SECTION */}
      <section id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black text-[#C49339] dark:text-[#F0C96A] uppercase tracking-wider">
              — OUR COURSES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight mt-1">
              Popular Courses
            </h2>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-[#C49339] dark:hover:text-[#F0C96A] transition-colors"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

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
      </section>

      {/* 5. FAQS SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-black text-[#C49339] dark:text-[#F0C96A] uppercase tracking-wider">
            COMMON QUESTIONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200/90 dark:border-white/10 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 dark:text-white hover:text-[#C49339] dark:hover:text-[#F0C96A] transition-colors text-sm sm:text-base"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#C49339] dark:text-[#F0C96A]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Video Modal Preview */}
      <VideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        title="MAHI SKILLS Introduction • Munna Bhai"
      />
    </div>
  );
}
