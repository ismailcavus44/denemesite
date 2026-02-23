-- Admin kullanıcılar taslak dahil tüm makaleleri okuyabilsin (liste/düzenleme sayfaları için)
create policy "Admin can read all articles"
  on public.articles for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
