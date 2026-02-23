"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArticleEditor } from "@/components/article-editor";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import type { Article } from "@/types/article";
import type { Author } from "@/types/author";
import { toast } from "sonner";
import { ArrowLeft, Loader2, ImageIcon } from "lucide-react";

const ARTICLE_CATEGORIES: { value: string; label: string }[] = [
  { value: "aile-hukuku", label: "Aile Hukuku" },
  { value: "miras-hukuku", label: "Miras Hukuku" },
  { value: "is-hukuku", label: "İş Hukuku" },
  { value: "icra-hukuku", label: "İcra Hukuku" },
  { value: "ceza-hukuku", label: "Ceza Hukuku" },
  { value: "gayrimenkul-hukuku", label: "Gayrimenkul Hukuku" },
  { value: "diger", label: "Diğer" },
];

function getAccessToken(): string | null {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const projectRef = new URL(url).hostname.split(".")[0];
    const raw = localStorage.getItem(`sb-${projectRef}-auth-token`);
    if (!raw) return null;
    return JSON.parse(raw).access_token ?? null;
  } catch {
    return null;
  }
}

function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

type ArticleFormProps = {
  initialData?: Article | null;
  onSuccess?: () => void;
};

export function ArticleForm({ initialData, onSuccess }: ArticleFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [authorId, setAuthorId] = useState(initialData?.author_id ?? "");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(
    initialData?.meta_description ?? ""
  );
  const [content, setContent] = useState(initialData?.content ?? "");
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(
    initialData?.featured_image_url ?? null
  );
  const [featuredImageAlt, setFeaturedImageAlt] = useState(
    initialData?.featured_image_alt ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isEdit = !!initialData?.id;

  useEffect(() => {
    getSupabaseBrowserClient()
      .from("authors")
      .select("id,name,slug")
      .order("name")
      .then(({ data }) => setAuthors((data as Author[]) ?? []));
  }, []);

  const generateSlug = useCallback(() => {
    setSlug(slugFromTitle(title) || slug);
  }, [title, slug]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith("image/")) {
        toast.error("Lütfen bir görsel dosyası seçin.");
        return;
      }
      const token = getAccessToken();
      if (!token) {
        toast.error("Oturum bulunamadı.");
        return;
      }
      setUploading(true);
      try {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/admin/upload-article-image", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          toast.error(data.message ?? "Yükleme başarısız.");
          return;
        }
        if (typeof data.url === "string") {
          setFeaturedImageUrl(data.url);
          toast.success("Görsel yüklendi.");
        }
      } catch {
        toast.error("Yükleme başarısız.");
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    },
    []
  );

  const save = useCallback(
    async (status: "draft" | "published") => {
      const token = getAccessToken();
      if (!token) {
        toast.error("Oturum bulunamadı.");
        return;
      }
      const finalSlug = slug.trim().toLowerCase().replace(/\s+/g, "-") || slugFromTitle(title);
      if (!finalSlug) {
        toast.error("Slug girin veya başlıktan oluşturun.");
        return;
      }
      if (!title.trim()) {
        toast.error("Başlık gerekli.");
        return;
      }

      setSaving(true);
      try {
        const payload = {
          title: title.trim(),
          slug: finalSlug,
          category: category.trim() || null,
          author_id: authorId.trim() || null,
          content,
          meta_title: metaTitle.trim() || null,
          meta_description: metaDescription.trim() || null,
          featured_image_url: featuredImageUrl,
          featured_image_alt: featuredImageAlt.trim() || null,
          status,
        };

        if (isEdit) {
          const res = await fetch(`/api/admin/articles/${initialData!.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            toast.error(data.message ?? "Güncellenemedi.");
            return;
          }
          toast.success(status === "published" ? "Yayınlandı." : "Taslak kaydedildi.");
          onSuccess?.();
        } else {
          const res = await fetch("/api/admin/articles", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            toast.error(data.message ?? "Kaydedilemedi.");
            return;
          }
          toast.success(status === "published" ? "Yayınlandı." : "Taslak kaydedildi.");
          if (data.id) {
            window.location.href = `/admin/articles/${data.id}/edit`;
            return;
          }
          onSuccess?.();
        }
      } catch {
        toast.error("Bir hata oluştu.");
      } finally {
        setSaving(false);
      }
    },
    [
      isEdit,
      initialData,
      title,
      slug,
      category,
      authorId,
      content,
      metaTitle,
      metaDescription,
      featuredImageUrl,
      featuredImageAlt,
      onSuccess,
    ]
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/articles" aria-label="Makalelere dön">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">
          {isEdit ? "Makaleyi Düzenle" : "Yeni Makale"}
        </h1>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Başlık</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Makale başlığı"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Slug</label>
            <Button type="button" variant="outline" size="sm" onClick={generateSlug}>
              Başlıktan oluştur
            </Button>
          </div>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="url-slug"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Kategori</label>
          <Select value={category || "none"} onValueChange={(v) => setCategory(v === "none" ? "" : v)}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Kategori seçin (URL: /[kategori]/rehber/[slug])" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Kategori seçin</SelectItem>
              {ARTICLE_CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            URL: /{category || "[kategori]"}/rehber/{slug || "[slug]"}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Yazar</label>
          <Select value={authorId || "none"} onValueChange={(v) => setAuthorId(v === "none" ? "" : v)}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Yazar seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Yazar yok</SelectItem>
              {authors.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Meta Title (SEO)</label>
          <Input
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder="Tarayıcı sekmesi / arama sonucu başlığı"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Meta Description (SEO)</label>
          <Textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Kısa açıklama (140–160 karakter)"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Kapak görseli</label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="max-w-xs"
              />
              {uploading && (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              )}
            </div>
            {featuredImageUrl ? (
              <div className="space-y-2">
                <div className="relative h-48 w-full max-w-md overflow-hidden rounded-md border bg-muted">
                  <Image
                    src={featuredImageUrl}
                    alt={featuredImageAlt || "Kapak"}
                    fill
                    className="object-cover"
                    unoptimized={
                      featuredImageUrl.startsWith(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")
                    }
                  />
                </div>
                <Input
                  value={featuredImageAlt}
                  onChange={(e) => setFeaturedImageAlt(e.target.value)}
                  placeholder="Görsel alt etiketi (erişilebilirlik)"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFeaturedImageUrl(null);
                    setFeaturedImageAlt("");
                  }}
                >
                  Görseli kaldır
                </Button>
              </div>
            ) : (
              <div className="flex h-24 w-full max-w-md items-center justify-center rounded-md border border-dashed bg-muted/50 text-muted-foreground">
                <span className="flex items-center gap-2 text-sm">
                  <ImageIcon className="size-4" />
                  Görsel yükleyin veya sonra ekleyin
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">İçerik</label>
          <ArticleEditor
            value={content}
            onChange={setContent}
            placeholder="Makale içeriği (H2, H3, kalın, liste, link kullanabilirsiniz)"
            minHeight="400px"
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => save("draft")}
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : null}
            Taslak kaydet
          </Button>
          <Button type="button" disabled={saving} onClick={() => save("published")}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : null}
            Yayınla
          </Button>
        </div>
      </div>
    </div>
  );
}
