export type Author = {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  photo_url: string | null;
  title?: string | null;
  bar_name?: string | null;
  bar_registration?: string | null;
  sameas_links?: string[] | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  whatsapp_url: string | null;
  created_at: string;
};

export type AuthorInsert = Omit<Author, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export type AuthorUpdate = Partial<Omit<Author, "id" | "created_at">>;
