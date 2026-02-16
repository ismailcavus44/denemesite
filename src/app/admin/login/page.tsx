"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setErrorMsg("E-posta ve şifre gerekli.");
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      /* Supabase client lock'unu atlamak için doğrudan fetch */
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: key,
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const body = await res.json();

      if (!res.ok) {
        setErrorMsg(body.error_description || body.msg || "Giriş başarısız.");
        return;
      }

      /* Oturumu localStorage'a yaz — Supabase client bunu okuyacak */
      const storageKey = `sb-${new URL(url).hostname.split(".")[0]}-auth-token`;
      localStorage.setItem(storageKey, JSON.stringify(body));

      /* Tam sayfa yenileme ile admin paneline git */
      window.location.href = "/admin/dashboard";
    } catch {
      setErrorMsg("Bağlantı hatası. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-6 rounded-2xl border bg-card p-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Admin Girişi</h1>
        <p className="text-sm text-muted-foreground">
          Yönetim paneline erişmek için giriş yapın.
        </p>
      </div>
      <div className="space-y-3">
        <Input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin();
          }}
        />
        {errorMsg && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {errorMsg}
          </div>
        )}
        <Button
          type="button"
          className="w-full"
          disabled={loading}
          onClick={handleLogin}
        >
          {loading ? "Giriş yapılıyor..." : "Giriş yap"}
        </Button>
      </div>
    </div>
  );
}
