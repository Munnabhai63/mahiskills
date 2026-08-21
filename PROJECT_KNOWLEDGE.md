# 📘 MAHI SKILLS (`mahiskills.in`) — MASTER TECHNICAL DOCUMENTATION & ARCHITECTURAL REFERENCE

> **STATUS:** PRODUCTION READY & VERIFIED  
> **LATEST AUDIT:** 19/19 Automated Tests Passed | 32/32 Live Smoke Tests Passed | 0 Build Warnings | 0 Runtime Errors  
> **MAINTAINER / FOUNDER:** Munna Bhai (Mahipal Choudhary)  
> **PLATFORM DOMAIN:** `https://mahiskills.in`

---

## 1. EXECUTIVE SUMMARY & BRAND IDENTITY
* **Platform Name:** MAHI SKILLS
* **Domain:** `mahiskills.in`
* **Tagline:** *Learn. Grow. Earn.*
* **Purpose:** India's premier digital accelerator platform offering practical, income-generating masterclasses in Content Clipping (Whop campaigns), Instagram Virality, YouTube Monetization, WhatsApp Marketing Automation, and International Freelancing, along with 1:1 private mentorship calls.
* **Founder & Lead Mentor:** Munna Bhai (Creator, Entrepreneur & Growth Strategist).

---

## 2. TECHNOLOGY STACK & CORE ARCHITECTURE

### 2.1 Frontend Framework
* **Next.js 16.3.1 (App Router + Turbopack)**: High-speed server-rendered (SSR) and statically generated (SSG) architecture.
* **React 19 / Client Components**: Interactive UI using `'use client'` where state is required, with optimal code-splitting.
* **Tailwind CSS v4**: Custom dark/gold luxury theme (`#05080D` dark background, `#D6A84F` primary gold accents, `#F0C96A` gold highlight).
* **Typography**: Next.js Google Fonts (`Inter` for body readability, `Outfit` for luxury display headlines).
* **Icons**: `lucide-react` high-performance SVGs.
* **Animations & Effects**: `canvas-confetti` for lesson completion celebration.

### 2.2 Backend & Serverless API
* **Next.js Route Handlers (`app/api/*`)**: Clean, type-safe REST API endpoints.
* **Prisma ORM v6.4.1**: Strongly-typed database layer interacting with cloud PostgreSQL.
* **Input Validation**: `Zod` schema validation across all write APIs.
* **Authentication**: Stateless JSON Web Tokens (`jsonwebtoken`) stored in HTTP-Only, Secure, Lax SameSite cookies.
* **Password Hashing**: `bcryptjs` with salt round factor 10.

### 2.3 Cloud Database
* **PostgreSQL (Neon Serverless Cloud)**: High-availability cloud PostgreSQL instance.
* **Connection Pooling**: Optimized for serverless architectures via Prisma client singleton.

---

## 3. DATABASE SCHEMA & DATA MODELS (`prisma/schema.prisma`)

### 3.1 User & Identity
* **`User`**:
  * `id`: String (UUID primary key)
  * `name`: String
  * `email`: String (Unique, normalized lowercase)
  * `passwordHash`: String (Bcrypt)
  * `role`: Enum/String (`STUDENT` | `ADMIN`)
  * `phone`: String? (WhatsApp phone number)
  * `avatar`: String? (Profile image URI)
  * `bio`: String?
  * `isActive`: Boolean (Default: `true`)
  * Relationships: `enrollments`, `orders`, `sessionBookings`, `certificates`, `reviews`, `lessonProgress`

### 3.2 Courses, Modules & Lessons
* **`Course`**:
  * `id`, `title`, `slug` (Unique, URL-safe), `shortDescription`, `description`
  * `price`: Int, `originalPrice`: Int?, `discount`: Int?
  * `thumbnail`: String, `previewVideo`: String?
  * `level`, `category`, `badge` (e.g., `Bestseller`, `NEW`), `instructor`, `duration`
  * `rating`: Float (Default: 4.8), `totalStudents`: Int
  * `requirements`: String (JSON Array), `learningOutcomes`: String (JSON Array), `faqs`: String (JSON Array)
  * `published`: Boolean (Default: `true`)
  * Relationships: `modules`, `enrollments`, `orders`, `reviews`
