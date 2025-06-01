import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '8u9x6mi904.ufs.sh',
        port: '',
        pathname: '/**',
      },
    ],
  }
};

export default nextConfig;
