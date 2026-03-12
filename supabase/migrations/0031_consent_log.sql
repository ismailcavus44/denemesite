-- KVKK açık rıza logu: Onay zamanı, IP, açık rıza durumu (hukuki delil)
create table if not exists consent_log (
  id uuid primary key default gen_random_uuid(),
  ip_address text not null,
  consent_at timestamptz not null default now(),
  consent_status boolean not null default true,
  phone text,
  form_type text not null
);

comment on table consent_log is 'KVKK açık rıza kanıtı: Hangi IP, hangi zamanda, hangi formda onay verildi. Telefon opsiyonel.';
comment on column consent_log.consent_at is 'Onay verildiği an (gün, saat, dakika, saniye)';
comment on column consent_log.consent_status is 'Açık rıza = true';
comment on column consent_log.form_type is 'soru_sor | kariyer_basvuru';

create index if not exists consent_log_ip_at on consent_log (ip_address, consent_at desc);

alter table consent_log enable row level security;
