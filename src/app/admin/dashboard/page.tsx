"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Inbox,
  FileText,
  FolderTree,
  Mail,
  Loader2,
  ArrowRight,
} from "lucide-react";

type Stats = {
  pending: number;
  totalQuestions: number;
  categories: number;
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

async function fetchCount(
  url: string,
  key: string,
  token: string,
  path: string
): Promise<number> {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      Prefer: "count=exact",
      Range: "0-0",
    },
  });
  const range = res.headers.get("content-range");
  if (!range) return 0;
  const part = range.split("/")[1];
  return part === "*" ? 0 : Number(part);
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const token = getAccessToken();
      if (!token) {
        toast.error("Oturum bulunamadı.");
        setLoading(false);
        return;
      }

      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      try {
        const [pending, totalQuestions, categories] = await Promise.all([
          fetchCount(url, key, token, "questions?status=eq.pending"),
          fetchCount(url, key, token, "questions"),
          fetchCount(url, key, token, "categories"),
        ]);

        if (!cancelled) {
          setStats({ pending, totalQuestions, categories });
        }
      } catch {
        if (!cancelled) toast.error("İstatistikler yüklenemedi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const links = [
    {
      href: "/admin/inbox",
      label: "Inbox",
      description: "Yanıt bekleyen sorular",
      icon: Inbox,
      stat: stats?.pending,
      accent: "primary",
    },
    {
      href: "/admin/sorular",
      label: "Tüm Sorular",
      description: "Listele, düzenle, sil",
      icon: FileText,
      stat: stats?.totalQuestions,
      accent: "muted",
    },
    {
      href: "/admin/categories",
      label: "Kategoriler",
      description: "Kategori yönetimi",
      icon: FolderTree,
      stat: stats?.categories,
      accent: "muted",
    },
    {
      href: "/admin/toplu-email",
      label: "Toplu E-posta",
      description: "Reklam / bilgilendirme maili",
      icon: Mail,
      accent: "muted",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LayoutDashboard className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Admin paneli özeti ve hızlı erişim
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* İstatistik kartları */}
          {stats && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Bekleyen soru
                  </span>
                  <Inbox className="size-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-2xl font-semibold">{stats.pending}</p>
              </div>
              <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Toplam soru
                  </span>
                  <FileText className="size-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-2xl font-semibold">{stats.totalQuestions}</p>
              </div>
              <div className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Kategori
                  </span>
                  <FolderTree className="size-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-2xl font-semibold">{stats.categories}</p>
              </div>
            </div>
          )}

          {/* Hızlı linkler */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="border-b px-5 py-3">
              <h2 className="font-semibold">Hızlı erişim</h2>
              <p className="text-sm text-muted-foreground">
                İlgili sayfaya gitmek için tıklayın
              </p>
            </div>
            <div className="grid gap-px bg-border sm:grid-cols-2">
              {links.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-4 bg-card p-5 transition-colors hover:bg-muted/50"
                  >
                    <div
                      className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${
                        item.accent === "primary"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    {item.stat !== undefined && (
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium tabular-nums">
                        {item.stat}
                      </span>
                    )}
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
