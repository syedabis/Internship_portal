import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { isAdminEmail } from '@/lib/adminEmails';

function parseJwt(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// File is named `proxy.ts`, not `middleware.ts` — Next.js 16 renamed the
// middleware convention to "proxy" (see node_modules/next/dist/docs/01-app/
// 03-api-reference/03-file-conventions/proxy.md). clerkMiddleware() still
// returns a plain (request) => response function, so it works unchanged
// under the new file name/convention.
export default clerkMiddleware(async (_auth, req) => {
  const { pathname } = req.nextUrl;

  // Enforce server-side Admin Guard for all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    let token = req.cookies.get('sb-access-token')?.value;

    if (!token) {
      for (const cookie of req.cookies.getAll()) {
        if (cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')) {
          try {
            if (cookie.value.startsWith('[')) {
              const parsed = JSON.parse(cookie.value);
              if (Array.isArray(parsed) && parsed[0]) token = parsed[0];
            } else {
              token = cookie.value;
            }
          } catch {
            // ignore
          }
        }
      }
    }

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    const payload = parseJwt(token);
    if (!payload || !payload.email || (payload.exp && payload.exp * 1000 < Date.now())) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    if (!isAdminEmail(payload.email)) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static assets, run on everything else.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
