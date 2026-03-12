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
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [acceptedWhatsapp, setAcceptedWhatsapp] = useState(false);
  const [showLegalError, setShowLegalError] = useState(false);
  const [showWhatsappError, setShowWhatsappError] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const hasPhone = phone.trim().length > 0;
  const showWhatsappCheckbox = hasPhone;
  const canSubmit =
    acceptedLegal &&
    (hasPhone ? acceptedWhatsapp : true);
  const router = useRouter();

  const doSubmit = async () => {
    setLoading(true);
    setConfirmModalOpen(false);
    try {
      const res = await fetch("/api/soru-sor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: body.trim(),
          category_id: categoryId,
          consent_accepted: true,
          ...(phone.trim()
            ? {
                phone: phone.trim(),
                whatsapp_consent: acceptedWhatsapp,
              }
            : {}),
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
      toast.error(`Soru gönderilemedi: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!body.trim() || !categoryId) {
      toast.error("Lütfen kategori ve soruyu doldurun.");
      return;
    }
    if (!acceptedLegal) {
      setShowLegalError(true);
      return;
    }
    if (hasPhone && !acceptedWhatsapp) {
      setShowWhatsappError(true);
      return;
    }
    setShowLegalError(false);
    setShowWhatsappError(false);
    setConfirmModalOpen(true);
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
              setPhone("");
              setAcceptedLegal(false);
              setAcceptedWhatsapp(false);
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
        <label className="text-sm font-medium">Kategori <span className="text-red-600">*</span></label>
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
        <label className="text-sm font-medium">Telefon Numarası (Sorunuz cevaplandığında bildirim almak istiyorsanız yazın.)</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => {
          setPhone(e.target.value);
          if (!e.target.value.trim()) {
            setShowWhatsappError(false);
            setAcceptedWhatsapp(false);
          }
        }}
          placeholder="Örn: 5555555555"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Sorunuzu Detaylı Yazınız. <span className="text-red-600">*</span></label>
        <Textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Sorunuzu detaylı şekilde yazın"
          className="min-h-[180px]"
        />
      </div>
      <div className="space-y-3">
        <label className="flex cursor-pointer items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={acceptedLegal}
            onChange={(e) => {
              setAcceptedLegal(e.target.checked);
              if (e.target.checked) setShowLegalError(false);
            }}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-input"
            aria-required
          />
          <span className="text-muted-foreground">
            <Link href="/kvkk" className="text-red-600 underline hover:text-red-700">
              KVKK Aydınlatma Metni
            </Link>
            &apos;ni okudum.{" "}
            <Link href="/sorumluluk-reddi" className="text-red-600 underline hover:text-red-700">
              Sorumluluk Reddi ve Kullanım Şartları
            </Link>
            &apos;nı kabul ediyorum. <span className="text-red-600">*</span>
          </span>
        </label>

        {showWhatsappCheckbox && (
          <label className="flex cursor-pointer items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={acceptedWhatsapp}
              onChange={(e) => {
                setAcceptedWhatsapp(e.target.checked);
                if (e.target.checked) setShowWhatsappError(false);
              }}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-input"
              aria-required={hasPhone}
            />
            <span className="text-muted-foreground">
              Belirttiğim numaraya WhatsApp bildirimi gönderilmesini ve numaramın{" "}
              <Link href="/kvkk" className="text-red-600 underline hover:text-red-700">
                Aydınlatma Metni
              </Link>
              &apos;nde belirtilen yurtdışı altyapı sağlayıcılarına (Supabase, Twilio, Meta) aktarılmasını açık rızamla kabul ediyorum. <span className="text-red-600">*</span>
            </span>
          </label>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          disabled={loading || !canSubmit}
          className="bg-[#1d293d] text-white hover:bg-[#1d293d]/90"
        >
          {loading ? "Gönderiliyor..." : "Soruyu Gönder"}
        </Button>
      </div>

      {showLegalError && (
        <p className="text-sm text-red-600" role="alert">
          Soru göndermek için KVKK Aydınlatma Metni ve Sorumluluk Reddi metnini kabul etmeniz gerekmektedir.
        </p>
      )}
      {showWhatsappError && (
        <p className="text-sm text-red-600" role="alert">
          Telefon numarası girdiğinizde WhatsApp bildirimi ve veri aktarımı için açık rıza onayını işaretlemeniz gerekmektedir.
        </p>
      )}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent className="max-w-[400px] rounded-[8px] border border-slate-200 p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-slate-900">
              Soruyu gönder
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-relaxed text-slate-600">
            Telefon numaranızı girdiğiniz takdirde sorunuz cevaplandığında bildirim alacaksınız.
          </p>
          <div className="mt-3 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-[8px] border-slate-300"
              onClick={() => setConfirmModalOpen(false)}
            >
              İptal
            </Button>
            <Button
              type="button"
              className="flex-1 rounded-[8px] bg-slate-800 text-white hover:bg-slate-900"
              onClick={doSubmit}
              disabled={loading}
            >
              Gönder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}
