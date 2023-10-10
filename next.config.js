/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "i.stack.imgur.com",
        port: "",
        pathname: "/**",
      },
    ],
    domains: ["res.cloudinary.com"],
  },
}

module.exports = nextConfig
