// ============================================================
// @zalldi/auth — Public exports
//
// IMPORTANT — import rules:
//
//   Client Components ("use client"):
//     import { createBrowserClient } from "@zalldi/auth/client"
//
//   Server Components / Route Handlers / Server Actions:
//     import { createServerClient } from "@zalldi/auth/server"
//
//   Middleware (middleware.ts only):
//     import { updateSession } from "@zalldi/auth/middleware"
//
// Never import from "@zalldi/auth" directly in client components.
// This barrel file is intentionally kept minimal.
// ============================================================

// Browser-safe only — no next/headers
export { createClient as createBrowserClient } from "./client";