* **`CourseModule`**:
  * `id`, `courseId`, `title`, `order`: Int
  * Relationships: `course`, `lessons`
* **`Lesson`**:
  * `id`, `moduleId`, `title`, `duration`, `videoUrl`: String, `isPreview`: Boolean, `order`: Int
  * `description`: String?, `resources`: String? (JSON Array of PDF/links)
  * Relationships: `module`, `progress`

### 3.3 Learning Management System (LMS) Tracking
* **`Enrollment`**:
  * `id`, `userId`, `courseId`, `enrolledAt`, `completedAt`?, `progressPercent`: Float (0-100)
  * Unique constraint: `[userId, courseId]`
* **`LessonProgress`**:
  * `id`, `userId`, `lessonId`, `isCompleted`: Boolean, `completedAt`: DateTime?
  * Unique constraint: `[userId, lessonId]`
* **`Certificate`**:
  * `id`, `certificateNumber`: String (Unique, e.g. `MS-CERT-2026-IG-0042`)
  * `userId`, `courseId`, `studentName`, `courseName`, `instructorName`, `issueDate`, `verificationUrl`

### 3.4 Orders, Payments & Review State
* **`Order`**:
  * `id`, `orderNumber`: String (Unique, e.g. `ORD-1787275682120-5842`)
  * `userId`, `courseId`?, `sessionId`?, `itemType`: String (`COURSE` | `SESSION`)
  * `amount`: Int, `originalAmount`: Int, `discountAmount`: Int, `couponCode`: String?, `currency`: String (`INR`)
  * `status`: String (`PENDING` | `PENDING_REVIEW` | `PAID` | `FAILED` | `REFUNDED`)
  * `paymentMethod`: String (`PHONEPE_UPI_QR` | `ONLINE` | `UPI`)
  * `razorpayOrderId`?, `razorpayPaymentId`?
* **`Payment`**:
  * `id`, `orderId`, `gateway`: String, `transactionId`: String, `status`: String (`SUCCESS` | `PENDING` | `FAILED`)

### 3.5 1:1 Mentorship Session Engine
* **`SessionBooking`**:
  * `id`, `bookingNumber`: String (Unique, e.g. `SES-1787274000-899`)
  * `userId`, `studentName`, `studentEmail`, `studentPhone`, `bookingDate`: String (`YYYY-MM-DD`)
  * `startTime`: String, `endTime`: String, `topic`: String, `notes`: String?
  * `status`: String (`CONFIRMED` | `COMPLETED` | `CANCELLED`), `amount`: Int (₹899)
  * `meetingLink`: String (e.g. `https://meet.google.com/mahiskills-mentor`)
* **`SessionAvailability`**:
  * `id`, `dayOfWeek`: Int (1 = Monday ... 6 = Saturday), `startTime`: String (`11:00`), `endTime`: String (`19:00`), `slotDurationMinutes`: 60, `isActive`: Boolean
* **`BlockedDate`**:
  * `id`, `date`: String (Unique `YYYY-MM-DD`), `reason`: String?

### 3.6 Marketing, Coupons & Announcements
* **`Coupon`**:
  * `id`, `code`: String (Unique Uppercase), `discountType`: String (`PERCENTAGE` | `FLAT`), `discountValue`: Int
  * `minPurchase`: Int, `maxDiscount`: Int?, `expiresAt`: DateTime?, `usageLimit`: Int?, `usedCount`: Int, `isActive`: Boolean
