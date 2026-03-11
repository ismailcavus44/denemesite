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
import { Textarea } from "@/components/ui/textarea";
import { blogPosts } from "@/lib/blog-data";
import { CtaBlock } from "@/lib/tiptap/cta-block";
import { InfoBox } from "@/lib/tiptap/info-box";
import {
  Bold,
  Heading2,
  Heading3,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Megaphone,
  Info,
} from "lucide-react";
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
  const [customUrl, setCustomUrl] = useState("");
  const [linkNofollow, setLinkNofollow] = useState(false);
  const [linkNewTab, setLinkNewTab] = useState(false);
  const [ctaDialogOpen, setCtaDialogOpen] = useState(false);
  const [ctaType, setCtaType] = useState<"contact" | "internal">("contact");
  const [ctaTitle, setCtaTitle] = useState("Hukuki süreciniz için yardıma mı ihtiyacınız var?");
  const [ctaButtonText, setCtaButtonText] = useState("Bizimle İletişime Geçin");
  const [ctaHref, setCtaHref] = useState("/iletisim");
  const [infoBoxDialogOpen, setInfoBoxDialogOpen] = useState(false);
  const [infoBoxContent, setInfoBoxContent] = useState("");

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
      CtaBlock,
      InfoBox,
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "focus:outline-none min-h-[260px] text-slate-700 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2 [&_h2:hover]:relative [&_h2:hover::after]:content-['_H2'] [&_h2:hover::after]:ml-1.5 [&_h2:hover::after]:text-[10px] [&_h2:hover::after]:font-mono [&_h2:hover::after]:opacity-50 [&_h2:hover::after]:text-slate-500 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3:hover]:relative [&_h3:hover::after]:content-['_H3'] [&_h3:hover::after]:ml-1.5 [&_h3:hover::after]:text-[10px] [&_h3:hover::after]:font-mono [&_h3:hover::after]:opacity-50 [&_h3:hover::after]:text-slate-500 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-0.5 [&_a]:text-red-600 [&_a]:underline [&_a]:decoration-red-600 [&_[data-type=cta-block]]:my-4 [&_[data-type=cta-block]_a]:text-white [&_[data-type=cta-block]_a]:no-underline [&_[data-type=cta-block]_a]:hover:text-white [&_[data-type=info-box]]:my-4",
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
    setCustomUrl("");
    setLinkNofollow(false);
    setLinkNewTab(false);
    setLinkDialogOpen(true);
  }, [editor]);

  const applyLink = useCallback(
    (href: string) => {
      if (!editor) return;
      const relParts: string[] = [];
      if (linkNewTab) relParts.push("noopener", "noreferrer");
      if (linkNofollow) relParts.push("nofollow");
      editor.chain().focus().setLink({
        href,
        target: linkNewTab ? "_blank" : "_self",
        rel: relParts.length ? relParts.join(" ") : undefined,
      }).run();
      setLinkDialogOpen(false);
    },
    [editor, linkNofollow, linkNewTab]
  );

  const insertRehberLink = useCallback(
    (href: string) => {
      applyLink(href);
    },
    [applyLink]
  );

  const insertCustomLink = useCallback(() => {
    const url = customUrl.trim();
    if (!url) {
      toast.error("URL girin veya rehberden seçin.");
      return;
    }
    applyLink(url.startsWith("/") || url.startsWith("http") ? url : `https://${url}`);
  }, [customUrl, applyLink]);

  const openCtaDialog = useCallback(() => {
    setCtaType("contact");
    setCtaTitle("Hukuki süreciniz için yardıma mı ihtiyacınız var?");
    setCtaButtonText("Bizimle İletişime Geçin");
    setCtaHref("/iletisim");
    setCtaDialogOpen(true);
  }, []);

  const insertCta = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertContent({
      type: "ctaBlock",
      attrs: {
        ctaType,
        title: ctaTitle.trim() || (ctaType === "contact" ? "Hukuki süreciniz için yardıma mı ihtiyacınız var?" : "Diğer rehberimizi inceleyebilirsiniz:"),
        buttonText: ctaButtonText.trim() || (ctaType === "contact" ? "Bizimle İletişime Geçin" : "Rehbere Git"),
        href: ctaHref.trim() || "/iletisim",
      },
    }).run();
    setCtaDialogOpen(false);
  }, [editor, ctaType, ctaTitle, ctaButtonText, ctaHref]);

  const openInfoBoxDialog = useCallback(() => {
    setInfoBoxContent("");
    setInfoBoxDialogOpen(true);
  }, []);

  const insertInfoBox = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertContent({
      type: "infoBox",
      attrs: {
        content: infoBoxContent.trim() || "Önemli bilgi veya uyarı metnini buraya yazın.",
      },
    }).run();
    setInfoBoxDialogOpen(false);
  }, [editor, infoBoxContent]);

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
      <div className="shrink-0 flex flex-wrap items-center gap-2 border-b border-input bg-muted/40 px-2 py-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground ring-2 ring-primary/40 ring-offset-2 ring-offset-background" : ""}
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
          className={editor.isActive("heading", { level: 3 }) ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground ring-2 ring-primary/40 ring-offset-2 ring-offset-background" : ""}
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={openCtaDialog}
          title="CTA bloğu ekle"
        >
          <Megaphone className="size-4" />
          CTA
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onMouseDown={(e) => e.preventDefault()}
          onClick={openInfoBoxDialog}
          title="Bilgi kutusu ekle"
        >
          <Info className="size-4" />
          Bilgi
        </Button>
      </div>
      <div
        className="flex-1 min-h-0 overflow-y-auto px-3 py-2 text-sm outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-inset [&_.tiptap]:outline-none [&_.tiptap_.is-empty::before]:text-muted-foreground [&_.tiptap_.is-empty::before]:content-[attr(data-placeholder)]"
        style={{ minHeight }}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="max-h-[85vh] flex flex-col sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Link ekle</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600">Özel URL (boş bırakırsanız rehberden seçin)</label>
              <Input
                placeholder="/rehber/slug veya https://..."
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="mt-1"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={linkNofollow}
                onChange={(e) => setLinkNofollow(e.target.checked)}
                className="rounded border-input"
              />
              <span className="text-sm">Nofollow olarak işaretle (SEO)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={linkNewTab}
                onChange={(e) => setLinkNewTab(e.target.checked)}
                className="rounded border-input"
              />
              <span className="text-sm">Yeni sekmede aç</span>
            </label>
          </div>
          {customUrl.trim() ? (
            <Button onClick={insertCustomLink} className="w-full">
              Linki uygula
            </Button>
          ) : (
            <>
              <Input
                placeholder="Rehber ara..."
                value={rehberFilter}
                onChange={(e) => setRehberFilter(e.target.value)}
                className="mt-1"
              />
              <ul className="flex-1 overflow-y-auto rounded-md border p-1 space-y-0.5 max-h-[40vh]">
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
                  <li className="px-3 py-4 text-sm text-muted-foreground">Eşleşen yazı yok.</li>
                )}
              </ul>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* CTA Dialog */}
      <Dialog open={ctaDialogOpen} onOpenChange={setCtaDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>CTA bloğu ekle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600">Tip</label>
              <div className="mt-2 flex gap-2">
                <Button
                  type="button"
                  variant={ctaType === "contact" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setCtaType("contact");
                    setCtaTitle("Hukuki süreciniz için yardıma mı ihtiyacınız var?");
                    setCtaButtonText("Bizimle İletişime Geçin");
                    setCtaHref("/iletisim");
                  }}
                >
                  İletişim CTA
                </Button>
                <Button
                  type="button"
                  variant={ctaType === "internal" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setCtaType("internal");
                    setCtaTitle("Diğer rehberimizi inceleyebilirsiniz:");
                    setCtaButtonText("Rehbere Git");
                    setCtaHref("/rehber");
                  }}
                >
                  İç Link CTA
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Başlık metni</label>
              <Input
                value={ctaTitle}
                onChange={(e) => setCtaTitle(e.target.value)}
                placeholder="CTA başlığı"
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Buton metni</label>
              <Input
                value={ctaButtonText}
                onChange={(e) => setCtaButtonText(e.target.value)}
                placeholder="Buton yazısı"
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">Link (URL)</label>
              <Input
                value={ctaHref}
                onChange={(e) => setCtaHref(e.target.value)}
                placeholder="/iletisim veya /kategori/rehber/slug"
                className="mt-1"
              />
            </div>
            <Button onClick={insertCta} className="w-full">
              CTA ekle
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Info Box Dialog */}
      <Dialog open={infoBoxDialogOpen} onOpenChange={setInfoBoxDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bilgi kutusu ekle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600">İçerik (önemli uyarı veya pratik bilgi)</label>
              <Textarea
                value={infoBoxContent}
                onChange={(e) => setInfoBoxContent(e.target.value)}
                placeholder="Önemli hukuki uyarı veya pratik bilgi metnini buraya yazın."
                className="mt-1 min-h-[100px]"
              />
            </div>
            <Button onClick={insertInfoBox} className="w-full">
              Bilgi kutusu ekle
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
