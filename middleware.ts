import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(_request: NextRequest) {
  // Admin auth: AdminGuard client-side localStorage ile kontrol ediyor.
  // Middleware cookie kullanamaz çünkü login localStorage'a yazıyor.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