* **`Notification`**:
  * `id`, `title`, `message`, `type` (`ANNOUNCEMENT` | `UPDATE` | `ALERT`), `targetRole` (`ALL` | `STUDENT`), `link`: String?, `senderName`: String
* **`NotificationRead`**:
  * `id`, `notificationId`, `userId`, `readAt`
* **`BlogPost`**:
  * `id`, `title`, `slug` (Unique), `excerpt`, `content`, `coverImage`, `author`, `category`, `readTime`, `isPublished`: Boolean, `seoTitle`, `seoDescription`
* **`ContactMessage`**:
  * `id`, `name`, `email`, `phone`, `subject`, `message`, `isRead`: Boolean
* **`SiteSetting`**:
  * `id`, `key`: String (Unique), `value`: String, `group`: String

---

## 4. AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC)

### 4.1 Cookie-Based JWT Architecture
* **Cookie Name:** `mahiskills_auth_token`
* **Security Flags:** `httpOnly: true`, `secure: process.env.NODE_ENV === 'production'`, `sameSite: 'lax'`, `path: '/'`, `maxAge: 7 days`.
* **JWT Payload:** `{ userId, email, role: ('STUDENT' | 'ADMIN'), name }`
* **Helper Library (`lib/auth.ts`):**
  * `signToken(payload)`: Signs JWT with `JWT_SECRET`.
  * `verifyToken(token)`: Validates JWT signature.
  * `getCurrentUser()`: Extracts current authenticated user from request cookies.
  * `requireAuth(allowedRoles)`: Guards API route handlers and returns `{ user }` or `{ error, status: 401 | 403 }`.

### 4.2 Middleware Route Guard (`middleware.ts`)
* Protects `/dashboard/*`, `/admin/*`, and `/learn/*`.
* Redirects unauthenticated users to `/login?redirect={pathname}`.

---

## 5. PAYMENT & ORDER APPROVAL WORKFLOW (UPI QR + UTR)

### 5.1 Student Payment Journey
1. **Student Browses Course:** Opens course page (e.g. `/courses/whop-clipping-campaign-guide`).
2. **Instant Checkout:** Clicks "Enroll Now" → `POST /api/checkout/create-order` creates order with status `PENDING`.
3. **UPI Payment Modal (`components/UpiPaymentModal.tsx`):**
   * Displays official PhonePe / BHIM QR Code and Payee UPI ID (`muna937634@ybl` — Mahipal Choudhary / Mahi Skills).
   * Student scans, completes payment on UPI app, and submits the 12-digit UTR transaction number.
4. **Verification Handler (`POST /api/checkout/verify`):**
   * Recognizes `PHONEPE_UPI_QR` method.
   * **Security Rule:** Does NOT grant instant access.
   * Updates Order status to `PENDING_REVIEW` and records UTR number.
   * Returns `{ success: true, pendingReview: true }`.
5. **Dashboard Redirect:** Student sees confirmation popup and is redirected to `/dashboard?tab=orders` showing **`⏳ Under Review`** status. Course remains locked until approved.

### 5.2 Admin Approval Flow (`app/admin/orders/page.tsx` & `/api/admin/orders/approve`)
1. **Admin Orders Dashboard:** Shows live count of payments awaiting verification in a prominent yellow banner.
2. **Review Action:** Admin compares UTR with bank/UPI account.
3. **On "Approve":**
   * Calls `POST /api/admin/orders/approve` with `{ orderId, action: 'APPROVE' }`.
   * Order status transitions to `PAID`.
   * `Enrollment` record is created for student with `progressPercent: 0`.
   * In-app notification is dispatched.
   * **WhatsApp Automated Link:** Generates direct `wa.me` message URL pre-formatted with course access link.
4. **On "Reject":**
   * Order status transitions to `FAILED`. Access is not granted.

---

## 6. COURSE SYSTEM & LMS VIDEO PLAYER

