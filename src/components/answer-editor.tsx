"use client";

import { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { blogPosts } from "@/lib/blog-data";
import { Bold, Link2, List, ListOrdered } from "lucide-react";
import { toast } from "sonner";

type AnswerEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
};

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function AnswerEditor({
  value,
  onChange,
  placeholder = "Cevabı buraya yazın",
  className,
  minHeight = "280px",
}: AnswerEditorProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [rehberFilter, setRehberFilter] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        link: {
          openOnClick: false,
          HTMLAttributes: { target: "_self", rel: "" },
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[200px] text-slate-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-0.5",
      },
    },
  });

  useEffect(() => {
    if (!editor || value === undefined) return;
    const current = editor.getHTML();
    if (current === value) return;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [value, editor]);

  const openLinkDialog = useCallback(() => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    if (from === to) {
      toast.info("Önce link vermek istediğiniz kelimeyi veya cümleyi seçin.");
      return;
    }
    setRehberFilter("");
    setLinkDialogOpen(true);
  }, [editor]);

  const insertRehberLink = useCallback(
    (href: string) => {
      if (!editor) return;
      editor.chain().focus().setLink({ href }).run();
      setLinkDialogOpen(false);
    },
    [editor]
  );

  const filteredRehber = rehberFilter.trim()
    ? blogPosts.filter(
        (p) =>
          p.title.toLowerCase().includes(rehberFilter.toLowerCase()) ||
          p.slug.toLowerCase().includes(rehberFilter.toLowerCase())
      )
    : blogPosts;

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-muted" : ""}
          title="Kalın"
        >
          <Bold className="size-4" />
          Kalın
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-muted" : ""}
          title="Madde listesi"
        >
          <List className="size-4" />
          Madde
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-muted" : ""}
          title="Numaralı liste"
        >
          <ListOrdered className="size-4" />
          Numaralı
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={openLinkDialog}
          title="Rehberden link ekle"
        >
          <Link2 className="size-4" />
          Rehberden link ekle
        </Button>
        <span className="text-xs text-muted-foreground">
          Link için metni seçip rehber seçin.
        </span>
      </div>
      <div
        className={cn(
          "rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-within:ring-2 focus-within:ring-ring [&_.tiptap]:outline-none [&_.tiptap_.is-empty::before]:text-muted-foreground [&_.tiptap_.is-empty::before]:content-[attr(data-placeholder)]",
          className
        )}
        style={{ minHeight }}
      >
        <EditorContent editor={editor} />
      </div>

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
                  onClick={() => insertRehberLink(`/rehber/${post.slug}`)}
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
