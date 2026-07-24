import type { NextConfig } from "next";

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'
    https://checkout.razorpay.com
    https://cdn.razorpay.com
    https://www.clarity.ms
    https://scripts.clarity.ms
    https://*.clarity.ms
    https://fonts.googleapis.com
    https://unpkg.com
    https://cdn.jsdelivr.net
    https://staticimgly.com
    https://*.staticimgly.com;
  script-src-elem 'self' 'unsafe-inline'
    https://checkout.razorpay.com
    https://cdn.razorpay.com
    https://www.clarity.ms
    https://scripts.clarity.ms
    https://*.clarity.ms
    https://fonts.googleapis.com
    https://unpkg.com
    https://cdn.jsdelivr.net
    https://staticimgly.com
    https://*.staticimgly.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' data: https://fonts.gstatic.com;
  img-src 'self' data: blob:
    https://cdn.razorpay.com
    https://www.clarity.ms
    https://c.clarity.ms
    https://scripts.clarity.ms
    https://*.clarity.ms
    https://staticimgly.com
    https://*.staticimgly.com;
  connect-src 'self'
    https://api.razorpay.com
    https://lumberjack.razorpay.com
    https://www.clarity.ms
    https://c.clarity.ms
    https://scripts.clarity.ms
    https://*.clarity.ms
    https://unpkg.com
    https://cdn.jsdelivr.net
    https://staticimgly.com
    https://*.staticimgly.com;
  worker-src 'self' blob: https://staticimgly.com https://*.staticimgly.com;
  frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();


/** Security headers applied to ALL routes */
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self)",
  },
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Remove X-Powered-By header (reduces fingerprinting surface)
  poweredByHeader: false,

  // Enable gzip/brotli compression
  compress: true,

  async headers() {
    return [
      // ── Global security headers ──────────────────────────────────────
      {
        source: "/(.*)",
        headers: securityHeaders,
      },

      // ── Static assets: long-lived immutable cache ────────────────────
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // ── Public assets (favicon, images, etc.) ───────────────────────
      {
        source: "/(.*)\\.(png|jpg|jpeg|gif|webp|svg|ico|woff2|woff|ttf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },

      // ── Payment API: never cache financial data ──────────────────────
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
          { key: "Pragma", value: "no-cache" },
        ],
      },

      // ── Video editor: requires SharedArrayBuffer (COEP/COOP) ─────────
      {
        source: "/video-editor",
        headers: [
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
      {
        source: "/video-editor/:path*",
        headers: [
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
      // ── FFmpeg WASM/JS static files: needs COEP for SharedArrayBuffer ─
      {
        source: "/ffmpeg/:path*",
        headers: [
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
        ],
      },
      // ── imgly AI background removal static files ────────────────────
      {
        source: "/imgly/:path*",
        headers: [
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
        ],
      },

    ];
  },
};

export default nextConfig;
