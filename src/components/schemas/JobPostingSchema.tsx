import { siteConfig } from "@/lib/site";

const BASE_URL = siteConfig.url.replace(/\/$/, "");

type JobPostingSchemaProps = {
  title: string;
  description: string;
  url: string;
  /** ISO tarih. Verilmezse bugün. */
  datePosted?: string;
  /** Varsayılan: VOLUNTEER (gönüllü). */
  employmentType?: "FULL_TIME" | "PART_TIME" | "CONTRACTOR" | "TEMPORARY" | "INTERN" | "VOLUNTEER";
};

/** Google Jobs için JobPosting şeması (editör/yazar alımı). */
export function JobPostingSchema({
  title,
  description,
  url,
  datePosted,
  employmentType = "VOLUNTEER",
}: JobPostingSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description: description.replace(/\s+/g, " ").trim(),
    datePosted: datePosted ?? new Date().toISOString().slice(0, 10),
    employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: siteConfig.name,
      sameAs: BASE_URL,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "TR",
        addressRegion: "Uzaktan",
      },
    },
    directApply: true,
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
