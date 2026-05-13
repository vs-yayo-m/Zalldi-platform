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
  const { pathname } = request.nextUrl;
  
  const { user } = await updateSession(request as unknown as Request, null);
  
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  
  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  if (user && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};