// next.config.ts
import type { NextConfig } from "next"

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
  compiler: {
    styledComponents: true,
  },
  webpack: (config) => {
    config.module?.rules.push({
      test: /\.svg$/,
      use: "raw-loader",
    })
    //...
    return config
  },

}

export default nextConfig
