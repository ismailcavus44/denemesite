"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { blogPosts } from "@/lib/blog-data";
import { Link2 } from "lucide-react";
import { toast } from "sonner";

type AnswerEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
};

export function AnswerEditor({
  value,
  onChange,
  placeholder = "Cevabı buraya yazın",
  className,
  minHeight = "280px",
}: AnswerEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastValueRef = useRef<string>(value);
  const valueFromEditorRef = useRef(false);
  const savedRangeRef = useRef<Range | null>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [rehberFilter, setRehberFilter] = useState("");

  const syncFromProp = useCallback(() => {
    if (!editorRef.current) return;
    if (valueFromEditorRef.current && value === lastValueRef.current) {
      valueFromEditorRef.current = false;
      return;
    }
    if (value === lastValueRef.current) return;
    valueFromEditorRef.current = false;
    let html = value || "";
    if (html && !html.trim().includes("<")) {
      html = html.replace(/\n/g, "<br>");
    }
    editorRef.current.innerHTML = html;
    lastValueRef.current = value;
  }, [value]);

  useEffect(syncFromProp, [syncFromProp, value]);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !editorRef.current) return;
    const range = sel.getRangeAt(0);
    if (!editorRef.current.contains(range.commonAncestorContainer)) return;
    if (range.collapsed) return;
    savedRangeRef.current = range.cloneRange();
  }, []);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    valueFromEditorRef.current = true;
    lastValueRef.current = html;
    onChange(html);
  }, [onChange]);

  const openLinkDialog = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (!editorRef.current?.contains(range.commonAncestorContainer)) return;
    if (range.collapsed) return;
    savedRangeRef.current = range.cloneRange();
    setRehberFilter("");
    setLinkDialogOpen(true);
  }, []);

  const hasSelection = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    const range = sel.getRangeAt(0);
    return !range.collapsed && editorRef.current?.contains(range.commonAncestorContainer);
  }, []);

  const insertLink = useCallback(
    (href: string) => {
      const range = savedRangeRef.current;
      const editor = editorRef.current;
      if (!range || !editor) return;

      try {
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(range);
        }

        const a = document.createElement("a");
        a.href = href;
        try {
          range.surroundContents(a);
        } catch {
          const frag = range.extractContents();
          a.appendChild(frag);
          range.insertNode(a);
        }

        const html = editor.innerHTML;
        valueFromEditorRef.current = true;
        lastValueRef.current = html;
        onChange(html);
      } finally {
        savedRangeRef.current = null;
        setLinkDialogOpen(false);
      }
    },
    [onChange]
  );

  const filteredRehber = rehberFilter.trim()
    ? blogPosts.filter(
        (p) =>
          p.title.toLowerCase().includes(rehberFilter.toLowerCase()) ||
          p.slug.toLowerCase().includes(rehberFilter.toLowerCase())
      )
    : blogPosts;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onMouseDown={(e) => {
            e.preventDefault();
            if (hasSelection()) openLinkDialog();
            else toast.info("Önce link vermek istediğiniz kelimeyi veya cümleyi seçin.");
          }}
          className="gap-1.5"
        >
          <Link2 className="size-4" />
          Rehberden link ekle
        </Button>
        <span className="text-xs text-muted-foreground">
          Metni seçip butona tıklayın, listeden rehber yazısını seçin.
        </span>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        data-placeholder={placeholder}
        className={cn(
          "rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring [&:empty::before]:text-muted-foreground [&:empty::before]:content-[attr(data-placeholder)]",
          className
        )}
        style={{ minHeight }}
      />

      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="max-h-[80vh] flex flex-col sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rehber yazısı seçin</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Yazı ara..."
            value={rehberFilter}
            onChange={(e) => setRehberFilter(e.target.value)}
            className="mb-2"
          />
          <ul className="flex-1 overflow-y-auto rounded-md border p-1 space-y-0.5 max-h-[50vh]">
            {filteredRehber.map((post) => (
              <li key={post.slug}>
                <button
                  type="button"
                  className="w-full text-left rounded px-3 py-2 text-sm hover:bg-muted"
                  onClick={() => insertLink(`/rehber/${post.slug}`)}
                >
                  <span className="font-medium">{post.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    /rehber/{post.slug}
                  </span>
                </button>
              </li>
            ))}
            {filteredRehber.length === 0 && (
              <li className="px-3 py-4 text-sm text-muted-foreground">
                Eşleşen yazı yok.
              </li>
            )}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
