-- Yazar sosyal medya alanları
alter table public.authors
  add column if not exists linkedin_url text,
  add column if not exists instagram_url text,
  add column if not exists whatsapp_url text;

comment on column public.authors.linkedin_url is 'LinkedIn profil URL';
comment on column public.authors.instagram_url is 'Instagram profil URL';
comment on column public.authors.whatsapp_url is 'WhatsApp link (wa.me/...)';

-- Statik 2 yazarı ekle (varsa slug ile güncelle)
insert into public.authors (slug, name, bio, photo_url, linkedin_url, instagram_url, whatsapp_url)
values
  (
    'ismail-cavus',
    'İsmail Çavuş',
    'Av. İsmail Çavuş, Gazi Üniversitesi Hukuk Fakültesi 2020 mezunu olup Ankara 2 No''lu Barosu''na bağlı serbest avukat olarak çalışmaktadır. İş hukuku, trafik tazminat davaları, aile ve miras hukuku, askeri davalar ve sağlık hukuku alanlarında tecrübelidir; malpraktis davalarında doktor vekilliği ve sağlık personelinin idari ve disiplin süreçlerinde danışmanlık vermektedir. Çözüm odaklı ve profesyonel hukuki hizmet sunmayı ilke edinmiştir.',
    '/av-ismail-cavus.jpg',
    'https://www.linkedin.com/in/ismail-cavus/',
    'https://www.instagram.com/av.ismailcavus/',
    'https://wa.me/905102206945'
  ),
  (
    'kaan-karayaka',
    'Av. Kaan Karayaka',
    'Hukuk dünyasındaki gelişmeleri yakından takip eden Av. Kaan Karayaka, özellikle İş ve Aile Hukuku disiplinlerinde edindiği tecrübeyi akademik bir titizlikle pratiğe dökmektedir. Hazırladığı rehber yazılarla toplumu hukuki hakları konusunda bilinçlendirmeyi görev edinen Karayaka, uyuşmazlıkların çözümünde stratejik ve sonuç odaklı bir yaklaşım benimsemektedir.',
    '/av-kaan-karayaka.png',
    'https://www.linkedin.com/in/avukat-kaan-karayaka/',
    null,
    'https://wa.me/90'
  )
on conflict (slug) do update set
  name = excluded.name,
  bio = excluded.bio,
  photo_url = excluded.photo_url,
  linkedin_url = excluded.linkedin_url,
  instagram_url = excluded.instagram_url,
  whatsapp_url = excluded.whatsapp_url;
