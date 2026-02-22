type ArticleSchemaProps = {
  headline: string;
  description: string;
  /** Yayın tarihi; "YYYY-MM-DD" ise T12:00:00+03:00 eklenir (ISO 8601 + zaman dilimi). */
  datePublished: string;
  url?: string;
  /** Öne çıkan görsel; mutlaka tam absolute URL (https://...). */
  image?: string;
  /** Varsa BlogPosting + author kullanılır. */
  author?: { name: string; url?: string };
};

/** "YYYY-MM-DD" → ISO 8601 datetime + Türkiye zaman dilimi. */
function toISO8601WithTimezone(dateStr: string): string {
  const trimmed = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return `${trimmed}T12:00:00+03:00`;
  }
  return trimmed;
}

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
    datePublished: toISO8601WithTimezone(datePublished),
    ...(url && { mainEntityOfPage: { "@type": "WebPage", "@id": url } }),
    ...(image && image.startsWith("http") && {
      image: { "@type": "ImageObject", url: image },
    }),
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
