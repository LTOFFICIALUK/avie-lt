import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    domains: ['stream.avie.live','backend.avie.live', 'livestream.avie.live', 'localhost', 'streamapi.avie.live', 'stream.avie.live', 'avie.b-cdn.net',"images.unsplash.com"],
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
  compress: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;