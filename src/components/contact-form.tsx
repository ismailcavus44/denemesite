"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Mail, Send, User, Phone, MessageSquare } from "lucide-react";
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
    <label
      htmlFor={htmlFor}
      className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-slate-500"
    >
      {children}
      {req ? <span className="font-normal normal-case tracking-normal text-red-500">*</span> : null}
    </label>
  );
}

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

  const fieldClass =
    "h-11 rounded-xl border-slate-200/90 bg-slate-50/80 px-3.5 text-slate-900 shadow-none transition-colors placeholder:text-slate-400 focus-visible:border-[#1d293d]/30 focus-visible:bg-white focus-visible:ring-[#1d293d]/15";

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-xl mx-auto overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_20px_50px_-24px_rgba(15,23,42,0.25)] ring-1 ring-slate-900/[0.04]"
    >
      <div className="flex flex-col gap-6 p-6 sm:p-8">
        <header className="flex gap-4">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#1d293d]/[0.08] text-[#1d293d]"
            aria-hidden
          >
            <Mail className="size-6" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 space-y-1 pt-0.5">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-[1.35rem]">
              Bize yazın
            </h2>
            <p className="text-sm leading-relaxed text-slate-500">
              Mesajınızı iletin; ekibimiz en kısa sürede size dönüş yapacaktır.
            </p>
          </div>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel htmlFor="contact-fullName" required>
              <User className="size-3.5 text-slate-400" aria-hidden />
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
          <div className="space-y-2">
            <FieldLabel htmlFor="contact-phone" required>
              <Phone className="size-3.5 text-slate-400" aria-hidden />
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

        <div className="space-y-2">
          <FieldLabel htmlFor="contact-message" required>
            <MessageSquare className="size-3.5 text-slate-400" aria-hidden />
            Mesajınız
          </FieldLabel>
          <Textarea
            id="contact-message"
            name="message"
            required
            minLength={10}
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Konuyu kısaca özetleyebilir, talebinizi veya geri bildiriminizi yazabilirsiniz…"
            className={cn(
              fieldClass,
              "min-h-[140px] resize-y py-3 leading-relaxed"
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-xl bg-[#1d293d] text-[15px] font-medium text-white shadow-sm transition hover:bg-[#1d293d]/90"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Gönderiliyor…
            </>
          ) : (
            <>
              <Send className="mr-2 size-4 opacity-90" />
              Gönder
            </>
          )}
        </Button>

        {(showLegalError || showWhatsappError) ? (
          <div className="space-y-3">
            {showLegalError ? (
              <p
                className="rounded-xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-800"
                role="alert"
              >
                Mesaj göndermek için KVKK Aydınlatma Metni ve Sorumluluk Reddi metnini kabul etmeniz gerekmektedir.
              </p>
            ) : null}
            {showWhatsappError ? (
              <p
                className="rounded-xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-800"
                role="alert"
              >
                Telefon numarası girdiğinizde iletişim ve veri işleme onayını işaretlemeniz gerekmektedir.
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="space-y-3">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug">
            <input
              type="checkbox"
              checked={acceptedLegal}
              onChange={(e) => {
                setAcceptedLegal(e.target.checked);
                if (e.target.checked) setShowLegalError(false);
              }}
              className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-slate-300 text-[#1d293d] focus:ring-[#1d293d]/20"
              aria-required
            />
            <span className="text-slate-600">
              <Link
                href="/kvkk"
                className="font-medium text-[#1d293d] underline decoration-[#1d293d]/30 underline-offset-2 hover:decoration-[#1d293d]"
              >
                KVKK Aydınlatma Metni
              </Link>
              &apos;ni okudum.{" "}
              <Link
                href="/sorumluluk-reddi"
                className="font-medium text-[#1d293d] underline decoration-[#1d293d]/30 underline-offset-2 hover:decoration-[#1d293d]"
              >
                Sorumluluk Reddi ve Kullanım Şartları
              </Link>
              &apos;nı kabul ediyorum.{" "}
              <span className="text-red-500">*</span>
            </span>
          </label>

          {showWhatsappCheckbox ? (
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug">
              <input
                type="checkbox"
                checked={acceptedWhatsapp}
                onChange={(e) => {
                  setAcceptedWhatsapp(e.target.checked);
                  if (e.target.checked) setShowWhatsappError(false);
                }}
                className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-slate-300 text-[#1d293d] focus:ring-[#1d293d]/20"
                aria-required={hasPhone}
              />
              <span className="text-slate-600">
                Formda belirttiğim numaram üzerinden benimle iletişime geçilmesini ve verilerimin{" "}
                <Link
                  href="/kvkk"
                  className="font-medium text-[#1d293d] underline decoration-[#1d293d]/30 underline-offset-2 hover:decoration-[#1d293d]"
                >
                  Aydınlatma Metni
                </Link>
                &apos;ne uygun olarak işlenmesini kabul ediyorum.{" "}
                <span className="text-red-500">*</span>
              </span>
            </label>
          ) : null}
        </div>
      </div>
    </form>
  );
}
