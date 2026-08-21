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
    {
      title: 'Rumble CPM Method — $100–$500/Day Blueprint',
      slug: 'rumble-cpm-method',
      shortDescription: 'Master the secret Rumble CPM arbitrage method — channel setup, high-earning tricks, CPM boost strategies, and daily $100–$500 automated earnings.',
      description: 'Unlock the ultimate Rumble CPM Method to generate $100 to $500 per day. Learn how to create verified Rumble accounts, upload high-converting viral videos, boost your CPM safely, avoid account suspensions, and withdraw earnings directly to your bank account with 100% working proof.',
      price: 19999, originalPrice: 49999, discount: 60,
      thumbnail: '/images/rumble-cpm-method.jpg',
      previewVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      level: 'All Levels (Beginner to Pro)', category: 'CPM & Video Monetization', badge: 'HOT', duration: '6+ Hours', rating: 5.0, totalStudents: 180,
      requirements: JSON.stringify([
        'A computer or smartphone with internet connection',
        'Willingness to follow the step-by-step daily CPM workflow',
        'No prior video editing or complex tech skills required'
      ]),
      learningOutcomes: JSON.stringify([
        'Complete Rumble account setup & verification guide',
        'Niche selection for highest Rumble CPM ($30 - $80+ CPM)',
        'Secret video uploading & SEO ranking techniques',
        'Advanced CPM Boost methods (100% working & safe)',
        'High earning scaling tricks ($100 - $500 per day)',
        'Live payout withdrawal proof & bank transfer methods'
      ]),
      faqs: JSON.stringify([
        { q: 'Is this method working in 2026?', a: 'Yes! This is a 100% working, updated CPM blueprint tested and verified by Munna Bhai.' },
        { q: 'Do I get direct support from Munna Bhai?', a: 'Yes, full mentorship support and lifetime access to future course updates are included.' },
        { q: 'Can complete beginners start with this?', a: 'Absolutely! We start from complete zero — account creation to receiving your first payout.' }
      ]),
      modules: [
        {
          title: 'Module 1: Rumble Account Architecture & Verification',
          lessons: [
            { title: 'Rumble Platform Overview & Earning Potential', duration: '25m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', isPreview: true },
            { title: 'Creating & Verifying High-Trust Rumble Accounts', duration: '35m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', isPreview: false },
          ],
        },
        {
          title: 'Module 2: High-CPM Niche Selection & Content Strategy',
          lessons: [
            { title: 'Top 5 Highest CPM Niches on Rumble', duration: '40m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', isPreview: false },
            { title: 'Fast Video Creation & Automated Workflow', duration: '45m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', isPreview: false },
          ],
        },
        {
          title: 'Module 3: The Secret CPM Boost Method (Core System)',
          lessons: [
            { title: 'Step-by-Step CPM Boost Implementation', duration: '55m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', isPreview: false },
            { title: 'Safety Protocols & Account Protection Secrets', duration: '40m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4', isPreview: false },
          ],
        },
        {
          title: 'Module 4: Scaling to $100–$500/Day & Direct Bank Payouts',
          lessons: [
            { title: 'Daily Routine & Scaling Multiple Channels', duration: '50m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', isPreview: false },
            { title: 'Payout Setup, Tax Forms & Direct Bank Transfer', duration: '35m', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', isPreview: false },
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
      content: '## 1. High-Income Skills Positioning\n\nTo earn ₹1,00,000 per month, packaging high-ticket client offers is key.\n\n> Munna Bhai\'s Rule: Never sell your time by the hour. Sell guaranteed business outcomes and revenue growth.\n\n## 2. Cold Outreach That Closes\n\n- Step 1: Target verified business owners on LinkedIn and Upwork.\n- Step 2: Send a 60-second Loom audit showing how to fix their funnel.\n- Step 3: Close them on a retainer model.\n\n## 3. Scaling to 6-Figures\n\nBuild recurring client retainers and automate your delivery pipeline.',
      coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop',
      author: 'Munna Bhai', category: 'Freelancing', readTime: '7 min read', isPublished: true,
      seoTitle: 'Earn ₹1 Lakh/Month Freelancing Blueprint (2026) | MAHI SKILLS',
      seoDescription: 'Master the high-income freelance roadmap and land global clients with Munna Bhai.',
    },
    {
      title: 'How to Earn $500 to $2,000/Month from Whop Clipping Campaigns in 2026',
      slug: 'how-to-earn-from-whop-clipping-campaigns',
      excerpt: 'The complete beginner-to-pro guide on finding viral communities, editing high-retention clips, and making passive income with Whop.',
      content: '## 1. What is Whop Clipping?\n\nWhop Clipping is the fastest-growing creator monetization model in 2026. Top digital communities pay content clippers to repurpose long-form podcast and livestream moments into viral short-form reels and TikToks.\n\n> Golden Rule: Your clip must deliver immediate emotional hook in the first 3 seconds, followed by clear subtitle pacing and an urgent call-to-action.\n\n## 2. Finding High-Payout Campaigns\n\n- Join top-tier Whop communities with active clipping reward programs.\n- Research competitor views and average viral RPM rates.\n- Select niches with high audience engagement like trading, business, and fitness.\n\n## 3. Editing for Maximum Virality\n\n- Use CapCut or Premiere Pro with dynamic animated captions.\n- Add sound effects on transition points.\n- Export in 1080x1920 60FPS for crystal-clear mobile viewing.\n\n## 4. Multi-Platform Distribution & Payouts\n\nPublish simultaneously across YouTube Shorts, Instagram Reels, and TikTok to maximize viral reach and earn direct dollar payouts to your bank account.',
      coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1000&auto=format&fit=crop',
      author: 'Munna Bhai', category: 'Whop & Clipping', readTime: '6 min read', isPublished: true,
      seoTitle: 'Whop Clipping Guide 2026: Earn $500-$2000/Month | MAHI SKILLS',
      seoDescription: 'Complete step-by-step blueprint on how to make money clipping videos for Whop communities in 2026 by Munna Bhai.',
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
