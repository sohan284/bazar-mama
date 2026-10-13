import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Demo product photos are loaded from Unsplash.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
