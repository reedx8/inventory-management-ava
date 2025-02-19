import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    // To remove static route indicator:
    devIndicators: {
        appIsrStatus: false,
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
