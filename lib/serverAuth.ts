import { auth, currentUser as getClerkCurrentUser } from '@clerk/nextjs/server';
import { supabase } from './supabase';
import { cookies, headers } from 'next/headers';

export interface AuthenticatedUser {
  userId: string;
  email?: string;
}

/**
 * Resolves the current authenticated user across Supabase (primary) and Clerk (legacy fallback).
 * Inspects:
 * 1. Authorization: Bearer <token> in request headers
 * 2. Next.js cookies (sb-access-token or sb-*-auth-token)
 * 3. Clerk server-side session
 */
export async function getCurrentUser(req?: Request): Promise<AuthenticatedUser | null> {
  // 1. Check Authorization Bearer header
  let token: string | null = null;

  if (req) {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) {
    try {
      const headerStore = await headers();
      const authHeader = headerStore.get('authorization') || headerStore.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      }
    } catch {
      // headers() context not available
    }
  }

  // 2. If Bearer token present, verify with Supabase
  if (token) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (user && !error) {
        return {
          userId: user.id,
          email: user.email,
        };
      }
    } catch (err) {
      console.warn('Supabase token verification error:', err);
    }
  }

  // 3. Check cookies for Supabase tokens
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const sbCookie = allCookies.find(
      (c) =>
        c.name === 'sb-access-token' ||
        (c.name.startsWith('sb-') && (c.name.endsWith('-auth-token') || c.name.includes('access-token')))
    );

    if (sbCookie) {
      let sbToken = sbCookie.value;
      try {
        const parsed = JSON.parse(sbToken);
        if (parsed?.access_token) {
          sbToken = parsed.access_token;
        } else if (Array.isArray(parsed) && parsed[0]) {
          sbToken = parsed[0];
        }
      } catch {
        // Raw token string
      }

      if (sbToken) {
        const { data: { user }, error } = await supabase.auth.getUser(sbToken);
        if (user && !error) {
          return {
            userId: user.id,
            email: user.email,
          };
        }
      }
    }
  } catch {
    // cookies() context not available
  }

  // 4. Fallback to Clerk if present
  try {
    const clerkUser = await getClerkCurrentUser();
    if (clerkUser) {
      const primaryEmail =
        clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress;
      return {
        userId: clerkUser.id,
        email: primaryEmail,
      };
    }

    const { userId } = await auth();
    if (userId) {
      return { userId };
    }
  } catch {
    // Clerk not configured or user not signed in
  }

  return null;
}

/** Current signed-in user's ID, or null if signed out. */
export async function getCurrentUserId(req?: Request): Promise<string | null> {
  const user = await getCurrentUser(req);
  return user?.userId ?? null;
}

