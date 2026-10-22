import { toISO8601WithTimezone } from "@/lib/format-date";
import { escapeJsonLd } from "@/lib/jsonLd";
import { buildPublisherNode, WEBSITE_ID } from "@/lib/organization-schema";

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
  /** Varsa BlogPosting + author kullanılır. buildAuthorPersonSchema çıktısı (Person düğümü). */
  author?: Record<string, unknown>;
  /** Dipnot metinlerinden türetilen citation'lar. Boşsa hiç eklenmez. */
  citations?: string[];
};

export function ArticleSchema({
  headline,
  description,
  datePublished,
  dateModified,
  url,
  image,
  author,
  citations,
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
    inLanguage: "tr-TR",
    ...(url && { mainEntityOfPage: { "@type": "WebPage", "@id": url }, url }),
    isPartOf: { "@id": WEBSITE_ID },
    publisher: buildPublisherNode(),
    ...(image && image.startsWith("http") && {
      image: { "@type": "ImageObject", url: image },
    }),
    ...(author && { author }),
    ...(citations &&
      citations.length > 0 && {
        citation: citations.map((name) => ({
          "@type": "CreativeWork",
          name,
        })),
      }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escapeJsonLd(schema) }}
    />
  );
}
