/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Dev indicators render the Next.js Dev Tools button/overlay in development.
  // Setting this to `false` removes the indicator (useful for demos or screenshots).
  devIndicators: false,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