### 6.1 Google Drive Video Streaming Integration
* **Preview Mode Embedding:** Lesson URLs matching `drive.google.com/file/d/{id}` are converted dynamically to `https://drive.google.com/file/d/{id}/preview` rendered inside a secure iframe with `allow="autoplay; encrypted-media"`.
* **Protection:** Disables direct browser download buttons while allowing high-resolution streaming.
* **HTML5 / YouTube Fallback:** Supports direct `.mp4` URLs and YouTube video IDs.

### 6.2 Practice & Reflection Interactive Module
* **🎯 Practice Card:** Below every video lesson, students receive:
  1. Key actionable takeaways.
  2. Hands-on practice task before moving forward.
  3. Action checklist.
* **🎉 Celebration Modal:** Triggered upon marking a lesson complete with `canvas-confetti` explosion and dual action buttons: *"Continue to Next Lesson"* or *"Practice First"*.
* **Auto-Certificate Trigger:** Completing 100% of curriculum automatically issues a verifiable certificate.

---

## 7. 1:1 PERSONAL MENTORSHIP SESSION SYSTEM

* **Standard Fee:** ₹899 for 1 full hour.
* **Availability Engine (`app/api/session/available-slots/route.ts`):**
  * Evaluates day of week (Monday to Saturday, 11:00 AM – 8:30 PM).
  * Automatically blocks dates in `BlockedDate`.
  * **Double-Booking Collision Prevention:** Filters out existing confirmed/completed bookings for the chosen date.
* **Booking Engine (`app/api/session/book/route.ts`):**
  * Validates inputs with Zod.
  * Links booking to authenticated student or registers student account.
  * Generates Google Meet join link.

---

## 8. CERTIFICATE GENERATION & VERIFICATION

* **Verification URL:** `https://mahiskills.in/verify-certificate/{certificateNumber}`
* **Visual Credential (`app/verify-certificate/[id]/page.tsx`):**
  * Luxury gold border and executive credential card.
  * Verified checkmark with live database lookup.
  * Dynamic QR Code linking to verification URL.
  * Authentic handwritten digital signature component (`components/FounderSignature.tsx`).
  * One-click "Print / Save as PDF" button with print-specific CSS media queries.

---

## 9. COUPON SYSTEM & PRICING RULES

* **Validation Endpoint:** `POST /api/coupons/validate`
  * Accepts `cartAmount`, `cartTotal`, or `amount` flexibly.
  * Checks `isActive`, `expiresAt`, `usageLimit`, and `minPurchase`.
  * Calculates percentage or flat discounts capped at `maxDiscount`.
  * Returns `{ valid: true, code, discountType, discountValue, discountAmount }`.
* **Standard Coupons:**
  * `MAHI20`: 20% discount on orders ≥ ₹1,000 (Max: ₹2,000).
  * `WHOP50`: 50% discount on Whop campaigns.
  * `VIP1000`: Flat ₹1,000 discount on orders ≥ ₹3,000.

---

## 10. COMPLETE ROUTE INVENTORY

