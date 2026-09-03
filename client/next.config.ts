import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose"],
  images: {
    // Needed so next/image can serve /public/logo.svg. Safe here since it's
    // our own static asset, not user-supplied — the CSP still blocks any
    // script the SVG might contain from executing.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
