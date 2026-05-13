import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@zalldi/ui",
    "@zalldi/auth",
    "@zalldi/database",
    "@zalldi/config",
    "@zalldi/types",
    "@zalldi/validation",
    "@zalldi/storage",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;