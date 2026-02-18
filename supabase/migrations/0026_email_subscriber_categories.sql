-- Abone–kategori eşleştirmesi: hangi abonenin hangi kategoride soru sorduğu
create table if not exists email_subscriber_categories (
  subscriber_id uuid not null references email_subscribers(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  primary key (subscriber_id, category_id)
);

create index if not exists email_subscriber_categories_category_id_idx
  on email_subscriber_categories (category_id);

alter table email_subscriber_categories enable row level security;

create policy "email_subscriber_categories_admin_select"
  on email_subscriber_categories for select
  using (is_admin(auth.uid()));

-- Mevcut sorulardan backfill: her (email, category_id) için abone varsa eşle
insert into email_subscriber_categories (subscriber_id, category_id)
select es.id, q.category_id
from questions q
join email_subscribers es on trim(lower(q.asker_email)) = lower(es.email)
where q.asker_email is not null and trim(q.asker_email) <> '' and q.category_id is not null
on conflict (subscriber_id, category_id) do nothing;
