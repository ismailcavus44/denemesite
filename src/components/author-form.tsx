"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Author } from "@/types/author";
import { toast } from "sonner";
import { ArrowLeft, Loader2, ImageIcon } from "lucide-react";

function getAccessToken(): string | null {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const projectRef = new URL(url).hostname.split(".")[0];
    const raw = localStorage.getItem(`sb-${projectRef}-auth-token`);
    if (!raw) return null;
    return JSON.parse(raw).access_token ?? null;
  } catch {
    return null;
  }
}

function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

type AuthorFormProps = {
  initialData?: Author | null;
  onSuccess?: () => void;
};

export function AuthorForm({ initialData, onSuccess }: AuthorFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [bio, setBio] = useState(initialData?.bio ?? "");
  const [photoUrl, setPhotoUrl] = useState(initialData?.photo_url ?? null);
  const [linkedinUrl, setLinkedinUrl] = useState(initialData?.linkedin_url ?? "");
  const [instagramUrl, setInstagramUrl] = useState(initialData?.instagram_url ?? "");
  const [whatsappUrl, setWhatsappUrl] = useState(initialData?.whatsapp_url ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const isEdit = !!initialData?.id;

  const generateSlug = useCallback(() => {
    setSlug(slugFromName(name) || slug);
  }, [name, slug]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith("image/")) {
        toast.error("Lütfen bir görsel dosyası seçin.");
        return;
      }
      const token = getAccessToken();
      if (!token) {
        toast.error("Oturum bulunamadı.");
        return;
      }
      setUploading(true);
      try {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/admin/upload-author-image", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          toast.error(data.message ?? "Yükleme başarısız.");
          return;
        }
        if (typeof data.url === "string") {
          setPhotoUrl(data.url);
          toast.success("Fotoğraf yüklendi.");
        }
      } catch {
        toast.error("Yükleme başarısız.");
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    },
    []
  );

  const save = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      toast.error("Oturum bulunamadı.");
      return;
    }
    const finalSlug = slug.trim().toLowerCase().replace(/\s+/g, "-") || slugFromName(name);
    if (!finalSlug) {
      toast.error("Slug girin veya isimden oluşturun.");
      return;
    }
    if (!name.trim()) {
      toast.error("İsim gerekli.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        slug: finalSlug,
        bio: bio.trim() || null,
        photo_url: photoUrl,
        linkedin_url: linkedinUrl.trim() || null,
        instagram_url: instagramUrl.trim() || null,
        whatsapp_url: whatsappUrl.trim() || null,
      };

      if (isEdit) {
        const res = await fetch(`/api/admin/authors/${initialData!.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          toast.error(data.message ?? "Güncellenemedi.");
          return;
        }
        toast.success("Yazar güncellendi.");
        onSuccess?.();
      } else {
        const res = await fetch("/api/admin/authors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          toast.error(data.message ?? "Kaydedilemedi.");
          return;
        }
        toast.success("Yazar eklendi.");
        if (data.id) {
          window.location.href = `/admin/authors/${data.id}/edit`;
          return;
        }
        onSuccess?.();
      }
    } catch {
      toast.error("Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  }, [isEdit, initialData, name, slug, bio, photoUrl, linkedinUrl, instagramUrl, whatsappUrl, onSuccess]);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/authors" aria-label="Yazarlara dön">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">
          {isEdit ? "Yazarı Düzenle" : "Yeni Yazar"}
        </h1>
      </div>

      <div className="grid max-w-xl gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">İsim</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ad Soyad"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Slug</label>
            <Button type="button" variant="outline" size="sm" onClick={generateSlug}>
              İsimden oluştur
            </Button>
          </div>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="yazar-slug"
          />
          <p className="text-xs text-muted-foreground">URL: /yazar/{slug || "[slug]"}</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Biyografi</label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Kısa biyografi"
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Sosyal medya</label>
          <Input
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="LinkedIn URL"
          />
          <Input
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            placeholder="Instagram URL"
          />
          <Input
            value={whatsappUrl}
            onChange={(e) => setWhatsappUrl(e.target.value)}
            placeholder="WhatsApp (wa.me/90...)"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Fotoğraf</label>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="max-w-xs"
              />
              {uploading && (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              )}
            </div>
            {photoUrl ? (
              <div className="space-y-2">
                <div className="relative h-32 w-32 overflow-hidden rounded-full border bg-muted">
                  <Image
                    src={photoUrl}
                    alt={name || "Yazar"}
                    fill
                    className="object-cover"
                    unoptimized={photoUrl.startsWith(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPhotoUrl(null)}
                >
                  Fotoğrafı kaldır
                </Button>
              </div>
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-dashed bg-muted/50 text-muted-foreground">
                <ImageIcon className="size-8" />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : null}
            {isEdit ? "Güncelle" : "Kaydet"}
          </Button>
        </div>
      </div>
    </div>
  );
}
