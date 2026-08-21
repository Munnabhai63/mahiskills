'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  User as UserIcon,
  BookOpen,
  Calendar,
  Award,
  Shield,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import NotificationBell from '@/components/NotificationBell';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export default function Navbar({ onOpenSearch }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { items, setIsOpen: setCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    { name: '1:1 Session', href: '/session', highlight: true },
    { name: 'About Us', href: '/about' },
    { name: 'Community', href: '/community' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-[#07111F]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-sm py-3'
          : 'bg-white/90 dark:bg-[#07111F]/90 backdrop-blur-sm border-b border-slate-100 dark:border-white/5 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo matching reference */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] dark:from-[#D6A84F] dark:to-[#B3862D] flex items-center justify-center font-black text-xl text-[#D6A84F] dark:text-[#05080D] shadow-md border border-[#D6A84F]/30 group-hover:scale-105 transition-transform">
            M
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl tracking-wider text-slate-900 dark:text-white group-hover:text-[#D6A84F] transition-colors">
              MAHI <span className="text-[#C49339] dark:text-[#F0C96A]">SKILLS</span>
            </span>
            <span className="text-[10px] tracking-widest text-slate-500 dark:text-slate-400 uppercase font-semibold">
              Learn. Grow. Earn.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-slate-950 dark:text-white font-bold'
                    : link.highlight
                    ? 'text-[#C49339] dark:text-[#F0C96A] hover:text-[#9A7024]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#D6A84F] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-slate-700" />
            ) : (
              <Sun className="w-5 h-5 text-[#F0C96A]" />
            )}
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            title="Search Courses"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Notification Bell */}
          <NotificationBell />

          {/* Cart Trigger */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D6A84F] text-white font-bold text-xs flex items-center justify-center shadow-md">
                {items.length}
              </span>
            )}
          </button>

          {/* Authentication Dropdown / Login CTA */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-[#D6A84F] transition-all text-sm font-semibold text-slate-800 dark:text-white"
              >
                <div className="w-7 h-7 rounded-lg bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-white/5">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[#D6A84F]/15 text-[#C49339] dark:text-[#F0C96A]">
                      {user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-[#D6A84F]" />
                      Student Dashboard
                    </Link>
                    <Link
                      href="/dashboard?tab=courses"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <BookOpen className="w-4 h-4 text-[#D6A84F]" />
                      My Courses
                    </Link>
                    <Link
                      href="/dashboard?tab=sessions"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-[#D6A84F]" />
                      1:1 Sessions
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#C49339] dark:text-[#F0C96A] font-bold bg-[#D6A84F]/10 hover:bg-[#D6A84F]/20 transition-colors border-y border-[#D6A84F]/20 my-1"
                      >
                        <Shield className="w-4 h-4 text-[#D6A84F]" />
                        Admin Panel
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-white/5">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white border border-slate-300 dark:border-white/10 hover:border-slate-400 rounded-xl transition-all shadow-xs"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#D6A84F] to-[#C49339] hover:from-[#E0B45C] hover:to-[#D6A84F] rounded-xl shadow-md shadow-[#D6A84F]/30 transition-all hover:scale-[1.02]"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger & Theme Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-700 dark:text-slate-300 hover:text-slate-950"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-slate-700" />
            ) : (
              <Sun className="w-5 h-5 text-[#F0C96A]" />
            )}
          </button>

          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 text-slate-700 dark:text-slate-300 hover:text-slate-950"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D6A84F] text-white font-bold text-[10px] flex items-center justify-center">
                {items.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-950 hover:bg-slate-100 dark:hover:bg-white/5"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bg-white/98 dark:bg-[#07111F]/98 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 shadow-2xl p-6 transition-all animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                  pathname === link.href
                    ? 'text-[#C49339] dark:text-[#F0C96A] bg-slate-50 dark:bg-white/5 border border-[#D6A84F]/30'
                    : 'text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <span>{link.name}</span>
                {link.highlight && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] font-bold">
                    ₹899 Session
                  </span>
                )}
              </Link>
            ))}

            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-white/5 flex flex-col gap-3">
              {user ? (
                <>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#D6A84F]/20 text-[#C49339] dark:text-[#F0C96A] font-bold">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white font-semibold text-sm"
                  >
                    <UserIcon className="w-4 h-4 text-[#D6A84F]" />
                    Dashboard
                  </Link>

                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D6A84F]/15 text-[#C49339] dark:text-[#F0C96A] font-bold text-sm"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Backoffice
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white font-semibold text-center"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-bold text-center"
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
