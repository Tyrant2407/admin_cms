import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'automateriz-secret-key-2024';

// Helper to check authentication
async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('automateriz_token')?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    
    // 1. Calculate time boundaries
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    // 2. Fetch counts from DB
    const [
      totalLeads,
      leadsThisMonth,
      leadsThisWeek,
      trainingCount,
      automationCount,
      bothCount,
      recentLeadsForChart,
    ] = await Promise.all([
      db.lead.count(),
      db.lead.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      db.lead.count({
        where: { createdAt: { gte: startOfWeek } },
      }),
      db.lead.count({
        where: { serviceType: 'training' },
      }),
      db.lead.count({
        where: { serviceType: 'automation' },
      }),
      db.lead.count({
        where: { serviceType: 'both' },
      }),
      db.lead.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
      }),
    ]);

    // 3. Process chart data (leads per day for last 30 days)
    const dailyLeadsMap = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dailyLeadsMap.set(dateStr, 0);
    }

    recentLeadsForChart.forEach(lead => {
      const dateStr = lead.createdAt.toISOString().split('T')[0];
      if (dailyLeadsMap.has(dateStr)) {
        dailyLeadsMap.set(dateStr, (dailyLeadsMap.get(dateStr) || 0) + 1);
      }
    });

    const dailyLeads = Array.from(dailyLeadsMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    return NextResponse.json({
      totalLeads,
      leadsThisMonth,
      leadsThisWeek,
      trainingCount,
      automationCount,
      bothCount,
      dailyLeads,
    });
  } catch (error) {
    console.error('Fetch stats error:', error);
    return NextResponse.json({ error: 'Failed to aggregate statistics' }, { status: 500 });
  }
}
