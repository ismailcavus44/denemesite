"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BreadcrumbBlock } from "@/components/breadcrumb";
import { GuideArticleHeader } from "@/components/article/GuideArticleHeader";
import { AiSummarizeMenu } from "@/components/article/AiSummarizeMenu";
import { GuideToc } from "@/components/guide-toc";
import { StickyCTA } from "@/components/question-detail/StickyCTA";
import { addHeadingIdsAndGetToc, enhanceFootnoteHtml } from "@/lib/articleHtml";
import {
  ARTICLE_PREVIEW_STORAGE_KEY,
  type ArticlePreviewData,
} from "@/lib/article-preview";
import { siteConfig } from "@/lib/site";

function slugifyForId(text: string): string {
  const t = text
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
    .replace(/^-|-$/g, "");
  return t || "baslik";
}

function PreviewBanner() {
  return (
    <div className="sticky top-0 z-50 flex flex-wrap items-center justify-center gap-2 bg-slate-800 px-4 py-2 text-center text-sm font-medium text-white">
      <span>Önizleme modu — bu içerik henüz kaydedilmedi, yalnızca sizin görebileceğiniz bir taslaktır.</span>
      <button
        type="button"
        onClick={() => window.close()}
        className="rounded bg-white/15 px-2.5 py-0.5 text-xs font-semibold hover:bg-white/25"
      >
        Sekmeyi kapat
      </button>
    </div>
  );
}

export function ArticlePreview() {
  const [data, setData] = useState<ArticlePreviewData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ARTICLE_PREVIEW_STORAGE_KEY);
      if (raw) setData(JSON.parse(raw) as ArticlePreviewData);
    } catch {
      setData(null);
    } finally {
      setLoaded(true);
    }
  }, []);

  const processed = useMemo(() => {
    if (!data?.content) return { html: "", tocItems: [] as ReturnType<typeof addHeadingIdsAndGetToc>["tocItems"] };
    const { html, tocItems } = addHeadingIdsAndGetToc(data.content);
    return { html: enhanceFootnoteHtml(html), tocItems };
  }, [data?.content]);

  const faqIds = useMemo(() => {
    if (!data?.faq?.length) return [] as string[];
    const used = new Set(processed.tocItems.map((t) => t.id));
    return data.faq.map((item) => {
      let id = slugifyForId(item.question);
      if (used.has(id)) {
        let n = 2;
        while (used.has(`${id}-${n}`)) n++;
        id = `${id}-${n}`;
      }
      used.add(id);
      return id;
    });
  }, [data?.faq, processed.tocItems]);

  if (!loaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
        Önizleme yükleniyor…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-lg font-semibold text-slate-900">Önizlenecek içerik bulunamadı</p>
        <p className="text-sm text-slate-600">
          Bu sayfa, makale düzenleme ekranındaki <strong>&quot;Önizle&quot;</strong> butonuyla açılır.
          Admin panelde yazınızı açıp Önizle&apos;ye tıklayın.
        </p>
      </div>
    );
  }

  const title = data.title.trim() || "Başlıksız yazı";
  const categorySlug = data.category?.trim() || "";
  const categoryName = data.categoryLabel?.trim() || categorySlug;
  const tocItems = [...processed.tocItems];
  if (data.faq.length > 0) {
    tocItems.push({ id: "sik-sorulan-sorular", label: "Sık Sorulan Sorular", level: "h2" });
    data.faq.forEach((item, idx) => {
      tocItems.push({ id: faqIds[idx], label: item.question, level: "h3" });
    });
  }

  return (
    <>
      <PreviewBanner />
      <div className="mx-auto max-w-6xl space-y-6 px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pt-10">
        <BreadcrumbBlock
          items={[
            { label: "Anasayfa", href: "/" },
            ...(categorySlug
              ? [
                  { label: categoryName, href: `/${categorySlug}` },
                  { label: "Rehber", href: `/${categorySlug}/rehber` },
                ]
              : [{ label: "Rehber", href: "/rehber" }]),
            { label: title },
          ]}
        />
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,2fr)_300px]">
          <article className="min-w-0 max-w-[70ch] space-y-8">
            <div className="space-y-4">
            <GuideArticleHeader
              title={title}
              date={data.updated_at ?? data.created_at}
              categoryName={data.categoryLabel}
              categoryHref={data.category ? `/${data.category}` : null}
              author={data.author}
            />
            {data.category && data.slug ? (
              <AiSummarizeMenu
                title={title}
                url={`${siteConfig.url.replace(/\/$/, "")}/${data.category}/rehber/${data.slug}`}
              />
            ) : null}
            </div>
            {tocItems.length > 0 && <GuideToc items={tocItems} />}
            <aside className="md:hidden rounded-[8px] border border-slate-200 bg-slate-50/80 p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Sorunuz mu var?</p>
              <p className="mt-0.5 text-xs text-slate-600 leading-snug">
                Uzman ekibimize iletin; yayınlanan cevaplardan faydalanın.
              </p>
              <Link
                href="/soru-sor"
                className="mt-3 flex w-full items-center justify-center rounded-[8px] bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-900"
              >
                Soru sor
              </Link>
            </aside>
            {data.content ? (
              <div
                id="rehber-icerik"
                className="rehber-icerik space-y-4 text-[14px] text-black text-justify"
                dangerouslySetInnerHTML={{ __html: processed.html }}
              />
            ) : (
              <p className="text-sm text-slate-500">Bu yazının içeriği henüz eklenmemiş.</p>
            )}
            {data.faq.length > 0 && (
              <section className="space-y-4">
                <h2
                  id="sik-sorulan-sorular"
                  className="flex scroll-mt-6 items-center gap-2 text-xl font-semibold text-slate-900"
                >
                  <span className="h-5 w-1 rounded-full bg-slate-800" aria-hidden />
                  Sık Sorulan Sorular
                </h2>
                <div className="divide-y divide-slate-200 rounded-xl border border-slate-200">
                  {data.faq.map((item, idx) => (
                    <details key={idx} className="group">
                      <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-left [&::-webkit-details-marker]:hidden">
                        <h3 id={faqIds[idx]} className="text-[16px] font-semibold text-slate-900 scroll-mt-6">
                          {item.question}
                        </h3>
                        <span className="shrink-0 text-slate-400 transition-transform group-open:rotate-180">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </summary>
                      <div className="px-5 pb-4">
                        <p className="text-[14px] leading-7 text-black">{item.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </article>
          <div className="hidden md:flex flex-col gap-6 overflow-visible">
            <StickyCTA />
          </div>
        </div>
      </div>
    </>
  );
}
