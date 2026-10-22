import { escapeJsonLd } from "@/lib/jsonLd";

type AuthorPersonSchemaProps = {
  /** Yazar sayfasının tam URL'i. */
  url: string;
  /** buildAuthorPersonSchema çıktısı. */
  person: Record<string, unknown>;
};

/** Yazar sayfası: ProfilePage + mainEntity Person (Google profil sayfası önerisi). */
export function AuthorPersonSchema({ url, person }: AuthorPersonSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#profilepage`,
    url,
    inLanguage: "tr-TR",
    mainEntity: person,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escapeJsonLd(schema) }}
    />
  );
}
