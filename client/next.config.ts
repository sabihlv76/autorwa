import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose"],
  images: {
    // Needed so next/image can serve /public/logo.svg. Safe here since it's
    // our own static asset, not user-supplied — the CSP still blocks any
    // script the SVG might contain from executing.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Product photos are uploaded to Cloudinary (src/lib/cloudinary.ts) and
    // stored as res.cloudinary.com URLs. next/image refuses to render any
    // remote host that isn't explicitly allow-listed here, so without this,
    // ProductCard/ProductGallery's <Image> silently fail to render an
    // uploaded photo on the storefront even though the admin's plain <img>
    // thumbnails show it fine.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
