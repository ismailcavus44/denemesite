import { siteConfig } from "@/lib/site";

const BASE_URL = siteConfig.url.replace(/\/$/, "");
const LOGO_URL = `${BASE_URL}/hukuki-sor-logo.png`;

/** Anasayfa için Organization şeması. Tek yerde tanımlı, mükerrer kullanılmaz. */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: siteConfig.name,
    url: BASE_URL,
    logo: LOGO_URL,
    description: siteConfig.description,
    email: siteConfig.contactEmail,
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.facebook,
      siteConfig.social.x,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
