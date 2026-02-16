"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

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

export default function AdminTopluEmailPage() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("/api/admin/newsletter", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.count === "number") setCount(data.count);
      })
      .catch(() => toast.error("Abone sayısı alınamadı."))
      .finally(() => setLoading(false));
  }, []);

  const handleSend = async () => {
    const token = getAccessToken();
    if (!token) {
      toast.error("Oturum bulunamadı.");
      return;
    }
    if (!subject.trim() || !html.trim()) {
      toast.error("Konu ve içerik gerekli.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject: subject.trim(), html: html.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || "Gönderim başarısız.");
        return;
      }
      toast.success(`${data.sent ?? 0} adrese gönderildi.${data.failed ? ` ${data.failed} hata.` : ""}`);
      if (data.sent > 0) {
        setSubject("");
        setHtml("");
      }
    } catch {
      toast.error("Gönderim sırasında hata oluştu.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Mail className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Toplu E-posta</h1>
          <p className="text-sm text-muted-foreground">
            Toplanan e-posta adreslerine reklam / bilgilendirme maili gönderin
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-sm font-medium text-muted-foreground">
              Listede toplam <span className="font-semibold text-foreground">{count ?? 0}</span> e-posta adresi var.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              E-postalar soru sor formunda e-posta bırakan kullanıcılardan toplanır.
            </p>
          </div>

          <div className="space-y-4 rounded-xl border p-4">
            <h2 className="text-lg font-semibold">Mail içeriği</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Konu</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="E-posta konusu"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">İçerik (HTML)</label>
              <Textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                placeholder="<p>Merhaba, ...</p>"
                className="min-h-[200px] font-mono text-sm"
                rows={12}
              />
              <p className="text-xs text-muted-foreground">
                HTML kullanabilirsiniz. Örn. &lt;p&gt;, &lt;a href="..."&gt;, &lt;strong&gt;
              </p>
            </div>
            <Button
              onClick={handleSend}
              disabled={sending || (count ?? 0) === 0 || !subject.trim() || !html.trim()}
            >
              {sending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {sending ? "Gönderiliyor…" : "Toplu mail gönder"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
