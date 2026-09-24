import { NextResponse } from 'next/server';

export function isAdminEmail(email: string | null): boolean {
  if (!email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes(email.toLowerCase());
}

// Legacy alias used by old Profile Builder admin pages
export const isAdmin = isAdminEmail;

/**
 * Legacy requireAdmin guard for old API routes.
 * Returns { userId: string } on success, or a 403 NextResponse on failure.
 * NOTE: This is a server-side stub. Old Clerk-based routes calling this
 * will get a 403 since we no longer have Clerk server auth.
 */
export async function requireAdmin(): Promise<{ userId: string } | NextResponse> {
  // Without Clerk server auth, we cannot verify the user server-side via cookies.
  // Old API routes using this will return 403. New admin pages use client-side Supabase auth.
  return NextResponse.json({ error: 'Forbidden — legacy route' }, { status: 403 });
}
