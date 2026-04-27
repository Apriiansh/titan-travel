import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Match the server-side 5MB validation in upload.ts
      bodySizeLimit: "5mb",
    },
  },

  images: {
    // Serve locally uploaded images via Next.js optimizer
    // This enables WebP/AVIF conversion and resizing for /uploads/* files
    localPatterns: [
      {
        pathname: "/uploads/**",
        search: "",
      },
      {
        pathname: "/*.png",
        search: "",
      },
    ],

    // External image hosts that are allowed
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],

    // Prefer AVIF (smaller), fallback to WebP — both far smaller than JPEG/PNG
    formats: ["image/avif", "image/webp"],

    // Cache optimized images for 30 days in the CDN/browser
    minimumCacheTTL: 60 * 60 * 24 * 30,

    // Sizes for responsive images — covers mobile, tablet, desktop, wide monitors
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],

    // Sizes for fixed-size images (components with explicit width/height)
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
};

export default nextConfig;
