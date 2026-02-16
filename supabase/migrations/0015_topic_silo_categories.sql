-- Topic-silo URL yapısı için kategori slug'ları
-- /[category], /[category]/soru/[slug], /[category]/rehber/[slug]
-- İş Hukuku, Miras Hukuku, Ceza Hukuku, İcra Hukuku,
-- Gayrimenkul Hukuku, Aile Hukuku, Diğer
insert into categories (slug, name)
values
  ('is-hukuku', 'İş Hukuku'),
  ('miras-hukuku', 'Miras Hukuku'),
  ('ceza-hukuku', 'Ceza Hukuku'),
  ('icra-hukuku', 'İcra Hukuku'),
  ('gayrimenkul-hukuku', 'Gayrimenkul Hukuku'),
  ('aile-hukuku', 'Aile Hukuku'),
  ('diger', 'Diğer')
on conflict (slug) do update set name = excluded.name;
