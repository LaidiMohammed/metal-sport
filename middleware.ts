import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow all routes to be accessed
  // Client-side authentication will handle redirects
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
