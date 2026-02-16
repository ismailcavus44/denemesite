-- Soru detay sayfasında cevap kartı sonunda gösterilecek rehber linki (iç link CTA).
alter table questions
  add column if not exists related_guide_url text,
  add column if not exists related_guide_label text;

comment on column questions.related_guide_url is 'Cevap sonunda CTA olarak gösterilecek rehber sayfası URL (örn. /hukuk-rehberi/rehber/kira-sorunlarinda-ilk-adimlar).';
comment on column questions.related_guide_label is 'CTA butonunda görünecek metin (örn. Kira sorunlarında ilk adımlar).';
