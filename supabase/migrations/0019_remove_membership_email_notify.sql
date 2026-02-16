-- Üyelik sistemini kaldır: sorular e-posta ile eşlensin, sadece admin girişi kalsın.

-- 1. Soru sahipliği (user_id) kaldır
drop policy if exists "questions_select_own" on questions;
alter table questions drop column if exists user_id;

-- 2. Site içi bildirimler tablosu ve politikaları kaldır
drop policy if exists "notifications_select_own" on notifications;
drop policy if exists "notifications_update_own" on notifications;
drop policy if exists "notifications_delete_own" on notifications;
drop table if exists notifications;

-- 3. Yeni kullanıcı kaydında otomatik profil oluşturmayı kapat (artık sadece manuel admin)
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 4. Üye profil güncellemesi (email_bildirim vb.) kaldır — artık üye yok
drop policy if exists "profiles_self_update" on profiles;
drop policy if exists "profiles_self_select" on profiles;

-- questions.asker_email zaten 0001'de var (text null). Ek sütun yok.
