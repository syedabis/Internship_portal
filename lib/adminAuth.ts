import { NextResponse } from 'next/server';
import { getCurrentUser } from './serverAuth';

import { isAdminEmail, ADMIN_EMAILS } from './adminEmails';

export { isAdminEmail, ADMIN_EMAILS };

// Legacy alias used by old Profile Builder admin pages
export const isAdmin = isAdminEmail;

export interface AdminAuthResult {
  userId: string;
  email?: string;
}

/**
 * Server-side admin guard for API routes and server actions.
 * Verifies Supabase JWT token or session and ensures email is an authorized administrator.
 * Returns { userId: string, email: string } on success, or an unauthorized/forbidden NextResponse.
 */
export async function requireAdmin(req?: Request): Promise<AdminAuthResult | NextResponse> {
  const user = await getCurrentUser(req);

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized — Administrator login required' },
      { status: 401 }
    );
  }

  if (!isAdminEmail(user.email)) {
    return NextResponse.json(
      { error: 'Forbidden — Administrator access required' },
      { status: 403 }
    );
  }

  return {
    userId: user.userId,
    email: user.email,
  };
}

