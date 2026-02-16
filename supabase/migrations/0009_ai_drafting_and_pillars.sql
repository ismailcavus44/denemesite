-- AI drafting columns on questions
alter table questions
  add column if not exists ai_title text,
  add column if not exists ai_answer_draft text,
  add column if not exists ai_main_concept text,
  add column if not exists ai_pillar_slug text,
  add column if not exists ai_pillar_url text,
  add column if not exists ai_card_summary text,
  add column if not exists seo_slug text,
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists ai_version text default 'v1',
  add column if not exists ai_updated_at timestamptz;

-- Pillars table (hub pages for concept linking)
create table if not exists pillars (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  url text not null,
  synonyms text[] default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists pillars_slug_idx on pillars (slug);
create index if not exists pillars_is_active_idx on pillars (is_active) where is_active = true;

alter table pillars enable row level security;

create policy "pillars_select_active"
  on pillars for select
  using (is_active = true);

create policy "pillars_admin_all"
  on pillars for all
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );
