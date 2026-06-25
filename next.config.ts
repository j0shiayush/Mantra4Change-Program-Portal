import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // In Next.js 15+, these have moved out of the 'experimental' object
  serverExternalPackages: ['@prisma/client', 'prisma'],
  outputFileTracingIncludes: {
    '/api/**/*': ['./prisma/**/*'],
  },
};

export default nextConfig;