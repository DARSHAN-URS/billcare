import { NextRequest, NextResponse } from 'next/server';

/**
 * RUVEXI Multi-Tenant Resolution Middleware (PRD Section 5.1)
 *
 * Handles:
 * 1. Root / marketing site (e.g., ruvexi.com) -> (marketing)
 * 2. Salon owner/staff dashboard (e.g., app.ruvexi.com) -> (dashboard)
 * 3. Super admin console (e.g., admin.ruvexi.com) -> (super-admin)
 * 4. Salon branded websites (e.g., [salon].ruvexi.com or custom domain) -> (tenant-site)/[salonSlug]
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // Extract root domain from environment or default
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'ruvexi.com';

  // Handle local development subdomains (e.g. salon1.localhost:3000)
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');
  let subdomain = '';

  if (isLocalhost) {
    const parts = hostname.split(':')[0].split('.');
    if (parts.length > 1 && parts[0] !== 'localhost') {
      subdomain = parts[0];
    }
  } else if (hostname.endsWith(`.${rootDomain}`)) {
    subdomain = hostname.replace(`.${rootDomain}`, '');
  }

  // 1. App Dashboard
  if (subdomain === 'app') {
    return NextResponse.rewrite(new URL(`/(dashboard)${url.pathname}`, req.url));
  }

  // 2. Super Admin Portal
  if (subdomain === 'admin') {
    return NextResponse.rewrite(new URL(`/(super-admin)${url.pathname}`, req.url));
  }

  // 3. Branded Salon Subdomain (e.g. blossom-salon.ruvexi.com)
  if (subdomain && subdomain !== 'www') {
    return NextResponse.rewrite(
      new URL(`/(tenant-site)/${subdomain}${url.pathname}`, req.url)
    );
  }

  // 4. Fallback: Main SaaS Marketing Platform
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)'],
};
