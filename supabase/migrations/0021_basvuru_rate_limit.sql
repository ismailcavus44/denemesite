-- Kariyer başvuru rate limit: IP başına 1 saatte en fazla 2 başvuru
create table if not exists basvuru_log (
  id uuid primary key default gen_random_uuid(),
  ip_address text not null,
  submitted_at timestamptz not null default now()
);

create index if not exists basvuru_log_ip_time
  on basvuru_log (ip_address, submitted_at desc);

alter table basvuru_log enable row level security;
-- Policy yok = sadece service role erişir
