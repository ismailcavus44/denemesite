"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Search, ChevronLeft, ChevronRight, Trash2, Pencil, Eye } from "lucide-react";

type CategoryOption = { id: string; name: string };

type QuestionRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  created_at: string;
  category: { name: string; slug: string } | null;
};

const STATUS_OPTIONS = [
  { value: "", label: "Tümü" },
  { value: "pending", label: "Bekleyen" },
  { value: "draft", label: "Taslak" },
  { value: "published", label: "Yayında" },
  { value: "rejected", label: "Reddedilen" },
];

const PAGE_SIZE = 15;

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

function statusLabel(s: string): string {
  const t: Record<string, string> = {
    pending: "Bekleyen",
    draft: "Taslak",
    published: "Yayında",
    rejected: "Reddedilen",
  };
  return t[s] ?? s;
}

function statusBadgeClass(s: string): string {
  const base = "rounded-full px-3 py-1 text-xs font-medium ";
  switch (s) {
    case "published":
      return base + "bg-emerald-100 text-emerald-700";
    case "pending":
      return base + "bg-amber-100 text-amber-700";
    case "rejected":
      return base + "bg-red-100 text-red-700";
    default:
      return base + "bg-slate-100 text-slate-600";
  }
}

export default function AdminSorularPage() {
  const [items, setItems] = useState<QuestionRow[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingSelected, setDeletingSelected] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllOnPage = () => {
    const ids = filteredItems.map((q) => q.id);
    const allSelected = ids.length > 0 && ids.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) ids.forEach((id) => next.delete(id));
      else ids.forEach((id) => next.add(id));
      return next;
    });
  };

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase().trim();
    return items.filter((row) => row.title?.toLowerCase().includes(q));
  }, [items, search]);

  const loadCategories = async () => {
    const token = getAccessToken();
    if (!token) return;
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const res = await fetch(`${url}/rest/v1/categories?select=id,name&order=name`, {
        headers: { apikey: key, Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (res.ok) {
        const data: CategoryOption[] = await res.json();
        setCategories(data);
      }
    } catch {
      // ignore
    }
  };

  const load = async () => {
    setLoading(true);
    const token = getAccessToken();
    if (!token) {
      toast.error("Oturum bulunamadı.");
      setLoading(false);
      return;
    }

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const orderDir = statusFilter === "pending" ? "asc" : "desc";
      let listPath = `${url}/rest/v1/questions?select=id,title,slug,status,created_at,category:categories(name,slug)&order=created_at.${orderDir}`;
      if (statusFilter) listPath += `&status=eq.${statusFilter}`;
      if (categoryFilter) listPath += `&category_id=eq.${categoryFilter}`;

      let countPath = `${url}/rest/v1/questions?select=id`;
      if (statusFilter) countPath += `&status=eq.${statusFilter}`;
      if (categoryFilter) countPath += `&category_id=eq.${categoryFilter}`;
      const [listRes, countRes] = await Promise.all([
        fetch(listPath, {
          headers: {
            apikey: key,
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            Range: `${from}-${to}`,
          },
        }),
        fetch(countPath, {
          headers: {
            apikey: key,
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            Prefer: "count=exact",
            Range: "0-0",
          },
        }),
      ]);

      if (!listRes.ok) {
        toast.error("Sorular yüklenemedi.");
        setItems([]);
        setLoading(false);
        return;
      }

      const data: QuestionRow[] = await listRes.json();
      setItems(data);

      const countHeader = countRes.headers.get("content-range");
      if (countHeader) {
        const part = countHeader.split("/")[1];
        setTotal(part === "*" ? 0 : Number(part));
      } else {
        setTotal(data.length);
      }
    } catch {
      toast.error("Sorular yüklenemedi.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, categoryFilter]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" soruyu kalıcı olarak silmek istediğinize emin misiniz?`)) return;

    const token = getAccessToken();
    if (!token) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        toast.error("Soru silinemedi.");
        return;
      }
      toast.success("Soru silindi.");
      load();
    } catch {
      toast.error("Soru silinemedi.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteSelected = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (!confirm(`${ids.length} soruyu kalıcı olarak silmek istediğinize emin misiniz?`)) return;

    const token = getAccessToken();
    if (!token) return;

    setDeletingSelected(true);
    let failed = 0;
    for (const id of ids) {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) failed++;
    }
    setDeletingSelected(false);
    setSelectedIds(new Set());
    if (failed > 0) toast.error(`${failed} soru silinemedi.`);
    else toast.success(`${ids.length} soru silindi.`);
    load();
  };

  return (
    <div className="rounded-2xl sm:rounded-[2rem] border border-slate-100 bg-white p-4 sm:p-6 lg:p-8 shadow-sm">
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Tüm Sorular</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Toplam {total} soru
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full sm:w-56 rounded-xl border-0 bg-slate-100 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
          {selectedIds.size > 0 && (
            <button
              type="button"
              disabled={deletingSelected}
              onClick={handleDeleteSelected}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
            >
              <Trash2 className="size-4" />
              {deletingSelected ? "Siliniyor…" : `Seçilenleri sil (${selectedIds.size})`}
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
        <label className="text-xs sm:text-sm text-slate-500">Durum:</label>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <label className="text-xs sm:text-sm text-slate-500">Kategori:</label>
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700"
        >
          <option value="">Tümü</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="py-12 text-sm text-slate-500">Yükleniyor...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="w-10 pb-3 pr-2 pt-0 text-left">
                    <input
                      type="checkbox"
                      checked={filteredItems.length > 0 && filteredItems.every((q) => selectedIds.has(q.id))}
                      onChange={selectAllOnPage}
                      className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      aria-label="Bu sayfadakileri seç / kaldır"
                    />
                  </th>
                  <th className="pb-3 pr-4 pt-0 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Başlık</th>
                  <th className="pb-3 pr-4 pt-0 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Kategori</th>
                  <th className="pb-3 pr-4 pt-0 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Durum</th>
                  <th className="pb-3 pr-4 pt-0 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Tarih</th>
                  <th className="pb-3 pt-0 pr-0 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((q) => (
                  <tr
                    key={q.id}
                    className="border-b border-slate-50 transition-colors duration-200 hover:bg-indigo-50/50"
                  >
                    <td className="w-10 py-3 pr-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(q.id)}
                        onChange={() => toggleSelect(q.id)}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        aria-label={`${q.title} soruyu seç`}
                      />
                    </td>
                    <td className="max-w-[160px] sm:max-w-[240px] truncate py-3 pr-4 font-medium text-slate-800" title={q.title}>
                      {q.title}
                    </td>
                    <td className="py-3 pr-4 text-slate-500">
                      {q.category?.name ?? "—"}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={statusBadgeClass(q.status)}>
                        {statusLabel(q.status)}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-500">
                      {new Date(q.created_at).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-3">
                        {q.status === "published" && q.slug && q.category?.slug && (
                          <a
                            href={`/${q.category.slug}/soru/${q.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-slate-400 transition-colors hover:text-emerald-600"
                            title="Sitede görüntüle"
                          >
                            <Eye className="size-4" />
                          </a>
                        )}
                        <Link
                          href={`/admin/q/${q.id}`}
                          className="inline-flex items-center gap-1 text-slate-400 transition-colors hover:text-indigo-600"
                        >
                          <Pencil className="size-4" />
                          Düzenle
                        </Link>
                        <button
                          type="button"
                          disabled={deletingId === q.id}
                          onClick={() => handleDelete(q.id, q.title)}
                          className="inline-flex items-center gap-1 text-slate-400 transition-colors hover:text-red-500 disabled:opacity-50"
                        >
                          <Trash2 className="size-4" />
                          {deletingId === q.id ? "..." : "Sil"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!items.length && (
            <div className="border-b border-slate-50 py-8 text-center text-sm text-slate-500">
              {statusFilter || categoryFilter ? "Bu filtreye uygun soru yok." : "Henüz soru yok."}
            </div>
          )}

          {items.length > 0 && !filteredItems.length && (
            <p className="py-6 text-center text-sm text-slate-500">Arama sonucu bulunamadı.</p>
          )}

          {totalPages > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4 text-sm text-slate-500">
              <span>
                Sayfa {page} / {totalPages} · Toplam {total} soru
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Rows per page:</span>
                <span className="font-medium text-slate-600">{PAGE_SIZE}</span>
                  <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                  aria-label="Önceki"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                  aria-label="Sonraki"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
