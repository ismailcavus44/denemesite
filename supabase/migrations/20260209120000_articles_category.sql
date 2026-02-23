-- Topic Cluster: URL /[category]/rehber/[slug]; category sütunu
alter table public.articles
  add column if not exists category text;

-- Aynı slug farklı kategoride olabilsin; benzersizlik (category, slug) ile
alter table public.articles drop constraint if exists articles_slug_key;
create unique index if not exists idx_articles_category_slug_unique
  on public.articles (category, slug)
  where category is not null;

-- category null olan satırlar için slug tek kalmalı (eski veri)
create unique index if not exists idx_articles_slug_null_category_unique
  on public.articles (slug)
  where category is null;

create index if not exists idx_articles_category on public.articles(category);

comment on column public.articles.category is 'URL segment: /[category]/rehber/[slug] (örn. aile-hukuku, miras-hukuku)';
