/** ISO 8601 datetime (+03:00); "YYYY-MM-DD" girdilerine öğlen saati ekler. */
export function toISO8601WithTimezone(dateStr: string): string {
  const trimmed = dateStr.trim();
  if (!trimmed) return trimmed;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return `${trimmed}T12:00:00+03:00`;
  }
  return trimmed;
}

/** "15 Mart 2025" — tr-TR uzun ay adı. */
export function formatTurkishLongDate(iso: string | null | undefined): string | null {
  if (!iso?.trim()) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
