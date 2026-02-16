# YasalHaklariniz

Modern hukuk soru-cevap portalı. Next.js App Router + Supabase + shadcn/ui.

## Kurulum

```bash
npm install
```

`.env.local` dosyası oluşturun:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Veritabanı (Supabase)

1. `supabase/migrations/0001_init.sql` dosyasını Supabase SQL Editor ile çalıştırın.
2. Supabase Auth üzerinden admin kullanıcınızı oluşturun.
3. Admin kullanıcı için `profiles.role` alanını `admin` olarak güncelleyin:

```sql
update profiles set role = 'admin' where id = '<admin-user-uuid>';
```

## Geliştirme

```bash
npm run dev
```

Uygulama: `http://localhost:3000`

## Önemli Notlar

- Sorular anonim olarak gönderilebilir.
- Yalnızca `admin` rolü olan kullanıcılar cevap ekleyebilir ve yayımlayabilir.
- SEO için sitemap, robots ve QAPage schema eklidir.
