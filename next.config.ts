import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// next.config.js
const withPWA = require("next-pwa")({
  dest: "public", // folder where service worker will be generated
});

module.exports = withPWA({
  reactStrictMode: true,
});

export default nextConfig;
