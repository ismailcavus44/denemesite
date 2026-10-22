import { getAuthorBySlug, type Author as StaticAuthor } from "@/lib/authors";

/** Statik yazarlar için baro/unvan yedekleri (migration öncesi veya boş DB alanları). */
const STATIC_EEAT: Record<
  string,
  { title?: string; barName?: string; barRegistration?: string; knowsAbout?: string[] }
> = {
  "ismail-cavus": {
    title: "Av.",
    barName: "Ankara 2 No'lu Barosu",
    barRegistration: "3289",
    knowsAbout: [
      "İş hukuku",
      "Trafik tazminat davaları",
      "Aile ve miras hukuku",
      "Askeri davalar",
      "Sağlık hukuku",
      "Malpraktis",
    ],
  },
  "kaan-karayaka": {
    title: "Av.",
    knowsAbout: ["İş hukuku", "Aile hukuku"],
  },
};

export type AuthorEeatFields = {
  title?: string | null;
  bar_name?: string | null;
  bar_registration?: string | null;
  sameas_links?: unknown;
  linkedin_url?: string | null;
  instagram_url?: string | null;
  whatsapp_url?: string | null;
};

export function parseSameAsLinks(
  raw: unknown,
  socials?: {
    linkedin?: string | null;
    instagram?: string | null;
    whatsapp?: string | null;
  }
): string[] {
  const urls: string[] = [];

  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (typeof item === "string" && item.trim().startsWith("http")) {
        urls.push(item.trim());
      }
    }
  } else if (typeof raw === "string" && raw.trim()) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return parseSameAsLinks(parsed, socials);
      }
    } catch {
      for (const part of raw.split(",")) {
        const u = part.trim();
        if (u.startsWith("http")) urls.push(u);
      }
    }
  }

  if (urls.length > 0) return [...new Set(urls)];

  if (socials?.linkedin?.trim()) urls.push(socials.linkedin.trim());
  if (socials?.instagram?.trim()) urls.push(socials.instagram.trim());

  // WhatsApp gibi doğrudan iletişim linkleri yayınlanmaz.
  return [...new Set(urls)].filter((u) => !/wa\.me|whatsapp/i.test(u));
}

export function resolveAuthorEeat(
  slug: string,
  db?: AuthorEeatFields | null,
  staticAuthor?: StaticAuthor | null
) {
  const staticEeat = STATIC_EEAT[slug];
  const title =
    db?.title?.trim() ||
    staticAuthor?.title?.trim() ||
    staticEeat?.title ||
    null;
  const barName = db?.bar_name?.trim() || staticEeat?.barName || null;
  const barRegistration =
    db?.bar_registration?.trim() || staticEeat?.barRegistration || null;
  const sameAs = parseSameAsLinks(db?.sameas_links, {
    linkedin: db?.linkedin_url ?? staticAuthor?.socials?.linkedin,
    instagram: db?.instagram_url ?? staticAuthor?.socials?.instagram,
  });

  const knowsAbout = staticEeat?.knowsAbout ?? [];

  return { title, barName, barRegistration, sameAs, knowsAbout };
}

export function formatAuthorDisplayName(
  name: string,
  title?: string | null
): string {
  const t = title?.trim();
  if (!t) return name;
  if (name.trim().toLowerCase().startsWith(t.toLowerCase())) return name;
  return `${t} ${name}`;
}

export function formatBarRegistrationLine(
  barName?: string | null,
  barRegistration?: string | null
): string | null {
  const reg = barRegistration?.trim();
  if (!reg) return null;
  const bar = barName?.trim();
  return bar ? `${bar} - Sicil No: ${reg}` : `Sicil No: ${reg}`;
}

/** "Av." gibi kısaltmaları şemada okunur meslek adına çevirir. */
function jobTitleFromTitle(title?: string | null): string | null {
  const t = title?.trim();
  if (!t) return null;
  return /^av\.?$/i.test(t) ? "Avukat" : t;
}

/**
 * Yazar için JSON-LD Person düğümü (makale, yazar sayfası ve hakkımızda ortak).
 * Baro sicili hasCredential, uzmanlık alanları knowsAbout olarak verilir.
 */
export function buildAuthorPersonSchema(
  slug: string,
  name: string,
  baseUrl: string,
  db?: AuthorEeatFields | null,
  extra?: { description?: string | null; image?: string | null }
): Record<string, unknown> {
  const base = baseUrl.replace(/\/$/, "");
  const staticAuthor = getAuthorBySlug(slug);
  const eeat = resolveAuthorEeat(slug, db, staticAuthor);
  const url = `${base}/yazar/${slug}`;
  const jobTitle = jobTitleFromTitle(eeat.title);
  const image = extra?.image?.trim();

  return {
    "@type": "Person",
    "@id": `${url}#person`,
    name: formatAuthorDisplayName(name, eeat.title),
    url,
    ...(jobTitle && { jobTitle }),
    ...(extra?.description?.trim() && { description: extra.description.trim() }),
    ...(image && { image: image.startsWith("http") ? image : `${base}${image}` }),
    ...(eeat.sameAs.length > 0 && { sameAs: eeat.sameAs }),
    ...(eeat.knowsAbout.length > 0 && { knowsAbout: eeat.knowsAbout }),
    ...(eeat.barRegistration && {
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Avukatlık ruhsatı",
        name: formatBarRegistrationLine(eeat.barName, eeat.barRegistration),
        ...(eeat.barName && { recognizedBy: { "@type": "Organization", name: eeat.barName } }),
      },
    }),
    worksFor: { "@id": `${base}/#organization` },
  };
}

/** Makale JSON-LD author nesnesi. */
export function buildArticleAuthorSchema(
  slug: string,
  name: string,
  baseUrl: string,
  db?: AuthorEeatFields | null
) {
  return buildAuthorPersonSchema(slug, name, baseUrl, db);
}
