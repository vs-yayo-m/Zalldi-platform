import { z } from "zod";

// ============================================================
// Environment variable validation using Zod
// Call validateEnv() once at app startup (in next.config.ts)
// ============================================================

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required").optional(),
  NEXT_PUBLIC_APP_ENV: z.enum(["development", "staging", "production"]).default("development"),
  NEXT_PUBLIC_APP_NAME: z.string().default("Zalldi"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

export function getEnv(): Env {
  if (_env) return _env;

  const result = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    result.error.issues.forEach((issue) => {
      console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
    });
    // Don't throw in build time — warn and continue
    if (process.env.NODE_ENV !== "production") {
      console.warn("⚠️  Continuing with partial env (dev mode)");
    }
  }

  _env = (result.data ?? {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    NEXT_PUBLIC_APP_ENV: "development",
    NEXT_PUBLIC_APP_NAME: "Zalldi",
    NODE_ENV: "development",
  }) as Env;

  return _env;
}

// App-level constants
export const APP_CONFIG = {
  name: "Zalldi",
  tagline: "Food, Groceries & More — Delivered Fast",
  supportEmail: "support@zalldi.com",
  defaultCurrency: "INR",
  defaultCity: "Hyderabad",
  defaultCountry: "IN",
  maxCartItems: 20,
  freeDeliveryThreshold: 299,
  platformFee: 5,
  gstRate: 0.05,
  verticals: ["food", "groceries", "dineout"] as const,
} as const;

export const ROUTES = {
  home: "/",
  food: "/food",
  groceries: "/groceries",
  dineout: "/dineout",
  login: "/login",
  register: "/register",
  account: "/account",
  orders: "/account/orders",
  addresses: "/account/addresses",
} as const;
