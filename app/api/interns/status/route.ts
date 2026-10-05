import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { checkInternBlocked } from '@/lib/blockedInterns';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ isBlocked: false });
  }

  const status = await checkInternBlocked(email);
  return NextResponse.json(status);
}
