"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { formatPhoneInputDisplay } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
};

const MIN_BODY_LENGTH = 100;

type QuestionFormProps = {
  categories: Category[];
};

export function QuestionForm({ categories }: QuestionFormProps) {
  const [body, setBody] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [wantsContact, setWantsContact] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [acceptedWhatsapp, setAcceptedWhatsapp] = useState(false);
  const [showLegalError, setShowLegalError] = useState(false);
  const [showWhatsappError, setShowWhatsappError] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

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
          wants_contact: wantsContact,
          ...(wantsContact
            ? {
                contact_full_name: contactName.trim(),
                contact_phone: contactPhone.trim(),
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
    if (body.trim().length < MIN_BODY_LENGTH) {
      toast.error(
        `Sorunuz en az ${MIN_BODY_LENGTH} karakter olmalıdır. (${body.trim().length} / ${MIN_BODY_LENGTH})`
      );
      return;
    }
    if (wantsContact) {
      if (contactName.trim().length < 2) {
        toast.error("İletişim için isim soyisim en az 2 karakter olmalıdır.");
        return;
      }
      if (!contactPhone.trim()) {
        toast.error("İletişim talebi için telefon numarası girin.");
        return;
      }
    }
    if (!acceptedLegal) {
      setShowLegalError(true);
      return;
    }
    if (wantsContact && !acceptedWhatsapp) {
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
        <Button
          className="mt-4 bg-[#1d293d] text-white hover:bg-[#1d293d]/90"
          onClick={() => router.push("/sorular")}
        >
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
          <Button
            className="bg-[#1d293d] text-white hover:bg-[#1d293d]/90"
            onClick={() => router.push("/sorular")}
          >
            Diğer soruları gör
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              setBody("");
              setCategoryId("");
              setWantsContact(false);
              setContactName("");
              setContactPhone("");
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
        <label className="text-sm font-medium">
          Kategori seçin <span className="text-red-600">*</span>
        </label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="Kategoriler" />
          </SelectTrigger>
          <SelectContent>
            {[...categories]
              .sort((a, b) =>
                a.name === "Diğer" ? 1 : b.name === "Diğer" ? -1 : 0
              )
              .map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            Sorunuz <span className="text-red-600">*</span>
          </label>
          <span
            className={`text-xs ${body.trim().length > 0 && body.trim().length < MIN_BODY_LENGTH ? "text-amber-600" : "text-muted-foreground"}`}
          >
            {body.trim().length} / {MIN_BODY_LENGTH} karakter
          </span>
        </div>
        <Textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Sorunuzu detaylı şekilde yazın (en az 100 karakter)"
          className="min-h-[180px]"
        />
      </div>

      <div
        className={
          "space-y-3 rounded-lg border border-border bg-muted/20 p-4 " +
          (wantsContact ? "w-full" : "w-full md:w-fit md:max-w-full")
        }
      >
        <p className="text-sm font-medium text-foreground">
          Sorunuz için sizinle iletişime geçilmesini istiyor musunuz?
        </p>
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="İletişim tercihi"
        >
          <Button
            type="button"
            variant="outline"
            aria-pressed={wantsContact}
            className="border-[#1d293d] !bg-[#1d293d] text-white shadow-none hover:!bg-[#1d293d]/90 hover:!text-white"
            onClick={() => setWantsContact(true)}
          >
            Evet
          </Button>
          <Button
            type="button"
            variant="outline"
            aria-pressed={!wantsContact}
            className={
              !wantsContact
                ? "border-border bg-muted/90 font-medium text-foreground shadow-none hover:bg-muted"
                : "border-border bg-background text-muted-foreground shadow-none hover:bg-muted/60 hover:text-foreground"
            }
            onClick={() => {
              setWantsContact(false);
              setContactName("");
              setContactPhone("");
              setAcceptedWhatsapp(false);
              setShowWhatsappError(false);
            }}
          >
            Hayır
          </Button>
        </div>
        <div
          className={`grid transition-[grid-template-rows] duration-200 ease-out ${
            wantsContact ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div
            className={`min-h-0 overflow-hidden ${!wantsContact ? "pointer-events-none" : ""}`}
          >
            <div className="space-y-3 pt-1">
              <div className="space-y-2">
                <label htmlFor="soru-contact-name" className="text-sm font-medium">
                  İsim soyisim <span className="text-red-600">*</span>
                </label>
                <Input
                  id="soru-contact-name"
                  name="contact_full_name"
                  autoComplete="name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Adınız ve soyadınız"
                  minLength={2}
                  tabIndex={wantsContact ? 0 : -1}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="soru-contact-phone" className="text-sm font-medium">
                  Telefon <span className="text-red-600">*</span>
                </label>
                <Input
                  id="soru-contact-phone"
                  name="contact_phone"
                  type="tel"
                  autoComplete="tel"
                  value={contactPhone}
                  onChange={(e) => {
                    setContactPhone(formatPhoneInputDisplay(e.target.value));
                    if (e.target.value.replace(/\D/g, "").length > 0) setShowWhatsappError(false);
                  }}
                  placeholder="05xx xxx xx xx"
                  tabIndex={wantsContact ? 0 : -1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#1d293d] text-white hover:bg-[#1d293d]/90"
        >
          {loading ? "Gönderiliyor..." : "Soruyu Gönder"}
        </Button>
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
            <Link href="/kvkk" className="text-muted-foreground underline hover:text-foreground">
              KVKK Aydınlatma Metni
            </Link>
            &apos;ni okudum.{" "}
            <Link href="/sorumluluk-reddi" className="text-muted-foreground underline hover:text-foreground">
              Sorumluluk Reddi ve Kullanım Şartları
            </Link>
            &apos;nı kabul ediyorum. <span className="text-red-600">*</span>
          </span>
        </label>

        {wantsContact ? (
          <label className="flex cursor-pointer items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={acceptedWhatsapp}
              onChange={(e) => {
                setAcceptedWhatsapp(e.target.checked);
                if (e.target.checked) setShowWhatsappError(false);
              }}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-input"
              aria-required
            />
            <span className="text-muted-foreground">
              Formda belirttiğim numaram üzerinden benimle iletişime geçilmesini ve verilerimin{" "}
              <Link href="/kvkk" className="text-muted-foreground underline hover:text-foreground">
                Aydınlatma Metni
              </Link>
              &apos;ne uygun olarak işlenmesini kabul ediyorum.{" "}
              <span className="text-red-600">*</span>
            </span>
          </label>
        ) : null}
      </div>

      {showLegalError && (
        <p className="text-sm text-red-600" role="alert">
          Soru göndermek için KVKK Aydınlatma Metni ve Sorumluluk Reddi metnini kabul etmeniz gerekmektedir.
        </p>
      )}
      {showWhatsappError && (
        <p className="text-sm text-red-600" role="alert">
          İletişim talebi için numara ve veri işleme onayını işaretlemeniz gerekmektedir.
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
            Sorunuzu göndermek üzeresiniz. Onaylıyor musunuz?
          </p>
          <div className="mt-3 flex gap-3">
            <Button
              type="button"
              className="flex-1 rounded-[8px] bg-slate-800 text-white hover:bg-slate-900"
              onClick={doSubmit}
              disabled={loading}
            >
              Gönder
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-[8px] border-slate-300"
              onClick={() => setConfirmModalOpen(false)}
            >
              İptal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}
