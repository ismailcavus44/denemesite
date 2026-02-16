"use client";

import { useEffect, useState } from "react";

const HIDE_AFTER_PX = 80;

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      setHidden(winScroll > HIDE_AFTER_PX);
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setProgress(height > 0 ? (winScroll / height) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (hidden) return null;

  return (
    <div
      className="fixed left-0 top-0 z-50 h-1 bg-slate-800 transition-all duration-150"
      style={{ width: `${progress}%` }}
      aria-hidden
    />
  );
}
