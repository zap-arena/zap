import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*",
      },
    ]
  },
  // Monaco Editor and other heavy client-only libs
  webpack: (config: Record<string, unknown>) => {
    const cfg = config as { resolve: { fallback: Record<string, boolean> } }
    cfg.resolve.fallback = { fs: false, path: false }
    return config
  },
}

export default nextConfig
