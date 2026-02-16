"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  originalText: string;
};

export function OriginalQuestionCollapsible({ originalText }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-xl border bg-muted/30">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium"
      >
        <span>Sorunun devamı</span>
        {open ? (
          <EyeOff className="size-4 shrink-0 text-muted-foreground" />
        ) : (
          <Eye className="size-4 shrink-0 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="border-t px-4 py-3">
          <p className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">
            {originalText}
          </p>
        </div>
      )}
    </div>
  );
}
