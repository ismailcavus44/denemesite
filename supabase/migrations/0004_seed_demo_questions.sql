insert into categories (slug, name)
values ('miras-payli-mulkiyet', 'Miras ve Payli Mulkiyet')
on conflict (slug) do update set name = excluded.name;

with category as (
  select id from categories where slug = 'miras-payli-mulkiyet' limit 1
),
q1 as (
  insert into questions (
    title,
    body,
    slug,
    category_id,
    status,
    created_at,
    published_at
  )
  select
    'Annemden kalan arsaya abim kendi parasıyla ev yaptı ama tapu ortak. Benim de payım var. Bu ev üzerinde hakkım olur mu?',
    'Annemden kalan arsaya abim kendi parasıyla ev yaptı ama tapu ortak. Benim de payım var. Bu ev üzerinde hakkım olur mu?',
    'annemden-kalan-arsaya-abim-ev-yapti',
    category.id,
    'published',
    now(),
    now()
  from category
  on conflict (slug) do update
    set title = excluded.title,
        body = excluded.body,
        category_id = excluded.category_id,
        status = excluded.status,
        published_at = excluded.published_at
  returning id
),
q2 as (
  insert into questions (
    title,
    body,
    slug,
    category_id,
    status,
    created_at,
    published_at
  )
  select
    'Ortak tapulu bir arsada diğer hissedar benden izinsiz ev yaptı. Satış olursa ne olur?',
    'Ortak tapulu bir arsada diğer hissedar benden izinsiz ev yaptı. Satış olursa ne olur?',
    'ortak-tapulu-arsada-izinsiz-ev',
    category.id,
    'published',
    now(),
    now()
  from category
  on conflict (slug) do update
    set title = excluded.title,
        body = excluded.body,
        category_id = excluded.category_id,
        status = excluded.status,
        published_at = excluded.published_at
  returning id
),
q3 as (
  insert into questions (
    title,
    body,
    slug,
    category_id,
    status,
    created_at,
    published_at
  )
  select
    'Babamdan kalan hisseli tarlaya kardeşim ev yaptı. Ben dava açabilir miyim?',
    'Babamdan kalan hisseli tarlaya kardeşim ev yaptı. Ben dava açabilir miyim?',
    'hisseli-tarlaya-ev-dava-acabilir-miyim',
    category.id,
    'published',
    now(),
    now()
  from category
  on conflict (slug) do update
    set title = excluded.title,
        body = excluded.body,
        category_id = excluded.category_id,
        status = excluded.status,
        published_at = excluded.published_at
  returning id
),
q4 as (
  insert into questions (
    title,
    body,
    slug,
    category_id,
    status,
    created_at,
    published_at
  )
  select
    'Kardeşim miras kalan arsaya ev yaptı, şimdi evi satmak istiyor. Böyle bir hakkı var mı?',
    'Kardeşim miras kalan arsaya ev yaptı, şimdi evi satmak istiyor. Böyle bir hakkı var mı?',
    'miras-arsaya-ev-yapti-satmak-istiyor',
    category.id,
    'published',
    now(),
    now()
  from category
  on conflict (slug) do update
    set title = excluded.title,
        body = excluded.body,
        category_id = excluded.category_id,
        status = excluded.status,
        published_at = excluded.published_at
  returning id
),
q5 as (
  insert into questions (
    title,
    body,
    slug,
    category_id,
    status,
    created_at,
    published_at
  )
  select
    'Ortak tapulu arsada yapılan ev yıkılır mı, hakkımı nasıl korurum?',
    'Ortak tapulu arsada yapılan ev yıkılır mı, hakkımı nasıl korurum?',
    'ortak-tapulu-arsada-ev-yikilir-mi',
    category.id,
    'published',
    now(),
    now()
  from category
  on conflict (slug) do update
    set title = excluded.title,
        body = excluded.body,
        category_id = excluded.category_id,
        status = excluded.status,
        published_at = excluded.published_at
  returning id
)
insert into answers (question_id, answer_text, created_by, created_at, updated_at)
select q1.id,
  'Bu tür durumlarda, arsa üzerine yapılan yapının kime ait olduğunun tespiti önemlidir. Eğer ev, abinizin kendi emeği ve masrafıyla yapılmışsa bu yapı muhdesat olarak değerlendirilir. Muhdesatın kime ait olduğu kabul edilirse, arsa payınız devam eder ancak ev arsa payından ayrı bir hak konusu olabilir. Muhdesat tespit edilmeden yapılacak bir satışta ise ev de arsayla birlikte elden çıkabilir ve hak kaybı yaşanabilir.',
  null::uuid,
  now(),
  now()
from q1
union all
select q2.id,
  'Ortak tapulu taşınmazlarda yapılan izinsiz yapılar ciddi sorunlara yol açabilir. Eğer yapılan ev muhdesat olarak kabul edilirse, bu yapının kime ait olduğu ayrıca değerlendirilir. Ancak muhdesat tespiti yapılmamışsa, ortaklığın giderilmesi sürecinde arsa ile birlikte satış konusu olabilir. Bu da yapıyı yapan kişinin ev üzerinde hak iddia edememesine neden olabilir.',
  null::uuid,
  now(),
  now()
from q2
union all
select q3.id,
  'Hisseli taşınmazlarda paydaşlardan birinin tek başına ev yapması, diğer paydaşların haklarını ortadan kaldırmaz. Bu durumda yapılan yapı muhdesat kapsamında değerlendirilir. Muhdesatın kime ait olduğu netleşmeden açılacak bir ortaklığın giderilmesi davasında, ev de taşınmazla birlikte satılabilir. Bu nedenle sürecin doğru yönetilmesi hak kaybını önlemek açısından önemlidir.',
  null::uuid,
  now(),
  now()
from q3
union all
select q4.id,
  'Arsa ortak tapuluysa, tek başına ev yapmak kişiye arsayı veya evi satma hakkı vermez. Yapılan ev muhdesat sayılabilir ancak bu, yapının kime ait olduğunun ayrıca tespit edilmesini gerektirir. Muhdesat tespiti olmadan yapılacak işlemler hukuki uyuşmazlıklara yol açabilir ve satış geçersiz hale gelebilir.',
  null::uuid,
  now(),
  now()
from q4
union all
select q5.id,
  'Ortak tapulu taşınmazlarda yapılan evler kendiliğinden yıkılmaz. Ancak muhdesat olarak kabul edilip edilmediği belirleyici olur. Muhdesatın kime ait olduğu tespit edilmezse, satış veya ortaklığın giderilmesi sürecinde ev de taşınmazla birlikte elden çıkabilir. Hak kaybı yaşamamak için muhdesatın tespitine yönelik adımların zamanında atılması gerekir.',
  null::uuid,
  now(),
  now()
from q5
on conflict (question_id) do update set answer_text = excluded.answer_text, updated_at = excluded.updated_at;
