import type { NextConfig } from "next";

// On GitHub Pages the site lives at /lattis, so the build sets PAGES_BASE_PATH.
// Locally (npm run dev) it stays at the root.
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
