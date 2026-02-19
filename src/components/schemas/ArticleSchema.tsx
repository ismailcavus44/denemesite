type ArticleSchemaProps = {
  headline: string;
  description: string;
  datePublished: string;
  url?: string;
  image?: string;
};

export function ArticleSchema({
  headline,
  description,
  datePublished,
  url,
  image,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    datePublished,
    ...(url && { mainEntityOfPage: { "@type": "WebPage", "@id": url } }),
    ...(image && { image }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
