type BreadcrumbItem = { name: string; url?: string };

type BreadcrumbListSchemaProps = {
  items: BreadcrumbItem[];
};

/** Genel BreadcrumbList şeması. url yoksa o öğe "mevcut sayfa" kabul edilir; yine de item verilebilir. */
export function BreadcrumbListSchema({ items }: BreadcrumbListSchemaProps) {
  if (!items.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
