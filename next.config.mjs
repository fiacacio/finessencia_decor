/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.10.173', '192.168.0.17'],
  images: {
    unoptimized: true,
  },
}

export default nextConfig
