import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const email = req.cookies.get("email")?.value;

  // Allow access to login and signup pages
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    return NextResponse.next();
  }

  // Protect other routes
  if (!email) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
      "/((?!api|_next|static|favicon.ico|login|signup).*)",
  ],
};
