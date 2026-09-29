"use client";

import { useEffect, useState } from "react";
import { computeOpenStatus, type DateWindows, type WeeklyWindows } from "@/lib/open-status";

const TONES = {
  // On the dark header bar and footer.
  dark: {
    base: "bg-white/10 text-cream",
    open: "bg-emerald-400/15 text-emerald-300",
  },
  // On cream or white surfaces.
  light: {
    base: "bg-char/5 text-char-muted",
    open: "bg-emerald-100 text-emerald-800",
  },
};

export function StatusPill({
  weekly,
  overrides,
  fallback,
  tone = "light",
  className = "",
}: {
  weekly: WeeklyWindows;
  overrides: DateWindows;
  /** Shown until the client works out the live status (server render). */
  fallback: string;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  const [status, setStatus] = useState<{ open: boolean; text: string } | null>(null);

  useEffect(() => {
    const update = () => setStatus(computeOpenStatus(weekly, overrides));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, [weekly, overrides]);

  const open = status?.open ?? false;
  const colors = TONES[tone];

  return (
    <span
      role="status"
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-label text-xs font-bold tracking-[0.06em] uppercase whitespace-nowrap ${
        open ? colors.open : colors.base
      } ${className}`}
    >
      <span className="relative flex size-2">
        {open && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        )}
        <span
          className={`relative inline-flex size-2 rounded-full ${open ? "bg-emerald-500" : "bg-current opacity-50"}`}
        />
      </span>
      {status?.text ?? fallback}
    </span>
  );
}
