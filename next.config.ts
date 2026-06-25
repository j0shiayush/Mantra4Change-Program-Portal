import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // This forces Vercel to include Prisma and your SQLite file in the serverless functions
    serverComponentsExternalPackages: ['@prisma/client', 'prisma'],
    outputFileTracingIncludes: {
      '/api/**/*': ['./prisma/**/*'],
    },
  },
};

export default nextConfig;