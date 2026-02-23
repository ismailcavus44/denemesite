-- Makale yönetim sistemi: articles tablosu
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null default '',
  meta_title text,
  meta_description text,
  featured_image_url text,
  featured_image_alt text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_articles_slug on public.articles(slug);
create index if not exists idx_articles_status on public.articles(status);

-- RLS: Servis rolü (admin) zaten tüm erişime sahip. İstemci okuma için policy (published).
alter table public.articles enable row level security;

create policy "Public can read published articles"
  on public.articles for select
  using (status = 'published');

-- Admin yazma: service_role ile yapılacak (API/admin), ek policy gerekmez.
-- Güncelleme zamanı trigger (opsiyonel)
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists articles_updated_at on public.articles;
create trigger articles_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();
