type WebPageSchemaProps = {
  name: string;
  description: string;
  url: string;
};

/** Standart WebPage şeması (aksiyon/form sayfaları vb.). */
export function WebPageSchema({ name, description, url }: WebPageSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
