/** Admin "Önizle" ile rehber detay önizlemesi arasında taşınan veri. */
export const ARTICLE_PREVIEW_STORAGE_KEY = "yasalhaklariniz_article_preview";

export type ArticlePreviewAuthor = {
  name: string;
  slug: string;
  photoUrl?: string | null;
  title?: string | null;
};

export type ArticlePreviewData = {
  title: string;
  content: string;
  slug: string;
  category: string | null;
  categoryLabel: string | null;
  author: ArticlePreviewAuthor | null;
  faq: { question: string; answer: string }[];
  created_at: string;
  /** Son kayıt; yoksa created_at kullanılır. */
  updated_at?: string;
};
