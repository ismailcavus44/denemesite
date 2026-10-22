import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const PRIVATE_PATHS = ["/admin/", "/api/", "/private/", "/config/", "/temp/", "/search/", "/ara/", "/onizleme/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
      // Yapay zekâ arama/asistan botları: içerik kaynak gösterilsin diye açık.
      ...[
        "GPTBot",
        "OAI-SearchBot",
        "ChatGPT-User",
        "Google-Extended",
        "CCBot",
        "ClaudeBot",
        "Claude-SearchBot",
        "Claude-User",
        "anthropic-ai",
        "PerplexityBot",
        "Perplexity-User",
        "Applebot-Extended",
      ].map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE_PATHS })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
