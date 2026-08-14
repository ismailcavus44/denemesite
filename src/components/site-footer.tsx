import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { FOOTER_POPULAR_GUIDES } from "@/lib/blog-data";

/** Header ile aynı (İletişim ve Kariyer hariç) */
const footerMenuLinks = [
  { href: "/rehber", label: "Rehber" },
  { href: "/sorular", label: "Sorular" },
  { href: "/hakkimizda", label: "Hakkımızda" },
];

const linkClass =
  "block text-sm text-slate-600 hover:text-primary hover:underline";

function MenuLinks() {
  return (
    <ul className="space-y-1.5 [list-style:none] [margin:0] [padding:0]">
      {footerMenuLinks.map(({ href, label }) => (
        <li key={href}>
          <Link href={href} className={linkClass}>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function GuideLinks() {
  return (
    <ul className="space-y-1.5 [list-style:none] [margin:0] [padding:0]">
      {FOOTER_POPULAR_GUIDES.map((guide) => (
        <li key={guide.slug}>
          <Link
            href={`/${guide.categorySlug}/rehber/${guide.slug}`}
            className={linkClass}
          >
            {guide.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ContactLinks() {
  return (
    <ul className="space-y-1.5 [list-style:none] [margin:0] [padding:0]">
      <li>
        <Link href="/iletisim" className={linkClass}>
          İletişim
        </Link>
      </li>
      <li>
        <Link href="/kariyer" className={linkClass}>
          Kariyer
        </Link>
      </li>
    </ul>
  );
}

function FooterAccordionItem({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="group border-b border-slate-200 last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown
          className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="pb-3">{children}</div>
    </details>
  );
}

export function SiteFooter() {
  return (
    <footer className="overflow-x-hidden border-t bg-slate-50/50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-col gap-8 sm:flex-row sm:items-start sm:gap-9">
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

          <div className="w-full min-w-0 sm:hidden">
            <div className="border-t border-slate-200">
              <FooterAccordionItem title="Menü">
                <MenuLinks />
              </FooterAccordionItem>
              <FooterAccordionItem title="Rehber">
                <GuideLinks />
              </FooterAccordionItem>
              <FooterAccordionItem title="İletişim">
                <ContactLinks />
              </FooterAccordionItem>
            </div>
          </div>

          <div className="hidden w-full min-w-0 grid-cols-3 gap-x-6 sm:grid">
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-900">Menü</p>
              <MenuLinks />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-900">
                Popüler Rehberler
              </p>
              <GuideLinks />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-900">
                İletişime Geçin
              </p>
              <ContactLinks />
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center gap-3 border-t border-slate-200 pt-6 text-center text-xs text-slate-500 sm:flex-row sm:justify-between sm:text-left">
          <Link
            href="/"
            className="logo-switcher inline-flex items-center"
            aria-label="YasalHaklarınız ana sayfa"
          >
            <Image
              src="/hukuki-sor-logo.png"
              alt="YasalHaklarınız"
              width={120}
              height={24}
              className="logo-light h-6 w-auto object-contain dark:hidden"
              unoptimized
            />
            <Image
              src="/hukuki-sor-logo-dark.png"
              alt=""
              width={120}
              height={24}
              className="logo-dark hidden h-6 w-auto object-contain dark:block"
              unoptimized
            />
          </Link>
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
