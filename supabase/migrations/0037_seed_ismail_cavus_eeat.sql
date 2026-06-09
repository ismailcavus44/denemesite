-- İsmail Çavuş yazar E-E-A-T alanları (0036 migration'dan sonra çalıştırın)
update public.authors
set
  title = 'Av.',
  bar_name = 'Ankara 2 No''lu Barosu',
  bar_registration = '3289',
  linkedin_url = 'https://www.linkedin.com/in/ismail-cavus/',
  instagram_url = 'https://www.instagram.com/av.ismailcavus/',
  whatsapp_url = 'https://wa.me/905102206945',
  sameas_links = '[
    "https://www.linkedin.com/in/ismail-cavus/",
    "https://x.com/avismailcavus",
    "https://www.instagram.com/av.ismailcavus/",
    "https://wa.me/905102206945"
  ]'::jsonb
where slug = 'ismail-cavus';
