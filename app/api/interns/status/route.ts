import { NextResponse } from 'next/server';
import { checkInternBlocked } from '@/lib/blockedInterns';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ isBlocked: false });
  }

  const status = checkInternBlocked(email);
  return NextResponse.json(status);
}
