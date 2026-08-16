"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import {
  AI_SUMMARIZE_PROVIDERS,
  buildArticleSummarizePrompt,
} from "@/lib/ai-summarize";

function IconChatGPT() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="#10a37f" aria-hidden>
      <path d="M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A6.07 6.07 0 0 0 4.98 4.18a5.98 5.98 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 5.97 5.97 0 0 0 .52 4.91 6.05 6.05 0 0 0 6.51 2.9 6.06 6.06 0 0 0 10.27-2.17 5.98 5.98 0 0 0 4-2.9 6.06 6.06 0 0 0-.74-7.1z" />
    </svg>
  );
}

function IconClaude() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="#d97706" aria-hidden>
      <path d="M17.3 1.5h-3.6L12 4.8 10.3 1.5H6.7L12 12l5.3-10.5zM6.7 22.5h3.6L12 19.2l1.7 3.3h3.6L12 12 6.7 22.5z" />
    </svg>
  );
}

function IconPerplexity() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="#20b8c9" aria-hidden>
      <path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

function IconGrok() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="#111" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const ICONS: Record<string, () => ReactNode> = {
  chatgpt: IconChatGPT,
  claude: IconClaude,
  perplexity: IconPerplexity,
  grok: IconGrok,
};

function IconExternal() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5 shrink-0 text-slate-400" fill="currentColor" aria-hidden>
      <path d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14V3zM5 5h4v2H7v10h10v-2h2v4H5V5z" />
    </svg>
  );
}

type AiSummarizeMenuProps = {
  title: string;
  url: string;
};

export function AiSummarizeMenu({ title, url }: AiSummarizeMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const prompt = buildArticleSummarizePrompt(title, url);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 transition-colors hover:border-primary hover:text-primary"
      >
        <Sparkles className="size-3.5 text-primary" aria-hidden />
        Yapay Zeka ile Özetle
        <span className="rounded-[4px] bg-primary px-1 py-px text-[10px] font-semibold leading-none text-white">
          AI
        </span>
        <ChevronDown
          className={`size-3.5 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute left-0 z-20 mt-2 w-[min(100vw-2rem,20rem)] rounded-md border border-slate-200 bg-white p-3 shadow-md"
        >
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Özeti nerede açalım?
          </p>
          <ul className="space-y-0.5">
            {AI_SUMMARIZE_PROVIDERS.map((provider) => {
              const Icon = ICONS[provider.id];
              return (
                <li key={provider.id}>
                  <a
                    href={provider.href(prompt)}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    role="menuitem"
                    className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-slate-800 no-underline hover:bg-slate-50"
                    onClick={() => setOpen(false)}
                  >
                    {Icon ? <Icon /> : null}
                    <span className="flex-1">{provider.name}</span>
                    <IconExternal />
                  </a>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 border-t border-slate-100 pt-2.5 text-[11px] leading-relaxed text-slate-500">
            Özet, seçtiğiniz yapay zeka aracında yeni sekmede oluşturulur. Yapay zeka özetleri hatalı
            veya eksik olabilir; hukuki danışmanlık yerine geçmez.
          </p>
        </div>
      ) : null}
    </div>
  );
}
