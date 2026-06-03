import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { db } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth-utils';

const JWT_SECRET = process.env.JWT_SECRET || 'automateriz-secret-key-2024';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('automateriz_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify JWT
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const email = payload.email as string;

    const { oldPassword, newPassword } = await request.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: 'Old password and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters long' }, { status: 400 });
    }

    const admin = await db.adminUser.findUnique({
      where: { email },
    });

    if (!admin || !verifyPassword(oldPassword, admin.passwordHash)) {
      return NextResponse.json({ error: 'Incorrect old password' }, { status: 400 });
    }

    // Hash new password and update in db
    const newHash = hashPassword(newPassword);
    await db.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Internal server error or invalid token' }, { status: 500 });
  }
}
