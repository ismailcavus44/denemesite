"use client";

import Link from "next/link";

const MAX_VISIBLE = 6;
const LINE_LEFT = "11px"; // dikey çizgi + nokta hizası
const DOT_CENTER_OFFSET = "4px"; // 8px nokta için merkez

type GuideItem = { title: string; href: string; slug: string };

type CategoryGuidesSidebarProps = {
  guides: GuideItem[];
  currentSlug?: string | null;
  allGuidesUrl: string;
};

export function CategoryGuidesSidebar({
  guides,
  currentSlug,
  allGuidesUrl,
}: CategoryGuidesSidebarProps) {
  const visible = guides.slice(0, MAX_VISIBLE);
  const hasMore = guides.length > MAX_VISIBLE;

  return (
    <aside className="mt-0 mb-0 shrink-0">
      <div className="rounded-[6px] border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <span className="h-5 w-1 shrink-0 rounded-full bg-slate-800" aria-hidden />
          <h3 className="text-base font-bold text-slate-900">
            En Çok Okunan Rehberler
          </h3>
        </div>

        {/* Timeline liste: sol dikey çizgi + noktalar + içerik */}
        <div className="relative mt-4">
          {/* Dikey çizgi */}
          <div
            className="absolute bottom-0 top-0 w-px bg-slate-200"
            style={{ left: LINE_LEFT }}
            aria-hidden
          />

          <ul className="flex flex-col gap-1">
            {visible.map((g) => {
              const isActive = currentSlug != null && g.slug === currentSlug;
              return (
                <li
                key={g.slug}
                className={`group relative min-h-[3.25rem] pl-8 ${
                  isActive ? "bg-slate-50/80" : ""
                }`}
              >
                  {/* Nokta: çizginin üzerinde — sadece noktada hover */}
                  <span
                    className={`absolute rounded-full transition-colors duration-150 ${
                      isActive
                        ? "bg-slate-800 ring-2 ring-slate-800/20"
                        : "bg-slate-300 group-hover:bg-slate-500"
                    }`}
                    style={{
                      left: `calc(${LINE_LEFT} - ${DOT_CENTER_OFFSET})`,
                      top: "1.25rem",
                      width: "8px",
                      height: "8px",
                    }}
                    aria-hidden
                  />
                  {/* Aktif satırda çizgi boyunca ince mavi vurgu */}
                  {isActive && (
                    <div
                      className="absolute bottom-0 top-0 w-0.5 bg-slate-800"
                      style={{ left: LINE_LEFT }}
                      aria-hidden
                    />
                  )}

                  <Link
                    href={g.href}
                    className="block rounded-lg py-3 pr-2"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] uppercase tracking-wide text-slate-400">
                        Rehber
                      </span>
                      <span
                        className={`block break-words text-sm leading-snug ${
                          isActive
                            ? "font-semibold text-slate-900"
                            : "font-medium text-slate-700"
                        }`}
                      >
                        {g.title}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {hasMore && (
          <div className="mt-4 border-t border-slate-100 pt-3">
            <Link
              href={allGuidesUrl}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors hover:text-slate-800"
            >
              Tüm rehberleri gör
              <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
