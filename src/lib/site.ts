export const siteConfig = {
  name: "YasalHaklarınız",
  homeTitle: "Yasal Haklarınız: Miras, Boşanma, İş ve İcra Hukuku Rehberi",
  description:
    "Miras, boşanma, iş hukuku ve icra konularında avukatlar tarafından hazırlanan sade, güncel ve kaynaklı hukuk rehberi. Haklarınızı öğrenin, hak kaybı yaşamayın.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://yasalhaklariniz.com",
  /** İletişim sayfası ve mailto için e-posta adresi. */
  contactEmail: "bilgi@yasalhaklariniz.com",
  /** Kariyer başvuruları için e-posta adresi. */
  kariyerEmail: "kariyer@yasalhaklariniz.com",
  social: {
    instagram: "https://instagram.com/yasalhaklariniz",
    facebook: "https://www.facebook.com/profile.php?id=61571165892545&locale=tr_TR",
    x: "https://x.com/yasalhaklariniz",
    tiktok: "https://tiktok.com/@yasalhaklariniz",
    linkedin: "https://linkedin.com/company/yasal-haklariniz",
    youtube: "https://youtube.com/@yasalhaklariniz",
  },
};

/** Varsayılan paylaşım görseli (1200x630). Alt sayfalar openGraph tanımlayınca üst ayardaki görsel silindiği için her sayfada açıkça verilir. */
export const defaultOgImage = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "YasalHaklarınız",
};

/** Meta açıklamayı kelime sınırında ~155 karaktere kısaltır. */
export function toMetaDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.]+$/, "")}…`;
}
