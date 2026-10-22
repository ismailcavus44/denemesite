import { buildOrganizationNode } from "@/lib/organization-schema";
import { escapeJsonLd } from "@/lib/jsonLd";

/** Anasayfa için Organization şeması. Tek yerde tanımlı, mükerrer kullanılmaz. */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    ...buildOrganizationNode(),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escapeJsonLd(schema) }}
    />
  );
}
