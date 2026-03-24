-- İletişim formu mesajları (admin panelinde listelenir; yazma yalnızca service role / API)
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  message text not null,
  whatsapp_consent boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on contact_messages (created_at desc);

comment on table contact_messages is 'İletişim sayfası formundan gelen mesajlar.';

alter table contact_messages enable row level security;

create policy "contact_messages_admin_select" on contact_messages
for select
using (is_admin(auth.uid()));

-- IP bazlı rate limit (iletişim formu)
create table if not exists contact_submission_log (
  id uuid primary key default gen_random_uuid(),
  ip_address text not null,
  submitted_at timestamptz not null default now()
);

create index if not exists contact_submission_log_ip_time
  on contact_submission_log (ip_address, submitted_at desc);

alter table contact_submission_log enable row level security;
