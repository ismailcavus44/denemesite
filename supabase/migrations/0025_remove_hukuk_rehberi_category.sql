-- Hukuk Rehberi kategorisini kaldır: ilgili soruları Diğer'e taşı, sonra kategoriyi sil
with target as (select id from categories where slug = 'diger' limit 1),
     old_cat as (select id from categories where slug = 'hukuk-rehberi' limit 1)
update questions
set category_id = (select id from target)
where category_id = (select id from old_cat);

delete from categories where slug = 'hukuk-rehberi';
