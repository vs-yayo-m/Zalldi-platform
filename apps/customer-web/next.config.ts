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
      // Supabase Storage URLs
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Any supabase project
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "zalldi.com"],
    },
  },
};

export default nextConfig;