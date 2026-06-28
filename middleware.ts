import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
  prefix: 'rl',
});

const isAuthPath = (path: string) =>
  path === '/api/auth/signup' || path === '/api/send-code' ||
  path.startsWith('/api/chargily/');

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // ─── Security Headers ─────────────────────────────────────────────────
  const headers: Record<string, string> = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'X-XSS-Protection': '0',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
  };
  Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));

  // Content-Security-Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.supabase.co https://*.tile.openstreetmap.org https://lh3.googleusercontent.com https://placehold.co",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co https://overpass-api.de https://api.stripe.com https://api.chargily.com",
    "frame-src 'self' https://*.stripe.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
  response.headers.set('Content-Security-Policy', csp);

  // ─── Rate Limiting ──────────────────────────────────────────────────
  if (isAuthPath(pathname) || request.method !== 'GET') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    try {
      const { success, limit, remaining, reset } = await ratelimit.limit(ip);
      response.headers.set('X-RateLimit-Limit', String(limit));
      response.headers.set('X-RateLimit-Remaining', String(remaining));
      response.headers.set('X-RateLimit-Reset', String(reset));

      if (!success) {
        return new NextResponse(JSON.stringify({ error: 'Too many requests. Try again later.' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json', 'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)) },
        });
      }
    } catch { /* rate limit skip on error */ }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
