import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatTurkishLongDate } from "@/lib/format-date";

export type LatestArticleItem = {
  slug: string;
  title: string;
  categorySlug: string;
  categoryName: string;
  date: string | null;
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-xl font-semibold">
      <span className="h-5 w-1 rounded-full bg-primary" />
      {children}
    </h2>
  );
}

/** Hero altı: solda görsel, sağda kısa tanıtım. */
export function IntroSplit() {
  return (
    <section className="grid items-center gap-10 md:grid-cols-2">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
        <Image
          src="/hakkimizda1.png"
          alt="Hukuk rehberi okuyan kişi"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          loading="lazy"
        />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Haklarını Bilmek, Hak Kaybını Önler
          </h2>
          <span className="block h-1 w-10 rounded-full bg-primary" />
        </div>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          Birçok hak kaybı, bir sürenin kaçırılmasından ya da bir hakkın varlığının
          bilinmemesinden doğar. Rehber yazılarımız miras, aile, iş ve icra
          hukukundaki temel konuları; ilgili kanun maddeleri, süreler ve dikkat
          edilmesi gereken noktalarla birlikte sade bir dille anlatır.
        </p>
        <Link
          href="/rehber"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Tüm rehberlere göz at
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

type RightItem = {
  title: string;
  description: string;
  basis: string;
  href?: string;
};

const LEGAL_RIGHTS: RightItem[] = [
  {
    title: "Hak Arama ve Dava Açma Hakkı",
    description: "Herkes, hakkını korumak için yargı mercilerine başvurabilir; davacı veya davalı olarak iddia ve savunmada bulunabilir.",
    basis: "Anayasa m. 36",
  },
  {
    title: "Adil Yargılanma Hakkı",
    description: "Davanın bağımsız ve tarafsız bir mahkemede, makul sürede ve hakkaniyete uygun biçimde görülmesini isteme hakkı.",
    basis: "Anayasa m. 36 · AİHS m. 6",
  },
  {
    title: "Susma ve Savunma Hakkı",
    description: "Kimse kendisini veya yakınlarını suçlayan bir beyanda bulunmaya zorlanamaz; ifade sırasında susma hakkı hatırlatılır.",
    basis: "Anayasa m. 38 · CMK m. 147",
  },
  {
    title: "Mülkiyet ve Miras Hakkı",
    description: "Herkes mülkiyet ve miras haklarına sahiptir; yasal mirasçıların saklı payı kanunla korunur.",
    basis: "Anayasa m. 35 · TMK m. 506",
    href: "/miras-hukuku",
  },
  {
    title: "Aile ve Çocuk Hakları",
    description: "Aile, toplumun temelidir; boşanmada nafaka, velayet ve mal paylaşımı gibi haklar kanunla düzenlenir.",
    basis: "Anayasa m. 41",
    href: "/aile-hukuku",
  },
  {
    title: "Çalışma Hakkı",
    description: "Herkes çalışma hakkına sahiptir; işçinin ücret, izin, kıdem ve ihbar tazminatı gibi hakları güvence altındadır.",
    basis: "Anayasa m. 49",
    href: "/is-hukuku",
  },
  {
    title: "Dilekçe ve Bilgi Edinme Hakkı",
    description: "Kendinizle veya kamuyla ilgili dilek ve şikâyetlerinizi yetkili makamlara yazılı olarak iletebilir, bilgi talep edebilirsiniz.",
    basis: "Anayasa m. 74",
  },
  {
    title: "Adli Yardım Hakkı",
    description: "Yargılama giderlerini karşılayamayacak durumda olanlar, harç ve masraflardan geçici olarak muaf tutulmayı isteyebilir.",
    basis: "HMK m. 334",
  },
];

/** "Yasal Haklarınız Nelerdir?" — temel haklar ve dayanakları (sade liste). */
export function LegalRightsGrid() {
  return (
    <section className="space-y-4">
      <SectionTitle>Yasal Haklarınız Nelerdir?</SectionTitle>
      <p className="max-w-2xl text-[15px] text-muted-foreground">
        Anayasa ve kanunlarla güvence altına alınan temel haklardan bazıları.
      </p>
      <ul className="grid gap-x-10 md:grid-cols-2">
        {LEGAL_RIGHTS.map(({ title, description, basis, href }) => (
          <li key={title} className="border-b border-slate-200/70 py-4">
            <h3 className="text-[16px] font-semibold text-foreground">
              {href ? (
                <Link href={href} className="hover:underline">
                  {title}
                </Link>
              ) : (
                title
              )}
            </h3>
            <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{description}</p>
            <p className="mt-1 text-xs text-slate-500">Dayanak: {basis}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Ana sayfa: en yeni rehber yazıları (başlık, kategori, tarih). */
export function LatestArticles({ items }: { items: LatestArticleItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="space-y-4">
      <SectionTitle>Son Yazılar</SectionTitle>
      <ul className="grid gap-x-8 md:grid-cols-2">
        {items.map((a) => (
          <li key={`${a.categorySlug}-${a.slug}`} className="border-b border-slate-200/70">
            <Link
              href={`/${a.categorySlug}/rehber/${a.slug}`}
              className="group flex flex-col gap-1 py-4"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-primary">
                {a.categoryName}
                {a.date && <span className="ml-2 font-normal normal-case tracking-normal text-muted-foreground">· {formatTurkishLongDate(a.date)}</span>}
              </span>
              <span className="text-[16px] font-semibold text-foreground group-hover:underline">
                {a.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
