-- Toplu reklam / bilgilendirme mailleri için toplanan e-posta adresleri.
create table if not exists email_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text null,
  created_at timestamptz not null default now()
);

create index if not exists email_subscribers_email_idx on email_subscribers (email);

alter table email_subscribers enable row level security;

create policy "email_subscribers_admin_select"
  on email_subscribers for select
  using (is_admin(auth.uid()));

-- Mevcut soru gönderen e-postalarını ekle (tekil e-posta).
insert into email_subscribers (email, source)
select distinct trim(asker_email), 'questions'
from questions
where asker_email is not null and trim(asker_email) <> ''
on conflict (email) do nothing;
