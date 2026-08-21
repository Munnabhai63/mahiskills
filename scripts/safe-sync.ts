import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function safeSync() {
  console.log('🔄 Running Safe Master Sync for MAHI SKILLS...');

  // 1. Ensure Admin User
  const adminPasswordHash = await bcrypt.hash('Munabhai@6375', 10);
  await prisma.user.upsert({
    where: { email: 'munachoudhary246@gmail.com' },
    update: {
      role: 'ADMIN',
      name: 'Munna Bhai',
      phone: '+91 9376343629',
    },
    create: {
      name: 'Munna Bhai',
      email: 'munachoudhary246@gmail.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      phone: '+91 9376343629',
      avatar: '/images/munna-bhai-transparent.png',
      bio: 'Founder & Lead Mentor at Mahi Skills.',
    },
  });

  // 2. Ensure Coupons
  const coupons = [
    { code: 'MAHI20', discountType: 'PERCENTAGE', discountValue: 20, minPurchase: 1000, maxDiscount: 2000, isActive: true },
    { code: 'WHOP50', discountType: 'PERCENTAGE', discountValue: 50, minPurchase: 1000, maxDiscount: 5000, isActive: true },
    { code: 'VIP1000', discountType: 'FLAT', discountValue: 1000, minPurchase: 3000, maxDiscount: 1000, isActive: true },
  ];
  for (const cp of coupons) {
    await prisma.coupon.upsert({
      where: { code: cp.code },
      update: cp,
      create: cp,
    });
  }

  // 3. Ensure Courses
  const allCourses = [
    {
      title: 'Instagram Growth Mastery',
      slug: 'instagram-growth-mastery',
      shortDescription: 'Grow your followers, build authority, and monetize your Instagram brand with proven organic strategies.',
      description: 'Master the complete algorithm of Instagram Reels, viral hooks, storytelling, aesthetic feed design, and monetization.',
      price: 4999, originalPrice: 9999, discount: 50,
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
      previewVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      level: 'Beginner to Advanced', category: 'Social Media & Growth', badge: 'Bestseller', duration: '14+ Hours', rating: 4.8, totalStudents: 320,
      requirements: JSON.stringify(['A smartphone with internet', 'An active Instagram account']),
      learningOutcomes: JSON.stringify(['Master Instagram Algorithm', 'Viral Reels Blueprint', 'Monetization']),
      faqs: JSON.stringify([{ q: 'Is this for beginners?', a: 'Yes, full step by step.' }]),
      modules: [
        {
          title: 'Module 1: Instagram Algorithm & Profile Architecture',
          lessons: [
            { title: 'Welcome & Course Roadmap', duration: '8m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', isPreview: true },
            { title: 'Deconstructing the 2026 Instagram Algorithm', duration: '18m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', isPreview: true },
            { title: 'High-Converting Bio & Profile Setup', duration: '14m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', isPreview: false },
          ],
        },
      ],
    },
    {
      title: 'YouTube Growth & Monetization',
      slug: 'youtube-growth-monetization',
      shortDescription: 'Complete step-by-step blueprint to launch, grow on YouTube and build multiple automated income streams.',
      description: 'Unlock high CTR, retention, and monetization beyond AdSense.',
      price: 4999, originalPrice: 11999, discount: 58,
      thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1000&auto=format&fit=crop',
      previewVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      level: 'All Levels', category: 'Video Creation & Monetization', badge: 'Bestseller', duration: '18+ Hours', rating: 4.9, totalStudents: 450,
      requirements: JSON.stringify(['Computer or smartphone for editing']),
      learningOutcomes: JSON.stringify(['Recommendation Algorithm', 'Thumbnail Design', 'Monetization']),
      faqs: JSON.stringify([{ q: 'Do I need expensive gear?', a: 'No, smartphone is enough.' }]),
      modules: [
        {
          title: 'Module 1: YouTube Channel Strategy & Niche Selection',
          lessons: [
            { title: 'The High-CPM Niche Matrix', duration: '15m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', isPreview: true },
          ],
        },
      ],
    },
    {
      title: 'WhatsApp Marketing Mastery',
      slug: 'whatsapp-marketing-mastery',
      shortDescription: 'Learn WhatsApp marketing, automation chatbots, broadcast funnels, and high-converting earning strategies.',
      description: 'Turn WhatsApp into a 24/7 revenue-generating machine with automated bots.',
      price: 3999, originalPrice: 7999, discount: 50,
      thumbnail: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?q=80&w=1000&auto=format&fit=crop',
      previewVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      level: 'Beginner to Intermediate', category: 'Digital Marketing & Sales', badge: 'Bestseller', duration: '10+ Hours', rating: 4.7, totalStudents: 280,
      requirements: JSON.stringify(['WhatsApp Business installed']),
      learningOutcomes: JSON.stringify(['Meta Cloud API', 'Broadcast Campaigns', 'Chatbots']),
      faqs: JSON.stringify([{ q: 'Will my number get banned?', a: 'Anti-ban strategies included.' }]),
      modules: [
        {
          title: 'Module 1: WhatsApp Business Foundation',
          lessons: [
            { title: 'Why WhatsApp has 98% Open Rates', duration: '12m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', isPreview: true },
          ],
        },
      ],
    },
    {
      title: 'Freelancing & Online Earning',
      slug: 'freelancing-online-earning',
      shortDescription: 'Start freelancing, land international clients, and earn online with high-demand digital skills.',
      description: 'The definitive blueprint to building a sustainable, high-income freelancing business.',
      price: 4999, originalPrice: 12999, discount: 61,
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop',
      previewVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
      level: 'All Levels', category: 'Freelancing & Career', badge: 'Bestseller', duration: '16+ Hours', rating: 4.8, totalStudents: 350,
      requirements: JSON.stringify(['Basic English & laptop with internet']),
      learningOutcomes: JSON.stringify(['High-income freelance skills', 'Upwork & LinkedIn closing']),
      faqs: JSON.stringify([{ q: 'How fast can I earn?', a: '21 to 45 days average.' }]),
      modules: [
        {
          title: 'Module 1: High-Income Skill Positioning',
          lessons: [
            { title: 'The Global Freelance Economy Overview', duration: '14m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', isPreview: true },
          ],
        },
      ],
    },
    {
      title: 'Whop Clipping — A-Z Guide',
      slug: 'whop-clipping-campaign-guide',
      shortDescription: 'Step-by-step full course to master Whop Clipping campaigns — from niche research to viral editing and scaling.',
      description: 'Master the high-income skill of Whop Clipping and Content Monetization.',
      price: 9999, originalPrice: 26999, discount: 63,
      thumbnail: '/images/whop-clipping-guide.jpg',
      previewVideo: 'https://drive.google.com/file/d/1nDFm7WJqidz2OshgXM4YR5PLfUV-Rjdw/view?usp=sharing',
      level: 'All Levels (Beginner to Pro)', category: 'Content Clipping & Monetization', badge: 'NEW', duration: '5+ Hours', rating: 4.9, totalStudents: 320,
      requirements: JSON.stringify(['CapCut/Premiere Pro', 'Internet']),
      learningOutcomes: JSON.stringify(['Whop Platform', 'Clip Editing', 'Viral Distribution']),
      faqs: JSON.stringify([{ q: 'Is this for beginners?', a: 'Yes, full A-Z blueprint.' }]),
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

  for (const c of allCourses) {
    const { modules, ...cData } = c;
    const existing = await prisma.course.findUnique({ where: { slug: c.slug } });
    let courseId = existing?.id;

    if (!existing) {
      const created = await prisma.course.create({ data: cData });
      courseId = created.id;
      console.log(`  ➕ Created course: ${c.title}`);

      // Create modules & lessons
      for (let mIdx = 0; mIdx < modules.length; mIdx++) {
        const m = modules[mIdx];
        const mod = await prisma.courseModule.create({
          data: { courseId: created.id, title: m.title, order: mIdx + 1 },
        });
        for (let lIdx = 0; lIdx < m.lessons.length; lIdx++) {
          const l = m.lessons[lIdx];
          await prisma.lesson.create({
            data: {
              moduleId: mod.id,
              title: l.title,
              duration: l.duration,
              videoUrl: l.videoUrl,
              isPreview: l.isPreview,
              order: lIdx + 1,
              description: `Master ${l.title} step-by-step with practical examples.`,
            },
          });
        }
      }
    } else {
      console.log(`  ✓ Course already exists: ${c.title}`);
    }
  }

  // 4. Ensure Blog Posts
  const blogPosts = [
    {
      title: 'How to Gain Your First 10,000 Instagram Followers in 2026',
      slug: 'how-to-gain-first-10000-instagram-followers',
      excerpt: 'Discover the exact 5-step organic growth system to build a loyal audience from scratch.',
      content: '### Introduction\n\nBuilding an audience on Instagram in 2026 requires high-retention hooks and genuine engagement.',
      coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
      author: 'Munna Bhai', category: 'Instagram Growth', readTime: '6 min read', isPublished: true,
      seoTitle: 'How to Gain 10K Instagram Followers in 2026 | Mahi Skills',
      seoDescription: 'Learn the organic growth formula to hit 10,000 followers on Instagram in 2026 by Munna Bhai.',
    },
    {
      title: 'The Ultimate Blueprint to Earning ₹1 Lakh/Month Freelancing',
      slug: 'ultimate-blueprint-earning-1-lakh-month-freelancing',
      excerpt: 'A complete step-by-step roadmap to hitting consistent 6-figure monthly freelance income.',
      content: '### High-Income Skills\n\nTo earn ₹1,00,000 per month, packaging high-ticket client offers is key.',
      coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop',
      author: 'Munna Bhai', category: 'Freelancing', readTime: '7 min read', isPublished: true,
      seoTitle: 'Earn ₹1 Lakh/Month Freelancing Blueprint | Mahi Skills',
      seoDescription: 'Master the high-income freelance roadmap and land global clients with Mahi Skills.',
    },
  ];

  for (const b of blogPosts) {
    const exists = await prisma.blogPost.findUnique({ where: { slug: b.slug } });
    if (!exists) {
      await prisma.blogPost.create({ data: b });
      console.log(`  ➕ Created blog post: ${b.title}`);
    }
  }

  // 5. Ensure Session Availability
  const availCount = await prisma.sessionAvailability.count();
  if (availCount === 0) {
    for (let day = 1; day <= 6; day++) {
      await prisma.sessionAvailability.create({
        data: { dayOfWeek: day, startTime: '11:00', endTime: '19:00', slotDurationMinutes: 60, isActive: true },
      });
    }
    console.log('  ✓ Session availability created (Mon-Sat 11am-7pm)');
  }

  console.log('\n✅ Safe Master Sync Completed Successfully!');
  await prisma.$disconnect();
}

safeSync().catch(console.error);
