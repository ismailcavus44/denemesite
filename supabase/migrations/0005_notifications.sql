-- Bildirimler tablosu
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid references questions(id) on delete cascade,
  type text not null default 'answer_published',
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on notifications (user_id);
create index if not exists notifications_created_at_idx on notifications (created_at);

-- RLS
alter table notifications enable row level security;

-- Kullanıcı sadece kendi bildirimlerini görebilir
create policy "notifications_select_own" on notifications
for select using (auth.uid() = user_id);

-- Kullanıcı sadece kendi bildirimlerini okundu olarak işaretleyebilir
create policy "notifications_update_own" on notifications
for update using (auth.uid() = user_id)
with check (auth.uid() = user_id);
