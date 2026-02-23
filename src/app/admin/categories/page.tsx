"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Category = {
  id: string;
  name: string;
  slug: string;
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

  const loadCategories = async () => {
    setLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const res = await fetch(
        `${url}/rest/v1/categories?select=id,name,slug&order=name`,
        { headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: "application/json" } }
      );
      const data: Category[] = res.ok ? await res.json() : [];
      setCategories(data);
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
    if (!token) { toast.error("Oturum bulunamadı."); return; }
    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: name.trim(), slug: slug.trim() }),
    });
    if (!response.ok) {
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
    if (!token) { toast.error("Oturum bulunamadı."); return; }
    const response = await fetch("/api/admin/categories", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(category),
    });
    if (!response.ok) {
      toast.error("Kategori güncellenemedi.");
      return;
    }
    toast.success("Kategori güncellendi.");
    loadCategories();
  };

  const handleDelete = async (id: string) => {
    const token = getAccessToken();
    if (!token) { toast.error("Oturum bulunamadı."); return; }
    const response = await fetch("/api/admin/categories", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) {
      toast.error("Kategori silinemedi.");
      return;
    }
    toast.success("Kategori silindi.");
    loadCategories();
  };

  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Kategoriler</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Toplam {categories.length} kategori · Ekleyin, güncelleyin, silin.
        </p>
      </div>

      <div className="mb-6 grid gap-3 rounded-xl bg-slate-50/80 p-4 md:grid-cols-3">
        <Input
          placeholder="Kategori adı"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded-xl border-slate-200 bg-white"
        />
        <Input
          placeholder="slug"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          className="rounded-xl border-slate-200 bg-white"
        />
        <Button onClick={handleCreate} className="rounded-xl">Ekle</Button>
      </div>

      {loading ? (
        <div className="py-12 text-sm text-slate-500">Yükleniyor...</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-100">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="grid gap-3 border-b border-slate-50 p-4 transition-colors duration-200 hover:bg-slate-50/50 md:grid-cols-[1fr_1fr_auto_auto]"
            >
              <Input
                value={category.name}
                onChange={(event) => {
                  const updated = [...categories];
                  updated[index] = { ...category, name: event.target.value };
                  setCategories(updated);
                }}
                className="rounded-xl border-slate-200 bg-white"
              />
              <Input
                value={category.slug}
                onChange={(event) => {
                  const updated = [...categories];
                  updated[index] = { ...category, slug: event.target.value };
                  setCategories(updated);
                }}
                className="rounded-xl border-slate-200 bg-white"
              />
              <button
                type="button"
                onClick={() => handleUpdate(category)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-indigo-300 hover:text-indigo-600"
              >
                Kaydet
              </button>
              <button
                type="button"
                onClick={() => handleDelete(category.id)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:border-red-200 hover:text-red-500"
              >
                Sil
              </button>
            </div>
          ))}
          {!categories.length && (
            <div className="border-b border-slate-50 p-8 text-center text-sm text-slate-500">
              Henüz kategori yok.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
