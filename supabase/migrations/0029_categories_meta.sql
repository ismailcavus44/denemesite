-- Kategori SEO: meta başlık ve açıklama
alter table categories
  add column if not exists meta_title text,
  add column if not exists meta_description text;

comment on column categories.meta_title is 'SEO meta title (tarayıcı sekmesi / arama sonucu)';
comment on column categories.meta_description is 'SEO meta description';
