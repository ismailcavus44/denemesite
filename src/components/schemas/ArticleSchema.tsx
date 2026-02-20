type ArticleSchemaProps = {
  headline: string;
  description: string;
  datePublished: string;
  url?: string;
  image?: string;
  /** Varsa BlogPosting + author kullanılır. */
  author?: { name: string; url?: string };
};

export function ArticleSchema({
  headline,
  description,
  datePublished,
  url,
  image,
  author,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": author ? "BlogPosting" : "Article",
    headline,
    description,
    datePublished,
    ...(url && { mainEntityOfPage: { "@type": "WebPage", "@id": url } }),
    ...(image && { image }),
    ...(author && {
      author: {
        "@type": "Person",
        name: author.name,
        ...(author.url && { url: author.url }),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
