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
import { Bold, Heading2, Heading3, Link2, Link2Off, List, ListOrdered } from "lucide-react";
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
          "focus:outline-none min-h-[260px] text-slate-700 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2 [&_h2:hover]:relative [&_h2:hover::after]:content-['_H2'] [&_h2:hover::after]:ml-1.5 [&_h2:hover::after]:text-[10px] [&_h2:hover::after]:font-mono [&_h2:hover::after]:opacity-50 [&_h2:hover::after]:text-slate-500 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3:hover]:relative [&_h3:hover::after]:content-['_H3'] [&_h3:hover::after]:ml-1.5 [&_h3:hover::after]:text-[10px] [&_h3:hover::after]:font-mono [&_h3:hover::after]:opacity-50 [&_h3:hover::after]:text-slate-500 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-0.5 [&_a]:text-red-600 [&_a]:underline [&_a]:decoration-red-600",
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
    <div className={cn("flex h-full min-h-0 flex-col rounded-md border border-input bg-background overflow-hidden", className)}>
      {/* Toolbar her zaman görünür */}
      <div className="shrink-0 flex flex-wrap items-center gap-2 border-b border-input bg-muted/40 px-2 py-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground ring-2 ring-primary/40 ring-offset-2 ring-offset-background" : ""}
          title="Başlık 2 (imleç bu başlıkta)"
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
          className={editor.isActive("heading", { level: 3 }) ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground ring-2 ring-primary/40 ring-offset-2 ring-offset-background" : ""}
          title="Başlık 3 (imleç bu başlıkta)"
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
          className={editor.isActive("bold") ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground" : ""}
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
          className={editor.isActive("bulletList") ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground" : ""}
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
          className={editor.isActive("orderedList") ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground" : ""}
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
          className={editor.isActive("link") ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground" : ""}
        >
          <Link2 className="size-4" />
          Link
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
          title="Linki kaldır"
        >
          <Link2Off className="size-4" />
          Link kaldır
        </Button>
      </div>
      {/* Sadece içerik alanı scroll olur */}
      <div
        className="flex-1 min-h-0 overflow-y-auto px-3 py-2 text-sm outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-inset [&_.tiptap]:outline-none [&_.tiptap_.is-empty::before]:text-muted-foreground [&_.tiptap_.is-empty::before]:content-[attr(data-placeholder)]"
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
