import Link from "next/link";
import Image from "next/image";
import { QuestionCard } from "@/components/question-card";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { blogPosts, HOMEPAGE_REHBER_SLUGS } from "@/lib/blog-data";
import { BlogTeaserCard } from "@/components/blog-teaser-card";
import { questionSummaries } from "@/lib/question-summaries";

export default async function Home() {
  const supabase = createSupabaseServerClient();
  const { data: trending } = await supabase
    .from("questions")
    .select("id,title,slug,created_at,ai_card_summary,category:categories(name,slug)")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(4);


  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden py-8 md:py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Sol: İçerik */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-[42px] md:leading-[1.15]">
              Hukuki sorunu yaz,
              <br />
              net cevabını öğren.
            </h1>
            <p className="max-w-lg text-base text-muted-foreground md:text-lg">
              Hukuki sorununu sorabilir, benzer gerçek sorulara verilen kısa ve
              anlaşılır cevapları inceleyebilirsin.
            </p>

            <div className="flex flex-nowrap gap-2 sm:gap-3">
              <Button asChild size="lg" className="shrink-0 bg-[#1d293d] text-white hover:bg-[#1d293d]/90">
                <Link href="/soru-sor">Hemen soru sor</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="shrink-0 border-[#1d293d] text-[#1d293d] hover:bg-[#1d293d]/10 hover:border-[#1d293d] hover:text-[#1d293d]">
                <Link href="/sorular">Yayındaki cevaplara göz at</Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground/60 tracking-wide">
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

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <span className="h-5 w-1 rounded-full bg-primary" />
            Trend Sorular
          </h2>
          <Button asChild size="sm" className="shrink-0 bg-[#1d293d] text-white hover:bg-[#1d293d]/90">
            <Link href="/sorular">Tümünü gör</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
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
            <div className="rounded-xl border border-dashed p-8 text-sm text-muted-foreground">
              Henüz yayınlanan soru yok.
            </div>
          )}
        </div>
      </section>

      <section className="grid items-center gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Hukuki Sorulara Sade ve Net Cevaplar
            </h2>
            <span className="block h-1 w-10 rounded-full bg-primary" />
          </div>
          <p className="text-sm text-muted-foreground md:text-base">
            Hukuk karmaşık olmak zorunda değil.
            <br />
            Sorun, editör incelemesinden geçtikten sonra anonim olarak yayınlanır ve benzer gerçek sorulara verilmiş sade açıklamalarla birlikte sunulur. Böylece yalnızca kendi durumunu değil, aynı konuda daha önce yaşanmış örnekleri de görebilirsin. Karmaşık hukuk dili, uzun kanun metinleri ve anlaşılmaz ifadeler yerine; seni neyin beklediğini, hangi risklerin olabileceğini ve nasıl bir yol izlenebileceğini açık ve sakin bir çerçevede değerlendirebilirsin.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl relative aspect-[4/3]">
          <Image
            src="/avukata-sor.png"
            alt="Avukata sor görseli"
            width={800}
            height={600}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="h-auto w-full object-cover"
            loading="lazy"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <span className="h-5 w-1 rounded-full bg-primary" />
          Rehber
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {HOMEPAGE_REHBER_SLUGS.slice(0, 3)
            .map((slug) => blogPosts.find((p) => p.slug === slug))
            .filter((p): p is (typeof blogPosts)[number] => p != null)
            .map((post) => (
              <BlogTeaserCard key={post.slug} post={post} />
            ))}
        </div>
        <div className="flex justify-center pt-2">
          <Button asChild size="lg" className="bg-[#1d293d] text-white hover:bg-[#1d293d]/90">
            <Link href="/rehber">Tümünü Gör</Link>
          </Button>
        </div>
      </section>

    </div>
  );
}
