-- Kategori pillar sayfası: intro, pillar_md, updated_at
-- top_links her istekte rehber/soru listesinden (views) hesaplanır, saklanmaz
alter table categories
  add column if not exists intro text,
  add column if not exists pillar_md text,
  add column if not exists updated_at timestamptz default now();
