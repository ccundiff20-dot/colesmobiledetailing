import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  images: { formats: ["image/avif", "image/webp"] },
  poweredByHeader: false,

  async redirects() {
    return [
      { source: "/book-here", destination: "/book", permanent: true },
      { source: "/book-here/:path*", destination: "/book", permanent: true },
      { source: "/contact", destination: "/book", permanent: true },
      { source: "/pricing", destination: "/services", permanent: true },
      { source: "/results", destination: "/gallery", permanent: true },
      { source: "/rv-%26-marine", destination: "/rv-marine", permanent: true },
      { source: "/fleet-detailing", destination: "/fleet", permanent: true },
      { source: "/gift-card", destination: "/book", permanent: true },
    ];
  },

  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
      ],
    }];
  },
};

export default nextConfig;
