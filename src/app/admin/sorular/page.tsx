"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type QuestionRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  created_at: string;
  category: { name: string } | null;
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

export default function AdminSorularPage() {
  const [items, setItems] = useState<QuestionRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

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

      let listPath = `${url}/rest/v1/questions?select=id,title,slug,status,created_at,category:categories(name)&order=created_at.desc`;
      if (statusFilter) {
        listPath += `&status=eq.${statusFilter}`;
      }

      const countPath = `${url}/rest/v1/questions?select=id${statusFilter ? `&status=eq.${statusFilter}` : ""}`;
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
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

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

  const handleDeleteAll = async () => {
    if (!confirm(`Tüm sorular (${total} adet) kalıcı olarak silinecek. Cevaplar da silinir. Bu işlem geri alınamaz. Emin misiniz?`)) return;

    const token = getAccessToken();
    if (!token) return;

    setDeletingAll(true);
    try {
      const res = await fetch("/api/admin/questions", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error((data.message as string) ?? "Silinemedi.");
        return;
      }
      toast.success("Tüm sorular silindi.");
      load();
    } catch {
      toast.error("Silinirken hata oluştu.");
    } finally {
      setDeletingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tüm Sorular</h1>
          <p className="text-sm text-muted-foreground">
            Tüm soruları listele, düzenle veya sil.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-muted-foreground">Durum:</label>
          <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        </div>
        <Button
          variant="destructive"
          size="sm"
          disabled={loading || total === 0 || deletingAll}
          onClick={handleDeleteAll}
        >
          {deletingAll ? "Siliniyor…" : "Tümünü sil"}
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Yükleniyor...</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 font-medium">Başlık</th>
                  <th className="p-3 font-medium">Kategori</th>
                  <th className="p-3 font-medium">Durum</th>
                  <th className="p-3 font-medium">Tarih</th>
                  <th className="p-3 font-medium text-right">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {items.map((q) => (
                  <tr key={q.id} className="border-b last:border-0">
                    <td className="max-w-[240px] truncate p-3 font-medium" title={q.title}>
                      {q.title}
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {q.category?.name ?? "—"}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{statusLabel(q.status)}</Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(q.created_at).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/q/${q.id}`}>Düzenle</Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deletingId === q.id}
                          onClick={() => handleDelete(q.id, q.title)}
                        >
                          {deletingId === q.id ? "..." : "Sil"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!items.length && (
            <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
              {statusFilter ? "Bu filtreye uygun soru yok." : "Henüz soru yok."}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
              <span>
                Toplam {total} soru • Sayfa {page} / {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Önceki
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Sonraki
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
