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
import { ArrowLeft, Loader2, ImageIcon, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { FaqItem } from "@/types/article";

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
  const [faqItems, setFaqItems] = useState<FaqItem[]>(
    initialData?.faq?.length ? initialData.faq : []
  );
  const [faqOpen, setFaqOpen] = useState(false);
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
        const cleanFaq = faqItems.filter((f) => f.question.trim() && f.answer.trim());
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
          faq: cleanFaq,
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
      faqItems,
      onSuccess,
    ]
  );

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/articles" aria-label="Makalelere dön">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold sm:text-2xl">
          {isEdit ? "Makaleyi Düzenle" : "Yeni Makale"}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,6fr)_minmax(0,3fr)] lg:gap-6">
        {/* Sol: Editör + FAQ (mobilde altta) */}
        <div className="order-2 min-w-0 lg:order-1 flex flex-col gap-4">
          <div className="flex flex-col min-h-[420px] lg:min-h-[calc(100vh-10rem)] lg:max-h-[calc(100vh-6rem)]">
            <div className="flex-1 min-h-0 flex flex-col">
              <ArticleEditor
                value={content}
                onChange={setContent}
                placeholder="Makale içeriği (H2, H3, kalın, liste, link kullanabilirsiniz)"
                minHeight="280px"
                className="h-full flex flex-col min-h-0"
              />
            </div>
          </div>

          {/* FAQ Alanı */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setFaqOpen((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-sm font-semibold text-slate-800">
                Sık Sorulan Sorular (FAQ){faqItems.length > 0 && ` · ${faqItems.length}`}
              </span>
              {faqOpen ? <ChevronUp className="size-4 text-slate-500" /> : <ChevronDown className="size-4 text-slate-500" />}
            </button>
            {faqOpen && (
              <div className="border-t border-slate-100 px-4 pb-4 pt-3 space-y-3">
                {faqItems.map((item, idx) => (
                  <div key={idx} className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="shrink-0 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                        {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFaqItems((prev) => prev.filter((_, i) => i !== idx))}
                        className="shrink-0 text-slate-400 hover:text-red-500 transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                    <Input
                      value={item.question}
                      onChange={(e) =>
                        setFaqItems((prev) =>
                          prev.map((f, i) => (i === idx ? { ...f, question: e.target.value } : f))
                        )
                      }
                      placeholder="Soru başlığı"
                      className="h-8 text-sm font-medium"
                    />
                    <Textarea
                      value={item.answer}
                      onChange={(e) =>
                        setFaqItems((prev) =>
                          prev.map((f, i) => (i === idx ? { ...f, answer: e.target.value } : f))
                        )
                      }
                      placeholder="Cevap metni"
                      rows={2}
                      className="resize-none text-sm"
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setFaqItems((prev) => [...prev, { question: "", answer: "" }])}
                >
                  <Plus className="size-3.5 mr-1" />
                  Soru ekle
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sağ: Tüm girdiler (mobilde üstte) */}
        <aside className="order-1 flex flex-col gap-4 lg:order-2 lg:sticky lg:top-4 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4 shadow-sm">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Başlık</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Makale başlığı"
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label className="text-sm font-medium text-slate-700">Slug</label>
                <Button type="button" variant="outline" size="sm" className="h-7 text-xs shrink-0" onClick={generateSlug}>
                  Başlıktan
                </Button>
              </div>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="url-slug"
                className="h-9 font-mono text-sm"
              />
              <p className="text-[11px] text-slate-500 truncate">
                /{category || "…"}/rehber/{slug || "…"}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Kategori</label>
              <Select value={category || "none"} onValueChange={(v) => setCategory(v === "none" ? "" : v)}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Kategori seçin" />
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
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Yazar</label>
              <Select value={authorId || "none"} onValueChange={(v) => setAuthorId(v === "none" ? "" : v)}>
                <SelectTrigger className="h-9 w-full">
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

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Meta başlık (SEO)</label>
              <Input
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Sekme / arama başlığı"
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Meta açıklama (SEO)</label>
              <Textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="140–160 karakter"
                rows={2}
                className="resize-none text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Kapak görseli</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="h-9 cursor-pointer text-xs file:mr-2 file:rounded file:border-0 file:bg-slate-100 file:cursor-pointer file:px-2 file:py-1 file:text-xs"
                  />
                  {uploading && <Loader2 className="size-4 shrink-0 animate-spin text-slate-400" />}
                </div>
                {featuredImageUrl ? (
                  <div className="space-y-2">
                    <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-slate-100">
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
                      placeholder="Alt metni"
                      className="h-8 text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 w-full text-xs"
                      onClick={() => {
                        setFeaturedImageUrl(null);
                        setFeaturedImageAlt("");
                      }}
                    >
                      Görseli kaldır
                    </Button>
                  </div>
                ) : (
                  <div className="flex h-20 w-full items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                    <span className="flex items-center gap-1.5 text-xs">
                      <ImageIcon className="size-3.5" />
                      Görsel yok
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
              <Button
                type="button"
                className="w-full"
                disabled={saving}
                onClick={() => save("published")}
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : null}
                Yayınla
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={saving}
                onClick={() => save("draft")}
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : null}
                Taslak kaydet
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
