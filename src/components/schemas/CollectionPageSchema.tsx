import { escapeJsonLd } from "@/lib/jsonLd";
import { WEBSITE_ID } from "@/lib/organization-schema";

type CollectionPageSchemaProps = {
  name: string;
  description: string;
  url: string;
  /** Sayfada listelenen yazılar (görünen sırayla). */
  items: { name: string; url: string }[];
  /** Ekmek kırıntısı (ad + tam URL); son öğe bu sayfa. */
  breadcrumb: { name: string; url: string }[];
};

/** Rehber liste sayfaları: CollectionPage + ItemList + BreadcrumbList (tek @graph). */
export function CollectionPageSchema({ name, description, url, items, breadcrumb }: CollectionPageSchemaProps) {
  const breadcrumbId = `${url}#breadcrumb`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        name,
        description,
        url,
        inLanguage: "tr-TR",
        isPartOf: { "@id": WEBSITE_ID },
        breadcrumb: { "@id": breadcrumbId },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: items.length,
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            url: item.url,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: breadcrumb.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: b.url,
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escapeJsonLd(schema) }}
    />
  );
}
