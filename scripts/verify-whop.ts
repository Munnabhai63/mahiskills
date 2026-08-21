import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function verify() {
  const c = await p.course.findUnique({
    where: { slug: 'whop-clipping-campaign-guide' },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: { lessons: { orderBy: { order: 'asc' } } },
      },
    },
  });

  if (!c) { console.log('NOT FOUND'); return; }

  console.log(`✅ Course: ${c.title}`);
  console.log(`   Price: ₹${c.price} | Original: ₹${c.originalPrice} | Published: ${c.published}`);
  console.log(`   Modules: ${c.modules.length} | Total Lessons: ${c.modules.reduce((a, m) => a + m.lessons.length, 0)}`);

  c.modules.forEach(m => {
    console.log(`\n📦 ${m.title}`);
    m.lessons.forEach(l => {
      console.log(`  🎬 ${l.title}`);
      console.log(`     Video: ${l.videoUrl?.substring(0, 70)}...`);
      console.log(`     Duration: ${l.duration} | Free Preview: ${l.isPreview}`);
    });
  });

  await p.$disconnect();
}

verify();
