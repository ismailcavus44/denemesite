-- Yazar E-E-A-T alanları (Supabase SQL Editor'da çalıştırın)
alter table public.authors
  add column if not exists title text,
  add column if not exists bar_name text,
  add column if not exists bar_registration text,
  add column if not exists sameas_links jsonb default '[]'::jsonb;

comment on column public.authors.title is 'Unvan (örn. Av.)';
comment on column public.authors.bar_name is 'Baro adı (örn. Ankara 2 No''lu Barosu)';
comment on column public.authors.bar_registration is 'Baro sicil numarası';
comment on column public.authors.sameas_links is 'Dış profil URL listesi (JSON array, örn. ["https://linkedin.com/in/..."])';
