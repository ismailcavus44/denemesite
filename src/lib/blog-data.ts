/** Rehber içeriği: paragraf, başlık veya madde listesi. Metinde *...* arası bold. */
export type ContentBlock =
  | { t: "p"; v: string }
  | { t: "h2"; v: string }
  | { t: "h3"; v: string }
  | { t: "ul"; v: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  /** Kategori URL slug (topic silo: /[category]/rehber/[slug]) */
  categorySlug: string;
  /** Yazar sayfası slug (örn. ismail-cavus) */
  authorSlug?: string;
  date: string;
  readTime: string;
  /** Öne çıkan görsel (rehber detay sayfası). */
  image?: string;
  /** Anasayfa/rehber listesinde kartta kullanılacak görsel. Yoksa image kullanılır. */
  cardImage?: string;
  /** Görsel alt metni (yoksa "{title} avukata sor"). */
  imageAlt?: string;
  /** Arama için düz metin; contentBlocks varsa o render edilir. */
  content: string[];
  /** H2, H3, paragraf, liste ile zengin içerik (varsa kullanılır). */
  contentBlocks?: ContentBlock[];
  /** Sık sorulan sorular (accordion). */
  faq?: { question: string; answer: string }[];
  /** Özel meta başlık (yoksa title + site adı). */
  seoTitle?: string;
  /** Özel meta açıklama (yoksa summary). */
  seoDescription?: string;
};

/** Footer'da "Popüler Rehberler" bölümünde gösterilecek rehberler (slug, title, categorySlug). */
export const FOOTER_POPULAR_GUIDES: { slug: string; title: string; categorySlug: string }[] = [
  { slug: "muris-muvazaasi-nedir", title: "Muris Muvazaası Nedir?", categorySlug: "miras-hukuku" },
  { slug: "bosanma-davasi-nasil-acilir", title: "Boşanma Davası nasıl açılır", categorySlug: "aile-hukuku" },
  { slug: "isten-cikarilan-iscinin-haklari-nelerdir", title: "İşten çıkarılan işçinin hakları", categorySlug: "is-hukuku" },
];

/** Anasayfada "Rehber" bölümünde gösterilecek rehber slug'ları (statik, en fazla 3, sırayla). */
export const HOMEPAGE_REHBER_SLUGS: string[] = [];

/** Anasayfada "Rehber" bölümünde DB'den gösterilecek makale başlıkları (kısmi eşleşme). Her slot için ilk eşleşen makale alınır. */
export const HOMEPAGE_DYNAMIC_REHBER_TITLES: string[] = [
  "Muris muvazaası",
  "Boşanma davası nasıl açılır",
  "İşten çıkarılan işçinin hakları",
  "İşçi hakları",
];

export const blogPosts: BlogPost[] = [];
