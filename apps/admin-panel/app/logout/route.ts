import { NextResponse } from "next/server";
import { createClient } from "@zalldi/auth/server";

export async function GET() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001"));
}
