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
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Monaco Editor and other heavy client-only libs
  webpack: (config: Record<string, unknown>) => {
    const cfg = config as { resolve: { fallback: Record<string, boolean> } }
    cfg.resolve.fallback = { fs: false, path: false }
    return config
  },
  turbopack: {},
}

export default nextConfig
