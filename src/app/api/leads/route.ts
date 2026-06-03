import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { db } from '@/lib/db';
import { ServiceType } from '@/generated/prisma/client';

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

// GET - Get all leads (Protected)
export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const serviceType = searchParams.get('serviceType') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    // Build filter where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (serviceType && ['training', 'automation', 'both'].includes(serviceType)) {
      where.serviceType = serviceType as ServiceType;
    }

    // Validate sort parameters
    const allowedSortFields = ['name', 'email', 'createdAt', 'serviceType'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const validSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'desc';

    // Get leads and total count
    const [leads, totalCount] = await Promise.all([
      db.lead.findMany({
        where,
        orderBy: { [validSortBy]: validSortOrder },
        skip,
        take: limit,
      }),
      db.lead.count({ where }),
    ]);

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Fetch leads error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

// POST - Submit new lead (Public)
export async function POST(request: Request) {
  try {
    const { name, whatsapp, email, serviceType, projectDetail, honeypot } = await request.json();

    // 1. Honeypot check (anti-spam)
    if (honeypot) {
      // Return 200/success silently to trick bots
      return NextResponse.json({ success: true, message: 'Lead submitted successfully' });
    }

    // 2. Validate input
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 });
    }

    // WhatsApp validation
    const cleanWA = whatsapp ? whatsapp.replace(/\D/g, '') : '';
    if (!whatsapp || cleanWA.length < 9) {
      return NextResponse.json({ error: 'WhatsApp number must be at least 9 digits' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (!serviceType || !['training', 'automation', 'both'].includes(serviceType)) {
      return NextResponse.json({ error: 'Invalid service type selected' }, { status: 400 });
    }

    if (!projectDetail || projectDetail.trim().length < 20 || projectDetail.length > 1000) {
      return NextResponse.json({ error: 'Project detail must be between 20 and 1000 characters' }, { status: 400 });
    }

    // 3. Save to database
    const newLead = await db.lead.create({
      data: {
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        serviceType: serviceType as ServiceType,
        projectDetail: projectDetail.trim(),
      },
    });

    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
