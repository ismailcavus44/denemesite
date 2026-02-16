import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";

const POPULAR_GUIDE_COUNT = 5;

/** Header ile aynı (İletişim ve Kariyer hariç) */
const footerMenuLinks = [
  { href: "/rehber", label: "Rehber" },
  { href: "/sorular", label: "Sorular" },
  { href: "/hakkimizda", label: "Hakkımızda" },
];

export function SiteFooter() {
  const popularGuides = blogPosts.slice(0, POPULAR_GUIDE_COUNT);

  return (
    <footer className="border-t bg-slate-50/50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start" style={{ gap: "36px" }}>
          {/* Yasal Uyarı — sonraki blokla arası 36px */}
          <div className="max-w-sm shrink-0">
            <h3 className="mb-2 text-sm font-semibold text-slate-900">
              Yasal Uyarı
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">
              YasalHaklariniz, hukuka ilişkin genel bilgilendirme sunan bir
              platformdur. İçerikler avukatlık hizmeti veya hukuki danışmanlık
              niteliği taşımaz.
            </p>
          </div>

          {/* Menü | Popüler Rehberler | İletişim — araları 24px */}
          <div className="flex flex-wrap gap-[24px]">
            {/* Menü */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                Menü
              </h3>
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
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                Popüler Rehberler
              </h3>
              <ul className="space-y-1.5 text-sm text-slate-600 [list-style:none] [padding:0] [margin:0]">
                {popularGuides.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/${post.categorySlug}/rehber/${post.slug}`}
                      className="hover:text-primary hover:underline"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* İletişim */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-900">
                İletişime Geçin
              </h3>
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
        <p className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
          YasalHaklariniz — Genel bilgilendirme platformu
          <span className="mx-2">·</span>
          <Link href="/sorumluluk-reddi" className="hover:text-primary hover:underline">Sorumluluk Reddi</Link>
          <span className="mx-2">·</span>
          <Link href="/kvkk" className="hover:text-primary hover:underline">KVKK</Link>
          <span className="mx-2">·</span>
          <Link href="/gizlilik-sozlesmesi" className="hover:text-primary hover:underline">Gizlilik Sözleşmesi</Link>
        </p>
      </div>
    </footer>
  );
}
