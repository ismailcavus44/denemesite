import { toISO8601WithTimezone } from "@/lib/format-date";

type ArticleSchemaProps = {
  headline: string;
  description: string;
  /** Yayın tarihi; "YYYY-MM-DD" ise T12:00:00+03:00 eklenir (ISO 8601 + zaman dilimi). */
  datePublished: string;
  /** Güncelleme tarihi; verilmezse datePublished kullanılır. */
  dateModified?: string;
  url?: string;
  /** Öne çıkan görsel; mutlaka tam absolute URL (https://...). */
  image?: string;
  /** Varsa BlogPosting + author kullanılır. */
  author?: { name: string; url?: string; sameAs?: string[]; jobTitle?: string };
};

export function ArticleSchema({
  headline,
  description,
  datePublished,
  dateModified,
  url,
  image,
  author,
}: ArticleSchemaProps) {
  const publishedIso = toISO8601WithTimezone(datePublished);
  const modifiedIso = toISO8601WithTimezone(
    dateModified?.trim() ? dateModified : datePublished
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": author ? "BlogPosting" : "Article",
    headline,
    description,
    datePublished: publishedIso,
    dateModified: modifiedIso,
    ...(url && { mainEntityOfPage: { "@type": "WebPage", "@id": url } }),
    ...(image && image.startsWith("http") && {
      image: { "@type": "ImageObject", url: image },
    }),
    ...(author && {
      author: {
        "@type": "Person",
        name: author.name,
        ...(author.url && { url: author.url }),
        ...(author.jobTitle && { jobTitle: author.jobTitle }),
        ...(author.sameAs && author.sameAs.length > 0 && { sameAs: author.sameAs }),
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
