import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { notifyGoogleIndexing } from "@/lib/googleIndexing";
import { siteConfig } from "@/lib/site";

const DELAY_MS = 500;
const baseUrl = siteConfig.url.replace(/\/$/, "");

export async function POST(request: Request) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  const supabase = createSupabaseAdminClient();

  const [articlesRes, questionsRes] = await Promise.all([
    supabase
      .from("articles")
      .select("slug, category")
      .eq("status", "published")
      .not("category", "is", null),
    supabase
      .from("questions")
      .select("slug, category:categories(slug)")
      .eq("status", "published"),
  ]);

  const urls: string[] = [];

  (articlesRes.data ?? []).forEach((a) => {
    const slug = (a as { slug: string }).slug;
    const category = (a as { category: string }).category;
    if (slug && category) urls.push(`${baseUrl}/${category}/rehber/${slug}`);
  });

  (questionsRes.data ?? []).forEach((q) => {
    const slug = (q as { slug: string }).slug;
    const cat = (q as { category: { slug: string } | { slug: string }[] }).category;
    const categorySlug = Array.isArray(cat) ? cat[0]?.slug : (cat as { slug: string })?.slug;
    if (slug && categorySlug) urls.push(`${baseUrl}/${categorySlug}/soru/${slug}`);
  });

  let sent = 0;
  for (const url of urls) {
    await notifyGoogleIndexing(url);
    sent++;
    if (sent < urls.length) {
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }

  return NextResponse.json({ ok: true, sent, total: urls.length });
}
