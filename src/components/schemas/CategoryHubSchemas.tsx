import { siteConfig } from "@/lib/site";

const BASE_URL = siteConfig.url.replace(/\/$/, "");

type CategoryHubSchemasProps = {
  categoryName: string;
  categoryUrl: string;
  description?: string | null;
};

/** Kategori hub sayfası: BreadcrumbList + CollectionPage (tek script, @graph). */
export function CategoryHubSchemas({
  categoryName,
  categoryUrl,
  description,
}: CategoryHubSchemasProps) {
  const breadcrumbId = `${categoryUrl}#breadcrumb`;
  const graph = [
    {
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Anasayfa", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: categoryName, item: categoryUrl },
      ],
    },
    {
      "@type": "CollectionPage",
      name: `${categoryName} | ${siteConfig.name}`,
      description: description ?? undefined,
      url: categoryUrl,
      isPartOf: { "@id": `${BASE_URL}/#website` },
      breadcrumb: { "@id": breadcrumbId },
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
