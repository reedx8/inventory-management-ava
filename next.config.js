/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pfgxgvbovzogwfhejjus.supabase.co',
                port: '',
                pathname: 'storage/v1/object/public/media/vendorLogos/**',
                search: '',
            },
            {
                protocol: 'https',
                hostname: 'images.squarespace-cdn.com',
                port: '',
                pathname: '/content/v1/**',
            },
        ],
    },
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

module.exports = nextConfig;
