-- Seed pillars for CONCEPT_LINK (tapu iptali, muris muvazaası, tenkis, irade sakatlığı, vekalet)
insert into pillars (title, slug, url, synonyms, is_active)
values
  (
    'Tapu iptali davası nedir?',
    'tapu-iptali-davasi',
    '/rehber/tapu-iptali-davasi',
    array['tapu iptali', 'tapu iptali ve tescil', 'kayıt iptali', 'baba tarlayı dayıya verdi', 'üzerine yaptı', 'elinden aldı', 'geri alabilir miyiz'],
    true
  ),
  (
    'Muris muvazaası nedir?',
    'muris-muvazaasi',
    '/rehber/muris-muvazaasi',
    array['muris muvazaası', 'mirasçı muvazaa', 'mirasçıların devirle hak kaybı', 'ölünceye kadar bakma', 'miras payı'],
    true
  ),
  (
    'Tenkis davası nedir?',
    'tenkis-davasi',
    '/rehber/tenkis-davasi',
    array['tenkis', 'tenkis davası', 'mirasçılık alacakları', 'saklı pay'],
    true
  ),
  (
    'İrade sakatlığı nedir?',
    'irade-sakatligi',
    '/rehber/irade-sakatligi',
    array['irade sakatlığı', 'ehliyetsizlik', 'baskı altında imza', 'imza attırdılar', 'kandırıldı', 'yaşlıydı', 'akıl sağlığı'],
    true
  ),
  (
    'Vekaletin kötüye kullanılması nedir?',
    'vekaletin-kotuye-kullanilmasi',
    '/rehber/vekaletin-kotuye-kullanilmasi',
    array['vekaletin kötüye kullanılması', 'vekalet', 'vekâlet', 'vekil elinden aldı'],
    true
  )
on conflict (slug) do update set
  title = excluded.title,
  url = excluded.url,
  synonyms = excluded.synonyms,
  is_active = excluded.is_active;
