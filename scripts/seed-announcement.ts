import prisma from '../lib/prisma';

async function main() {
  const existing = await prisma.notification.count();
  if (existing === 0) {
    await prisma.notification.create({
      data: {
        title: '🔥 Welcome to MAHI SKILLS Official Community!',
        message: 'Welcome all students & creators! Explore our practical courses to master Instagram Growth & Freelancing, and book your 1:1 strategy calls with Munna Bhai.',
        type: 'ANNOUNCEMENT',
        link: '/courses',
        senderName: 'Munna Bhai',
      },
    });
    console.log('Sample announcement created');
  }
}

main().finally(() => prisma.$disconnect());
