// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pps.whatsapp.net",
        port: "",
        // Use ** to match any nested path segments and file names
        pathname: "/**",
        // Omit `search` or leave undefined to allow any query string
      },
    ],
  },
};

export default nextConfig;
