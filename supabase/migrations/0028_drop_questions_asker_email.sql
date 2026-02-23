-- Ziyaretçi iletişimi artık sadece WhatsApp (phone_number) üzerinden; e-posta sütunu kaldırılıyor.
alter table questions
  drop column if exists asker_email;
