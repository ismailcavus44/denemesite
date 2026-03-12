import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Edit3, ShieldCheck, MessageCircle } from "lucide-react";
import { QuestionCard } from "@/components/question-card";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { blogPosts, HOMEPAGE_REHBER_SLUGS, HOMEPAGE_DYNAMIC_REHBER_TITLES } from "@/lib/blog-data";
import { BlogTeaserCard } from "@/components/blog-teaser-card";
import { questionSummaries } from "@/lib/question-summaries";
import { OrganizationSchema } from "@/components/schemas/OrganizationSchema";
import { WebSiteSchema } from "@/components/schemas/WebSiteSchema";
import { FAQSchema } from "@/components/schemas/FAQSchema";
import { HomepageFAQ, HOMEPAGE_FAQ_ITEMS } from "@/components/homepage-faq";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: siteConfig.url },
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default async function Home() {
  const supabase = createSupabaseServerClient();
  const [trendingRes, dynamicRehberRes] = await Promise.all([
    supabase
      .from("questions")
      .select("id,title,slug,created_at,ai_card_summary,category:categories(name,slug)")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(4),
    HOMEPAGE_DYNAMIC_REHBER_TITLES.length > 0
      ? supabase
          .from("articles")
          .select("title, slug, category, meta_description, content")
          .eq("status", "published")
          .not("category", "is", null)
          .limit(30)
      : Promise.resolve({ data: [] }),
  ]);

  const trending = trendingRes.data;
  type ArticleRow = { title: string; slug: string; category: string; meta_description?: string | null; content?: string | null };
  const allArticles = (dynamicRehberRes.data ?? []) as ArticleRow[];
  const usedIds = new Set<string>();
  const dynamicRehber = HOMEPAGE_DYNAMIC_REHBER_TITLES.map((titlePattern) => {
    const article = allArticles.find(
      (a) => !usedIds.has(a.slug) && a.title.toLowerCase().includes(titlePattern.toLowerCase())
    );
    if (article) usedIds.add(article.slug);
    return article;
  }).filter((a): a is ArticleRow => a != null);

  const staticRehber = HOMEPAGE_REHBER_SLUGS.slice(0, 3)
    .map((slug) => blogPosts.find((p) => p.slug === slug))
    .filter((p): p is (typeof blogPosts)[number] => p != null);

  const dynamicRehberMapped = dynamicRehber.map((a) => {
    const metaDesc = a.meta_description?.trim() || "";
    const contentText = a.content ? stripHtml(a.content) : "";
    const raw = metaDesc || contentText;
    const summary = raw.length > 160 ? `${raw.slice(0, 157)}...` : raw;
    const isBosanma = a.title.toLowerCase().includes("boşanma") || a.title.toLowerCase().includes("bosanma");
    const isIsci = a.title.toLowerCase().includes("işçi") || a.title.toLowerCase().includes("isci");
    const cardImg = isBosanma ? "/rehber/bosanma-davasi-nasil-acilir-avukata-sor.webp" : isIsci ? "/rehber/isten-cikarilan-iscinin-haklari-avukata-sor.webp" : undefined;
    const imageAlt = isBosanma ? "Boşanma davası nasıl açılır avukata sor" : isIsci ? "İşten çıkarılan işçinin hakları avukata sor" : undefined;
    return {
      slug: a.slug,
      title: a.title,
      summary,
      categorySlug: a.category,
      image: cardImg,
      cardImage: cardImg,
      imageAlt,
    };
  });

  const homepageRehber = [...staticRehber, ...dynamicRehberMapped];
  const isciFallback = blogPosts.find((p) => p.slug === "isten-cikarilan-iscinin-haklari-nelerdir");
  if (homepageRehber.length < 3 && isciFallback && !homepageRehber.some((p) => p.slug === isciFallback.slug)) {
    homepageRehber.push(isciFallback);
  }
  const finalRehber = homepageRehber.slice(0, 3);

  return (
    <>
      <OrganizationSchema />
      <WebSiteSchema />
      <FAQSchema items={HOMEPAGE_FAQ_ITEMS} />
      <div className="space-y-12">
      <section className="relative overflow-hidden py-8 md:py-12">
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Sol: İçerik */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-[42px] md:leading-[1.15]">
              Hukuki sorunu yaz,
              <br />
              net cevabını öğren.
            </h1>
            <p className="max-w-lg text-[15px] text-muted-foreground">
              Platformumuz üzerinden anında hukuki soru sorabilir, benzer durumlara
              verilen kısa ve anlaşılır cevapları inceleyebilirsin.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto bg-[#1d293d] text-white hover:bg-[#1d293d]/90">
                <Link href="/soru-sor">Hemen soru sor</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-[#1d293d] text-[#1d293d] hover:bg-[#1d293d]/10 hover:border-[#1d293d] hover:text-[#1d293d]">
                <Link href="/sorular">Yayındaki cevaplara göz at</Link>
              </Button>
            </div>

            <p className="text-[15px] text-muted-foreground/60 tracking-wide">
              Bu platform forum değildir ve otomatik yanıt üretmez.
              <br />
              Sorular editör incelemesinden geçerek genel hukuki bilgilendirme kapsamında yayımlanır.
            </p>
          </div>

          {/* Sağ: LCP görseli (desktop) — next/image ile AVIF/WebP, priority */}
          <div className="hidden md:block relative aspect-[4/3] max-w-[800px] w-full">
            <Image
              src="/yasalhaklariniz-avukata-soru-sor.webp"
              alt="YasalHaklariniz — Avukata soru sor"
              width={800}
              height={600}
              priority
              sizes="(max-width: 768px) 0px, (max-width: 1200px) 50vw, 800px"
              className="rounded-2xl object-cover w-full h-full"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEEA/ALnq2p3mn6ndW1rO0cMT7EUY4GKKKKVYz//Z"
            />
          </div>
        </div>
      </section>

      <section className="space-y-8" aria-labelledby="nasil-calisir-heading">
        <header className="space-y-3">
          <h2 id="nasil-calisir-heading" className="flex items-center gap-2 text-[20px] font-bold text-gray-900">
            <span className="h-5 w-1 shrink-0 rounded-full bg-primary" />
            3 Basit Adımda Hukuki Soru Sor
          </h2>
          <p className="max-w-2xl text-[15px] text-muted-foreground">
            Kafanı kurcalayan hukuki sorunları anonim ve güvenli bir şekilde ilet, uzman editör incelemesinden geçen net cevaplara ulaş.
          </p>
        </header>
        <div className="flex flex-col gap-8 md:flex-row md:gap-6">
          <article className="flex flex-1 flex-col items-center rounded-xl border border-slate-100 bg-white p-6 text-center shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Edit3 className="size-6 text-primary" aria-hidden />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">1. Hukuki Sorunu Yaz</h3>
            <p className="text-[15px] text-muted-foreground">
              Yaşadığın durumu ve aklındaki hukuki soruyu detaylarıyla, isim vermeden platformumuza yaz.
            </p>
          </article>
          <article className="flex flex-1 flex-col items-center rounded-xl border border-slate-100 bg-white p-6 text-center shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <ShieldCheck className="size-6 text-primary" aria-hidden />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">2. Editör İncelemesi</h3>
            <p className="text-[15px] text-muted-foreground">
              Sorun, yayınlanmadan önce hukuki standartlara uygunluk ve anonimlik açısından editörlerimizce incelenir.
            </p>
          </article>
          <article className="flex flex-1 flex-col items-center rounded-xl border border-slate-100 bg-white p-6 text-center shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MessageCircle className="size-6 text-primary" aria-hidden />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">3. Net Cevabını Öğren</h3>
            <p className="text-[15px] text-muted-foreground">
              Karmaşık kanun maddeleri arasında kaybolmadan, hukuki soruna verilen anlaşılır ve sade cevabı oku.
            </p>
          </article>
        </div>
      </section>

      <section className="mt-16 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <span className="h-5 w-1 rounded-full bg-primary" />
            Trend Sorular
          </h2>
          <Button asChild size="sm" className="shrink-0 bg-[#1d293d] text-white hover:bg-[#1d293d]/90">
            <Link href="/sorular">Tümünü gör</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 min-h-[280px]">
          {(trending ?? []).map((question) => (
            <QuestionCard
              key={question.id}
              title={question.title}
              slug={question.slug}
              category={Array.isArray(question.category) ? (question.category[0] ?? null) : question.category}
              createdAt={question.created_at}
              summaryText={(question as { ai_card_summary?: string | null }).ai_card_summary ?? questionSummaries[question.title] ?? null}
              categorySlug={(Array.isArray(question.category) ? question.category[0] : question.category)?.slug ?? null}
            />
          ))}
          {!trending?.length && (
            <div className="col-span-full rounded-xl border border-dashed p-8 text-sm text-muted-foreground min-h-[120px] flex items-center justify-center">
              Henüz yayınlanan soru yok.
            </div>
          )}
        </div>
      </section>

      <section className="grid items-center gap-10 md:grid-cols-2">
        <div className="order-2 space-y-4 md:order-1">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Hukuki Sorulara Sade ve Net Cevaplar
            </h2>
            <span className="block h-1 w-10 rounded-full bg-primary" />
          </div>
          <p className="text-[15px] text-muted-foreground">
            Hukuk karmaşık olmak zorunda değil.
            <br />
            Sorun, editör incelemesinden geçtikten sonra anonim olarak yayınlanır ve benzer gerçek sorulara verilmiş sade açıklamalarla birlikte sunulur. Böylece yalnızca kendi durumunu değil, aynı konuda daha önce yaşanmış örnekleri de görebilirsin. Karmaşık hukuk dili, uzun kanun metinleri ve anlaşılmaz ifadeler yerine; seni neyin beklediğini, hangi risklerin olabileceğini ve nasıl bir yol izlenebileceğini açık ve sakin bir çerçevede değerlendirebilirsin.
          </p>
        </div>
        <div className="order-1 relative aspect-[4/3] w-full overflow-hidden rounded-2xl md:order-2">
          <Image
            src="/avukata-sor.png"
            alt="Avukata sor - hukuki soru sor"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEEA/ALnq2p3mn6ndW1rO0cMT7EUY4GKKKKVYz//Z"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <span className="h-5 w-1 rounded-full bg-primary" />
          Rehber
        </div>
        <div className="grid gap-5 md:grid-cols-3 min-h-[300px]">
          {finalRehber.map((post) => (
            <BlogTeaserCard key={`${post.categorySlug}-${post.slug}`} post={post} />
          ))}
        </div>
        <div className="flex justify-center pt-2">
          <Button asChild size="lg" className="bg-[#1d293d] text-white hover:bg-[#1d293d]/90">
            <Link href="/rehber">Tümünü Gör</Link>
          </Button>
        </div>
      </section>

      <div className="border-t border-slate-200/70" aria-hidden />

      <HomepageFAQ />
    </div>
    </>
  );
}
