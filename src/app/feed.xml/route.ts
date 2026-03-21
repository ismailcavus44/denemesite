import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/serverClient";
import { siteConfig } from "@/lib/site";
import { blogPosts } from "@/lib/blog-data";

const baseUrl = siteConfig.url.replace(/\/$/, "");

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(html: string, maxLen = 200): string {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > maxLen ? text.slice(0, maxLen) + "..." : text;
}

function formatRssDate(d: Date): string {
  return d.toUTCString();
}

export async function GET() {
  const supabase = createSupabaseServerClient();

  const [questionsRes, articlesRes] = await Promise.all([
    supabase
      .from("questions")
      .select("title, body, slug, published_at, created_at, category:categories(slug)")
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false }),
    supabase
      .from("articles")
      .select("title, meta_description, content, slug, category, updated_at, created_at")
      .eq("status", "published")
      .not("category", "is", null)
      .order("updated_at", { ascending: false }),
  ]);

  type FeedItem = {
    title: string;
    link: string;
    description: string;
    date: Date;
    guid: string;
  };

  const items: FeedItem[] = [];

  (questionsRes.data ?? []).forEach((q) => {
    const cat = (q as { category?: { slug: string } | { slug: string }[] }).category;
    const categorySlug = Array.isArray(cat) ? cat[0]?.slug : (cat as { slug: string })?.slug;
    if (!categorySlug) return;
    const slug = (q as { slug: string }).slug;
    const publishedAt = (q as { published_at?: string | null }).published_at ?? (q as { created_at: string }).created_at;
    const date = new Date(publishedAt);
    items.push({
      title: (q as { title: string }).title,
      link: `${baseUrl}/${categorySlug}/soru/${slug}`,
      description: stripHtml((q as { body: string }).body ?? ""),
      date,
      guid: `${baseUrl}/${categorySlug}/soru/${slug}`,
    });
  });

  (articlesRes.data ?? []).forEach((a) => {
    const slug = (a as { slug: string }).slug;
    const category = (a as { category: string }).category;
    const updatedAt = (a as { updated_at?: string }).updated_at ?? (a as { created_at: string }).created_at;
    const date = new Date(updatedAt);
    const desc =
      (a as { meta_description?: string | null }).meta_description?.trim() ||
      stripHtml((a as { content?: string }).content ?? "");
    items.push({
      title: (a as { title: string }).title,
      link: `${baseUrl}/${category}/rehber/${slug}`,
      description: desc,
      date,
      guid: `${baseUrl}/${category}/rehber/${slug}`,
    });
  });

  blogPosts.forEach((post) => {
    const date = post.date ? new Date(post.date) : new Date();
    items.push({
      title: post.title,
      link: `${baseUrl}/${post.categorySlug}/rehber/${post.slug}`,
      description: post.summary,
      date,
      guid: `${baseUrl}/${post.categorySlug}/rehber/${post.slug}`,
    });
  });

  items.sort((a, b) => b.date.getTime() - a.date.getTime());

  const lastBuild = items[0]?.date ?? new Date();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>tr</language>
    <lastBuildDate>${formatRssDate(lastBuild)}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items
      .map(
        (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${formatRssDate(item.date)}</pubDate>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
