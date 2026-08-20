'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Shield, ExternalLink, LogOut, Sun, Moon } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#D6A84F] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-300">Validating administrator privileges...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-800 border border-red-500/40 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Access Required</h2>
          <p className="text-xs text-slate-300">
            This portal is restricted to authorized administrators of MAHI SKILLS.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login?redirect=/admin"
              className="py-3 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-bold text-xs shadow-md"
            >
              Sign In with Admin Account →
            </Link>
            <Link href="/" className="text-xs text-slate-400 hover:text-white py-1">
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#07111F] text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row transition-colors">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Top Header */}
        <header className="h-16 bg-white dark:bg-[#07111F] border-b border-slate-200 dark:border-white/10 px-6 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#C49339] dark:text-[#F0C96A]">MAHI SKILLS</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-800 dark:text-white">Administration Hub</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              title="Toggle Dark/Light Mode"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-700" />
              ) : (
                <Sun className="w-4 h-4 text-[#F0C96A]" />
              )}
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Admin: <strong className="text-slate-900 dark:text-white">{user.name}</strong></span>
            </div>

            <button
              onClick={() => logout()}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 text-xs flex items-center gap-1.5 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Admin Content Area */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
