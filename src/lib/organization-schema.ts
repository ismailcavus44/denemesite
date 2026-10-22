import { siteConfig } from "@/lib/site";

const BASE_URL = siteConfig.url.replace(/\/$/, "");

export const ORGANIZATION_ID = `${BASE_URL}/#organization`;
export const WEBSITE_ID = `${BASE_URL}/#website`;

/** Tüm resmi sosyal hesaplar (Organization.sameAs). */
const SOCIAL_PROFILES = Object.values(siteConfig.social);

/** Kısa Organization düğümü: makalelerde publisher olarak gömülür (logo dahil). */
export function buildPublisherNode(): Record<string, unknown> {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/logo-square.png`,
      width: 600,
      height: 600,
    },
  };
}

/** Tam Organization düğümü (anasayfa, hakkımızda). */
export function buildOrganizationNode(): Record<string, unknown> {
  return {
    ...buildPublisherNode(),
    description: siteConfig.description,
    email: siteConfig.contactEmail,
    sameAs: SOCIAL_PROFILES,
  };
}
