import type { NextConfig } from "next";

const ONE_MONTH = 60 * 60 * 24 * 30;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Only the admin gallery page uses next/image (the public site uses
    // plain <img>, so this doesn't touch it). Matches the 1-month
    // Cache-Control already set on upload in gallery/menu actions.ts.
    minimumCacheTTL: ONE_MONTH,
  },
  experimental: {
    serverActions: {
      // Admin photo uploads go through Server Actions (default cap is 1 MB).
      // Photos are downscaled in the browser first, so this is headroom for
      // the ones that can't be; Vercel itself rejects bodies over 4.5 MB.
      bodySizeLimit: "4mb",
    },
  },
  async headers() {
    return [
      {
        // The site's own photos. Filenames aren't fingerprinted, so when
        // swapping a photo give it a new filename or returning visitors keep
        // the old one until this expires.
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_MONTH}, s-maxage=${ONE_MONTH}`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
