import { getAuthorBySlug, type Author as StaticAuthor } from "@/lib/authors";

/** Statik yazarlar için baro/unvan yedekleri (migration öncesi veya boş DB alanları). */
const STATIC_EEAT: Record<
  string,
  { title?: string; barName?: string; barRegistration?: string }
> = {
  "ismail-cavus": {
    title: "Av.",
    barName: "Ankara 2 No'lu Barosu",
    barRegistration: "3289",
  },
  "kaan-karayaka": {
    title: "Av.",
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
  if (socials?.whatsapp?.trim()) urls.push(socials.whatsapp.trim());

  return [...new Set(urls)];
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
    whatsapp: db?.whatsapp_url ?? staticAuthor?.socials?.whatsapp,
  });

  return { title, barName, barRegistration, sameAs };
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

/** Makale JSON-LD author nesnesi. */
export function buildArticleAuthorSchema(
  slug: string,
  name: string,
  baseUrl: string,
  db?: AuthorEeatFields | null
) {
  const staticAuthor = getAuthorBySlug(slug);
  const eeat = resolveAuthorEeat(slug, db, staticAuthor);
  const displayName = formatAuthorDisplayName(name, eeat.title);
  const sameAs = eeat.sameAs.length > 0 ? eeat.sameAs : undefined;

  return {
    name: displayName,
    url: `${baseUrl.replace(/\/$/, "")}/yazar/${slug}`,
    ...(eeat.title && { jobTitle: eeat.title }),
    ...(sameAs && { sameAs }),
  };
}
