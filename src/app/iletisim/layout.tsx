import type { Metadata } from "next";
import { siteConfig, defaultOgImage } from "@/lib/site";
import { escapeJsonLd } from "@/lib/jsonLd";
import { ORGANIZATION_ID, WEBSITE_ID } from "@/lib/organization-schema";

const _t = "İletişim | YasalHaklarınız";
const _d = "YasalHaklarınız ile iletişime geçin. Öneri ve geri bildirimlerinizi paylaşabilirsiniz.";
const _u = `${siteConfig.url}/iletisim`;

export const metadata: Metadata = {
  title: { absolute: "İletişim | YasalHaklarınız" },
  description: _d,
  openGraph: { title: _t, description: _d, url: _u, images: [defaultOgImage] },
  twitter: { card: "summary_large_image", title: _t, description: _d, images: [defaultOgImage.url] },
  alternates: { canonical: _u },
};

export default function IletisimLayout({
  children,
}: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${_u}#contact`,
    name: "İletişim",
    description: _d,
    url: _u,
    inLanguage: "tr-TR",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@id": ORGANIZATION_ID,
      "@type": "Organization",
      name: siteConfig.name,
      email: siteConfig.contactEmail,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: siteConfig.contactEmail,
        availableLanguage: ["Turkish"],
      },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: escapeJsonLd(schema) }} />
      {children}
    </>
  );
}
