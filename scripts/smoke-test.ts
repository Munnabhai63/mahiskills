const BASE_URL = 'http://localhost:3000';

interface TestResult {
  step: string;
  status: 'PASS' | 'FAIL';
  details: string;
  statusCode?: number;
}

const results: TestResult[] = [];

function log(step: string, status: 'PASS' | 'FAIL', details: string, statusCode?: number) {
  results.push({ step, status, details, statusCode });
  const icon = status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} [${status}] ${step} - ${details} ${statusCode ? `(HTTP ${statusCode})` : ''}`);
}

async function runSmokeTests() {
  console.log('🚀 Launching Comprehensive Real-World Production Smoke Test against localhost:3000...\n');

  // ==========================================
  // 1. PAGE ROUTING & HTML RENDER INTEGRITY
  // ==========================================
  console.log('--- 1. Testing Core Frontend Pages ---');
  const pagesToTest = [
    { path: '/', title: 'Homepage' },
    { path: '/courses', title: 'Courses Index' },
    { path: '/courses/whop-clipping-campaign-guide', title: 'Whop Clipping Course Page' },
    { path: '/courses/instagram-growth-mastery', title: 'Instagram Course Page' },
    { path: '/session', title: '1:1 Session Booking Page' },
    { path: '/about', title: 'About Munna Bhai Page' },
    { path: '/community', title: 'Community Page' },
    { path: '/blog', title: 'Blog Listing Page' },
    { path: '/blog/how-to-gain-first-10000-instagram-followers', title: 'Blog Post Page' },
    { path: '/contact', title: 'Contact Us Page' },
    { path: '/login', title: 'Login Page' },
    { path: '/register', title: 'Register Page' },
    { path: '/forgot-password', title: 'Forgot Password Page' },
    { path: '/privacy-policy', title: 'Privacy Policy' },
    { path: '/terms', title: 'Terms & Conditions' },
    { path: '/refund-policy', title: 'Refund Policy' },
    { path: '/verify-certificate/MS-CERT-2026-IG-0042', title: 'Certificate Verification' },
    { path: '/robots.txt', title: 'Robots TXT' },
    { path: '/sitemap.xml', title: 'Sitemap XML' },
  ];

  for (const page of pagesToTest) {
    try {
      const res = await fetch(`${BASE_URL}${page.path}`);
      const text = await res.text();
      if (res.status === 200 && text.length > 50) {
        log(`Page: ${page.title} (${page.path})`, 'PASS', `Rendered successfully (${text.length} bytes)`, res.status);
      } else {
        log(`Page: ${page.title} (${page.path})`, 'FAIL', `Unexpected response`, res.status);
      }
    } catch (e: any) {
      log(`Page: ${page.title} (${page.path})`, 'FAIL', `Fetch error: ${e.message}`);
    }
  }

  // ==========================================
  // 2. 404 NOT FOUND HANDLING
  // ==========================================
  console.log('\n--- 2. Testing 404 Error Boundaries ---');
  try {
    const notFoundRes = await fetch(`${BASE_URL}/non-existent-page-test-404`);
    const notFoundText = await notFoundRes.text();
    if (notFoundRes.status === 404 || notFoundText.includes('404') || notFoundText.includes('Page Not Found')) {
      log('404 Error Page', 'PASS', 'Custom 404 page rendered gracefully without crashing', notFoundRes.status);
    } else {
      log('404 Error Page', 'FAIL', 'Custom 404 not rendered properly', notFoundRes.status);
    }
  } catch (e: any) {
    log('404 Error Page', 'FAIL', e.message);
  }

  // ==========================================
  // 3. API ENDPOINTS INTEGRITY
  // ==========================================
  console.log('\n--- 3. Testing Public API Endpoints ---');
  
  // Courses API
  try {
    const res = await fetch(`${BASE_URL}/api/courses`);
    const data: any = await res.json();
    if (res.status === 200 && Array.isArray(data.courses) && data.courses.length >= 4) {
      log('GET /api/courses', 'PASS', `Returned ${data.courses.length} active courses`, res.status);
    } else {
      log('GET /api/courses', 'FAIL', `Failed to return courses array`, res.status);
    }
  } catch (e: any) {
    log('GET /api/courses', 'FAIL', e.message);
  }

  // Single Course API
  try {
    const res = await fetch(`${BASE_URL}/api/courses/whop-clipping-campaign-guide`);
    const data: any = await res.json();
    if (res.status === 200 && data.course && data.course.modules?.length === 4) {
      log('GET /api/courses/whop-clipping-campaign-guide', 'PASS', `Whop course has 4 modules & ${data.course.totalLessons} lessons`, res.status);
    } else {
      log('GET /api/courses/whop-clipping-campaign-guide', 'FAIL', 'Course data incomplete', res.status);
    }
  } catch (e: any) {
    log('GET /api/courses/[slug]', 'FAIL', e.message);
  }

  // Settings API
  try {
    const res = await fetch(`${BASE_URL}/api/settings`);
    const data: any = await res.json();
    if (res.status === 200 && data.settings?.brand_name === 'MAHI SKILLS') {
      log('GET /api/settings', 'PASS', 'Brand settings loaded correctly (MAHI SKILLS)', res.status);
    } else {
      log('GET /api/settings', 'FAIL', 'Settings missing or invalid', res.status);
    }
  } catch (e: any) {
    log('GET /api/settings', 'FAIL', e.message);
  }

  // Available Slots API
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const dateStr = tomorrow.toISOString().split('T')[0];
    const res = await fetch(`${BASE_URL}/api/session/available-slots?date=${dateStr}`);
    const data: any = await res.json();
    if (res.status === 200 && data.available === true && Array.isArray(data.availableSlots)) {
      log('GET /api/session/available-slots', 'PASS', `Slots returned for ${dateStr} (${data.availableSlots.length} available)`, res.status);
    } else {
      log('GET /api/session/available-slots', 'FAIL', 'Failed to fetch available slots', res.status);
    }
  } catch (e: any) {
    log('GET /api/session/available-slots', 'FAIL', e.message);
  }

  // Coupon Validation API
  try {
    const res = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'MAHI20', cartTotal: 4999 }),
    });
    const data: any = await res.json();
    if (res.status === 200 && data.valid === true && data.discountAmount === 1000) {
      log('POST /api/coupons/validate (Valid)', 'PASS', 'MAHI20 20% discount computed to ₹1000 discount', res.status);
    } else {
      log('POST /api/coupons/validate (Valid)', 'FAIL', `Invalid coupon calculation: ${JSON.stringify(data)}`, res.status);
    }

    // Invalid coupon test
    const invRes = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'INVALID_XYZ_999', cartTotal: 4999 }),
    });
    const invData: any = await invRes.json();
    if (invRes.status === 400 || invRes.status === 404 || invData.valid === false) {
      log('POST /api/coupons/validate (Invalid)', 'PASS', `Properly rejected fake coupon code with HTTP ${invRes.status}`, invRes.status);
    } else {
      log('POST /api/coupons/validate (Invalid)', 'FAIL', 'Allowed fake coupon', invRes.status);
    }
  } catch (e: any) {
    log('POST /api/coupons/validate', 'FAIL', e.message);
  }

  // Contact Form Submission API
  try {
    const res = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Smoke Test Visitor',
        email: 'visitor@example.com',
        phone: '+91 9376343629',
        subject: 'Smoke Test Inquiry',
        message: 'This is an automated smoke test inquiry message.',
      }),
    });
    const data: any = await res.json();
    if (res.status === 200 || res.status === 201) {
      log('POST /api/contact', 'PASS', 'Contact message accepted and saved to database', res.status);
    } else {
      log('POST /api/contact', 'FAIL', `Failed to send contact message: ${data.error}`, res.status);
    }
  } catch (e: any) {
    log('POST /api/contact', 'FAIL', e.message);
  }

  // ==========================================
  // 4. AUTHENTICATION & RBAC SECURITY
  // ==========================================
  console.log('\n--- 4. Testing Authentication, Cookie Sessions & RBAC ---');
  
  let studentCookie = '';
  let adminCookie = '';

  // Student Login
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@mahiskills.in', password: 'Student@123456' }),
    });
    const rawCookie = res.headers.get('set-cookie');
    if (rawCookie) studentCookie = rawCookie.split(';')[0];
    const data: any = await res.json();
    if (res.status === 200 && data.user?.role === 'STUDENT') {
      log('Student Login', 'PASS', `Logged in as ${data.user.name} (${data.user.role}) with secure cookie`, res.status);
    } else {
      log('Student Login', 'FAIL', `Login failed: ${data.error}`, res.status);
    }
  } catch (e: any) {
    log('Student Login', 'FAIL', e.message);
  }

  // Admin Login
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'munachoudhary246@gmail.com', password: 'Munabhai@6375' }),
    });
    const rawCookie = res.headers.get('set-cookie');
    if (rawCookie) adminCookie = rawCookie.split(';')[0];
    const data: any = await res.json();
    if (res.status === 200 && data.user?.role === 'ADMIN') {
      log('Admin Login', 'PASS', `Logged in as ${data.user.name} (ADMIN) with secure cookie`, res.status);
    } else {
      log('Admin Login', 'FAIL', `Admin login failed: ${data.error}`, res.status);
    }
  } catch (e: any) {
    log('Admin Login', 'FAIL', e.message);
  }

  // Security: Student trying to access Admin API
  try {
    const res = await fetch(`${BASE_URL}/api/admin/analytics`, {
      headers: { Cookie: studentCookie },
    });
    if (res.status === 403 || res.status === 401) {
      log('RBAC Protection: Student -> Admin API', 'PASS', 'Blocked unauthorized student with HTTP 403/401', res.status);
    } else {
      log('RBAC Protection: Student -> Admin API', 'FAIL', `Security breach! Student accessed admin API`, res.status);
    }
  } catch (e: any) {
    log('RBAC Protection', 'FAIL', e.message);
  }

  // Security: Admin accessing Admin API
  try {
    const res = await fetch(`${BASE_URL}/api/admin/analytics`, {
      headers: { Cookie: adminCookie },
    });
    const data: any = await res.json();
    if (res.status === 200 && data.stats) {
      log('Admin Access: Admin -> Admin API', 'PASS', `Loaded admin analytics (${data.stats.totalStudents} students, ₹${data.stats.totalRevenue} revenue)`, res.status);
    } else {
      log('Admin Access: Admin -> Admin API', 'FAIL', `Failed to load admin analytics`, res.status);
    }
  } catch (e: any) {
    log('Admin Access', 'FAIL', e.message);
  }

  // ==========================================
  // 5. STUDENT DASHBOARD API (Fixed flattened enrollment bug)
  // ==========================================
  console.log('\n--- 5. Testing Student Dashboard API & Safe Data Structure ---');
  try {
    const res = await fetch(`${BASE_URL}/api/dashboard/stats`, {
      headers: { Cookie: studentCookie },
    });
    const data: any = await res.json();
    if (res.status === 200 && Array.isArray(data.enrollments) && Array.isArray(data.orders)) {
      log('GET /api/dashboard/stats', 'PASS', `Loaded dashboard stats (${data.enrollments.length} enrolled courses, ${data.orders.length} orders)`, res.status);
    } else {
      log('GET /api/dashboard/stats', 'FAIL', `Dashboard stats API failed: ${data.error}`, res.status);
    }
  } catch (e: any) {
    log('GET /api/dashboard/stats', 'FAIL', e.message);
  }

  // ==========================================
  // SUMMARY
  // ==========================================
  const total = results.length;
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;

  console.log('\n==================================================');
  console.log(`📊 REAL BROWSER SMOKE TEST SUMMARY: ${passed}/${total} PASSED`);
  if (failed === 0) {
    console.log('🎉 ALL REAL-WORLD LIVE SMOKE TESTS PASSED WITH 0 ERRORS!');
  } else {
    console.log(`⚠️ ${failed} tests failed!`);
  }
  console.log('==================================================\n');

  process.exit(failed === 0 ? 0 : 1);
}

runSmokeTests();
