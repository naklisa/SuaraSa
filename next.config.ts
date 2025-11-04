import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.scdn.co" },                  // album & artist images
      { protocol: "https", hostname: "image-cdn-fa.spotifycdn.com" },// some profile images
      { protocol: "https", hostname: "mosaic.scdn.co" },             // playlist mosaics (optional)
      { protocol: "https", hostname: "lh3.googleusercontent.com" },  // Google profile avatars
    ],
  },
}

export default nextConfig
