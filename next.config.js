/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["yt3.ggpht.com", "i.ytimg.com", "images.unsplash.com"],
  },
};

module.exports = nextConfig;
