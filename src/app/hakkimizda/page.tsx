import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "YasalHaklarınız ekibi ve misyonu. Hukuki bilgilendirmeyi sade ve anlaşılır kılmak için çalışıyoruz.",
};

export default function AboutPage() {
  return (
    <div className="space-y-20">
      {/* Üst görsel alanı — public/avukata-sor-hakkimizda.png (1905×675) */}
      <section className="w-full">
        <img
          src="/avukata-sor-hakkimizda.png"
          alt="Hakkımızda"
          width={1905}
          height={675}
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
              insanlar için tasarlanmış sade bir rehber alanı. Sorulan gerçek soruları,
              benzer durumlar ve örneklerle harmanlayarak, okuyanın kendi durumunu daha
              net görmesini amaçlıyoruz. Ne bir forumuz ne de otomatik cevap üreten bir
              bot; sadece sakin, anlaşılır ve yol gösterici bilgilendirme sunmaya
              odaklanan küçük bir ekip.
            </p>
          </div>
          <div className="relative h-full min-h-[240px] overflow-hidden rounded-2xl">
            <img
              src="/hakkimizda1.png"
              alt="Hakkımızda"
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        {/* Hero + kısa özet + kartlar (aynı section) */}
        <section className="space-y-4">
          <div className="grid gap-8 md:grid-cols-[1.6fr,1fr] md:items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight md:text-[32px]">
                Hukuki bilgiyi sakin, anlaşılır ve herkes için erişilebilir hale
                getiriyoruz.
              </h1>
              <p className="text-[15px] text-muted-foreground">
                YasalHaklariniz, karmaşık hukuk dilini günlük hayata çeviren bir
                soru-cevap rehberidir. Amacımız; okuyan herkesin, kendi durumunu
                daha net görebilmesini sağlamak ve atacağı adımlar konusunda sakin
                bir çerçeve sunmaktır.
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
                  <h2 className="text-sm font-semibold text-foreground">
                    Neyi yapmıyoruz?
                  </h2>
                </div>
                <p>
                  Burası forum değil, otomatik cevap üreten bir bot da değil. Somut
                  olaya özel hukuki danışmanlık vermiyoruz.
                </p>
              </CardContent>
            </Card>
            <Card className="group h-full rounded-2xl border border-border/70 bg-background/80 px-1 py-1 shadow-sm transition-colors">
              <CardContent className="space-y-3 rounded-xl bg-background p-5 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                    02
                  </span>
                  <h2 className="text-sm font-semibold text-foreground">
                    Neyi amaçlıyoruz?
                  </h2>
                </div>
                <p>
                  Benzer durumlarda sorulmuş gerçek sorular ve onlara verilen kısa
                  yanıtlar üzerinden, okuyana net bir çerçeve sunmak.
                </p>
              </CardContent>
            </Card>
            <Card className="group h-full rounded-2xl border border-border/70 bg-background/80 px-1 py-1 shadow-sm transition-colors">
              <CardContent className="space-y-3 rounded-xl bg-background p-5 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                    03
                  </span>
                  <h2 className="text-sm font-semibold text-foreground">
                    Kimin için tasarlandı?
                  </h2>
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
              YasalHaklariniz’de yer alan yanıtlar, yalnızca yürürlükteki mevzuat ve
              genel uygulama pratiği çerçevesinde hazırlanmış, genel bilgilendirme
              metinleridir. Somut olayın tüm detaylarına hâkim olunmadan verilen hiçbir
              açıklama, hukuki görüş veya avukatlık hizmeti yerine geçmez.
            </p>
            <p className="text-[15px] text-muted-foreground">
              Hak kaybı yaşamamak için; özellikle süreli işlemler, icra–dava süreçleri
              veya önemli mali sonuçlar doğurabilecek kararlar öncesinde bir avukattan
              profesyonel destek almanızı kuvvetle öneriyoruz. Bu platformu, süreci
              anlamak için ilk adım; nihai kararı ise her zaman bir hukuk
              profesyoneliyle birlikte vereceğiniz bir rehber olarak düşünün.
            </p>
          </div>
          <div className="relative h-full min-h-[240px] overflow-hidden rounded-2xl">
            <img
              src="/hakkimizda2.png"
              alt="Hukuki Süreç ve Biz"
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        {/* Diğer bölümler buraya eklenebilir */}
      </div>
    </div>
  );
}
