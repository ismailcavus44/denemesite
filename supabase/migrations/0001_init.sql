-- YasalHaklariniz initial schema
create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null
);

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  slug text not null unique,
  category_id uuid references categories(id),
  status text not null default 'pending' check (status in ('pending','draft','published','rejected')),
  asker_email text null,
  views int not null default 0,
  created_at timestamptz not null default now(),
  published_at timestamptz null
);

create table if not exists answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid unique references questions(id) on delete cascade,
  answer_text text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists question_tags (
  question_id uuid references questions(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (question_id, tag_id)
);

create index if not exists questions_slug_idx on questions (slug);
create index if not exists questions_status_idx on questions (status);
create index if not exists questions_created_at_idx on questions (created_at);

create or replace function is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from profiles where id = uid and role = 'admin'
  );
$$;

alter table profiles enable row level security;
alter table categories enable row level security;
alter table tags enable row level security;
alter table questions enable row level security;
alter table answers enable row level security;
alter table question_tags enable row level security;

create policy "profiles_self_select" on profiles
for select using (auth.uid() = id);

create policy "profiles_insert_self" on profiles
for insert with check (auth.uid() = id);

create policy "questions_insert_public" on questions
for insert to public
with check (status = 'pending');

create policy "questions_select_published" on questions
for select to public
using (status = 'published');

create policy "questions_admin_select" on questions
for select
using (is_admin(auth.uid()));

create policy "questions_admin_update" on questions
for update
using (is_admin(auth.uid()));

create policy "answers_select_published" on answers
for select to public
using (
  exists (
    select 1 from questions
    where questions.id = answers.question_id
      and questions.status = 'published'
  )
);

create policy "answers_admin_select" on answers
for select using (is_admin(auth.uid()));

create policy "answers_admin_write" on answers
for insert with check (is_admin(auth.uid()));

create policy "answers_admin_update" on answers
for update using (is_admin(auth.uid()));

create policy "categories_select_public" on categories
for select to public using (true);

create policy "categories_admin_write" on categories
for insert with check (is_admin(auth.uid()));

create policy "categories_admin_update" on categories
for update using (is_admin(auth.uid()));

create policy "categories_admin_delete" on categories
for delete using (is_admin(auth.uid()));

create policy "tags_select_public" on tags
for select to public using (true);

create policy "tags_admin_write" on tags
for insert with check (is_admin(auth.uid()));

create policy "tags_admin_update" on tags
for update using (is_admin(auth.uid()));

create policy "tags_admin_delete" on tags
for delete using (is_admin(auth.uid()));

create policy "question_tags_select_public" on question_tags
for select to public
using (
  exists (
    select 1 from questions
    where questions.id = question_tags.question_id
      and questions.status = 'published'
  )
);

create policy "question_tags_admin_select" on question_tags
for select using (is_admin(auth.uid()));

create policy "question_tags_admin_write" on question_tags
for insert with check (is_admin(auth.uid()));

create policy "question_tags_admin_delete" on question_tags
for delete using (is_admin(auth.uid()));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role) values (new.id, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
