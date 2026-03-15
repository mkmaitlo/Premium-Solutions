/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol: 'https',
                hostname: 'utfs.io',
            },
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
            },
            {
                protocol: 'https',
                hostname: 'images.clerk.dev',
            }
        ]
    },
    async redirects() {
        return [
            {
                source: '/subscriptions',
                destination: '/#subscriptions',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
