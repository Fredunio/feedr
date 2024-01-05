/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            // "lh3.googleusercontent.com"
            {
                hostname: "lh3.googleusercontent.com",
                protocol: "https",
                // port: '',
                // pathname: "*",
            },
        ]
    },
}

module.exports = nextConfig
