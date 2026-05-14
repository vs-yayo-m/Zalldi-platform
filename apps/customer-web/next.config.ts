import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@zalldi/ui", "@zalldi/auth", "@zalldi/database", "@zalldi/config", "@zalldi/types", "@zalldi/validation", "@zalldi/utils", "@zalldi/supabase"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.cloudflare.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "zalldi.com"],
    },
  },
};

export default nextConfig;
