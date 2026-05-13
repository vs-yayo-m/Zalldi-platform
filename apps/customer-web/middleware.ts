import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@zalldi/auth/middleware";

const PROTECTED_ROUTES = [
  "/account",
  "/account/orders",
  "/account/addresses",
  "/food/checkout",
  "/groceries/checkout",
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  const { user } = await updateSession(request);
  
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  
  if (isProtected && !user) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
  
  if (user && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};