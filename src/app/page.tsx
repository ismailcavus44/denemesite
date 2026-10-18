import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { blogPosts, FOOTER_POPULAR_GUIDES, HOMEPAGE_REHBER_SLUGS, HOMEPAGE_DYNAMIC_REHBER_TITLES } from "@/lib/blog-data";
import { BlogTeaserCard } from "@/components/blog-teaser-card";
import { OrganizationSchema } from "@/components/schemas/OrganizationSchema";
import { WebSiteSchema } from "@/components/schemas/WebSiteSchema";
import { FAQSchema } from "@/components/schemas/FAQSchema";
import { HomepageFAQ, HOMEPAGE_FAQ_ITEMS } from "@/components/homepage-faq";
import { siteConfig } from "@/lib/site";
import { getKnownCategoryName } from "@/lib/content";
import { IntroSplit, LatestArticles, LegalRightsGrid } from "@/components/home-sections";

export const metadata: Metadata = {
  alternates: { canonical: siteConfig.url },
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default async function Home() {
  const supabase = createSupabaseServerClient();
  const [dynamicRehberRes, categoriesRes] = await Promise.all([
    supabase
      .from("articles")
      .select("title, slug, category, meta_description, content, featured_image_url, created_at")
      .eq("status", "published")
      .not("category", "is", null)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase.from("categories").select("slug, name"),
  ]);

  type ArticleRow = { title: string; slug: string; category: string; meta_description?: string | null; content?: string | null; featured_image_url?: string | null; created_at?: string | null };
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
    const isMuris = a.title.toLowerCase().includes("muris") || a.title.toLowerCase().includes("muvazaa");
    const cardImg = isBosanma ? "/rehber/bosanma-davasi-nasil-acilir-avukata-sor.webp" : isIsci ? "/rehber/isten-cikarilan-iscinin-haklari-avukata-sor.webp" : isMuris ? "/rehber/muris-muvazaasi-nedir-anasayfa-avukata-sor.webp" : undefined;
    const origImg = a.featured_image_url ?? undefined;
    const imageAlt = isBosanma ? "Boşanma davası nasıl açılır avukata sor" : isIsci ? "İşten çıkarılan işçinin hakları avukata sor" : isMuris ? "Muris muvazaası nedir avukata sor" : undefined;
    const displayTitle =
      a.slug === "isten-cikarilan-iscinin-haklari-nelerdir" ||
      a.title.toLowerCase().includes("işten çıkarılan işçinin hakları")
        ? "İşten Çıkarılan İşçinin Hakları"
        : a.title;
    return {
      slug: a.slug,
      title: displayTitle,
      summary,
      categorySlug: a.category,
      image: origImg,
      cardImage: cardImg ?? origImg,
      imageAlt,
    };
  });

  const hasIsci = dynamicRehberMapped.some((p) => p.title.toLowerCase().includes("işçi") || p.title.toLowerCase().includes("isci"));
  const isciFallback =
    !hasIsci &&
    dynamicRehberMapped.length < 3 &&
    (() => {
      const g = FOOTER_POPULAR_GUIDES.find((x) => x.slug === "isten-cikarilan-iscinin-haklari-nelerdir");
      if (!g) return null;
      return {
        slug: g.slug,
        title: "İşten Çıkarılan İşçinin Hakları",
        summary: "İşten çıkarılan işçinin kıdem, ihbar tazminatı ve diğer hakları. Hak kaybına uğramamak için bilmeniz gerekenler.",
        categorySlug: g.categorySlug,
        image: "/rehber/isten-cikarilan-iscinin-haklari-avukata-sor.webp",
        cardImage: "/rehber/isten-cikarilan-iscinin-haklari-avukata-sor.webp",
        imageAlt: "İşten çıkarılan işçinin hakları avukata sor",
      };
    })();

  const homepageRehber = [...staticRehber, ...dynamicRehberMapped, ...(isciFallback ? [isciFallback] : [])];
  const finalRehber = homepageRehber.slice(0, 3);

  const categoryNames = new Map(
    ((categoriesRes.data ?? []) as { slug: string; name: string }[]).map((c) => [c.slug, c.name])
  );
  const categoryName = (slug: string) => categoryNames.get(slug) ?? getKnownCategoryName(slug) ?? slug;

  const featuredSlugs = new Set(finalRehber.map((p) => p.slug));
  const latestArticles = allArticles
    .filter((a) => !featuredSlugs.has(a.slug))
    .slice(0, 6)
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      categorySlug: a.category,
      categoryName: categoryName(a.category),
      date: a.created_at ?? null,
    }));

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
              Hukuki haklarını
              <br />
              sade bir dille öğren.
            </h1>
            <p className="max-w-lg text-[15px] text-muted-foreground">
              Miras, boşanma, iş ve icra hukukunda güncel, kaynaklı ve anlaşılır
              rehber yazılarıyla haklarını öğren.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto bg-[#1d293d] text-white hover:bg-[#1d293d]/90">
                <Link href="/rehber">Rehberleri incele</Link>
              </Button>
            </div>

          </div>

          {/* Sağ: LCP görseli (desktop) — next/image ile AVIF/WebP, priority */}
          <div className="hidden md:block relative aspect-[4/3] max-w-[800px] w-full">
            <Image
              src="/yasalhaklariniz-avukata-soru-sor.webp"
              alt="YasalHaklarınız hukuk rehberi"
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

      <IntroSplit />

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <span className="h-5 w-1 rounded-full bg-primary" />
          Öne Çıkan Rehberler
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

      <LegalRightsGrid />

      <LatestArticles items={latestArticles} />

      <div className="border-t border-slate-200/70" aria-hidden />

      <HomepageFAQ />
    </div>
    </>
  );
}
