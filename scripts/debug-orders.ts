import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();

async function check() {
  // Check for any orders with weird status
  const allOrders = await p.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { user: { select: { name: true, email: true } }, course: { select: { title: true } } },
  });

  console.log('Latest 5 orders:');
  allOrders.forEach(o => {
    console.log(`  ${o.orderNumber} | ${o.user?.name} | ${o.status} | ₹${o.amount} | ${o.course?.title}`);
  });

  // Check if dashboard API would crash - simulate the query
  try {
    const testUserId = allOrders[0]?.userId;
    if (testUserId) {
      const stats = await p.enrollment.findMany({ where: { userId: testUserId } });
      console.log(`\nEnrollments for ${allOrders[0]?.user?.name}: ${stats.length}`);
    }
  } catch(e: any) {
    console.error('Dashboard query error:', e.message);
  }

  await p.$disconnect();
}

check();
