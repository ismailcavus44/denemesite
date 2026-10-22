import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AboutPageSchema } from "@/components/schemas/AboutPageSchema";
import { siteConfig, defaultOgImage } from "@/lib/site";

const _t = "Hakkımızda | YasalHaklarınız";
const _d = "YasalHaklarınız ekibi ve misyonu. Hukuki bilgilendirmeyi sade ve anlaşılır kılmak için çalışıyoruz.";
const _u = `${siteConfig.url}/hakkimizda`;

export const metadata: Metadata = {
  title: { absolute: "Hakkımızda | YasalHaklarınız" },
  description: _d,
  openGraph: { title: _t, description: _d, url: _u, images: [defaultOgImage] },
  twitter: { card: "summary_large_image", title: _t, description: _d, images: [defaultOgImage.url] },
  alternates: { canonical: _u },
};

export default function AboutPage() {
  return (
    <>
      <AboutPageSchema />
      <h1 className="sr-only">Hakkımızda</h1>
      <div className="space-y-20">
      {/* Üst görsel alanı — public/avukata-sor-hakkimizda.png (1905×675) */}
      <section className="w-full">
        <Image
          src="/avukata-sor-hakkimizda.png"
          alt="Hakkımızda"
          width={1905}
          height={675}
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="h-auto w-full rounded-[6px] object-cover"
        />
      </section>

      <div className="mx-auto max-w-5xl space-y-20">
        {/* Section 2 – Biz? */}
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Biz?</h2>
            <p className="text-[15px] text-muted-foreground">
              Burası, hukuki terimlerin ve uzun kanun maddelerinin arasında kaybolan
              insanlar için hazırlanmış bir hukuk rehberi. Miras, aile, iş, icra ve
              gayrimenkul hukukundaki temel konuları; kanun maddeleri, süreler ve
              uygulamadaki önemli noktalarla birlikte sade bir dille anlatıyoruz.
            </p>
          </div>
          <div className="relative h-full min-h-[240px] overflow-hidden rounded-2xl">
            <Image
              src="/hakkimizda1.png"
              alt="Hakkımızda"
              fill
              sizes="(max-width: 768px) 100vw, 512px"
              className="object-cover"
            />
          </div>
        </section>

        {/* Hero + kısa özet + kartlar (aynı section) */}
        <section className="space-y-4">
          <div className="grid gap-8 md:grid-cols-[1.6fr,1fr] md:items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold tracking-tight md:text-[32px]">
                Hukuki bilgiyi sakin, anlaşılır ve herkes için erişilebilir hale
                getiriyoruz.
              </h2>
              <p className="text-[15px] text-muted-foreground">
                YasalHaklariniz, karmaşık hukuk dilini günlük hayata çeviren bir
                hukuk bloğudur. Amacımız; okuyan herkesin haklarını ve hukuki
                süreçlerin genel işleyişini daha iyi anlamasını sağlamaktır.
              </p>
            </div>
            <div className="hidden h-full md:block">
              <div className="flex h-full items-center justify-center rounded-2xl bg-muted" />
            </div>
          </div>

          <div className="grid gap-4 text-[14px] md:grid-cols-3">
            <Card className="group h-full rounded-2xl border border-border/70 bg-background/80 px-1 py-1 shadow-sm transition-colors">
              <CardContent className="space-y-3 rounded-xl bg-background p-5 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                    01
                  </span>
                  <h3 className="text-sm font-semibold text-foreground">
                    Neyi yapmıyoruz?
                  </h3>
                </div>
                <p>
                  Soru-cevap, bireysel değerlendirme veya hukuki danışmanlık
                  hizmeti sunmuyoruz. İçeriklerimiz genel bilgilendirme amaçlıdır.
                </p>
              </CardContent>
            </Card>
            <Card className="group h-full rounded-2xl border border-border/70 bg-background/80 px-1 py-1 shadow-sm transition-colors">
              <CardContent className="space-y-3 rounded-xl bg-background p-5 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                    02
                  </span>
                  <h3 className="text-sm font-semibold text-foreground">
                    Neyi amaçlıyoruz?
                  </h3>
                </div>
                <p>
                  Güncel mevzuat ve yargı uygulamasına dayanan, kaynaklı ve
                  anlaşılır rehber yazılarıyla okuyana net bir çerçeve sunmak.
                </p>
              </CardContent>
            </Card>
            <Card className="group h-full rounded-2xl border border-border/70 bg-background/80 px-1 py-1 shadow-sm transition-colors">
              <CardContent className="space-y-3 rounded-xl bg-background p-5 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                    03
                  </span>
                  <h3 className="text-sm font-semibold text-foreground">
                    Kimin için tasarlandı?
                  </h3>
                </div>
                <p>
                  Hukuki terimlere uzak olan, fakat haklarını merak eden herkes
                  için: kiracı, işçi, işveren, mirasçı veya tüketici fark etmeksizin.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Hukuki süreç ve biz */}
        <section className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Hukuki Süreç ve Biz</h2>
            <p className="text-[15px] text-muted-foreground">
              YasalHaklariniz’de yer alan yazılar, yalnızca yürürlükteki mevzuat ve
              genel uygulama pratiği çerçevesinde hazırlanmış, genel bilgilendirme
              metinleridir. Somut olayın tüm detaylarına hâkim olunmadan verilen hiçbir
              açıklama, hukuki görüş veya avukatlık hizmeti yerine geçmez.
            </p>
            <p className="text-[15px] text-muted-foreground">
              Her olayın kendine özgü koşulları vardır; süreli işlemler, icra–dava
              süreçleri veya önemli mali sonuçlar doğurabilecek kararlar söz konusu
              olduğunda yazılardaki genel bilgilerin olayınıza birebir uymayabileceğini
              göz önünde bulundurun.
            </p>
          </div>
          <div className="relative h-full min-h-[240px] overflow-hidden rounded-2xl">
            <Image
              src="/hakkimizda2.png"
              alt="Hukuki Süreç ve Biz"
              fill
              sizes="(max-width: 768px) 100vw, 512px"
              className="object-cover"
            />
          </div>
        </section>

        {/* Diğer bölümler buraya eklenebilir */}
      </div>
    </div>
    </>
  );
}
