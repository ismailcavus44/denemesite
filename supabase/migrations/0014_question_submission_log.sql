-- IP bazlı rate limit: 1 saatte en fazla 3 soru
create table if not exists question_submission_log (
  id uuid primary key default gen_random_uuid(),
  ip_address text not null,
  submitted_at timestamptz not null default now()
);

create index if not exists question_submission_log_ip_time
  on question_submission_log (ip_address, submitted_at desc);

alter table question_submission_log enable row level security;

-- Sadece service role yazabilsin; anon/authenticated erişemesin
-- (RLS açık, policy yok = sadece service role bypass ile yazabilir)
