import { createSupabaseAdminClient } from "@/lib/supabase/adminClient";

type AdminCheck =
  | { ok: true; userId: string }
  | { ok: false; status: number; message: string };

export async function requireAdminFromRequest(
  request: Request
): Promise<AdminCheck> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { ok: false, status: 401, message: "Yetkisiz istek." };
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    return { ok: false, status: 401, message: "Yetkisiz istek." };
  }

  const adminClient = createSupabaseAdminClient();
  const { data, error } = await adminClient.auth.getUser(token);

  if (error || !data.user) {
    return { ok: false, status: 401, message: "Geçersiz oturum." };
  }

  // Kullanıcının gerçekten admin olup olmadığını RLS üzerinden kontrol et
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const res = await fetch(
      `${url}/rest/v1/profiles?id=eq.${data.user.id}&select=role`,
      {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      return { ok: false, status: 403, message: "Admin yetkisi yok." };
    }

    const rows = (await res.json()) as Array<{ role?: string }>;
    const role = rows[0]?.role;
    if (role !== "admin") {
      return { ok: false, status: 403, message: "Admin yetkisi yok." };
    }
  } catch {
    return { ok: false, status: 403, message: "Admin yetkisi yok." };
  }

  return { ok: true, userId: data.user.id };
}
