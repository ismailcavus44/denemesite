"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

type BasvuruType = "yazar" | "editor";

export function BasvuruForm({ type }: { type: BasvuruType }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("type", type);

    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();
    const cv = formData.get("cv") as File | null;
    const kvkk = formData.get("kvkk") === "on";

    if (!name || !email || !phone) {
      setMessage({ type: "error", text: "Ad soyad, e-posta ve telefon zorunludur." });
      return;
    }
    if (!kvkk) {
      setMessage({ type: "error", text: "KVKK aydınlatma metnini kabul etmeniz gerekmektedir." });
      return;
    }
    if (!cv?.size) {
      setMessage({ type: "error", text: "CV dosyası (Word) yükleyiniz." });
      return;
    }
    const ext = cv.name.toLowerCase().slice(-5);
    if (ext !== ".docx") {
      setMessage({ type: "error", text: "CV yalnızca Word (.docx) formatında olmalıdır." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/kariyer/basvuru", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Başvuru gönderilemedi." });
        return;
      }
      setMessage({ type: "success", text: "Başvurunuz alındı. En kısa sürede dönüş yapacağız." });
      form.reset();
    } catch {
      setMessage({ type: "error", text: "Bağlantı hatası. Lütfen tekrar deneyin." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="basvuru-name" className="mb-1 block text-sm font-medium text-slate-700">
            Ad Soyad
          </label>
          <Input
            id="basvuru-name"
            name="name"
            type="text"
            required
            placeholder="Adınız soyadınız"
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="basvuru-email" className="mb-1 block text-sm font-medium text-slate-700">
            E-posta
          </label>
          <Input
            id="basvuru-email"
            name="email"
            type="email"
            required
            placeholder="ornek@email.com"
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="basvuru-phone" className="mb-1 block text-sm font-medium text-slate-700">
            Telefon
          </label>
          <Input
            id="basvuru-phone"
            name="phone"
            type="tel"
            required
            placeholder="05XX XXX XX XX"
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="basvuru-cv" className="mb-1 block text-sm font-medium text-slate-700">
            CV (Word)
          </label>
          <Input
            id="basvuru-cv"
            name="cv"
            type="file"
            accept=".docx"
            required
            className="mt-1 cursor-pointer file:cursor-pointer file:mr-2 file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm"
          />
          <p className="mt-1 text-xs text-slate-500">Yalnızca .docx formatı kabul edilir.</p>
        </div>
      </div>
      {message && (
        <p
          className={`text-sm ${message.type === "success" ? "text-green-700" : "text-red-600"}`}
        >
          {message.text}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={loading} className="gap-2">
          <Send className="h-4 w-4" aria-hidden />
          {loading ? "Gönderiliyor…" : "Başvuruyu gönder"}
        </Button>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="basvuru-kvkk"
            name="kvkk"
            required
            className="h-4 w-4 cursor-pointer rounded border-slate-300 text-primary focus:ring-primary"
            aria-describedby="basvuru-kvkk-desc"
          />
          <label id="basvuru-kvkk-desc" htmlFor="basvuru-kvkk" className="cursor-pointer text-sm text-slate-700">
            <a href="/kvkk" className="cursor-pointer text-primary underline underline-offset-2 hover:no-underline" target="_blank" rel="noopener noreferrer">
              KVKK Aydınlatma Metni
            </a>
            ’ni okudum ve kabul ediyorum.
          </label>
        </div>
      </div>
    </form>
  );
}
