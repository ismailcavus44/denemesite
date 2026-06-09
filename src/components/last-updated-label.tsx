import { formatTurkishLongDate } from "@/lib/format-date";

type LastUpdatedLabelProps = {
  date: string | null | undefined;
  className?: string;
};

export function LastUpdatedLabel({ date, className }: LastUpdatedLabelProps) {
  const formatted = formatTurkishLongDate(date);
  if (!formatted) return null;

  return (
    <p className={className ?? "text-xs text-slate-500"}>
      Son güncelleme: {formatted}
    </p>
  );
}
