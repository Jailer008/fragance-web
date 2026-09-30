import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sitio 100% estático: `npm run build` genera la carpeta `out/`, lista para cualquier hosting gratuito.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
