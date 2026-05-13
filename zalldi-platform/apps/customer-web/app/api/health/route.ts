import { NextResponse } from "next/server";
import { createClient } from "@zalldi/auth/server";

export async function GET() {
  const status: Record<string, string> = {
    app: "customer-web",
    status: "ok",
    env: process.env.NEXT_PUBLIC_APP_ENV ?? "unknown",
    timestamp: new Date().toISOString(),
  };

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("user_profiles").select("id").limit(1);
    status.database = error ? `error: ${error.message}` : "connected";
  } catch (e) {
    status.database = `error: ${e instanceof Error ? e.message : "unknown"}`;
  }

  const isHealthy = status.database === "connected";
  return NextResponse.json(status, { status: isHealthy ? 200 : 503 });
}
