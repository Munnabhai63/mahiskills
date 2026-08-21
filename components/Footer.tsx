'use client';

import React from 'react';
import Link from 'next/link';
import { Send, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

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

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#05080D] border-t border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-200 dark:border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-gradient-to-br dark:from-[#F0C96A] dark:to-[#B3862D] text-[#D6A84F] dark:text-[#05080D] flex items-center justify-center font-black text-xl shadow-md">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-wider text-slate-900 dark:text-white">
                  MAHI <span className="text-[#C49339] dark:text-[#F0C96A]">SKILLS</span>
                </span>
                <span className="text-[10px] tracking-widest text-slate-500 dark:text-slate-400 uppercase font-semibold">
                  Learn. Grow. Earn.
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 max-w-sm mt-1">
              MAHI SKILLS is India&apos;s leading digital accelerator platform founded by <strong className="text-slate-900 dark:text-white">Munna Bhai</strong>. We teach practical, high-income digital skills, content creation, social media growth, and freelancing to help you achieve financial independence.
            </p>

            {/* Complete 6 Clickable Social Media Links */}
            <div className="flex items-center flex-wrap gap-2.5 pt-2">
              <a
                href="https://youtube.com/@munnabhai7-h3l?si=HBdlfyDrZFAi4jPV"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-red-500 hover:border-red-500/40 flex items-center justify-center transition-all"
                aria-label="YouTube"
                title="YouTube Channel"
              >
                <YoutubeIcon />
              </a>

              <a
                href="https://www.instagram.com/mahiveres?igsh=aXE0c2dpMDZrbDli"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-pink-500 hover:border-pink-500/40 flex items-center justify-center transition-all"
                aria-label="Instagram"
                title="Instagram Profile"
              >
                <InstagramIcon />
              </a>

              <a
                href="https://www.facebook.com/share/1AUnSCSi7X/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-blue-500 hover:border-blue-500/40 flex items-center justify-center transition-all"
                aria-label="Facebook"
                title="Facebook Page"
              >
                <FacebookIcon />
              </a>

              <a
                href="https://www.linkedin.com/in/mahipal-choudhary-153ba83b1?utm_source=share_via&utm_content=member_android"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-sky-500 hover:border-sky-500/40 flex items-center justify-center transition-all"
                aria-label="LinkedIn"
                title="LinkedIn Profile"
              >
                <LinkedInIcon />
              </a>

              <a
                href="https://pin.it/3fhtaOAsI"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-rose-600 hover:border-rose-600/40 flex items-center justify-center transition-all"
                aria-label="Pinterest"
                title="Pinterest Profile"
              >
                <PinterestIcon />
              </a>

              <a
                href="https://t.me/mahiskills"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-sky-400 hover:border-sky-400/40 flex items-center justify-center transition-all"
                aria-label="Telegram"
                title="Telegram Community"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="hover:text-[#C49339] dark:hover:text-[#F0C96A] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-[#C49339] dark:hover:text-[#F0C96A] transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link href="/session" className="hover:text-[#C49339] dark:hover:text-[#F0C96A] transition-colors flex items-center gap-1.5">
                  1:1 Personal Session
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] font-bold">
                    ₹899
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C49339] dark:hover:text-[#F0C96A] transition-colors">
                  About Munna Bhai
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-[#C49339] dark:hover:text-[#F0C96A] transition-colors">
                  Student Community
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#C49339] dark:hover:text-[#F0C96A] transition-colors">
                  Articles & Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Programs */}
          <div className="flex flex-col gap-3">
            <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
              Top Programs
            </h4>
            <ul className="flex flex-col gap-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/courses/rumble-cpm-method"
                  className="hover:text-[#C49339] dark:text-[#F0C96A] font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>Rumble CPM Method</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black">HOT</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/courses/whop-clipping-campaign-guide"
                  className="hover:text-[#C49339] dark:text-[#F0C96A] font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>Whop Clipping — A-Z Guide</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500 text-white font-bold">NEW</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="hover:text-[#C49339] dark:hover:text-[#F0C96A] transition-colors"
                >
                  Explore All Masterclasses →
                </Link>
              </li>
              <li>
                <Link
                  href="/session"
                  className="hover:text-[#C49339] dark:hover:text-[#F0C96A] transition-colors"
                >
                  Book 1:1 Personal Session
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="hover:text-[#C49339] dark:hover:text-[#F0C96A] transition-colors"
                >
                  Student Community
                </Link>
              </li>
              <li>
                <Link
                  href="/verify-certificate"
                  className="hover:text-[#C49339] dark:hover:text-[#F0C96A] transition-colors flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D6A84F]" />
                  Verify Certificate
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="flex flex-col gap-3">
            <h4 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
              Support & Inquiries
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#D6A84F] shrink-0 mt-0.5" />
                <a
                  href="mailto:mahiverse.hub@gmail.com"
                  className="hover:text-[#C49339] dark:hover:text-[#F0C96A] transition-colors break-all"
                >
                  mahiverse.hub@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#D6A84F] shrink-0 mt-0.5" />
                <a
                  href="tel:9376343629"
                  className="hover:text-[#C49339] dark:hover:text-[#F0C96A] transition-colors"
                >
                  +91 9376343629
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Send className="w-4 h-4 text-[#D6A84F] shrink-0 mt-0.5" />
                <a
                  href="https://t.me/mahiskills"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C49339] dark:hover:text-[#F0C96A] transition-colors"
                >
                  Telegram: @mahiskills
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="inline-block mt-1 text-xs font-bold text-[#C49339] dark:text-[#F0C96A] hover:underline"
                >
                  Send us a message →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 Mahi Skills (mahiskills.in). All Rights Reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/refund-policy" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
