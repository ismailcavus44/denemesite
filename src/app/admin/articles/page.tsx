"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/browserClient";
import type { Article } from "@/types/article";
import { Plus, Pencil, Loader2, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

const ROWS_PER_PAGE = 10;

function getAccessToken(): string | null {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const projectRef = new URL(url).hostname.split(".")[0];
    const raw = typeof window !== "undefined" ? localStorage.getItem(`sb-${projectRef}-auth-token`) : null;
    if (!raw) return null;
    return JSON.parse(raw).access_token ?? null;
  } catch {
    return null;
  }
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" makalesini kalıcı olarak silmek istediğinize emin misiniz?`)) return;
    const token = getAccessToken();
    if (!token) {
      toast.error("Oturum bulunamadı. Yeniden giriş yapın.");
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error((data.message as string) || "Makale silinemedi.");
        return;
      }
      setArticles((prev) => prev.filter((a) => a.id !== id));
      toast.success("Makale silindi.");
    } catch {
      toast.error("Makale silinemedi.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("articles")
        .select("id,title,slug,category,status,created_at,updated_at")
        .order("updated_at", { ascending: false });

      if (!error) setArticles((data as Article[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return articles;
    const q = search.toLowerCase().trim();
    return articles.filter(
      (a) =>
        a.title?.toLowerCase().includes(q) ||
        a.slug?.toLowerCase().includes(q) ||
        a.category?.toLowerCase().includes(q)
    );
  }, [articles, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const from = (page - 1) * ROWS_PER_PAGE;
  const pageItems = filtered.slice(from, from + ROWS_PER_PAGE);

  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Makaleler</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Toplam {articles.length} makale
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Ara..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-10 w-56 rounded-xl border-0 bg-slate-100 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
          <Link
            href="/admin/articles/create"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-700"
          >
            <Plus className="size-4" />
            Yeni Ekle
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-12 text-sm text-slate-500">
          <Loader2 className="size-4 animate-spin" />
          Yükleniyor…
        </div>
      ) : articles.length === 0 ? (
        <p className="py-12 text-sm text-slate-500">Henüz makale yok. Yeni makale ekleyin.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 pr-4 pt-0 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Başlık</th>
                  <th className="pb-3 pr-4 pt-0 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Kategori</th>
                  <th className="pb-3 pr-4 pt-0 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Slug</th>
                  <th className="pb-3 pr-4 pt-0 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Durum</th>
                  <th className="pb-3 pr-4 pt-0 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Güncellenme</th>
                  <th className="w-36 pb-3 pt-0 pr-0 text-right text-xs font-semibold uppercase tracking-wider text-slate-400" />
                </tr>
              </thead>
              <tbody>
                {pageItems.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-slate-50 transition-colors duration-200 hover:bg-indigo-50/50"
                  >
                    <td className="py-3 pr-4 font-medium text-slate-800">{a.title}</td>
                    <td className="py-3 pr-4 text-slate-500">{a.category ?? "—"}</td>
                    <td className="py-3 pr-4 text-slate-500">{a.slug}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={
                          a.status === "published"
                            ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700"
                            : "rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700"
                        }
                      >
                        {a.status === "published" ? "Yayında" : "Taslak"}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-500">
                      {a.updated_at ? new Date(a.updated_at).toLocaleDateString("tr-TR") : "—"}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/articles/${a.id}/edit`}
                          className="inline-flex items-center gap-1 text-slate-400 transition-colors hover:text-indigo-600"
                        >
                          <Pencil className="size-4" />
                          Düzenle
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(a.id, a.title ?? "")}
                          disabled={deletingId === a.id}
                          className="inline-flex items-center gap-1 text-slate-400 transition-colors hover:text-red-600 disabled:opacity-50"
                          title="Sil"
                        >
                          {deletingId === a.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">Arama sonucu bulunamadı.</p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4 text-sm text-slate-500">
            <span>
              Sayfa {page} / {totalPages} · Toplam {filtered.length} kayıt
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Rows per page:</span>
              <span className="font-medium text-slate-600">{ROWS_PER_PAGE}</span>
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                aria-label="Önceki"
              >
                ←
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                aria-label="Sonraki"
              >
                →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
