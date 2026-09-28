import { requireAdmin } from '@/lib/adminAuth';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) {
    return NextResponse.json({ isAdmin: false, error: 'Not authorized' }, { status: 403 });
  }
  return NextResponse.json({ isAdmin: true, email: auth.email, userId: auth.userId });
}

