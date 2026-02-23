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
import { Bold, Heading2, Heading3, Link2, List, ListOrdered } from "lucide-react";
import { toast } from "sonner";

type ArticleEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
};

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function ArticleEditor({
  value,
  onChange,
  placeholder = "İçeriği buraya yazın",
  className,
  minHeight = "320px",
}: ArticleEditorProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [rehberFilter, setRehberFilter] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
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
        class:
          "focus:outline-none min-h-[260px] text-slate-700 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-0.5",
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
      toast.info("Önce link vermek istediğiniz metni seçin.");
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
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
          title="Başlık 2"
        >
          <Heading2 className="size-4" />
          H2
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""}
          title="Başlık 3"
        >
          <Heading3 className="size-4" />
          H3
        </Button>
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
          title="Link ekle"
        >
          <Link2 className="size-4" />
          Link
        </Button>
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
            <DialogTitle>Rehber linki seçin</DialogTitle>
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
                  onClick={() => insertRehberLink(`/${post.categorySlug}/rehber/${post.slug}`)}
                >
                  <span className="font-medium">{post.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    /{post.categorySlug}/rehber/{post.slug}
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