### 10.1 Frontend User Routes
| Route | Component | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Luxury Homepage (Hero, Stats, Benefits, 1:1 Banner, Courses, FAQ, Socials) |
| `/courses` | `app/courses/page.tsx` | All Courses Grid with Category Filtering & Live Search |
| `/courses/[slug]` | `app/courses/[slug]/page.tsx` | Course Detail Page with Video Preview Modal & Instant Checkout |
| `/learn/[slug]` | `app/learn/[slug]/page.tsx` | LMS Player (Google Drive player, Curriculum, Practice, Certificates) |
| `/session` | `app/session/page.tsx` | 1:1 Mentorship Booking Page with Interactive Slot Selector |
| `/dashboard` | `app/dashboard/page.tsx` | Student Dashboard (`?tab=courses`, `sessions`, `orders`, `certificates`, `profile`, `announcements`) |
| `/about` | `app/about/page.tsx` | Founder Story, Mission, Credentials & Social Media Channels |
| `/community` | `app/community/page.tsx` | Telegram & WhatsApp Community Channels & Student Reviews |
| `/blog` | `app/blog/page.tsx` | Digital Growth Blog & Insights Listing |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | In-Depth Blog Article with SEO Metadata |
| `/contact` | `app/contact/page.tsx` | Contact Form & Direct Support Channels |
| `/login` | `app/login/page.tsx` | Account Sign-In with Redirect Support |
| `/register` | `app/register/page.tsx` | Student Registration |
| `/forgot-password` | `app/forgot-password/page.tsx` | Password Recovery |
| `/verify-certificate/[id]` | `app/verify-certificate/[id]/page.tsx` | Verified Certificate View with QR Code & Print |
| `/privacy-policy` | `app/privacy-policy/page.tsx` | Official Privacy Policy |
| `/terms` | `app/terms/page.tsx` | Terms and Conditions |
| `/refund-policy` | `app/refund-policy/page.tsx` | Refund Policy |
| `* (404)` | `app/not-found.tsx` | Custom Luxury 404 Error Page |

### 10.2 Admin Routes (`/admin/*`)
| Route | Component | Purpose |
|---|---|---|
| `/admin` | `app/admin/page.tsx` | Admin Analytics Dashboard (Revenue, Orders, Students, Bookings) |
| `/admin/orders` | `app/admin/orders/page.tsx` | Order Management & UPI Approval / Rejection with WhatsApp Dispatch |
| `/admin/courses` | `app/admin/courses/page.tsx` | Course Catalog Management |
| `/admin/courses/new` | `app/admin/courses/new/page.tsx` | Course Creator |
| `/admin/courses/[id]` | `app/admin/courses/[id]/page.tsx` | Course Editor, Module & Lesson Manager |
| `/admin/students` | `app/admin/students/page.tsx` | Student Directory & Enrollment Inspection |
| `/admin/sessions` | `app/admin/sessions/page.tsx` | 1:1 Session Bookings & Google Meet Links |
| `/admin/coupons` | `app/admin/coupons/page.tsx` | Discount Coupon Manager |
| `/admin/notifications` | `app/admin/notifications/page.tsx` | Broadcast Announcements to Students |
| `/admin/reviews` | `app/admin/reviews/page.tsx` | Course Review Moderation |
| `/admin/blog` | `app/admin/blog/page.tsx` | Blog Article Editor & Publisher |
| `/admin/certificates` | `app/admin/certificates/page.tsx` | Issued Certificate Registry |
| `/admin/messages` | `app/admin/messages/page.tsx` | Contact Form Inquiries |
| `/admin/settings` | `app/admin/settings/page.tsx` | Dynamic Platform Settings |

### 10.3 API Routes (`/api/*`)
| Endpoint | Method | Role | Purpose |
|---|---|---|---|
| `/api/auth/register` | POST | Public | User account creation & cookie issue |
| `/api/auth/login` | POST | Public | User authentication & JWT cookie issue |
| `/api/auth/logout` | POST | Public | Auth cookie clear |
| `/api/auth/me` | GET | Authenticated | Retrieve current user session |
| `/api/auth/update-profile` | POST | Authenticated | Update name, phone, bio, password |
| `/api/courses` | GET | Public | List published courses with search & category |
| `/api/courses/[slug]` | GET | Public | Retrieve course with modules, lessons, isEnrolled |
| `/api/courses/[slug]/progress` | GET/POST | Authenticated | Track completed lessons, calc %, issue certificate |
| `/api/dashboard/stats` | GET | Authenticated | Fetch enrollments, sessions, orders, certificates |
| `/api/checkout/create-order` | POST | Authenticated | Initiate course/session purchase |
| `/api/checkout/verify` | POST | Authenticated | Verify payment / submit UTR to `PENDING_REVIEW` |
| `/api/coupons/validate` | POST | Public | Validate coupon code and calculate discount |
| `/api/session/available-slots` | GET | Public | Fetch unbooked 1:1 time slots for date |
| `/api/session/book` | POST | Public/Auth | Book 1:1 mentorship session |
| `/api/certificates/[id]` | GET | Public | Lookup and verify certificate |
| `/api/contact` | POST | Public | Save contact message |
| `/api/blog` | GET | Public | Fetch published blog posts |
| `/api/blog/[slug]` | GET | Public | Fetch single blog article & related posts |
| `/api/settings` | GET | Public | Fetch public site settings |
| `/api/notifications` | GET | Authenticated | Fetch announcements for user |
| `/api/notifications/read` | POST | Authenticated | Mark announcement as read |
| `/api/admin/orders/approve` | POST | ADMIN | Approve/Reject order, create enrollment, generate WA link |
| `/api/admin/*` | * | ADMIN | Full administrative CRUD endpoints |

