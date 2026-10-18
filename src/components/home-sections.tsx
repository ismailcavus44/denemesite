import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  FileText,
  Gavel,
  Home,
  Landmark,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";
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
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
};

const LEGAL_RIGHTS: RightItem[] = [
  {
    title: "Hak Arama ve Dava Açma Hakkı",
    description: "Herkes, hakkını korumak için yargı mercilerine başvurabilir; davacı veya davalı olarak iddia ve savunmada bulunabilir.",
    basis: "Anayasa m. 36",
    icon: Gavel,
  },
  {
    title: "Adil Yargılanma Hakkı",
    description: "Davanın bağımsız ve tarafsız bir mahkemede, makul sürede ve hakkaniyete uygun biçimde görülmesini isteme hakkı.",
    basis: "Anayasa m. 36 · AİHS m. 6",
    icon: Scale,
  },
  {
    title: "Susma ve Savunma Hakkı",
    description: "Kimse kendisini veya yakınlarını suçlayan bir beyanda bulunmaya zorlanamaz; ifade sırasında susma hakkı hatırlatılır.",
    basis: "Anayasa m. 38 · CMK m. 147",
    icon: ShieldCheck,
  },
  {
    title: "Mülkiyet ve Miras Hakkı",
    description: "Herkes mülkiyet ve miras haklarına sahiptir; yasal mirasçıların saklı payı kanunla korunur.",
    basis: "Anayasa m. 35 · TMK m. 506",
    icon: Home,
    href: "/miras-hukuku",
  },
  {
    title: "Aile ve Çocuk Hakları",
    description: "Aile, toplumun temelidir; boşanmada nafaka, velayet ve mal paylaşımı gibi haklar kanunla düzenlenir.",
    basis: "Anayasa m. 41",
    icon: Users,
    href: "/aile-hukuku",
  },
  {
    title: "Çalışma Hakkı",
    description: "Herkes çalışma hakkına sahiptir; işçinin ücret, izin, kıdem ve ihbar tazminatı gibi hakları güvence altındadır.",
    basis: "Anayasa m. 49",
    icon: Briefcase,
    href: "/is-hukuku",
  },
  {
    title: "Dilekçe ve Bilgi Edinme Hakkı",
    description: "Kendinizle veya kamuyla ilgili dilek ve şikâyetlerinizi yetkili makamlara yazılı olarak iletebilir, bilgi talep edebilirsiniz.",
    basis: "Anayasa m. 74",
    icon: FileText,
  },
  {
    title: "Adli Yardım Hakkı",
    description: "Yargılama giderlerini karşılayamayacak durumda olanlar, harç ve masraflardan geçici olarak muaf tutulmayı isteyebilir.",
    basis: "HMK m. 334",
    icon: Landmark,
  },
];

/** "Yasal Haklarınız Nelerdir?" — temel hakların kısa kartları ve dayanakları. */
export function LegalRightsGrid() {
  return (
    <section className="space-y-6 rounded-3xl bg-[#1d293d] px-5 py-10 text-white sm:px-8 md:py-12">
      <header className="mx-auto max-w-2xl space-y-3 text-center">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Yasal Haklarınız Nelerdir?
        </h2>
        <p className="text-[15px] text-slate-300">
          Anayasa ve kanunlarla güvence altına alınan temel haklardan bazıları.
          Her kartta hakkın dayandığı düzenleme yer alır.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {LEGAL_RIGHTS.map(({ title, description, basis, icon: Icon, href }) => {
          const body = (
            <>
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="text-[16px] font-semibold text-white">{title}</h3>
              <p className="flex-1 text-sm leading-relaxed text-slate-300">{description}</p>
              <span className="flex items-center justify-between gap-2 pt-1">
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-200">
                  {basis}
                </span>
                {href && <ArrowRight className="size-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />}
              </span>
            </>
          );
          const className =
            "group flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors";
          return href ? (
            <Link key={title} href={href} className={`${className} hover:border-primary/50 hover:bg-white/10`}>
              {body}
            </Link>
          ) : (
            <div key={title} className={className}>
              {body}
            </div>
          );
        })}
      </div>
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
