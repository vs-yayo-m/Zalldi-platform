import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@zalldi/auth/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { response, user } = await updateSession(request as unknown as Request);

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
