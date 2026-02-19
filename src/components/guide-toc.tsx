 "use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
type GuideTocItem = {
  id: string;
  label: string;
  level?: "h2" | "h3";
};

type GuideTocProps = {
  items?: GuideTocItem[];
};

export function GuideToc({ items }: GuideTocProps) {
  if (!items || items.length === 0) return null;

  const [open, setOpen] = useState(true);

  return (
    <nav className="inline-block min-w-[220px] rounded-[4px] border bg-background px-3 py-2 text-[14px] text-foreground">
      <div className="mb-1 flex items-center gap-2">
        <h2 className="text-[16px] font-semibold tracking-wide">
          İçindekiler
        </h2>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto inline-flex h-5 w-5 items-center justify-center text-muted-foreground hover:text-foreground"
          aria-label={open ? "İçindekileri gizle" : "İçindekileri göster"}
        >
          {open ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </button>
      </div>

      {open && (
        <ul className="space-y-1">
          {(() => {
            let h2Index = 0;
            let h3Index = 0;

            return items.map((item) => {
              if (item.level === "h3") {
                if (h2Index === 0) h2Index = 1;
                h3Index += 1;
              } else {
                h2Index += 1;
                h3Index = 0;
              }

              const numberPrefix =
                item.level === "h3" ? `${h2Index}.${h3Index}` : `${h2Index}`;

              return (
                <li
                  key={item.id}
                  className={item.level === "h3" ? "pl-4" : undefined}
                >
                  <a
                    href={`#${item.id}`}
                    className="cursor-pointer text-[14px] underline-offset-4 hover:underline"
                  >
                    <span className="mr-1">{numberPrefix}</span>
                    {item.label}
                  </a>
                </li>
              );
            });
          })()}
        </ul>
      )}
    </nav>
  );
}

