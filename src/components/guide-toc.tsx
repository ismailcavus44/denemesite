"use client";

import { useState, useEffect } from "react";
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
  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    setOpen(isDesktop);
  }, []);

  return (
    <nav className="inline-block min-w-[220px] min-h-[48px] rounded-[4px] border bg-background px-3 py-2 text-[14px] text-foreground">
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
            type TocNode = { item: GuideTocItem; h2Idx: number; children: { item: GuideTocItem; h3Idx: number }[] };
            const tree: TocNode[] = [];
            let h2Idx = 0;

            for (const item of items) {
              if (item.level === "h3" && tree.length > 0) {
                const parent = tree[tree.length - 1];
                parent.children.push({ item, h3Idx: parent.children.length + 1 });
              } else {
                h2Idx += 1;
                tree.push({ item, h2Idx, children: [] });
              }
            }

            return tree.map((node) => (
              <li key={node.item.id}>
                <a
                  href={`#${node.item.id}`}
                  className="cursor-pointer text-[14px] underline-offset-4 hover:underline"
                >
                  <span className="mr-1 font-semibold">{node.h2Idx}</span>
                  {node.item.label}
                </a>
                {node.children.length > 0 && (
                  <ul className="mt-1 space-y-1 pl-4">
                    {node.children.map((child) => (
                      <li key={child.item.id}>
                        <a
                          href={`#${child.item.id}`}
                          className="cursor-pointer text-[14px] text-foreground underline-offset-4 hover:underline"
                        >
                          <span className="mr-1 font-semibold">{node.h2Idx}.{child.h3Idx}</span>
                          {child.item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ));
          })()}
        </ul>
      )}
    </nav>
  );
}

