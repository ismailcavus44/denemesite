type AuthorPersonSchemaProps = {
  name: string;
  url: string;
  jobTitle?: string | null;
  sameAs?: string[];
};

export function AuthorPersonSchema({
  name,
  url,
  jobTitle,
  sameAs,
}: AuthorPersonSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url,
    ...(jobTitle?.trim() && { jobTitle: jobTitle.trim() }),
    ...(sameAs && sameAs.length > 0 && { sameAs }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
