import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@zalldi/auth/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const result = await updateSession(request);
  const { response, user } = result as { response: NextResponse; user: unknown };

  if (!user && !pathname.startsWith("/login") && !pathname.startsWith("/register")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (user && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
