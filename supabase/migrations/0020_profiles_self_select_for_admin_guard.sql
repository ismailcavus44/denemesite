-- AdminGuard, giriş yapan kullanıcının kendi profilini (role) okumak için
-- REST API'ye kullanıcı token'ı ile istek atıyor. RLS'te bu okumaya izin vermek gerekir.
create policy "profiles_self_select" on profiles
for select using (auth.uid() = id);
