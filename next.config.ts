import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // REQUIRED for cPanel static hosting
  trailingSlash: true, // Creates folders (admin/index.html) instead of files (admin.html)

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    unoptimized: true, // REQUIRED (no Next.js image server)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'xojgazsikkvzickbiltf.supabase.co',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
