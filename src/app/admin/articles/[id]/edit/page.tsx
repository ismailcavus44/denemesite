"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArticleForm } from "@/components/article-form";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import type { Article } from "@/types/article";
import { Loader2 } from "lucide-react";

export default function AdminArticleEditPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [article, setArticle] = useState<Article | null | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      setArticle(null);
      return;
    }
    async function load() {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();
      if (error || !data) {
        setArticle(null);
        return;
      }
      setArticle(data as Article);
    }
    load();
  }, [id]);

  if (article === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (article === null) {
    return (
      <div className="container max-w-4xl py-6">
        <p className="text-muted-foreground">Makale bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none py-4">
      <ArticleForm initialData={article} />
    </div>
  );
}
