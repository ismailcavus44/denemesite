import { siteConfig } from "@/lib/site";
import { authors } from "@/lib/authors";

const BASE_URL = siteConfig.url.replace(/\/$/, "");

/** Hakkımızda şeması: kurucu slug'ı. */
const FOUNDER_SLUG = "ismail-cavus";

/** Kişi bazında ek sameAs, knowsAbout, baro bilgisi. */
const PERSON_EXTRAS: Record<
  string,
  { sameAs?: string[]; knowsAbout?: string[]; baroName?: string; baroSicilNo?: string }
> = {
  "ismail-cavus": {
    knowsAbout: [
      "İş hukuku",
      "Trafik tazminat davaları",
      "Aile ve miras hukuku",
      "Askeri davalar",
      "Sağlık hukuku",
      "Malpraktis",
    ],
    baroName: "Ankara 2 No'lu Barosu",
    baroSicilNo: "3289",
  },
  "kaan-karayaka": {
    knowsAbout: ["İş hukuku", "Aile hukuku"],
  },
};

function authorToPerson(author: (typeof authors)[number], isFounder: boolean) {
  const displayName = author.title ? `${author.title} ${author.name}` : author.name;
  const sameAs: string[] = [];
  if (author.socials?.linkedin) sameAs.push(author.socials.linkedin);
  if (author.socials?.instagram) sameAs.push(author.socials.instagram);
  const extras = PERSON_EXTRAS[author.slug];
  if (extras?.sameAs?.length) sameAs.push(...extras.sameAs);

  const person: Record<string, unknown> = {
    "@type": "Person",
    name: displayName,
    description: author.bio,
    url: `${BASE_URL}/yazar/${author.slug}`,
    ...(sameAs.length > 0 && { sameAs }),
    ...(extras?.knowsAbout?.length && { knowsAbout: extras.knowsAbout }),
    ...(extras?.baroName && extras?.baroSicilNo && {
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "professional certification",
        name: `${extras.baroName}, Sicil No: ${extras.baroSicilNo}`,
      },
    }),
  };
  return person;
}

export function getAboutPageSchemaData() {
  const founder = authors.find((a) => a.slug === FOUNDER_SLUG);
  const employees = authors.filter((a) => a.slug !== FOUNDER_SLUG);

  const organization: Record<string, unknown> = {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: siteConfig.name,
    url: BASE_URL,
    ...(founder && { founder: authorToPerson(founder, true) }),
    ...(employees.length > 0 && {
      employee: employees.map((e) => authorToPerson(e, false)),
    }),
  };

  const aboutPage = {
    "@type": "AboutPage",
    "@id": `${BASE_URL}/hakkimizda#about`,
    name: "Hakkımızda",
    description: "YasalHaklarınız ekibi ve misyonu. Hukuki bilgilendirmeyi sade ve anlaşılır kılmak için çalışıyoruz.",
    url: `${BASE_URL}/hakkimizda`,
    mainEntity: organization,
  };

  return aboutPage;
}
