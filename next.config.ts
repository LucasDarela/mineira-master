import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gera um servidor enxuto para rodar em Docker na VPS
  output: "standalone",
};

export default nextConfig;
