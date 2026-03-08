import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (!payload.exp) return true;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const projectRef = new URL(supabaseUrl).hostname.split(".")[0];
    const cookieKey = `sb-${projectRef}-auth-token`;
    const sessionCookie = request.cookies.get(cookieKey);

    if (!sessionCookie?.value) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    let accessToken: string | undefined;
    try {
      const parsed = JSON.parse(sessionCookie.value);
      accessToken = Array.isArray(parsed) ? parsed[0] : parsed?.access_token;
    } catch {
      accessToken = sessionCookie.value;
    }

    if (!accessToken || isTokenExpired(accessToken)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
