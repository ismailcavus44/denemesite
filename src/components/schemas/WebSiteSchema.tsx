import { siteConfig } from "@/lib/site";

const BASE_URL = siteConfig.url.replace(/\/$/, "");

/** Anasayfa için WebSite şeması. Publisher olarak Organization referansı (#organization). */
export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: siteConfig.name,
    url: BASE_URL,
    description: siteConfig.description,
    publisher: { "@id": `${BASE_URL}/#organization` },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
