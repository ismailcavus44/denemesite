-- Kullanıcı kendi bildirimlerini silebilir
create policy "notifications_delete_own" on notifications
for delete using (auth.uid() = user_id);
