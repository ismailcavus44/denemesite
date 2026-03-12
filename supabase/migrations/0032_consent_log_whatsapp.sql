-- WhatsApp açık rıza kanıtı (telefon girildiğinde)
alter table consent_log add column if not exists whatsapp_consent boolean default null;
comment on column consent_log.whatsapp_consent is 'WhatsApp bildirimi ve yurtdışı aktarım için açık rıza (telefon girildiğinde true)';
