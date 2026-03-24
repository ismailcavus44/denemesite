-- Soru Sor: kullanıcı iletişim talebi (isim + telefon; telefon questions.phone_number ile uyumlu)
alter table questions add column if not exists wants_contact boolean not null default false;
alter table questions add column if not exists contact_full_name text null;

comment on column questions.wants_contact is 'Kullanıcı soru için geri aranmak / iletişim istedi mi';
comment on column questions.contact_full_name is 'İletişim talebinde verilen isim soyisim';

alter table contact_messages add column if not exists question_id uuid references questions(id) on delete set null;
create index if not exists contact_messages_question_id_idx on contact_messages(question_id) where question_id is not null;
