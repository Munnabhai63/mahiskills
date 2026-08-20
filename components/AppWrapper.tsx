'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SearchModal from '@/components/SearchModal';
import { ThemeProvider } from '@/context/ThemeContext';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith('/admin');
  const isLearnRoute = pathname.startsWith('/learn');

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#07111F] text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {!isAdminRoute && !isLearnRoute && (
          <Navbar onOpenSearch={() => setSearchOpen(true)} />
        )}

        <main className={`flex-1 ${!isAdminRoute && !isLearnRoute ? 'pt-20' : ''}`}>
          {children}
        </main>

        {!isAdminRoute && !isLearnRoute && <Footer />}

        <CartDrawer />
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </ThemeProvider>
  );
}
