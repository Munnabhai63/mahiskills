'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CreditCard,
  Calendar,
  Tag,
  Star,
  Award,
  FileText,
  Sliders,
  MessageSquare,
  ExternalLink,
  Shield,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Analytics', href: '/admin', icon: LayoutDashboard },
    { name: 'Courses', href: '/admin/courses', icon: BookOpen },
    { name: 'Students', href: '/admin/students', icon: Users },
    { name: 'Orders & Payments', href: '/admin/orders', icon: CreditCard },
    { name: '1:1 Sessions', href: '/admin/sessions', icon: Calendar },
    { name: 'Coupons', href: '/admin/coupons', icon: Tag },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Certificates', href: '/admin/certificates', icon: Award },
    { name: 'Blog Articles', href: '/admin/blog', icon: FileText },
    { name: 'Inquiries', href: '/admin/messages', icon: MessageSquare },
    { name: 'Site Settings', href: '/admin/settings', icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#07111F] border-r border-slate-200 dark:border-white/10 flex flex-col justify-between shrink-0 min-h-screen transition-colors">
      <div>
        {/* Admin Header */}
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-gradient-to-br dark:from-[#F0C96A] dark:to-[#B3862D] text-[#D6A84F] dark:text-[#05080D] flex items-center justify-center font-black text-lg shadow-sm">
            M
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              MAHI SKILLS
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] font-bold">
                ADMIN
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Backoffice Portal</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-[#D6A84F]/20 dark:text-[#F0C96A] dark:border dark:border-[#D6A84F]/40 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D6A84F]' : 'text-slate-400 dark:text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer link to live site */}
      <div className="p-4 border-t border-slate-200 dark:border-white/10">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-white text-xs font-bold transition-colors border border-slate-200 dark:border-white/5"
        >
          <span>View Public Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#D6A84F]" />
        </Link>
      </div>
    </aside>
  );
}
