import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addWhopClippingCourse() {
  console.log('🚀 Adding Whop Clipping A-Z Campaign Guide Course...\n');

  // Check if course already exists
  const existing = await prisma.course.findUnique({ where: { slug: 'whop-clipping-campaign-guide' } });
  if (existing) {
    console.log('⚠️ Course already exists! Deleting old one to recreate...');
    await prisma.lesson.deleteMany({ where: { module: { courseId: existing.id } } });
    await prisma.courseModule.deleteMany({ where: { courseId: existing.id } });
    await prisma.course.delete({ where: { id: existing.id } });
  }

  // 1. Create the Course
  const course = await prisma.course.create({
    data: {
      title: 'Whop Clipping — A-Z Campaign Guide',
      slug: 'whop-clipping-campaign-guide',
      shortDescription: 'Step-by-step full course to master Whop Clipping campaigns — from niche selection to editing, multi-platform upload, and campaign review for maximum earnings.',
      description: 'Unlock the complete Whop Clipping A-Z Campaign Blueprint. Learn how to find the most profitable niches, master professional clip editing techniques, upload & distribute content across all major platforms (YouTube, TikTok, Instagram Reels, Shorts), and review/optimize your campaigns for maximum revenue. This practical course covers every step with real-world examples, proven strategies, and actionable templates to help you scale your Whop clipping business from zero to consistent income.',
      price: 1999,
      originalPrice: 4999,
      discount: 60,
      thumbnail: '/images/whop-clipping-guide.jpg',
      previewVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      level: 'Beginner to Advanced',
      category: 'Content Clipping & Monetization',
      badge: 'NEW',
      instructor: 'Munna Bhai',
      duration: '12+ Hours',
      rating: 4.9,
      totalStudents: 0,
      published: true,
      requirements: JSON.stringify([
        'A laptop or smartphone with internet connection',
        'Basic understanding of video content (no editing experience needed)',
        'Willingness to learn and take action daily',
        'A free Whop account (we will guide you to set it up)',
      ]),
      learningOutcomes: JSON.stringify([
        'Master the complete Whop Clipping business model from A to Z',
        'Find highly profitable niches with low competition and high demand',
        'Edit professional, high-retention clips using free tools (CapCut, DaVinci)',
        'Upload and distribute clips across YouTube Shorts, TikTok, Instagram Reels & more',
        'Run, review, and optimize ad campaigns for maximum ROI',
        'Scale your clipping business to consistent monthly income',
        'Build a portfolio of viral clips that generate passive revenue',
      ]),
      faqs: JSON.stringify([
        { q: 'Kya ye course bilkul beginners ke liye hai?', a: 'Haan! Hum Step 1 se shuru karte hain — niche selection se lekar campaign review tak, sab step-by-step sikhaya jayega.' },
        { q: 'Kya mujhe paid tools chahiye?', a: 'Nahi! Saare editing tools free hain (CapCut, DaVinci Resolve). Sirf internet aur ek laptop/phone chahiye.' },
        { q: 'Course complete karne par certificate milega?', a: 'Haan, ek verified digital certificate milega jo aap LinkedIn aur resume par use kar sakte hain.' },
        { q: 'Kitna time lagega seekhne mein?', a: 'Course 12+ hours ka hai, lekin aap apni speed se karein. Lifetime access milega, koi deadline nahi.' },
        { q: 'Kya ye Whop platform pe paisa kamane mein madad karega?', a: 'Bilkul! Ye course specifically Whop clipping campaigns ke through income generate karna sikhata hai with practical strategies.' },
      ]),
    },
  });

  console.log(`✅ Course created: "${course.title}" (ID: ${course.id})`);

  // 2. Create Modules & Lessons

  // --- Module 1: Niche Selection & Research ---
  const mod1 = await prisma.courseModule.create({
    data: {
      courseId: course.id,
      title: 'Module 1: Niche Selection & Market Research',
      order: 1,
    },
  });

  const mod1Lessons = [
    { title: 'Welcome & Course Roadmap — Kya Sikhenge?', duration: '8m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', isPreview: true },
    { title: 'Whop Platform Introduction — Kaise Kaam Karta Hai?', duration: '12m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', isPreview: true },
    { title: 'High-Profit Niche Finding — Secret Research Method', duration: '22m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', isPreview: false },
    { title: 'Competitor Analysis & Trend Spotting', duration: '18m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', isPreview: false },
    { title: 'Niche Validation — Demand vs Competition Matrix', duration: '15m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', isPreview: false },
  ];

  for (let i = 0; i < mod1Lessons.length; i++) {
    await prisma.lesson.create({
      data: { moduleId: mod1.id, ...mod1Lessons[i], order: i + 1 },
    });
  }
  console.log(`  📦 Module 1 created with ${mod1Lessons.length} lessons`);

  // --- Module 2: Professional Clip Editing ---
  const mod2 = await prisma.courseModule.create({
    data: {
      courseId: course.id,
      title: 'Module 2: Professional Clip Editing Masterclass',
      order: 2,
    },
  });

  const mod2Lessons = [
    { title: 'Editing Tools Setup — CapCut & DaVinci (Free)', duration: '14m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', isPreview: false },
    { title: 'Clip Selection — Kaise Viral Moments Choose Karein', duration: '20m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', isPreview: false },
    { title: 'Hook Creation — First 3 Seconds Ka Magic', duration: '18m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', isPreview: false },
    { title: 'Captions, Subtitles & Text Animations', duration: '25m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4', isPreview: false },
    { title: 'Sound Design, Music & Audio Enhancement', duration: '16m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', isPreview: false },
    { title: 'Transitions, Effects & Professional Finishing', duration: '22m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4', isPreview: false },
  ];

  for (let i = 0; i < mod2Lessons.length; i++) {
    await prisma.lesson.create({
      data: { moduleId: mod2.id, ...mod2Lessons[i], order: i + 1 },
    });
  }
  console.log(`  📦 Module 2 created with ${mod2Lessons.length} lessons`);

  // --- Module 3: Multi-Platform Upload & Distribution ---
  const mod3 = await prisma.courseModule.create({
    data: {
      courseId: course.id,
      title: 'Module 3: Upload & Multi-Platform Distribution',
      order: 3,
    },
  });

  const mod3Lessons = [
    { title: 'Platform Strategy — YouTube Shorts vs TikTok vs Reels', duration: '15m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', isPreview: false },
    { title: 'YouTube Shorts Upload & SEO Optimization', duration: '20m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', isPreview: false },
    { title: 'TikTok Upload, Hashtags & Viral Triggers', duration: '18m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', isPreview: false },
    { title: 'Instagram Reels — Maximum Reach Strategy', duration: '16m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', isPreview: false },
    { title: 'Scheduling & Batch Upload Automation Tools', duration: '12m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', isPreview: false },
  ];

  for (let i = 0; i < mod3Lessons.length; i++) {
    await prisma.lesson.create({
      data: { moduleId: mod3.id, ...mod3Lessons[i], order: i + 1 },
    });
  }
  console.log(`  📦 Module 3 created with ${mod3Lessons.length} lessons`);

  // --- Module 4: Campaign Review, Optimization & Scaling ---
  const mod4 = await prisma.courseModule.create({
    data: {
      courseId: course.id,
      title: 'Module 4: Campaign Review, Optimization & Scaling',
      order: 4,
    },
  });

  const mod4Lessons = [
    { title: 'Analytics Dashboard — Kya Numbers Dekhne Hain?', duration: '15m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', isPreview: false },
    { title: 'A/B Testing — Clips Ko Optimize Kaise Karein', duration: '20m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', isPreview: false },
    { title: 'Revenue Tracking & Earnings Maximization', duration: '18m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4', isPreview: false },
    { title: 'Scaling Strategy — Team Building & Outsourcing', duration: '22m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', isPreview: false },
    { title: 'Final Blueprint — 30-Day Action Plan to ₹50K/Month', duration: '28m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4', isPreview: false },
  ];

  for (let i = 0; i < mod4Lessons.length; i++) {
    await prisma.lesson.create({
      data: { moduleId: mod4.id, ...mod4Lessons[i], order: i + 1 },
    });
  }
  console.log(`  📦 Module 4 created with ${mod4Lessons.length} lessons`);

  // Final Summary
  const totalLessons = mod1Lessons.length + mod2Lessons.length + mod3Lessons.length + mod4Lessons.length;
  console.log(`\n🎉 SUCCESS! Whop Clipping Course fully created!`);
  console.log(`   📚 4 Modules, ${totalLessons} Lessons`);
  console.log(`   💰 Price: ₹1,999 (Original: ₹4,999 — 60% OFF)`);
  console.log(`   🖼️  Thumbnail: /images/whop-clipping-guide.jpg`);
  console.log(`   🔗 URL: /courses/whop-clipping-campaign-guide\n`);

  await prisma.$disconnect();
}

addWhopClippingCourse().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
