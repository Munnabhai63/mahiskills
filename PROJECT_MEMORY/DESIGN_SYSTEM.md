# MAHI SKILLS — Design System & Visual Token Guide

## 1. Color Palette & Semantic Tokens

### Brand Accents
- **Gold Primary**: `#D6A84F` (Champagne Warm Gold)
- **Gold Light / Glow**: `#F0C96A`
- **Gold Deep / Gradient End**: `#C49339` / `#B3862D`
- **Gold Gradient**: `linear-gradient(135deg, #F0C96A 0%, #D6A84F 50%, #C49339 100%)`

### Light Mode Tokens
- **Page Background (`--bg-page`)**: `#F8FAFC` (Porcelain Slate)
- **Card Surface (`--bg-surface`)**: `#FFFFFF` (Pure Crisp White)
- **Elevated Surface (`--bg-surface-elevated`)**: `#F1F5F9`
- **Primary Text (`--text-primary`)**: `#0F172A` / `#05080D` (Deep Slate Black — 100% contrast)
- **Secondary Text (`--text-secondary`)**: `#334155` (Slate 700)
- **Muted Text (`--text-muted`)**: `#64748B` (Slate 500)
- **Subtle Borders (`--border-subtle`)**: `#E2E8F0` (Slate 200)
- **Strong Borders (`--border-strong`)**: `#CBD5E1` (Slate 300)

### Dark Mode Tokens
- **Page Background (`--bg-page`)**: `#07111F` (Obsidian Navy)
- **Card Surface (`--bg-surface`)**: `#0B1728` (Elevated Deep Navy)
- **Elevated Surface (`--bg-surface-elevated`)**: `#112238`
- **Primary Text (`--text-primary`)**: `#F8FAFC` / `#FFFFFF` (Crisp Pure White)
- **Secondary Text (`--text-secondary`)**: `#E2E8F0` (Slate 200)
- **Muted Text (`--text-muted`)**: `#94A3B8` (Slate 400)
- **Subtle Borders (`--border-subtle`)**: `rgba(255, 255, 255, 0.1)`
- **Strong Borders (`--border-strong`)**: `rgba(255, 255, 255, 0.2)`

### Status & Indicator Colors
- **Success / Paid / Active**: `emerald-600` (Light) / `emerald-400` (Dark) with `bg-emerald-500/10`
- **Pending / In-Progress**: `amber-600` (Light) / `amber-400` (Dark) with `bg-amber-500/10`
- **Error / Danger / Cancelled**: `rose-600` (Light) / `rose-400` (Dark) with `bg-rose-500/10`
- **Refunded / Notice**: `purple-600` (Light) / `purple-400` (Dark) with `bg-purple-500/10`

---

## 2. Typography Hierarchy
- **Font Sans**: `var(--font-sans), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Display Headlines**: `font-black text-3xl sm:text-5xl tracking-tight leading-[1.12]`
- **Section Titles**: `font-black text-2xl sm:text-3xl text-slate-950 dark:text-white`
- **Card Titles**: `font-bold text-base sm:text-lg text-slate-900 dark:text-white`
- **Body Text**: `text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed`
- **Micro Badges / Captions**: `text-[10px] sm:text-xs font-extrabold uppercase tracking-wider`

---

## 3. Border Radii & Shadow System
- **Main Cards / Drawers / Modals**: `rounded-3xl` (24px)
- **Buttons / Form Inputs / Small Cards**: `rounded-xl` (12px) to `rounded-2xl` (16px)
- **Badges / Pills**: `rounded-full` (9999px)
- **Elevation Shadows**:
  - Light mode: `shadow-md` / `shadow-xl` with subtle slate tint (`rgba(0,0,0,0.06)`)
  - Dark mode: `shadow-xl` / `shadow-2xl` with deep glow (`rgba(0,0,0,0.4)` & gold accents)

---

## 4. Component Patterns
- **Primary CTA Button**: `bg-gradient-to-r from-[#D6A84F] to-[#C49339] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:scale-105 transition-all`
- **Secondary Action Button**: `bg-white dark:bg-[#0B1728] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all`
- **Input Fields**: `w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:border-[#D6A84F] focus:outline-none font-medium`
