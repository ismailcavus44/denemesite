import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Kullanıcı girişini E.164 formatına çevirir (Türkiye: +90). Boş veya geçersiz girişte null döner. */
export function formatPhoneNumber(input: string | null | undefined): string | null {
  if (input == null || typeof input !== "string") return null
  let s = input.trim()
  if (!s) return null
  s = s.replace(/[\s\-\.\(\)]/g, "")
  s = s.replace(/[^\d+]/g, "")
  if (s.startsWith("+")) {
    s = s.slice(1).replace(/\D/g, "")
  } else {
    s = s.replace(/\D/g, "")
  }
  if (s.startsWith("0")) s = s.slice(1)
  if (!s.startsWith("90")) s = "90" + s
  if (s.length < 12) return null
  return "+" + s
}
