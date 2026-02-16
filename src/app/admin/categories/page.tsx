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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Kategoriler</h1>
        <p className="text-sm text-muted-foreground">
          Kategori ekleyin, güncelleyin, silin.
        </p>
      </div>

      <div className="grid gap-3 rounded-xl border p-4 md:grid-cols-3">
        <Input
          placeholder="Kategori adı"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Input
          placeholder="slug"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
        />
        <Button onClick={handleCreate}>Ekle</Button>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Yükleniyor...</div>
      ) : (
        <div className="space-y-3">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="grid gap-2 rounded-xl border p-4 md:grid-cols-[1fr_1fr_auto_auto]"
            >
              <Input
                value={category.name}
                onChange={(event) => {
                  const updated = [...categories];
                  updated[index] = { ...category, name: event.target.value };
                  setCategories(updated);
                }}
              />
              <Input
                value={category.slug}
                onChange={(event) => {
                  const updated = [...categories];
                  updated[index] = { ...category, slug: event.target.value };
                  setCategories(updated);
                }}
              />
              <Button variant="outline" onClick={() => handleUpdate(category)}>
                Kaydet
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(category.id)}
              >
                Sil
              </Button>
            </div>
          ))}
          {!categories.length && (
            <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
              Henüz kategori yok.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
