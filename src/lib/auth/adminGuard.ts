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

  const { data: profile, error: profileError } = await adminClient
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError || !profile || profile.role !== "admin") {
    return { ok: false, status: 403, message: "Admin erişimi gerekli." };
  }

  return { ok: true, userId: data.user.id };
}
