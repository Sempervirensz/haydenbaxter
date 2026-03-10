import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // required for static export; real savings come from pre-compressed WebP
  },
};

export default nextConfig;
