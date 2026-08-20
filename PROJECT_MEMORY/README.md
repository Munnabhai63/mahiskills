# MAHI SKILLS (mahiskills.in) — Project Memory & Master Blueprint

## 1. Project Overview & Brand Identity
- **Brand Name**: MAHI SKILLS
- **Domain**: `mahiskills.in`
- **Tagline**: *Learn. Grow. Earn.*
- **Founder**: Munna Bhai (*Founder & Lead Mentor, Mahi Skills*)
- **Brand Positioning**: Premium online education and digital skill-selling platform teaching in-demand digital skills (Instagram Growth, YouTube Monetization, WhatsApp Marketing, High-Ticket Freelancing) with 1:1 mentorship and verifiable certification.
- **Visual Design Direction**: Ultra-luxury creator brand with Champagne Gold (`#D6A84F` / `#F0C96A` / `#C49339`), crisp Porcelain White `#F8FAFC`, and Deep Obsidian Navy `#07111F`.

---

## 2. Technical Stack Architecture
- **Framework**: Next.js 16.3.1 App Router + TypeScript (Turbopack)
- **Styling**: Tailwind CSS v4 + Semantic CSS Theme Variables (`@custom-variant dark (&:where(.dark, .dark *));`)
- **Database & ORM**: SQLite (`dev.db`) + Prisma ORM
- **Authentication**: JWT-based HTTP-only cookies with `bcryptjs` password hashing and Role-Based Access Control (`STUDENT` & `ADMIN`).
- **Payment Architecture**: Razorpay integration with simulated & live verification + HMAC-SHA256 signature verification.
- **1:1 Mentorship Engine**: Real-time slot booking with double-booking collision prevention and Google Meet integration.
- **LMS Engine**: Video player with lesson completion tracking and automated verifiable certificate issuance upon 100% progress.
- **Admin Backoffice**: Comprehensive administration hub for Analytics, Courses & Curriculum, Students, Orders, 1:1 Sessions, Coupons, Reviews, Certificates, Blog CMS, and Dynamic Site Settings.

---

## 3. Directory Structure Summary
```
mahiskills/
├── app/
│   ├── (public pages)/
│   │   ├── page.tsx                    # Homepage (Mockup-aligned Hero, Stats, 1:1 Banner, FAQs)
│   │   ├── about/                      # About Munna Bhai & Brand Mission
│   │   ├── community/                  # VIP Telegram & WhatsApp Community
│   │   ├── blog/                       # Blog Insights & [slug] Single Article
│   │   ├── contact/                    # Contact Form & Support details
│   │   ├── login/, register/, forgot-password/ # Auth flows
│   │   ├── privacy-policy/, terms/, refund-policy/ # Legal compliance
│   │   └── not-found.tsx               # Custom 404
│   ├── courses/                        # Catalog & [slug] Sales Page
│   ├── session/                        # 1:1 Mentorship Booking Engine
│   ├── dashboard/                      # Student Portal (5 Tabs: Courses, Sessions, Certs, Orders, Profile)
│   ├── learn/[slug]/                   # LMS Video Player & Certificate Celebration
│   ├── verify-certificate/[id]/        # Authentic Guilloche-bordered Certificate Verification
│   ├── admin/                          # 11 Backoffice Management Modules
│   └── api/                            # Full REST API endpoints (Auth, Courses, Orders, Sessions, Admin, etc.)
├── components/                         # Navbar, Footer, CourseCard, CartDrawer, SearchModal, VideoModal, AdminSidebar, AppWrapper
├── context/                            # AuthContext, CartContext, ThemeContext (Dark/Light)
├── prisma/                             # schema.prisma & SQLite dev.db
├── PROJECT_MEMORY/                     # Persistent Project Knowledge & Progress
└── scripts/verify-all-flows.ts         # 19 automated end-to-end integration tests
```
