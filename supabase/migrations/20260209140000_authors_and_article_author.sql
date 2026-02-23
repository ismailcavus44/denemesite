-- Yazar tablosu
create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  bio text,
  photo_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_authors_slug on public.authors(slug);

alter table public.authors enable row level security;

create policy "Public can read authors"
  on public.authors for select
  using (true);

-- articles tablosuna yazar ilişkisi
alter table public.articles
  add column if not exists author_id uuid references public.authors(id) on delete set null;

create index if not exists idx_articles_author_id on public.articles(author_id);

comment on column public.articles.author_id is 'Yazar (authors.id). Null ise yazar atanmamış.';
