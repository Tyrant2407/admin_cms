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
      return new Response('Unauthorized', { status: 401 });
    }

    const leads = await db.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const headers = ['ID', 'Name', 'WhatsApp', 'Email', 'Service Type', 'Project Detail', 'Date'];
    const rows = leads.map(l => [
      l.id,
      l.name,
      l.whatsapp,
      l.email,
      l.serviceType,
      `"${l.projectDetail.replace(/"/g, '""')}"`,
      new Date(l.createdAt).toISOString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const dateStr = new Date().toISOString().split('T')[0];

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename=leads_${dateStr}.csv`,
      },
    });
  } catch (error) {
    console.error('Export CSV error:', error);
    return new Response('Failed to export leads', { status: 500 });
  }
}
