"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Mail, Search, Loader2 } from "lucide-react";

type ContactMessage = {
  id: string;
  full_name: string;
  phone: string;
  message: string;
  whatsapp_consent: boolean;
  created_at: string;
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

export default function AdminIletisimMesajlariPage() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<ContactMessage | null>(null);

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
      const res = await fetch(
        `${url}/rest/v1/contact_messages?select=*&order=created_at.desc`,
        {
          headers: {
            apikey: key,
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) {
        toast.error("Mesajlar yüklenemedi.");
        setItems([]);
      } else {
        const data: ContactMessage[] = await res.json();
        setItems(data);
      }
    } catch {
      toast.error("Mesajlar yüklenemedi.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const q = search.toLowerCase().trim();
  const filtered = q
    ? items.filter(
        (row) =>
          row.full_name.toLowerCase().includes(q) ||
          row.phone.toLowerCase().includes(q) ||
          row.message.toLowerCase().includes(q)
      )
    : items;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted/40 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="size-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">
                  İletişim mesajları
                </h1>
                <p className="text-sm text-muted-foreground">
                  İletişim formundan gelen kayıtlar
                </p>
              </div>
            </div>
            <div className="relative sm:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="İsim, telefon veya mesajda ara..."
                className="h-10 pl-9"
              />
            </div>
          </div>
        </div>

        <div className="min-h-[200px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
              <Loader2 className="size-8 animate-spin" />
              <p className="text-sm">Yükleniyor...</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 font-medium text-foreground sm:px-5">
                      İsim
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground sm:px-5">
                      Telefon
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground sm:px-5">
                      Mesaj
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 font-medium text-muted-foreground sm:px-5">
                      Tarih
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground sm:px-5">
                      İşlem
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-border/80 transition-colors last:border-0 hover:bg-muted/20"
                    >
                      <td className="max-w-[140px] px-4 py-3 font-medium text-foreground sm:max-w-[180px] sm:px-5">
                        <span className="line-clamp-2" title={row.full_name}>
                          {row.full_name}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground sm:px-5">
                        {row.phone}
                      </td>
                      <td className="max-w-[200px] px-4 py-3 text-muted-foreground sm:max-w-[280px] sm:px-5">
                        <span className="line-clamp-2" title={row.message}>
                          {row.message}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground sm:px-5">
                        {new Date(row.created_at).toLocaleString("tr-TR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right sm:px-5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setDetail(row)}
                        >
                          Görüntüle
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
              <Mail className="size-10 opacity-40" />
              <p className="font-medium text-foreground">
                {items.length === 0 ? "Henüz mesaj yok" : "Sonuç bulunamadı"}
              </p>
              <p className="text-sm">
                {items.length === 0
                  ? "İletişim formu gönderimleri burada listelenir."
                  : "Aramayı değiştirmeyi deneyin."}
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!detail} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto rounded-lg border p-6">
          <DialogHeader>
            <DialogTitle>Mesaj detayı</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-foreground">İsim soyisim</p>
                <p className="mt-1 text-muted-foreground">{detail.full_name}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Telefon</p>
                <p className="mt-1 text-muted-foreground">{detail.phone}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">WhatsApp onayı</p>
                <p className="mt-1 text-muted-foreground">
                  {detail.whatsapp_consent ? "Evet" : "Hayır"}
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">Gönderim</p>
                <p className="mt-1 text-muted-foreground">
                  {new Date(detail.created_at).toLocaleString("tr-TR")}
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">Mesaj</p>
                <p className="mt-1 whitespace-pre-wrap break-words text-muted-foreground">
                  {detail.message}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
