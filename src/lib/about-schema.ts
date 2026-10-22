import { siteConfig } from "@/lib/site";
import { authors } from "@/lib/authors";
import { buildAuthorPersonSchema } from "@/lib/author-profile";
import { buildOrganizationNode } from "@/lib/organization-schema";

const BASE_URL = siteConfig.url.replace(/\/$/, "");

/** Hakkımızda şeması: kurucu slug'ı. */
const FOUNDER_SLUG = "ismail-cavus";

function authorToPerson(author: (typeof authors)[number]) {
  const person = buildAuthorPersonSchema(
    author.slug,
    author.name,
    BASE_URL,
    {
      title: author.title,
      linkedin_url: author.socials?.linkedin,
      instagram_url: author.socials?.instagram,
    },
    { description: author.bio, image: author.image }
  );
  // Organization'ın içinde gömülü olduğu için worksFor tekrarına gerek yok.
  const { worksFor: _worksFor, ...rest } = person;
  return rest;
}

export function getAboutPageSchemaData() {
  const founder = authors.find((a) => a.slug === FOUNDER_SLUG);
  const employees = authors.filter((a) => a.slug !== FOUNDER_SLUG);

  const organization: Record<string, unknown> = {
    ...buildOrganizationNode(),
    ...(founder && { founder: authorToPerson(founder) }),
    ...(employees.length > 0 && {
      employee: employees.map((e) => authorToPerson(e)),
    }),
  };

  const aboutPage = {
    "@type": "AboutPage",
    "@id": `${BASE_URL}/hakkimizda#about`,
    name: "Hakkımızda",
    description: "YasalHaklarınız ekibi ve misyonu. Hukuki bilgilendirmeyi sade ve anlaşılır kılmak için çalışıyoruz.",
    url: `${BASE_URL}/hakkimizda`,
    inLanguage: "tr-TR",
    mainEntity: organization,
  };

  return aboutPage;
}
