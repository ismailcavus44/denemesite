import { getAboutPageSchemaData } from "@/lib/about-schema";

/** Hakkımızda sayfası: AboutPage + mainEntity (Organization: founder + employee). */
export function AboutPageSchema() {
  const schema = {
    "@context": "https://schema.org",
    ...getAboutPageSchemaData(),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
