'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  thumbnail: string;
  itemType: 'COURSE' | 'SESSION';
}

export interface AppliedCoupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  discountAmount: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  appliedCoupon: AppliedCoupon | null;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setIsOpen: (open: boolean) => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  subtotal: number;
  totalDiscount: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('mahiskills_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch {}
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mahiskills_cart', JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (item: CartItem) => {
    if (!items.some((i) => i.id === item.id)) {
      setItems((prev) => [...prev, item]);
    }
    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.toUpperCase().trim(), cartAmount: subtotal }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.error || 'Invalid coupon code' };
      }

      setAppliedCoupon({
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        discountAmount: data.discountAmount,
      });

      return { success: true, message: `Coupon applied: ₹${data.discountAmount} saved!` };
    } catch {
      return { success: false, message: 'Could not validate coupon. Please try again.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const totalDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal - totalDiscount);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        appliedCoupon,
        addItem,
        removeItem,
        clearCart,
        setIsOpen,
        applyCoupon,
        removeCoupon,
        subtotal,
        totalDiscount,
        finalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
