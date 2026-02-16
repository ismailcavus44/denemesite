-- Bildirim e-postası tercihi (profil sayfasından kapatılabilir)
alter table profiles
add column if not exists email_bildirim boolean not null default true;

-- Kullanıcı kendi profilinde sadece email_bildirim alanını güncelleyebilir
create policy "profiles_self_update" on profiles
for update using (auth.uid() = id)
with check (auth.uid() = id);
