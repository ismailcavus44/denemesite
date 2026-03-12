import Link from "next/link";
import { FOOTER_POPULAR_GUIDES } from "@/lib/blog-data";

/** Header ile aynı (İletişim ve Kariyer hariç) */
const footerMenuLinks = [
  { href: "/rehber", label: "Rehber" },
  { href: "/sorular", label: "Sorular" },
  { href: "/hakkimizda", label: "Hakkımızda" },
];

export function SiteFooter() {
  const popularGuides = FOOTER_POPULAR_GUIDES;

  return (
    <footer className="border-t bg-slate-50/50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-9">
          {/* Yasal Uyarı — mobilde üstte */}
          <div className="w-full shrink-0 sm:max-w-sm">
            <p className="mb-2 text-sm font-semibold text-slate-900">
              Yasal Uyarı
            </p>
            <p className="text-sm leading-relaxed text-slate-600">
              YasalHaklariniz, hukuka ilişkin genel bilgilendirme sunan bir
              platformdur. İçerikler avukatlık hizmeti veya hukuki danışmanlık
              niteliği taşımaz.
            </p>
          </div>

          {/* Menü | Popüler Rehberler | İletişim — mobilde yan yana 3 sütun */}
          <div className="flex w-full flex-wrap gap-x-4 gap-y-4 sm:gap-x-6">
            {/* Menü */}
            <div className="min-w-0">
              <p className="mb-2 text-sm font-semibold text-slate-900">
                Menü
              </p>
              <ul className="space-y-1.5 text-sm text-slate-600 [list-style:none] [padding:0] [margin:0]">
                {footerMenuLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-primary hover:underline">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popüler Rehberler */}
            <div className="min-w-0">
              <p className="mb-2 text-sm font-semibold text-slate-900">
                Popüler Rehberler
              </p>
              <ul className="space-y-1.5 text-sm text-slate-600 [list-style:none] [padding:0] [margin:0]">
                {popularGuides.map((guide) => (
                  <li key={guide.slug}>
                    <Link
                      href={`/${guide.categorySlug}/rehber/${guide.slug}`}
                      className="break-words hover:text-primary hover:underline"
                    >
                      {guide.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* İletişim */}
            <div className="min-w-0">
              <p className="mb-2 text-sm font-semibold text-slate-900">
                İletişime Geçin
              </p>
              <ul className="space-y-1.5 text-sm text-slate-600 [list-style:none] [padding:0] [margin:0]">
                <li>
                  <Link href="/iletisim" className="hover:text-primary hover:underline">
                    İletişim
                  </Link>
                </li>
                <li>
                  <Link href="/kariyer" className="hover:text-primary hover:underline">
                    Kariyer
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center gap-2 border-t border-slate-200 pt-6 text-center text-xs text-slate-500 sm:flex-row sm:justify-between sm:text-left">
          <span className="sm:shrink-0">YasalHaklariniz — Genel bilgilendirme platformu</span>
          <span className="flex flex-wrap items-center justify-center gap-x-0 gap-y-1 sm:justify-end">
            <Link href="/sorumluluk-reddi" className="hover:text-primary hover:underline">Sorumluluk Reddi</Link>
            <span className="mx-1.5 text-slate-400">|</span>
            <Link href="/kvkk" className="hover:text-primary hover:underline">KVKK</Link>
            <span className="mx-1.5 text-slate-400">|</span>
            <Link href="/gizlilik-sozlesmesi" className="hover:text-primary hover:underline">Gizlilik Sözleşmesi</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
