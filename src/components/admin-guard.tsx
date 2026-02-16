"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type AdminGuardProps = {
  children: React.ReactNode;
};

function getSessionFromStorage(): { accessToken: string; userId: string } | null {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const projectRef = new URL(url).hostname.split(".")[0];
    const storageKey = `sb-${projectRef}-auth-token`;
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;

    const session = JSON.parse(raw);
    const accessToken: string = session.access_token;
    if (!accessToken) return null;

    const payloadB64 = accessToken.split(".")[1];
    const payload = JSON.parse(atob(payloadB64));
    const userId: string = payload.sub;
    if (!userId) return null;

    return { accessToken, userId };
  } catch {
    return null;
  }
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [status, setStatus] = useState<"loading" | "ok" | "denied">("loading");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin/login")) {
      setStatus("ok");
      return;
    }

    const check = async () => {
      const session = getSessionFromStorage();
      if (!session) {
        setStatus("denied");
        return;
      }

      try {
        /* Supabase client KULLANMIYORUZ — doğrudan fetch */
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

        const res = await fetch(
          `${url}/rest/v1/profiles?id=eq.${session.userId}&select=role`,
          {
            headers: {
              apikey: key,
              Authorization: `Bearer ${session.accessToken}`,
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) {
          setStatus("denied");
          return;
        }

        const rows = await res.json();
        if (rows.length > 0 && rows[0].role === "admin") {
          setStatus("ok");
        } else {
          setStatus("denied");
        }
      } catch {
        setStatus("denied");
      }
    };

    check();
  }, [pathname]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 text-sm text-muted-foreground">
        Admin paneli yükleniyor...
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-3">
        <p className="text-sm text-muted-foreground">
          Admin yetkisi bulunamadı veya oturum süresi dolmuş.
        </p>
        <a
          href="/admin/login"
          className="inline-block rounded-md bg-foreground px-4 py-2 text-sm text-background"
        >
          Giriş yap
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
