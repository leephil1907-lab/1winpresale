import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the sandboxed live-preview proxy host during development
  allowedDevOrigins: ["*.e2b.app"],
};

export default nextConfig;
