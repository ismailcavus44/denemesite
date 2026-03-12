import Link from "next/link";

type LegalLayoutProps = {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
};

function slugifyId(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/ı/g, "i")
    .replace(/İ/g, "i")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    || "section";
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-5xl px-4 py-20 pb-24 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-16 inline-block text-sm text-slate-500 hover:text-slate-900"
        >
          ← Geri Dön
        </Link>

        <header className="mb-16">
          <h1 className="text-[30px] font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          {lastUpdated && (
            <>
              <div className="mt-8 h-px w-12 bg-slate-200" />
              <p className="mt-4 text-xs text-slate-500">
                Son güncelleme: {lastUpdated}
              </p>
            </>
          )}
        </header>

        <div className="legal-content max-w-none">
          {children}
        </div>

        <div className="mt-20 border-t border-slate-200/60 pt-12">
          <p className="text-sm text-slate-600">
            Sorularınız için bizimle iletişime geçin.
          </p>
          <Link
            href="/iletisim"
            className="mt-3 inline-block text-sm font-medium text-slate-900 underline underline-offset-2 hover:no-underline"
          >
            İletişime Geç →
          </Link>
        </div>
      </article>
    </main>
  );
}

export { slugifyId };
