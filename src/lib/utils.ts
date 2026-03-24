import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Kullanıcı girişini E.164 formatına çevirir (Türkiye: +90).
 * Örnek kabul edilen yazımlar: 5053989981, 05053989981, 0505 398 99 81, 505 398 99 81, +905053989981
 * Boş veya geçersiz girişte null döner.
 */
export function formatPhoneNumber(input: string | null | undefined): string | null {
  if (input == null || typeof input !== "string") return null

  let raw = input.trim().replace(/\u00a0/g, " ")
  if (!raw) return null

  raw = raw.replace(/[\s\-\.\(\)]/g, "")

  let digits: string
  if (raw.startsWith("+")) {
    digits = raw.slice(1).replace(/\D/g, "")
  } else {
    digits = raw.replace(/\D/g, "")
  }

  if (!digits) return null

  while (digits.startsWith("0") && digits.length > 1) {
    digits = digits.slice(1)
  }

  if (digits.startsWith("90")) {
    if (digits.length === 12) return `+${digits}`
    return null
  }

  if (digits.length === 10) {
    return `+90${digits}`
  }

  return null
}

/**
 * Telefon alanında gösterim: yerel 05xx xxx xx xx veya +90 5xx xxx xx xx (rakamlar arası boşluk).
 */
export function formatPhoneInputDisplay(raw: string): string {
  const t = raw.trimStart()
  if (!t) return ""

  if (t.startsWith("+")) {
    const d = t.slice(1).replace(/\D/g, "")
    if (!d) return "+"
    if (d.startsWith("90")) {
      const n = d.slice(2, 12)
      const inner = formatTenDigitSpacing(n)
      return inner.length ? `+90 ${inner}` : "+90"
    }
    return `+${d}`.slice(0, 16)
  }

  const d = t.replace(/\D/g, "").slice(0, 11)
  if (!d) return ""

  if (d.startsWith("0")) {
    if (d.length <= 4) return d
    let out = `${d.slice(0, 4)} ${d.slice(4, 7)}`
    if (d.length > 7) out += ` ${d.slice(7, 9)}`
    if (d.length > 9) out += ` ${d.slice(9, 11)}`
    return out.trimEnd()
  }

  return formatTenDigitSpacing(d.slice(0, 10))
}

function formatTenDigitSpacing(d: string): string {
  if (d.length <= 3) return d
  let out = `${d.slice(0, 3)} ${d.slice(3, 6)}`
  if (d.length > 6) out += ` ${d.slice(6, 8)}`
  if (d.length > 8) out += ` ${d.slice(8, 10)}`
  return out.trimEnd()
}