---

## 11. ENVIRONMENT VARIABLES REFERENCE

> **IMPORTANT:** Never commit real secrets to source control. The following environment variables are required in `.env` / deployment environments:

* `DATABASE_URL`: Cloud PostgreSQL connection string with SSL mode (`postgresql://...`).
* `JWT_SECRET`: Secret key used for signing and verifying JSON Web Tokens.
* `NEXT_PUBLIC_SITE_URL`: Root canonical URL (`https://mahiskills.in` or `http://localhost:3000`).
* `RAZORPAY_KEY_ID`: Payment gateway Public Key ID.
* `RAZORPAY_KEY_SECRET`: Payment gateway Secret Key.
* `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Client-accessible Razorpay Key ID.

---

## 12. VERIFIED QA & SMOKE TEST HISTORY

### 12.1 Automated Integration Suite (`scripts/verify-all-flows.ts`)
* **Status:** `19 / 19 PASSED` ✅
* **Coverage:**
  1. Database & Authentication (Admin user, bcrypt password hashing, JWT RBAC verification).
  2. Course System (5 active courses, curriculum structure, lesson durations, video URLs).
  3. Coupon Engine (MAHI20 discount calculation).
  4. Payment Architecture (Paise calculations, signature validation).
  5. 1:1 Session Engine (₹899 pricing, slot collision detection).
  6. LMS Progress & Certificates (100% progress auto-certificate issuance).
  7. Site Settings & Inquiries (Contact messages and dynamic settings).

### 12.2 Real-World Live Smoke Test Suite (`scripts/smoke-test.ts`)
* **Status:** `32 / 32 PASSED` ✅
* **Coverage:**
  * 19 core frontend pages rendered with HTTP 200.
  * Custom 404 error page handled without server crash.
  * Public APIs (Courses, Settings, Slots, Coupons, Contact).
  * RBAC security (Student denied admin access with HTTP 403; Admin authorized with HTTP 200).
  * Dashboard API returned safe, non-crashing enrollment objects.

---

## 13. FUTURE MODIFICATION & REGRESSION PROTECTION RULES

Whenever any developer or AI agent modifies this codebase in the future, adhere strictly to these principles:

1. **Zero Breaking Changes to Working Logic:** Never modify working business logic (e.g. UPI approval flow, 1:1 conflict prevention, Google Drive preview embeds) without explicit instruction.
2. **Preserve Suspense Boundaries:** Any page utilizing `useSearchParams` must remain wrapped in `<Suspense>`.
3. **Idempotent Seeding:** Never use destructive `deleteMany()` scripts on production database. Use `scripts/safe-sync.ts` for safe synchronization.
4. **Always Run Regression Suite:**
   ```bash
   npx tsx scripts/verify-all-flows.ts
   npm run build
   ```
5. **Keep `PROJECT_KNOWLEDGE.md` Updated:** Update this document whenever new courses, models, routes, or workflows are added.

---
*MAHI SKILLS — Built for scale, security, and high performance.*
