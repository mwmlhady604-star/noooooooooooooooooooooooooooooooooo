import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone build for Docker deployments
  output: 'standalone',
  
  // Enable React strict mode in development
  reactStrictMode: true,
  
  // Environment-specific configurations
  poweredByHeader: false, // Remove "X-Powered-By" header for security
};

export default nextConfig;
