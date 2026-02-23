"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AuthorForm } from "@/components/author-form";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import type { Author } from "@/types/author";
import { Loader2 } from "lucide-react";

export default function AdminAuthorEditPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [author, setAuthor] = useState<Author | null | undefined>(undefined);

  useEffect(() => {
    if (!id) {
      setAuthor(null);
      return;
    }
    async function load() {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .eq("id", id)
        .single();
      if (error || !data) {
        setAuthor(null);
        return;
      }
      setAuthor(data as Author);
    }
    load();
  }, [id]);

  if (author === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (author === null) {
    return (
      <div className="container max-w-2xl py-6">
        <p className="text-muted-foreground">Yazar bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-6">
      <AuthorForm initialData={author} />
    </div>
  );
}
