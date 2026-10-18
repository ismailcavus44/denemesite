import type { NextConfig } from "next";
import {
  LEGACY_QUESTION_FALLBACK,
  LEGACY_QUESTION_REDIRECTS,
} from "./src/lib/legacy-question-redirects";

/** Kaldırılan soru-cevap sistemi: eski adresler → en yakın rehber yazısı (308). */
function legacyQuestionRedirects() {
  const perSlug = Object.entries(LEGACY_QUESTION_REDIRECTS).flatMap(([slug, destination]) => {
    const encoded = encodeURIComponent(slug);
    const slugs = encoded === slug ? [slug] : [slug, encoded];
    return slugs.flatMap((s) => [
      { source: `/:category/soru/${s}`, destination, permanent: true },
      { source: `/soru/${s}`, destination, permanent: true },
    ]);
  });
  return [
    ...perSlug,
    { source: "/:category/soru/:slug*", destination: LEGACY_QUESTION_FALLBACK, permanent: true },
    { source: "/soru/:slug*", destination: LEGACY_QUESTION_FALLBACK, permanent: true },
    { source: "/hukuk-rehberi/soru/:slug*", destination: LEGACY_QUESTION_FALLBACK, permanent: true },
    { source: "/:category/sorular", destination: "/:category/rehber", permanent: true },
    { source: "/sorular", destination: LEGACY_QUESTION_FALLBACK, permanent: true },
    { source: "/soru-sor", destination: LEGACY_QUESTION_FALLBACK, permanent: true },
    { source: "/sorularim", destination: LEGACY_QUESTION_FALLBACK, permanent: true },
    { source: "/bildirimler", destination: LEGACY_QUESTION_FALLBACK, permanent: true },
  ];
}

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return legacyQuestionRedirects();
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
