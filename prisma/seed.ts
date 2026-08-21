import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding MAHI SKILLS database...');

  // 1. Clean existing records to allow re-seeding
  await prisma.review.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.sessionBooking.deleteMany();
  await prisma.sessionSlot.deleteMany();
  await prisma.sessionAvailability.deleteMany();
  await prisma.blockedDate.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.course.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.user.deleteMany();

  // 2. Users
  const adminPasswordHash = await bcrypt.hash('Munabhai@6375', 10);
  const studentPasswordHash = await bcrypt.hash('Student@123456', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Munna Bhai',
      email: 'munachoudhary246@gmail.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      phone: '+91 9376343629',
      avatar: '/images/munna-bhai-transparent.png',
      bio: 'Founder & Lead Mentor at Mahi Skills. Empowering 100,000+ creators and digital entrepreneurs across India to master practical income-generating skills.',
    },
  });

  const student = await prisma.user.create({
    data: {
      name: 'Aarav Sharma',
      email: 'student@mahiskills.in',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      phone: '+91 98111 22233',
      bio: 'Passionate student learning content creation and freelancing.',
    },
  });

  console.log('✓ Users created: Admin (admin@mahiskills.in) & Student (student@mahiskills.in)');

  // 3. Site Settings
  const settings = [
    { key: 'brand_name', value: 'MAHI SKILLS', group: 'general' },
    { key: 'brand_tagline', value: 'Learn. Grow. Earn.', group: 'general' },
    { key: 'founder_name', value: 'Munna Bhai', group: 'founder' },
    { key: 'founder_title', value: 'Founder, Mahi Skills', group: 'founder' },
    { key: 'founder_bio', value: 'Creator, Entrepreneur & Digital Growth Strategist helping ambitious individuals build digital assets and financial freedom.', group: 'founder' },
    { key: 'founder_image', value: '/images/munna-bhai-founder.jpg', group: 'founder' },
    { key: 'hero_headline_1', value: 'Learn In-Demand Skills.', group: 'hero' },
    { key: 'hero_headline_2', value: 'Build Your Future.', group: 'hero' },
    { key: 'hero_headline_3', value: 'Earn Without Limits.', group: 'hero' },
    { key: 'hero_description', value: 'Practical courses, real-world strategies and step-by-step learning designed to help you build valuable digital skills and create better opportunities.', group: 'hero' },
    { key: 'stat_students', value: '2,500+', group: 'stats' },
    { key: 'stat_courses', value: '25+', group: 'stats' },
    { key: 'stat_community', value: '10K+', group: 'stats' },
    { key: 'stat_rating', value: '4.8/5', group: 'stats' },
    { key: 'session_price', value: '899', group: 'session' },
    { key: 'session_title', value: '1:1 PERSONAL SESSION', group: 'session' },
    { key: 'session_subtitle', value: 'Get personal guidance directly from Munna Bhai.', group: 'session' },
    { key: 'session_description', value: 'Clear your doubts, get personalized strategies and create a focused action plan for your goals.', group: 'session' },
    { key: 'contact_email', value: 'mahiverse.hub@gmail.com', group: 'general' },
    { key: 'contact_phone', value: '+91 9376343629', group: 'general' },
    { key: 'social_youtube', value: 'https://youtube.com/@munnabhai7-h3l?si=HBdlfyDrZFAi4jPV', group: 'social' },
    { key: 'social_instagram', value: 'https://www.instagram.com/mahiveres?igsh=aXE0c2dpMDZrbDli', group: 'social' },
    { key: 'social_facebook', value: 'https://www.facebook.com/share/1AUnSCSi7X/', group: 'social' },
    { key: 'social_linkedin', value: 'https://www.linkedin.com/in/mahipal-choudhary-153ba83b1?utm_source=share_via&utm_content=member_android', group: 'social' },
    { key: 'social_pinterest', value: 'https://pin.it/3fhtaOAsI', group: 'social' },
    { key: 'social_telegram', value: 'https://t.me/mahiskills', group: 'social' },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.create({ data: setting });
  }

  // 4. Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'MAHI20',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        minPurchase: 1000,
        maxDiscount: 2000,
        usageLimit: 500,
        usedCount: 42,
        isActive: true,
      },
      {
        code: 'WELCOME500',
        discountType: 'FIXED',
        discountValue: 500,
        minPurchase: 2000,
        usageLimit: 1000,
        usedCount: 118,
        isActive: true,
      },
      {
        code: 'EARN50',
        discountType: 'PERCENTAGE',
        discountValue: 50,
        minPurchase: 3000,
        maxDiscount: 3000,
        usageLimit: 100,
        usedCount: 88,
        isActive: true,
      },
    ],
  });

  // 5. Courses & Modules & Lessons
  const coursesData = [
    {
      title: 'Instagram Growth Mastery',
      slug: 'instagram-growth-mastery',
      shortDescription: 'Grow your followers, build authority, and monetize your Instagram brand with proven organic strategies.',
      description: 'Master the complete algorithm of Instagram Reels, viral hooks, storytelling, aesthetic feed design, and monetization. Learn how to convert followers into paying customers, attract lucrative brand sponsorships, and build a high-income personal brand.',
      price: 4999,
      originalPrice: 9999,
      discount: 50,
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
      previewVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      level: 'Beginner to Advanced',
      category: 'Social Media & Growth',
      badge: 'Bestseller',
      duration: '14+ Hours',
      rating: 4.8,
      totalStudents: 320,
      requirements: JSON.stringify([
        'A smartphone or laptop with an internet connection',
        'An active Instagram account',
        'Willingness to apply daily action steps',
      ]),
      learningOutcomes: JSON.stringify([
        'Master the 2026 Instagram Algorithm and Reels virality blueprint',
        'Write magnetic hooks and craft high-retention 30-second scripts',
        'Optimize your bio, profile aesthetics, and sales funnel',
        'Close high-ticket brand sponsorships and affiliate deals',
        'Automate DM lead generation and sales conversations',
      ]),
      faqs: JSON.stringify([
        { q: 'Is this course suitable for complete beginners?', a: 'Yes! We start from fundamental profile optimization and progress to advanced virality mechanics and monetization.' },
        { q: 'Do I get lifetime access and future updates?', a: 'Yes, you get full lifetime access to all lessons and all future course updates for free.' },
        { q: 'Will I get a certificate upon completion?', a: 'Yes, an authentic verifiable certificate of completion is unlocked once all modules are completed.' },
      ]),
      modules: [
        {
          title: 'Module 1: Instagram Algorithm & Profile Architecture',
          lessons: [
            { title: 'Welcome & Course Roadmap', duration: '8m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', isPreview: true },
            { title: 'Deconstructing the 2026 Instagram Algorithm', duration: '18m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', isPreview: true },
            { title: 'High-Converting Bio & Profile Setup', duration: '14m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', isPreview: false },
          ],
        },
        {
          title: 'Module 2: Viral Reels Creation & Scripting',
          lessons: [
            { title: 'The 3-Second Hook Framework', duration: '22m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', isPreview: false },
            { title: 'Editing Fast-Paced Engaging Reels on CapCut', duration: '30m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', isPreview: false },
            { title: 'Audio Trends & Virality Timing', duration: '16m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4', isPreview: false },
          ],
        },
        {
          title: 'Module 3: Monetization, Brand Deals & DM Sales',
          lessons: [
            { title: 'Pitching Brands & Negotiation Templates', duration: '25m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', isPreview: false },
            { title: 'Setting Up ManyChat Automated Sales Funnels', duration: '28m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', isPreview: false },
            { title: 'Launching Your First Digital Product', duration: '35m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4', isPreview: false },
          ],
        },
      ],
    },
    {
      title: 'YouTube Growth & Monetization',
      slug: 'youtube-growth-monetization',
      shortDescription: 'Complete step-by-step blueprint to launch, grow on YouTube and build multiple automated income streams.',
      description: 'Unlock the real secrets behind high Click-Through Rates (CTR), Audience Retention, cinematic editing techniques, and monetization beyond AdSense. Discover how top creators generate consistent 6-figure incomes using sponsorships, merchandise, and high-ticket consulting.',
      price: 4999,
      originalPrice: 11999,
      discount: 58,
      thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1000&auto=format&fit=crop',
      previewVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      level: 'All Levels',
      category: 'Video Creation & Monetization',
      badge: 'Bestseller',
      duration: '18+ Hours',
      rating: 4.9,
      totalStudents: 450,
      requirements: JSON.stringify([
        'Computer or smartphone for video recording/editing',
        'Basic video editing software (Premiere Pro, DaVinci, or CapCut)',
        'Dedication to upload consistently',
      ]),
      learningOutcomes: JSON.stringify([
        'Master the YouTube Recommendation Algorithm',
        'Design 15%+ CTR Clickable Thumbnails that grab attention',
        'Script engaging video hooks that keep retention above 60%',
        'Rank videos with modern YouTube SEO and search intent',
        'Monetize with brand sponsorships, affiliate marketing, and course sales',
      ]),
      faqs: JSON.stringify([
        { q: 'Do I need expensive camera gear?', a: 'No, more than 80% of successful creators start with just a smartphone and natural lighting.' },
        { q: 'Can I grow a faceless YouTube channel?', a: 'Yes, module 4 covers faceless channel creation using AI voiceovers and stock footage.' },
      ]),
      modules: [
        {
          title: 'Module 1: YouTube Channel Strategy & Niche Selection',
          lessons: [
            { title: 'The High-CPM Niche Matrix', duration: '15m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', isPreview: true },
            { title: 'Channel Branding & Visual Identity', duration: '20m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', isPreview: true },
          ],
        },
        {
          title: 'Module 2: High-Retention Scripting & Production',
          lessons: [
            { title: 'The 4-Part Script Formula', duration: '24m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4', isPreview: false },
            { title: 'Mastering Thumbnail Psychology & Photoshop', duration: '32m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', isPreview: false },
          ],
        },
        {
          title: 'Module 3: Advanced Monetization & Scaling',
          lessons: [
            { title: 'Sponsorship Pitch Decks & Contracts', duration: '27m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', isPreview: false },
            { title: 'Building a 6-Figure Backend Funnel', duration: '35m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', isPreview: false },
          ],
        },
      ],
    },
    {
      title: 'WhatsApp Marketing Mastery',
      slug: 'whatsapp-marketing-mastery',
      shortDescription: 'Learn WhatsApp marketing, automation chatbots, broadcast funnels, and high-converting earning strategies.',
      description: 'Turn WhatsApp into a 24/7 revenue-generating machine. Master WhatsApp Business API, official green tick verification, bulk broadcast compliance, interactive chatbot automation, and closing high-ticket deals on chat.',
      price: 3999,
      originalPrice: 7999,
      discount: 50,
      thumbnail: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?q=80&w=1000&auto=format&fit=crop',
      previewVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      level: 'Beginner to Intermediate',
      category: 'Digital Marketing & Sales',
      badge: 'Bestseller',
      duration: '10+ Hours',
      rating: 4.7,
      totalStudents: 280,
      requirements: JSON.stringify([
        'WhatsApp Business app installed',
        'Basic business product, service, or affiliate offer',
      ]),
      learningOutcomes: JSON.stringify([
        'Set up and configure WhatsApp Business API and automated bots',
        'Build targeted contact lists with opt-in landing pages',
        'Create high-converting broadcast campaigns with 95%+ open rates',
        'Prevent number banning with compliance protocols',
        'Automate lead qualification and payment collection',
      ]),
      faqs: JSON.stringify([
        { q: 'Will my WhatsApp number get banned?', a: 'We teach strict anti-ban strategies, opt-in methods, and official Cloud API integration.' },
      ]),
      modules: [
        {
          title: 'Module 1: WhatsApp Business Foundation',
          lessons: [
            { title: 'Why WhatsApp has 98% Open Rates', duration: '12m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', isPreview: true },
            { title: 'Catalogue, Quick Replies & Labels Setup', duration: '18m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4', isPreview: true },
          ],
        },
        {
          title: 'Module 2: WhatsApp Chatbots & Meta Cloud API',
          lessons: [
            { title: 'Integrating Meta Cloud API Step-by-Step', duration: '25m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', isPreview: false },
            { title: 'Building Interactive Chatbot Flows', duration: '30m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', isPreview: false },
          ],
        },
      ],
    },
    {
      title: 'Freelancing & Online Earning',
      slug: 'freelancing-online-earning',
      shortDescription: 'Start freelancing, land international clients, and earn online with high-demand digital skills.',
      description: 'The definitive blueprint to building a sustainable, high-income freelancing business. Learn how to package your digital skills, optimize Upwork & LinkedIn profiles, pitch premium international clients, and scale into a boutique agency.',
      price: 4999,
      originalPrice: 12999,
      discount: 61,
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop',
      previewVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
      level: 'All Levels',
      category: 'Freelancing & Career',
      badge: 'Bestseller',
      duration: '16+ Hours',
      rating: 4.8,
      totalStudents: 350,
      requirements: JSON.stringify([
        'Basic English communication skills',
        'Laptop or computer with internet',
        'Determination to pitch daily for 30 days',
      ]),
      learningOutcomes: JSON.stringify([
        'Identify high-paying international freelance skill niches',
        'Create 100% winning Upwork and LinkedIn client acquisition profiles',
        'Write high-response cold emails and direct proposals',
        'Price projects in USD and receive global payments securely',
        'Scale from solo freelancer to a boutique agency model',
      ]),
      faqs: JSON.stringify([
        { q: 'How long until I land my first paying client?', a: 'Students following the daily 5-pitch action plan typically land their first client within 21 to 45 days.' },
      ]),
      modules: [
        {
          title: 'Module 1: High-Income Skill Positioning',
          lessons: [
            { title: 'The Global Freelance Economy Overview', duration: '14m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', isPreview: true },
            { title: 'Creating an Irresistible Portfolio that Sells', duration: '22m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', isPreview: true },
          ],
        },
        {
          title: 'Module 2: Client Acquisition & Proposal Mastery',
          lessons: [
            { title: 'The Upwork Top-Rated Proposal Formula', duration: '28m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4', isPreview: false },
            { title: 'LinkedIn Outreach & B2B Client Closing', duration: '26m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', isPreview: false },
          ],
        },
      ],
    },
    {
      title: 'Whop Clipping — A-Z Guide',
      slug: 'whop-clipping-campaign-guide',
      shortDescription: 'Step-by-step full course to master Whop Clipping campaigns — from niche research to viral editing and scaling.',
      description: 'Master the high-income skill of Whop Clipping and Content Monetization. Learn how to identify winning creator campaigns, extract viral moments, edit high-retention clips using CapCut & Premiere Pro, distribute across YouTube Shorts, TikTok & Instagram Reels, and optimize your submissions for maximum payout.',
      price: 9999,
      originalPrice: 26999,
      discount: 63,
      thumbnail: '/images/whop-clipping-guide.jpg',
      previewVideo: 'https://drive.google.com/file/d/1nDFm7WJqidz2OshgXM4YR5PLfUV-Rjdw/view?usp=sharing',
      level: 'All Levels (Beginner to Pro)',
      category: 'Content Clipping & Monetization',
      badge: 'NEW',
      duration: '5+ Hours',
      rating: 4.9,
      totalStudents: 320,
      requirements: JSON.stringify([
        'A computer or smartphone with video editing software (CapCut / Premiere Pro)',
        'An active internet connection',
        'Basic understanding of social media platforms (YouTube Shorts, Reels, TikTok)',
        'Consistency and willingness to follow the daily clipping blueprint',
      ]),
      learningOutcomes: JSON.stringify([
        'Master the Whop platform ecosystem and find high-payout clipping campaigns',
        'Conduct deep competitor analysis and identify viral content trends',
        'Master professional clip editing, pacing, sound design, and text animations',
        'Design high-CTR click-worthy covers and write viral captions',
        'Distribute clips simultaneously across Shorts, Reels, and TikTok without shadowbans',
        'Review analytics, optimize hook retention rate, and scale monthly clipping income',
      ]),
      faqs: JSON.stringify([
        { q: 'Is this course suitable for complete beginners?', a: 'Yes! We start from complete basics of Whop account setup and progress to advanced multi-platform distribution and scaling.' },
        { q: 'Do I get lifetime access and updates?', a: 'Yes, you get full lifetime access to all 4 modules, 6 video masterclasses, and future updates.' },
        { q: 'Will I receive a verified certificate upon completion?', a: 'Yes, once you complete all lessons, your verifiable certificate signed by Munna Bhai will be generated.' },
      ]),
      modules: [
        {
          title: 'Module 1: Niche Selection & Research',
          lessons: [
            { title: 'Whop Platform Introduction & Niche Finding', duration: '45m', videoUrl: 'https://drive.google.com/file/d/1nDFm7WJqidz2OshgXM4YR5PLfUV-Rjdw/view?usp=sharing', isPreview: true },
            { title: 'Competitor Analysis & Market Research', duration: '55m', videoUrl: 'https://drive.google.com/file/d/1w_4eMfLHLbAlmtEyOhWKO47HKbOXVarX/view?usp=sharing', isPreview: false },
          ],
        },
        {
          title: 'Module 2: Professional Clip Editing',
          lessons: [
            { title: 'Editing Tools & Clip Selection Masterclass', duration: '50m', videoUrl: 'https://drive.google.com/file/d/1wEZDsm03xAF3Z8MHa8gLuj5YzaLmXqTH/view?usp=sharing', isPreview: false },
            { title: 'Captions, Effects & Professional Finishing', duration: '55m', videoUrl: 'https://drive.google.com/file/d/1Rn6Rm2bOTIAHNc16dxD6D4rLlxgLDLsY/view?usp=sharing', isPreview: false },
          ],
        },
        {
          title: 'Module 3: Multi-Platform Upload & Distribution',
          lessons: [
            { title: 'Upload Strategy — YouTube Shorts, TikTok & Reels', duration: '40m', videoUrl: 'https://drive.google.com/file/d/14Ljzjl04mwGbvBML18qYNPpSQV2JeyLD/view?usp=sharing', isPreview: false },
          ],
        },
        {
          title: 'Module 4: Campaign Review & Scaling',
          lessons: [
            { title: 'Campaign Review, Optimization & 30-Day Action Plan', duration: '60m', videoUrl: 'https://drive.google.com/file/d/172f5Yfz2QHywWaEEcAS8tjKawMnGXqjn/view?usp=sharing', isPreview: false },
          ],
        },
      ],
    },
  ];

  for (const cData of coursesData) {
    const { modules, ...courseFields } = cData;
    const course = await prisma.course.create({
      data: courseFields,
    });

    for (let mIdx = 0; mIdx < modules.length; mIdx++) {
      const m = modules[mIdx];
      const createdModule = await prisma.courseModule.create({
        data: {
          courseId: course.id,
          title: m.title,
          order: mIdx + 1,
        },
      });

      for (let lIdx = 0; lIdx < m.lessons.length; lIdx++) {
        const l = m.lessons[lIdx];
        await prisma.lesson.create({
          data: {
            moduleId: createdModule.id,
            title: l.title,
            duration: l.duration,
            videoUrl: l.videoUrl,
            isPreview: l.isPreview,
            order: lIdx + 1,
            description: `In this practical lesson, you will master ${l.title} with actionable steps and downloadable resources.`,
            resources: JSON.stringify([
              { title: 'Action Checklist (PDF)', url: '#', type: 'pdf' },
              { title: 'Notion Template & Cheatsheet', url: '#', type: 'link' },
            ]),
          },
        });
      }
    }

    // Add sample reviews for this course
    await prisma.review.createMany({
      data: [
        {
          userId: student.id,
          courseId: course.id,
          rating: 5,
          comment: `This course completely transformed my approach! Munna Bhai explains concepts with such crystal clarity and real practical examples. Highly recommended to everyone!`,
          isApproved: true,
        },
      ],
    });
  }

  console.log('✓ Courses, Modules & Lessons created');

  // 6. Enroll student in Instagram Growth Mastery & create sample progress
  const igCourse = await prisma.course.findUnique({ where: { slug: 'instagram-growth-mastery' } });
  if (igCourse) {
    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: igCourse.id,
        progressPercent: 45.0,
      },
    });

    // Mark first 3 lessons as completed
    const igLessons = await prisma.lesson.findMany({
      where: { module: { courseId: igCourse.id } },
      take: 3,
    });

    for (const l of igLessons) {
      await prisma.lessonProgress.create({
        data: {
          userId: student.id,
          lessonId: l.id,
          isCompleted: true,
          completedAt: new Date(),
        },
      });
    }

    // Create completed order for student
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-001`,
        userId: student.id,
        courseId: igCourse.id,
        itemType: 'COURSE',
        amount: 4999,
        originalAmount: 9999,
        discountAmount: 5000,
        status: 'PAID',
        paymentMethod: 'UPI',
        razorpayOrderId: 'order_demo_1001',
        razorpayPaymentId: 'pay_demo_1001',
      },
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        gateway: 'RAZORPAY',
        transactionId: 'txn_demo_1001',
        status: 'SUCCESS',
      },
    });
  }

  // 7. 1:1 Session Availability (Monday to Saturday, 11 AM - 7 PM)
  for (let day = 1; day <= 6; day++) {
    await prisma.sessionAvailability.create({
      data: {
        dayOfWeek: day,
        startTime: '11:00',
        endTime: '19:00',
        slotDurationMinutes: 60,
        isActive: true,
      },
    });
  }

  // Seed sample session booking
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  await prisma.sessionBooking.create({
    data: {
      bookingNumber: `SES-${Date.now()}-899`,
      userId: student.id,
      studentName: 'Aarav Sharma',
      studentEmail: 'student@mahiskills.in',
      studentPhone: '+91 98111 22233',
      bookingDate: tomorrowStr,
      startTime: '04:00 PM',
      endTime: '05:00 PM',
      topic: 'Instagram Monetization & Brand Strategy Consultation',
      notes: 'Need direct guidance on closing high-ticket brand sponsorships.',
      status: 'CONFIRMED',
      meetingLink: 'https://meet.google.com/mahiskills-mentor',
      amount: 899,
      razorpayOrderId: 'order_demo_session_1',
      razorpayPaymentId: 'pay_demo_session_1',
    },
  });

  // 8. Sample Certificate
  if (igCourse) {
    await prisma.certificate.create({
      data: {
        certificateNumber: `MS-CERT-2026-IG-0042`,
        userId: student.id,
        courseId: igCourse.id,
        studentName: 'Aarav Sharma',
        courseName: igCourse.title,
        instructorName: 'Munna Bhai',
        verificationUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mahiskills.in'}/verify-certificate/MS-CERT-2026-IG-0042`,
      },
    });
  }

  // 9. Blog Posts
  await prisma.blogPost.createMany({
    data: [
      {
        title: 'How to Gain Your First 10,000 Instagram Followers in 2026',
        slug: 'how-to-gain-first-10000-instagram-followers',
        excerpt: 'Discover the exact 5-step organic growth system to build a loyal, high-converting Instagram audience from scratch without spending money on ads.',
        content: `### Introduction\n\nBuilding an audience on Instagram in 2026 is no longer about random hashtag stuffing or follow-unfollow loops. It requires algorithmic alignment, high-retention video hooks, and genuine audience engagement.\n\n### 1. The 3-Second Hook Rule\nEvery viral reel succeeds or fails within the first 3 seconds. Use high-contrast text overlays, intriguing question hooks, and pattern interruptions.\n\n### 2. Micro-Niche Authority\nFocus on solving one specific problem for one specific audience. When viewers visit your profile, your bio must explain what you teach within 5 seconds.\n\n### 3. DM Sales Funnels\nUse automated keywords to deliver lead magnets directly in your DMs. This triggers Instagram's engagement signals and converts followers into email/WhatsApp subscribers.\n\n### Conclusion\nConsistency with clear intent beats sporadic motivation. Follow the Mahi Skills framework and stay committed for 90 days.`,
        coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
        author: 'Munna Bhai',
        category: 'Instagram Growth',
        tags: JSON.stringify(['Instagram', 'Organic Growth', 'Reels Virality', 'Social Media']),
        readTime: '6 min read',
        isPublished: true,
        seoTitle: 'How to Gain 10K Instagram Followers in 2026 | Mahi Skills',
        seoDescription: 'Learn the organic growth formula to hit 10,000 followers on Instagram in 2026 by Munna Bhai.',
      },
      {
        title: 'The Ultimate Blueprint to Earning ₹1 Lakh/Month Freelancing',
        slug: 'ultimate-blueprint-earning-1-lakh-month-freelancing',
        excerpt: 'A complete step-by-step roadmap to packaging your digital skills, pitching international clients, and hitting consistent 6-figure monthly freelance income.',
        content: `### The Shift to High-Income Skills\n\nTo earn ₹1,00,000 per month, you don't need 100 clients paying ₹1,000. You need 2 to 3 premium clients paying ₹35,000 to ₹50,000 each month.\n\n### 1. Packaging Offers That Solve Expensive Problems\nInstead of offering "video editing", offer "YouTube Audience Retention Optimization that increases view duration by 40%".\n\n### 2. Global Client Acquisition\nPitch clients in the US, UK, Australia, and UAE via LinkedIn and customized video proposals on Loom.\n\n### 3. The 30-Day Pitching Sprint\nSend 5 personalized, high-value pitches daily. In 30 days, 150 targeted pitches will generate 10 to 15 discovery calls and 2 to 4 closed retainers.\n\n### Final Thoughts\nSkill + Distribution + Relentless Pitching = Predictable Freelance Success.`,
        coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop',
        author: 'Munna Bhai',
        category: 'Freelancing',
        tags: JSON.stringify(['Freelancing', 'Online Earning', 'Upwork', 'Client Acquisition']),
        readTime: '7 min read',
        isPublished: true,
        seoTitle: 'Earn ₹1 Lakh/Month Freelancing Blueprint | Mahi Skills',
        seoDescription: 'Master the high-income freelance roadmap and land global clients with Mahi Skills.',
      },
      {
        title: 'Why WhatsApp Marketing Outperforms Traditional Email in India',
        slug: 'why-whatsapp-marketing-outperforms-email-india',
        excerpt: 'With 98% open rates and instant 2-way conversations, learn how smart brands and creators are generating 10x ROI with WhatsApp Business API.',
        content: `### The Indian Consumer Landscape\n\nIn India, WhatsApp is the operating system of daily life. While email open rates linger around 15-20%, WhatsApp messages achieve 95%+ open rates within 15 minutes of sending.\n\n### 1. 2-Way Interactive Commerce\nUnlike static emails, WhatsApp enables dynamic quick-reply buttons, interactive catalogues, and one-click UPI checkout.\n\n### 2. Conversational Selling\nLeads who enter a WhatsApp chatbot convert at 3x higher rates because the friction of form fills is completely removed.\n\n### 3. Compliance and Trust\nUsing Meta Cloud API and verified green tick badges establishes instant trust for new brands.`,
        coverImage: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?q=80&w=1000&auto=format&fit=crop',
        author: 'Munna Bhai',
        category: 'WhatsApp Marketing',
        tags: JSON.stringify(['WhatsApp', 'Marketing', 'Automation', 'Sales Funnel']),
        readTime: '5 min read',
        isPublished: true,
        seoTitle: 'WhatsApp Marketing vs Email in India | Mahi Skills',
        seoDescription: 'Learn why WhatsApp marketing is the #1 growth channel in India with 98% open rates.',
      },
    ],
  });

  // 10. Contact Message Sample
  await prisma.contactMessage.create({
    data: {
      name: 'Rohan Gupta',
      email: 'rohan.gupta@example.com',
      phone: '+91 9376343629',
      subject: 'Inquiry about 1:1 Corporate Mentorship',
      message: 'Hi Munna Bhai, I run a digital agency with 6 creators and want to book a group mentorship training session for our team.',
      isRead: false,
    },
  });

  console.log('✅ MAHI SKILLS database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
