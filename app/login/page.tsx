'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      if (res.role === 'ADMIN' && redirectPath === '/dashboard') {
        router.push('/admin');
      } else {
        router.push(redirectPath);
      }
    } else {
      setErrorMessage(res.error || 'Invalid credentials');
    }
  };

  return (
    <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0B1728] border-2 border-slate-200 dark:border-[#D6A84F]/30 shadow-2xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] dark:from-[#F0C96A] dark:to-[#B3862D] flex items-center justify-center font-black text-2xl text-[#D6A84F] dark:text-[#05080D] mx-auto shadow-md">
            M
          </div>
        </Link>
        <h1 className="text-2xl font-black text-slate-950 dark:text-white">Welcome Back</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Sign in to access your courses and 1:1 sessions</p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@mahiskills.in"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
            <Link href="/forgot-password" className="text-xs text-[#C49339] dark:text-[#F0C96A] font-bold hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#D6A84F] focus:outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#D6A84F]/20 hover:scale-[1.01] transition-all disabled:opacity-50"
        >
          <span>{isLoading ? 'Signing In...' : 'Sign In to Account'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Quick Demo Credentials Help */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-1 text-xs text-slate-600 dark:text-slate-300">
        <p className="font-bold text-slate-900 dark:text-white">Default Demo Credentials:</p>
        <p>• Student: <span className="font-bold text-[#C49339] dark:text-[#F0C96A]">student@mahiskills.in</span> / <span className="font-bold text-slate-900 dark:text-white">Student@123456</span></p>
        <p>• Admin: <span className="font-bold text-[#C49339] dark:text-[#F0C96A]">admin@mahiskills.in</span> / <span className="font-bold text-slate-900 dark:text-white">Admin@123456</span></p>
      </div>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/10">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-[#C49339] dark:text-[#F0C96A] font-bold hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-xs text-slate-500">Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
