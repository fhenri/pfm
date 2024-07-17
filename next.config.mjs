/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },

    experimental: {
        instrumentationHook: true,
    },

};

export default nextConfig;
