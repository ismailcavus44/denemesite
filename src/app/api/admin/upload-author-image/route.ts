import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/auth/adminGuard";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";

const BUCKET = "author-images";

export async function POST(request: Request) {
  const admin = await requireAdminFromRequest(request);
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file") as File | null;
  if (!file || !file.size) {
    return NextResponse.json({ message: "Dosya gerekli." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  const { error: bucketError } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  });
  if (bucketError && !String(bucketError.message).toLowerCase().includes("already exists")) {
    return NextResponse.json(
      { message: bucketError.message ?? "Bucket oluşturulamadı." },
      { status: 500 }
    );
  }

  const ext = file.name.replace(/^.*\./, "") || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const buf = await file.arrayBuffer();
  const { error } = await supabase.storage.from(BUCKET).upload(path, buf, {
    contentType: file.type || "image/jpeg",
    upsert: true,
  });

  if (error) {
    return NextResponse.json(
      { message: error.message ?? "Yükleme başarısız." },
      { status: 500 }
    );
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: urlData.publicUrl });
}
