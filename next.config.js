/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            // "lh3.googleusercontent.com"
            {
                hostname: "lh3.googleusercontent.com",
                protocol: "https",
            },
            {
                hostname: "feedr.s3.amazonaws.com",
                protocol: "https",
            },
        ]
    },
}

module.exports = nextConfig