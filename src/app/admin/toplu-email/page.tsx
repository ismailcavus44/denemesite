"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Mail, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { getTemplateGroups, getTemplateById, resolveTemplateHtml } from "@/lib/mail-templates";

type Subscriber = {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
};

type CategoryOption = {
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

export default function AdminTopluEmailPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [categorySlug, setCategorySlug] = useState<string>("");
  const [listVisible, setListVisible] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  const siteUrl = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL ?? "");
  const templateGroups = getTemplateGroups();

  const applyTemplate = (templateId: string) => {
    const t = getTemplateById(templateId);
    if (!t) return;
    setSubject(t.subject);
    setHtml(resolveTemplateHtml(t.html, siteUrl));
    setSelectedTemplateId(templateId);
    toast.success(`"${t.name}" şablonu uygulandı. İstediğiniz gibi düzenleyip gönderebilirsiniz.`);
  };

  const load = (slug: string) => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const url = slug ? `/api/admin/newsletter?category=${encodeURIComponent(slug)}` : "/api/admin/newsletter";
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.subscribers)) setSubscribers(data.subscribers);
        if (Array.isArray(data.categories)) setCategories(data.categories);
      })
      .catch(() => toast.error("Havuz yüklenemedi."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(categorySlug);
  }, [categorySlug]);

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(subscribers.map((s) => s.id)));
  };

  const selectNone = () => {
    setSelectedIds(new Set());
  };

  const allSelected = subscribers.length > 0 && selectedIds.size === subscribers.length;
  const someSelected = selectedIds.size > 0;
  const sendTargetCount = someSelected ? selectedIds.size : subscribers.length;
  const categoryLabel = categorySlug ? categories.find((c) => c.slug === categorySlug)?.name : null;

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
    if (sendTargetCount === 0) {
      toast.error("En az bir alıcı gerekli.");
      return;
    }
    setSending(true);
    try {
      const body: { subject: string; html: string; recipientIds?: string[] } = {
        subject: subject.trim(),
        html: html.trim(),
      };
      if (someSelected) {
        body.recipientIds = Array.from(selectedIds);
      } else {
        body.recipientIds = subscribers.map((s) => s.id);
      }
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
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
        setSelectedIds(new Set());
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
            Kategori bazlı filtreleyin, listeyi gösterin veya gizleyin, seçime veya tümüne gönderin.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm font-medium text-muted-foreground">Kategori:</label>
              <select
                value={categorySlug}
                onChange={(e) => {
                  setCategorySlug(e.target.value);
                  setSelectedIds(new Set());
                }}
                className="h-9 rounded-md border bg-background px-3 text-sm min-w-[180px]"
              >
                <option value="">Tümü (havuz)</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-sm text-muted-foreground">
              {categoryLabel
                ? `${categoryLabel} kategorisinde soru sormuş `
                : "Havuzda toplam "}
              <span className="font-semibold text-foreground">{subscribers.length}</span> e-posta adresi.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={selectAll} disabled={subscribers.length === 0}>
                Tümünü seç
              </Button>
              <Button variant="outline" size="sm" onClick={selectNone}>
                Seçimi kaldır
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setListVisible((v) => !v)}
                className="text-muted-foreground"
              >
                {listVisible ? (
                  <>
                    <ChevronUp className="mr-1 size-4" />
                    Listeyi gizle
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-1 size-4" />
                    Listeyi göster
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              E-postalar soru sor formunda e-posta bırakan kullanıcılardan toplanır. Listeyi gizliyken de &quot;Tümünü seç&quot; ile hepsini seçip gönderebilirsiniz.
            </p>
          </div>

          {listVisible && subscribers.length > 0 && (
            <div className="overflow-hidden rounded-xl border">
              <div className="max-h-[320px] overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 border-b bg-muted/50">
                    <tr>
                      <th className="w-10 p-2">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={() => (allSelected ? selectNone() : selectAll())}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="p-3 font-medium">E-posta</th>
                      <th className="hidden p-3 font-medium text-muted-foreground sm:table-cell">Kaynak</th>
                      <th className="hidden p-3 font-medium text-muted-foreground md:table-cell">Tarih</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((s) => (
                      <tr key={s.id} className="border-b last:border-0">
                        <td className="p-2">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(s.id)}
                            onChange={() => toggleOne(s.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="p-3 font-medium">{s.email}</td>
                        <td className="hidden p-3 text-muted-foreground sm:table-cell">{s.source ?? "—"}</td>
                        <td className="hidden p-3 text-muted-foreground md:table-cell">
                          {new Date(s.created_at).toLocaleDateString("tr-TR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="rounded-xl border bg-card p-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <FileText className="size-5 text-muted-foreground" />
              Mail şablonu
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Hazır şablon seçin, konu ve içerik alanlarına uygulanır. Sonrasında düzenleyip istediğiniz kişilere veya tümüne gönderebilirsiniz.
            </p>
            <div className="mt-3">
              <select
                value={selectedTemplateId}
                onChange={(e) => {
                  const v = e.target.value;
                  setSelectedTemplateId(v);
                  if (v) applyTemplate(v);
                }}
                className="h-10 w-full max-w-md rounded-md border bg-background px-3 text-sm"
              >
                <option value="">Şablon seçin…</option>
                {templateGroups.map((gr) => (
                  <optgroup key={gr.group} label={gr.label}>
                    {gr.templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
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
              disabled={sending || sendTargetCount === 0 || !subject.trim() || !html.trim()}
            >
              {sending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {sending
                ? "Gönderiliyor…"
                : someSelected
                  ? `Seçilen ${selectedIds.size} adrese gönder`
                  : `Tümüne gönder (${sendTargetCount})`}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
