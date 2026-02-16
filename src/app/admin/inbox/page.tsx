"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Inbox, Search, ExternalLink, FileQuestion, Loader2 } from "lucide-react";

type PendingQuestion = {
  id: string;
  title: string;
  created_at: string;
  category: { name: string } | null;
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

export default function AdminInboxPage() {
  const [items, setItems] = useState<PendingQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const loadPending = async () => {
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
      const res = await fetch(
        `${url}/rest/v1/questions?status=eq.pending&select=id,title,created_at,category:categories(name)&order=created_at.desc`,
        {
          headers: {
            apikey: key,
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) {
        toast.error("Bekleyen sorular getirilemedi.");
        setItems([]);
      } else {
        const data: PendingQuestion[] = await res.json();
        setItems(data);
      }
    } catch {
      toast.error("Bekleyen sorular getirilemedi.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleReject = async (id: string) => {
    const token = getAccessToken();
    if (!token) return;

    setRejectingId(id);
    try {
      const response = await fetch(`/api/admin/questions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "rejected" }),
      });

      if (!response.ok) {
        toast.error("Soru reddedilemedi.");
        return;
      }
      toast.success("Soru reddedildi.");
      loadPending();
    } catch {
      toast.error("Soru reddedilemedi.");
    } finally {
      setRejectingId(null);
    }
  };

  const filteredItems = items.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <div className="space-y-6">
      {/* Panel container */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* Panel header */}
        <div className="border-b border-border bg-muted/40 px-5 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Inbox className="size-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">Inbox</h1>
                <p className="text-sm text-muted-foreground">
                  Yanıt bekleyen sorular
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="relative flex-1 sm:w-56">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Başlıkta ara..."
                  className="h-9 pl-9"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {items.length} bekleyen
                </span>
                <Button asChild variant="outline" size="sm" className="shrink-0">
                  <Link href="/admin/sorular" className="inline-flex items-center gap-1.5">
                    Tüm Sorular
                    <ExternalLink className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel body: table or empty */}
        <div className="min-h-[200px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
              <Loader2 className="size-8 animate-spin" />
              <p className="text-sm">Yükleniyor...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-5 py-3 font-medium text-foreground">Başlık</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">Kategori</th>
                    <th className="px-5 py-3 font-medium text-muted-foreground">Gönderim</th>
                    <th className="px-5 py-3 text-right font-medium text-muted-foreground">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-border/80 transition-colors last:border-0 hover:bg-muted/20"
                    >
                      <td className="max-w-[320px] px-5 py-3">
                        <span className="font-medium text-foreground line-clamp-2" title={row.title}>
                          {row.title}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {row.category?.name ?? "—"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">
                        {new Date(row.created_at).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/admin/q/${row.id}`}>Düzenle</Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={rejectingId === row.id}
                            onClick={() => handleReject(row.id)}
                          >
                            {rejectingId === row.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              "Reddet"
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <FileQuestion className="size-7" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-foreground">
                  {items.length === 0
                    ? "Bekleyen soru yok"
                    : "Aramanıza uygun soru yok"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {items.length === 0
                    ? "Yeni sorular burada listelenecek."
                    : "Farklı bir arama deneyin veya Tüm Sorular sayfasına gidin."}
                </p>
              </div>
              {items.length === 0 && (
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/sorular">Tüm sorulara git</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
