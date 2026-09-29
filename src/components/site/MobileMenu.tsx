"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Menu as MenuIcon, Phone, X } from "lucide-react";
import { formatPhoneHref } from "@/lib/utils";

const noSubscribe = () => () => {};

export function MobileMenu({
  links,
  footnote,
  phone,
}: {
  links: { label: string; href: string }[];
  footnote: string;
  phone: string | null;
}) {
  const [open, setOpen] = useState(false);
  // The overlay is portalled to <body>: the header's backdrop blur would
  // otherwise trap a fixed overlay inside the header's own box.
  const mounted = useSyncExternalStore(noSubscribe, () => true, () => false);

  useEffect(() => {
    document.body.toggleAttribute("data-menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  const overlay = (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
      className={`fixed inset-0 z-[80] flex flex-col bg-char bg-[radial-gradient(80%_50%_at_100%_0%,rgb(235_103_30/0.22),transparent_70%)] text-cream transition-[opacity,visibility] duration-300 lg:hidden ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div className="flex h-18 items-center justify-between border-b border-white/10 px-4">
        <a href="#top" onClick={close} className="flex items-center gap-3">
          <img src="/images/logo.avif" alt="" width={40} height={40} className="size-10 rounded-full" />
          <span className="font-headline text-[1.7rem] leading-none tracking-[0.04em]">Smasheat</span>
        </a>
        <button
          type="button"
          onClick={close}
          aria-label="Close menu"
          className="grid size-10 place-items-center rounded-full bg-flame text-white"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 pt-6">
        <ul>
          {links.map((link, i) => (
            <li
              key={link.href}
              className={`transition duration-500 ease-out ${
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${80 + i * 60}ms` : "0ms" }}
            >
              <a
                href={link.href}
                onClick={close}
                className="group flex items-center justify-between border-b border-white/10 py-4"
              >
                <span className="flex items-baseline gap-4">
                  <span className="w-6 font-label text-sm font-bold text-flame">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-headline text-[2.6rem] leading-none tracking-[0.03em] uppercase group-active:text-flame">
                    {link.label}
                  </span>
                </span>
                <ArrowRight className="size-5 text-cream/40 group-active:text-flame" />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="grid gap-3 border-t border-white/10 px-5 pt-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        <p className="text-sm text-cream/65">{footnote}</p>
        <div className="grid grid-cols-[1fr_1.4fr] gap-2">
          {phone && (
            <a
              href={formatPhoneHref(phone)}
              className="flex h-12 items-center justify-center gap-2 rounded-lg border border-white/20 font-label text-sm font-bold tracking-[0.06em] uppercase"
            >
              <Phone className="size-4 text-flame" /> Call
            </a>
          )}
          <button
            type="button"
            data-order-trigger
            onClick={close}
            className={`flex h-12 items-center justify-center gap-2 rounded-lg bg-flame font-label text-sm font-bold tracking-[0.06em] text-white uppercase ${
              phone ? "" : "col-span-2"
            }`}
          >
            Order now <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="grid size-10 place-items-center rounded-full bg-flame text-white shadow-pop-sm transition active:translate-y-0.5 active:shadow-none lg:hidden"
      >
        <MenuIcon className="size-5" />
      </button>
      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
