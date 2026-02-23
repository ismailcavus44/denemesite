export type ArticleStatus = "draft" | "published";

export type Article = {
  id: string;
  title: string;
  slug: string;
  /** URL segment: /[category]/rehber/[slug] */
  category: string | null;
  author_id: string | null;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  status: ArticleStatus;
  created_at: string;
  updated_at: string;
};

export type ArticleInsert = Omit<Article, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ArticleUpdate = Partial<Omit<Article, "id" | "created_at">>;
