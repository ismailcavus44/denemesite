-- WhatsApp bildirimi için soru sahibi telefon numarası (E.164, isteğe bağlı)
alter table questions
  add column if not exists phone_number text null;

comment on column questions.phone_number is 'Cevaplandığında WhatsApp bildirimi gönderilecek numara; E.164 formatında (örn. +905301234567).';
