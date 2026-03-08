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
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-800" />
          <p className="text-sm font-medium text-slate-500">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
        <div className="w-full max-w-[380px] px-4 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v.01M12 9v3m0 0a9 9 0 110 0 9 9 0 010 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-slate-900">Erişim Engellendi</h1>
          <p className="mt-2 text-sm text-slate-500">
            Admin yetkisi bulunamadı veya oturum süresi dolmuş.
          </p>
          <a
            href="/admin/login"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-slate-800 px-8 text-sm font-medium text-white transition-colors hover:bg-slate-900"
          >
            Giriş Yap
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
