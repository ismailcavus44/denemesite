"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SearchBarProps = {
  placeholder?: string;
  size?: "sm" | "md";
  initialQuery?: string;
  /** Arama yapılacak sayfa (örn. "/rehber"). Yoksa "/sorular" kullanılır. */
  searchPath?: string;
};

export function SearchBar({
  placeholder = "Aradığınız soruyu yazın",
  size = "md",
  initialQuery = "",
  searchPath = "/sorular",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    router.push(`${searchPath}?${params.toString()}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full min-w-0 items-center gap-2"
    >
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        className={`min-w-0 flex-1 ${size === "sm" ? "h-9" : "h-11"}`}
      />
      <Button type="submit" className={`shrink-0 ${size === "sm" ? "h-9" : "h-11"}`}>
        Ara
      </Button>
    </form>
  );
}
