import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@zalldi/auth/middleware";

// Protected routes that require authentication
const PROTECTED_ROUTES = ["/account", "/account/orders", "/account/addresses", "/food/checkout", "/groceries/checkout"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Update Supabase session (refresh tokens)
  const result = await updateSession(request);
  const { response, user } = result as { response: NextResponse; user: unknown };

  // Guard protected routes
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (user && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
