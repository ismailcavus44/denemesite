-- hukuk-rehberi kategorisi ve kira sorusu + cevabı (sayfa 404 vermesin)
insert into categories (slug, name)
values ('hukuk-rehberi', 'Hukuk Rehberi')
on conflict (slug) do update set name = excluded.name;

-- Soru: yoksa ekle, varsa category_id'yi hukuk-rehberi yap
with cat as (select id from categories where slug = 'hukuk-rehberi' limit 1)
insert into questions (title, body, slug, category_id, status, created_at, published_at)
select
  'Kira sözleşmem bitmeden evden çıkarsam ceza öder miyim?',
  'Kira sözleşmem bitmeden evden çıkarsam ceza öder miyim?',
  'kira-sozlesmem-bitmeden-evden-cikarsam',
  cat.id,
  'published',
  now(),
  now()
from cat
on conflict (slug) do update set
  category_id = (select id from categories where slug = 'hukuk-rehberi' limit 1),
  status = 'published';

-- Cevap: soru var ama cevap yoksa ekle
insert into answers (question_id, answer_text, created_by, created_at, updated_at)
select q.id, 'Kira süresi dolmadan çıkılması bazı durumlarda tazminat doğurabilir. Ancak haklı neden varsa sorumluluk oluşmayabilir.', null, now(), now()
from questions q
where q.slug = 'kira-sozlesmem-bitmeden-evden-cikarsam'
and not exists (select 1 from answers a where a.question_id = q.id);
