/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Enable standalone build for Docker deployments
  output: 'standalone',
  
  // Enable React strict mode in development
  reactStrictMode: true,
  
  // Environment-specific configurations
  poweredByHeader: false, // Remove "X-Powered-By" header for security
};

module.exports = nextConfig;
