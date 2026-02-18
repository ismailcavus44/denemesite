# LCP ve Performans Optimizasyonları Raporu

Bu dokümanda yapılan değişiklikler ve beklenen etkiler özetlenmiştir.

---

## 1. Fontlar (LCP bloklaması azaltıldı)

**Sorun:** `@font-face` ile 4 ağırlık (400, 500, 600, 700) yükleniyordu; fontlar render’ı geciktiriyordu.

**Yapılanlar:**
- **next/font/local** kullanıldı (layout’ta). Sadece **400** ve **600** ağırlıkları yükleniyor (500/700 kaldırıldı).
- `display: "swap"` ile metin hemen görünüyor, font gelene kadar sistem fontu kullanılıyor.
- `preload: true` ile kritik fontlar öncelikli çekiliyor.
- `globals.css` içindeki tüm Manrope `@font-face` tanımları kaldırıldı; font artık next/font üzerinden geliyor.

**Beklenen kazanım:** İlk anlamlı çizim (FCP/LCP) daha erken; font geç yüklense bile metin hemen okunabilir.

---

## 2. LCP Görseli (Hero image)

**Sorun:** 412KB hero görseli `<img>` ile yükleniyordu; AVIF/WebP ve responsive boyut yoktu.

**Yapılanlar:**
- **next/image** kullanıldı. Next.js otomatik AVIF/WebP ve `srcset` üretiyor.
- **priority** sadece hero görselinde (LCP elementi).
- **sizes:** `(max-width: 768px) 0px, (max-width: 1200px) 50vw, 800px` — mobilde hero gizli olduğu için dar bant harcanmıyor.
- **placeholder="blur"** + **blurDataURL** ile düşük çözünürlüklü placeholder; layout shift azaltıldı.
- İkinci görsel (avukata-sor.png) de **next/image** ile **loading="lazy"** ve uygun **sizes** verildi.

**Not:** Görseli fiziksel olarak **120KB altına** indirmek için `public/yasalhaklariniz-avukata-soru-sor.webp` dosyasını sıkıştırmanız önerilir (ör. Squoosh, ImageOptim). next/image format ve boyut optimizasyonu sağlar; kaynak dosya küçükse LCP daha da iyileşir.

**Beklenen kazanım:** Daha küçük transfer, daha erken LCP (özellikle desktop).

---

## 3. CSS ve JS

**Yapılanlar:**
- **experimental.optimizePackageImports: ["lucide-react"]** (next.config) ile lucide-react tree-shake ediliyor; sadece kullanılan ikonlar bundle’a giriyor.
- **reactStrictMode: true** açıldı.
- Next.js zaten kritik CSS’i sayfa bazında üretiyor; Tailwind v4 + App Router ile kullanılmayan stiller eleniyor.

**Beklenen kazanım:** Daha küçük JS bundle, daha az kullanılmayan kod.

---

## 4. Görsel pipeline (next.config)

**Yapılanlar:**
- **images.formats: ["image/avif", "image/webp"]** — cihaz destekliyorsa AVIF/WebP otomatik sunuluyor.
- **images.deviceSizes** varsayılan; gerekirse projeye göre daraltılabilir.

---

## 5. İstek zinciri / preconnect

**Yapılanlar:**
- **Supabase preconnect:** `NEXT_PUBLIC_SUPABASE_URL` doluysa metadata üzerinden `links: [{ rel: "preconnect", href: origin }]` ekleniyor. API istekleri daha erken başlayabiliyor.
- LCP görseli **priority** ile işlendiği için Next.js gerekirse preload link’i ekliyor.

**Beklenen kazanım:** İlk API ve görsel isteklerinde gecikme azalması.

---

## 6. Yapılmayan / bilinen sınırlar

- **Toaster:** Layout Server Component olduğu için `dynamic(..., { ssr: false })` kullanılamadı; Toaster normal import kaldı. Etkisi sınırlı.
- **Critical CSS inline:** Next + Tailwind v4 ile mevcut pipeline kullanıldı; ekstra critical CSS ayrıştırma yapılmadı.
- **core-js / polyfill:** package.json’da görünmüyor; ek bir kaldırma yapılmadı.
- **Görsel dosya boyutu:** 120KB altı hedefi için kaynak WebP’yi sıkıştırmanız gerekiyor (manuel veya CI’da görsel optimizasyonu).

---

## Hedefler ve ölçüm

| Metrik            | Hedef        | Nasıl ölçülür              |
|-------------------|-------------|----------------------------|
| LCP (mobile)      | &lt; 1.8s   | Lighthouse Performance     |
| Lighthouse skoru  | &gt; 90     | Lighthouse Performance     |
| Bundle size       | Küçültmek   | `npm run build` çıktısı / Analyzer |

**Öneri:** Deploy sonrası Lighthouse (mobile, throttling açık) ile tekrar ölçüm yapın; gerekirse hero görselini sıkıştırıp tekrar test edin.

---

## Özet

- Font: next/font/local, 2 ağırlık, swap.
- Hero: next/image, priority, blur placeholder, AVIF/WebP.
- İkinci görsel: next/image, lazy.
- lucide-react: optimizePackageImports ile tree-shake.
- Supabase: preconnect (env varsa).
- Build başarılı; production’da Lighthouse ile doğrulama yapılmalı.
