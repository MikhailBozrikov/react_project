/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  turbopack: {
    root: process.cwd(), 
  },
}

module.exports = nextConfig