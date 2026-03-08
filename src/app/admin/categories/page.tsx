"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ChevronDown, ChevronRight } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  meta_title: string | null;
  meta_description: string | null;
};

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

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [openMetaId, setOpenMetaId] = useState<string | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const token = getAccessToken();
      if (!token) {
        setCategories([]);
        setLoading(false);
        return;
      }
      const res = await fetch("/api/admin/categories", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: Category[] = res.ok ? await res.json() : [];
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Kategoriler getirilemedi.");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async () => {
    if (!name.trim() || !slug.trim()) {
      toast.error("İsim ve slug zorunlu.");
      return;
    }
    const token = getAccessToken();
    if (!token) {
      toast.error("Oturum bulunamadı.");
      return;
    }
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: name.trim(), slug: slug.trim().toLowerCase().replace(/\s+/g, "-") }),
    });
    if (!res.ok) {
      toast.error("Kategori eklenemedi.");
      return;
    }
    setName("");
    setSlug("");
    toast.success("Kategori eklendi.");
    loadCategories();
  };

  const handleUpdate = async (category: Category) => {
    const token = getAccessToken();
    if (!token) {
      toast.error("Oturum bulunamadı.");
      return;
    }
    const res = await fetch("/api/admin/categories", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: category.id,
        name: category.name,
        slug: category.slug,
        meta_title: category.meta_title ?? null,
        meta_description: category.meta_description ?? null,
      }),
    });
    if (!res.ok) {
      toast.error("Kategori güncellenemedi.");
      return;
    }
    toast.success("Kategori güncellendi.");
    loadCategories();
  };

  const handleDelete = async (id: string) => {
    const token = getAccessToken();
    if (!token) {
      toast.error("Oturum bulunamadı.");
      return;
    }
    const res = await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      toast.error("Kategori silinemedi.");
      return;
    }
    toast.success("Kategori silindi.");
    loadCategories();
  };

  const setCategory = (index: number, patch: Partial<Category>) => {
    const next = [...categories];
    next[index] = { ...next[index], ...patch };
    setCategories(next);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-slate-800 sm:text-xl">Kategoriler</h1>
        <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{categories.length} kategori</p>
      </div>

      {/* Ekle */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end sm:gap-3">
        <Input
          placeholder="Kategori adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-10 w-full rounded-lg border-slate-200 text-sm sm:max-w-[200px]"
        />
        <Input
          placeholder="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="h-10 w-full rounded-lg border-slate-200 font-mono text-sm sm:max-w-[160px]"
        />
        <Button onClick={handleCreate} size="sm" className="h-10 rounded-lg px-4 text-sm">
          Ekle
        </Button>
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-slate-500">Yükleniyor…</p>
      ) : categories.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">Henüz kategori yok.</p>
      ) : (
        <div className="space-y-4">
          {categories.map((category, index) => {
            const isMetaOpen = openMetaId === category.id;
            return (
              <div
                key={category.id}
                className="rounded-lg border border-slate-100 bg-slate-50/50 p-3 sm:p-4"
              >
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setOpenMetaId(isMetaOpen ? null : category.id)}
                    className="flex h-8 w-6 shrink-0 items-center justify-center rounded text-slate-400 hover:bg-slate-200/60 hover:text-slate-600"
                    aria-expanded={isMetaOpen}
                    title={isMetaOpen ? "Meta alanlarını kapat" : "Meta alanlarını aç"}
                  >
                    {isMetaOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                  </button>
                  <Input
                    value={category.name}
                    onChange={(e) => setCategory(index, { name: e.target.value })}
                    placeholder="Ad"
                    className="h-8 w-full min-w-0 max-w-[160px] rounded border-slate-200 text-sm sm:max-w-[180px]"
                  />
                  <Input
                    value={category.slug}
                    onChange={(e) => setCategory(index, { slug: e.target.value })}
                    placeholder="slug"
                    className="h-8 w-full min-w-0 max-w-[120px] rounded border-slate-200 font-mono text-xs sm:max-w-[140px]"
                  />
                  <div className="flex shrink-0 gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 rounded px-2 text-xs"
                      onClick={() => handleUpdate(categories[index])}
                    >
                      Kaydet
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-8 rounded px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDelete(category.id)}
                    >
                      Sil
                    </Button>
                  </div>
                </div>
                {isMetaOpen && (
                  <div className="mt-3 border-t border-slate-200 pt-3">
                    <p className="mb-2 text-xs font-medium text-slate-600">SEO / Meta</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div>
                        <label className="mb-0.5 block text-xs font-medium text-slate-500">Meta başlık</label>
                        <Input
                          value={category.meta_title ?? ""}
                          onChange={(e) => setCategory(index, { meta_title: e.target.value })}
                          placeholder="Tarayıcı sekmesi başlığı"
                          className="h-8 rounded border-slate-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-0.5 block text-xs font-medium text-slate-500">Meta açıklama</label>
                        <Textarea
                          value={category.meta_description ?? ""}
                          onChange={(e) => setCategory(index, { meta_description: e.target.value })}
                          placeholder="Arama sonucu açıklaması (~160 karakter)"
                          rows={2}
                          className="min-h-0 resize-none rounded border-slate-200 text-sm"
                        />
                      </div>
                    </div>
                    <p className="mt-1 text-[10px] text-slate-400">Değişiklikten sonra Kaydet’e basın.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
