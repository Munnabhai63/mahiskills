import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateWhopVideos() {
  console.log('🎬 Updating Whop Clipping course lessons with real Google Drive videos...\n');

  // Find the Whop Clipping course
  const course = await prisma.course.findUnique({
    where: { slug: 'whop-clipping-campaign-guide' },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: { orderBy: { order: 'asc' } },
        },
      },
    },
  });

  if (!course) {
    console.log('❌ Course not found!');
    process.exit(1);
  }

  // Google Drive video links (user provided)
  const driveLinks = [
    'https://drive.google.com/file/d/1nDFm7WJqidz2OshgXM4YR5PLfUV-Rjdw/view?usp=sharing',
    'https://drive.google.com/file/d/1w_4eMfLHLbAlmtEyOhWKO47HKbOXVarX/view?usp=sharing',
    'https://drive.google.com/file/d/1wEZDsm03xAF3Z8MHa8gLuj5YzaLmXqTH/view?usp=sharing',
    'https://drive.google.com/file/d/1Rn6Rm2bOTIAHNc16dxD6D4rLlxgLDLsY/view?usp=sharing',
    'https://drive.google.com/file/d/14Ljzjl04mwGbvBML18qYNPpSQV2JeyLD/view?usp=sharing',
    'https://drive.google.com/file/d/172f5Yfz2QHywWaEEcAS8tjKawMnGXqjn/view?usp=sharing',
  ];

  // Delete all existing modules and lessons, recreate with 6 lessons mapped to 4 modules
  // Module 1: Video 1, 2 (Niche & Intro)
  // Module 2: Video 3, 4 (Editing)
  // Module 3: Video 5 (Upload)
  // Module 4: Video 6 (Review & Scaling)

  // First delete existing lessons and modules
  for (const mod of course.modules) {
    await prisma.lesson.deleteMany({ where: { moduleId: mod.id } });
  }
  await prisma.courseModule.deleteMany({ where: { courseId: course.id } });

  console.log('  🗑️  Cleared old modules & lessons');

  // Module 1: Niche Selection & Research
  const mod1 = await prisma.courseModule.create({
    data: { courseId: course.id, title: 'Module 1: Niche Selection & Research', order: 1 },
  });
  await prisma.lesson.create({
    data: {
      moduleId: mod1.id, order: 1,
      title: 'Whop Platform Introduction & Niche Finding',
      videoUrl: driveLinks[0],
      duration: '45m', isPreview: true,
    },
  });
  await prisma.lesson.create({
    data: {
      moduleId: mod1.id, order: 2,
      title: 'Competitor Analysis & Market Research',
      videoUrl: driveLinks[1],
      duration: '55m', isPreview: false,
    },
  });
  console.log('  ✅ Module 1 created — 2 lessons (Video 1 & 2)');

  // Module 2: Professional Clip Editing
  const mod2 = await prisma.courseModule.create({
    data: { courseId: course.id, title: 'Module 2: Professional Clip Editing', order: 2 },
  });
  await prisma.lesson.create({
    data: {
      moduleId: mod2.id, order: 1,
      title: 'Editing Tools & Clip Selection Masterclass',
      videoUrl: driveLinks[2],
      duration: '50m', isPreview: false,
    },
  });
  await prisma.lesson.create({
    data: {
      moduleId: mod2.id, order: 2,
      title: 'Captions, Effects & Professional Finishing',
      videoUrl: driveLinks[3],
      duration: '55m', isPreview: false,
    },
  });
  console.log('  ✅ Module 2 created — 2 lessons (Video 3 & 4)');

  // Module 3: Multi-Platform Upload & Distribution
  const mod3 = await prisma.courseModule.create({
    data: { courseId: course.id, title: 'Module 3: Multi-Platform Upload & Distribution', order: 3 },
  });
  await prisma.lesson.create({
    data: {
      moduleId: mod3.id, order: 1,
      title: 'Upload Strategy — YouTube Shorts, TikTok & Reels',
      videoUrl: driveLinks[4],
      duration: '40m', isPreview: false,
    },
  });
  console.log('  ✅ Module 3 created — 1 lesson (Video 5)');

  // Module 4: Campaign Review, Optimization & Scaling
  const mod4 = await prisma.courseModule.create({
    data: { courseId: course.id, title: 'Module 4: Campaign Review & Scaling', order: 4 },
  });
  await prisma.lesson.create({
    data: {
      moduleId: mod4.id, order: 1,
      title: 'Campaign Review, Optimization & 30-Day Action Plan',
      videoUrl: driveLinks[5],
      duration: '60m', isPreview: false,
    },
  });
  console.log('  ✅ Module 4 created — 1 lesson (Video 6)');

  console.log('\n🎉 SUCCESS! All 6 Google Drive videos mapped to Whop Clipping course!');
  console.log('   📦 4 Modules, 6 Lessons with real Google Drive video links');
  console.log('   🔒 Videos stream via Google Drive Preview (no download button)\n');

  await prisma.$disconnect();
}

updateWhopVideos().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
