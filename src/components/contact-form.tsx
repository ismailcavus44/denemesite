"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn, formatPhoneInputDisplay } from "@/lib/utils";

function FieldLabel({
  htmlFor,
  children,
  required: req,
}: {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="text-[13px] text-slate-600">
      {children}
      {req ? <span className="text-red-500"> *</span> : null}
    </label>
  );
}

const fieldClass =
  "h-10 rounded-none border-0 border-b border-slate-300 bg-transparent px-0 text-[15px] shadow-none placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:ring-0";

export function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [acceptedWhatsapp, setAcceptedWhatsapp] = useState(false);
  const [showLegalError, setShowLegalError] = useState(false);
  const [showWhatsappError, setShowWhatsappError] = useState(false);

  const hasPhone = phone.trim().length > 0;
  const showWhatsappCheckbox = hasPhone;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 10) {
      toast.error("Mesaj en az 10 karakter olmalıdır.");
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
    setLoading(true);
    try {
      const res = await fetch("/api/iletisim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          message: message.trim(),
          consent_accepted: true,
          whatsapp_consent: acceptedWhatsapp,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data?.error === "string"
            ? data.error
            : `Gönderim başarısız (${res.status})`;
        toast.error(msg);
        return;
      }
      toast.success(
        "Teşekkürler. Mesajınız alındı; en kısa sürede dönüş yapacağız."
      );
      setFullName("");
      setPhone("");
      setMessage("");
      setAcceptedLegal(false);
      setAcceptedWhatsapp(false);
    } catch {
      toast.error("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-full border-t border-slate-200 pt-8">
      <div className="flex flex-col gap-8">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-x-12">
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="contact-fullName" required>
              İsim soyisim
            </FieldLabel>
            <Input
              id="contact-fullName"
              name="fullName"
              required
              minLength={2}
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Adınız ve soyadınız"
              className={fieldClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="contact-phone" required>
              Telefon
            </FieldLabel>
            <Input
              id="contact-phone"
              name="phone"
              type="tel"
              required
              minLength={8}
              autoComplete="tel"
              value={phone}
              onChange={(e) => {
                setPhone(formatPhoneInputDisplay(e.target.value));
                if (e.target.value.replace(/\D/g, "").length > 0)
                  setShowWhatsappError(false);
              }}
              placeholder="05xx xxx xx xx"
              className={fieldClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="contact-message" required>
            Mesajınız
          </FieldLabel>
          <Textarea
            id="contact-message"
            name="message"
            required
            minLength={10}
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Konuyu ve talebinizi yazabilirsiniz."
            className={cn(
              fieldClass,
              "min-h-[148px] resize-y py-2 leading-relaxed"
            )}
          />
        </div>

        <div className="space-y-3 border-t border-slate-100 pt-6">
          <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-snug text-slate-600">
            <input
              type="checkbox"
              checked={acceptedLegal}
              onChange={(e) => {
                setAcceptedLegal(e.target.checked);
                if (e.target.checked) setShowLegalError(false);
              }}
              className="mt-0.5 size-3.5 shrink-0 cursor-pointer rounded-sm border-slate-300 text-slate-900 focus:ring-slate-900/20"
              aria-required
            />
            <span>
              <Link
                href="/kvkk"
                className="underline decoration-slate-300 underline-offset-2 hover:decoration-slate-700"
              >
                KVKK Aydınlatma Metni
              </Link>
              &apos;ni okudum.{" "}
              <Link
                href="/sorumluluk-reddi"
                className="underline decoration-slate-300 underline-offset-2 hover:decoration-slate-700"
              >
                Sorumluluk Reddi ve Kullanım Şartları
              </Link>
              &apos;nı kabul ediyorum.{" "}
              <span className="text-red-500">*</span>
            </span>
          </label>

          {showWhatsappCheckbox ? (
            <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-snug text-slate-600">
              <input
                type="checkbox"
                checked={acceptedWhatsapp}
                onChange={(e) => {
                  setAcceptedWhatsapp(e.target.checked);
                  if (e.target.checked) setShowWhatsappError(false);
                }}
                className="mt-0.5 size-3.5 shrink-0 cursor-pointer rounded-sm border-slate-300 text-slate-900 focus:ring-slate-900/20"
                aria-required={hasPhone}
              />
              <span>
                Formda belirttiğim numaram üzerinden benimle iletişime geçilmesini ve verilerimin{" "}
                <Link
                  href="/kvkk"
                  className="underline decoration-slate-300 underline-offset-2 hover:decoration-slate-700"
                >
                  Aydınlatma Metni
                </Link>
                &apos;ne uygun olarak işlenmesini kabul ediyorum.{" "}
                <span className="text-red-500">*</span>
              </span>
            </label>
          ) : null}

          {showLegalError ? (
            <p className="text-[13px] text-red-700" role="alert">
              Mesaj göndermek için KVKK Aydınlatma Metni ve Sorumluluk Reddi metnini kabul etmeniz gerekmektedir.
            </p>
          ) : null}
          {showWhatsappError ? (
            <p className="text-[13px] text-red-700" role="alert">
              Telefon numarası girdiğinizde iletişim ve veri işleme onayını işaretlemeniz gerekmektedir.
            </p>
          ) : null}
        </div>

        <div>
          <Button
            type="submit"
            disabled={loading}
            className="h-11 min-w-[140px] rounded-sm bg-slate-900 px-8 text-[15px] font-medium text-white hover:bg-slate-800"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Gönderiliyor…
              </>
            ) : (
              "Gönder"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
