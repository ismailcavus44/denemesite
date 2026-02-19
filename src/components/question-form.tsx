"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LEGAL_DISCLAIMER_TITLE,
  LEGAL_DISCLAIMER_TEXT,
  LEGAL_DISCLAIMER_LIST_CEVAPLAR,
  LEGAL_DISCLAIMER_LIST_KABUL,
  LEGAL_DISCLAIMER_LIST_KABUL_SUFFIX,
} from "@/lib/legal-disclaimer";
import { toast } from "sonner";

type Category = {
  id: string;
  name: string;
};

type QuestionFormProps = {
  categories: Category[];
};

export function QuestionForm({ categories }: QuestionFormProps) {
  const [body, setBody] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [showLegalError, setShowLegalError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!body.trim() || !categoryId) {
      toast.error("Lütfen kategori ve soruyu doldurun.");
      return;
    }
    if (!acceptedLegal) {
      setShowLegalError(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/soru-sor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: body.trim(),
          category_id: categoryId,
          ...(email.trim() ? { email: email.trim() } : {}),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const serverMsg = data?.error || `HTTP ${res.status}`;
        if (res.status === 429) {
          setRateLimitMessage(serverMsg);
          return;
        }
        throw new Error(serverMsg);
      }

      setSubmitted(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
      toast.error(`Soru gönderilemedi: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  if (rateLimitMessage) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">{rateLimitMessage}</p>
        <Button className="mt-4" onClick={() => router.push("/sorular")}>
          Diğer soruları gör
        </Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">Teşekkürler!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sorunuz başarıyla alındı. En geç 24 saat içinde ekibimiz tarafından uygun
          görülmesi halinde yayınlanacaktır.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={() => router.push("/sorular")}>
            Diğer soruları gör
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              setBody("");
              setCategoryId("");
              setEmail("");
            }}
          >
            Tekrar sor
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Kategori</label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="Kategori seçin" />
          </SelectTrigger>
          <SelectContent>
            {[...categories]
              .sort((a, b) => (a.name === "Diğer" ? 1 : b.name === "Diğer" ? -1 : 0))
              .map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">E-posta (isteğe bağlı)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Cevaplandığında bilgi almak isterseniz girebilirsiniz"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Soru metni</label>
        <Textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Sorunuzu detaylı şekilde yazın"
          className="min-h-[180px]"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={loading} className="bg-[#1d293d] text-white hover:bg-[#1d293d]/90">
          {loading ? "Gönderiliyor..." : "Soruyu Gönder"}
        </Button>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={acceptedLegal}
            onChange={(e) => {
              setAcceptedLegal(e.target.checked);
              if (e.target.checked) setShowLegalError(false);
            }}
            className="h-4 w-4 cursor-pointer rounded border-input"
            aria-required
          />
          <span className="text-muted-foreground">
            <Link href="/kvkk" className="text-red-600 underline hover:text-red-700">
              KVKK Metni
            </Link>
            {" ve "}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setLegalModalOpen(true);
              }}
              className="text-red-600 underline hover:text-red-700"
            >
              Yasal Bilgilendirme
            </button>
            {" metnini kabul ediyorum."}
          </span>
        </label>
      </div>
      {showLegalError && (
        <p className="text-sm text-red-600" role="alert">
          Soru göndermek için Yasal Bilgilendirme ve KVKK metnini kabul etmeniz gerekmektedir.
        </p>
      )}
      <Dialog open={legalModalOpen} onOpenChange={setLegalModalOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="pr-8">{LEGAL_DISCLAIMER_TITLE}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto text-sm text-muted-foreground">
            {LEGAL_DISCLAIMER_TEXT.split("\n\n").map((p, i) => {
              const trimmed = p.trim();
              if (trimmed === "__LIST_CEVAPLAR__") {
                return (
                  <ul key={i} className="mb-2 ml-4 list-disc space-y-1">
                    {LEGAL_DISCLAIMER_LIST_CEVAPLAR.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                );
              }
              if (trimmed === "__LIST_KABUL__") {
                return (
                  <div key={i} className="mb-2">
                    <ul className="mb-2 ml-4 list-disc space-y-1">
                      {LEGAL_DISCLAIMER_LIST_KABUL.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                    <p className="mb-2">{LEGAL_DISCLAIMER_LIST_KABUL_SUFFIX}</p>
                  </div>
                );
              }
              const isMaddeBaslik = /^\d+\.\s+.+/.test(trimmed);
              return (
                <p
                  key={i}
                  className={
                    isMaddeBaslik
                      ? "mb-2 mt-4 font-bold text-foreground first:mt-0"
                      : "mb-2"
                  }
                >
                  {trimmed}
                </p>
              );
            })}
            <p className="mt-6 border-t pt-4 text-xs text-muted-foreground">
              Son güncelleme tarihi: 12/02/2026
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}
