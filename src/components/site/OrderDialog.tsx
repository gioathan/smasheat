"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, Bike, ChevronRight, Phone, ShoppingBag, UtensilsCrossed, X } from "lucide-react";
import { formatPhoneDisplay, formatPhoneHref } from "@/lib/utils";

type Option = {
  href: string;
  icon: typeof Bike;
  title: string;
  detail: string;
  external: boolean;
};

export function OrderDialog({
  phone,
  address,
  woltUrl,
  efoodUrl,
  hoursSummary,
}: {
  phone: string;
  address: string;
  woltUrl: string | null;
  efoodUrl: string | null;
  hoursSummary: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as Element | null)?.closest("[data-order-trigger]");
      if (!trigger) return;
      e.preventDefault();
      ref.current?.showModal();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const close = () => ref.current?.close();

  const options: Option[] = [
    efoodUrl && {
      href: efoodUrl,
      icon: Bike,
      title: "Delivery via efood",
      detail: "Order in the efood app or website",
      external: true,
    },
    woltUrl && {
      href: woltUrl,
      icon: ShoppingBag,
      title: "Delivery via Wolt",
      detail: "Order in the Wolt app or website",
      external: true,
    },
    {
      href: formatPhoneHref(phone),
      icon: Phone,
      title: "Call for pickup",
      detail: formatPhoneDisplay(phone),
      external: false,
    },
    {
      href: "#visit",
      icon: UtensilsCrossed,
      title: "Dine in",
      detail: address,
      external: false,
    },
  ].filter(Boolean) as Option[];

  return (
    <dialog
      ref={ref}
      aria-labelledby="order-title"
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
      className="m-auto mb-0 w-full max-w-none bg-transparent p-0 backdrop:bg-char/60 backdrop:backdrop-blur-sm sm:mb-auto sm:max-w-md"
    >
      <div className="rounded-t-2xl bg-cream p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-float sm:rounded-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-label text-xs font-bold tracking-[0.08em] text-flame-ink uppercase">
              Order Smasheat
            </p>
            <h2 id="order-title" className="mt-1 font-headline text-4xl leading-none text-char">
              How do you want it tonight?
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="grid size-10 shrink-0 place-items-center rounded-lg border-2 border-char text-char transition-colors hover:bg-char hover:text-cream"
          >
            <X className="size-5" />
          </button>
        </div>

        <ul className="mt-6 grid gap-3">
          {options.map(({ href, icon: Icon, title, detail, external }) => (
            <li key={title}>
              <a
                href={href}
                onClick={href.startsWith("#") ? close : undefined}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener" : undefined}
                className="group flex min-h-18 items-center gap-4 rounded-xl border border-line bg-white p-3 pr-4 transition hover:-translate-y-0.5 hover:border-char hover:shadow-pop-sm"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-flame text-white">
                  <Icon className="size-5" />
                </span>
                <span className="grid flex-1 gap-0.5">
                  <strong className="font-label text-base font-bold tracking-[0.02em] text-char uppercase">
                    {title}
                  </strong>
                  <span className="text-sm text-char-soft">{detail}</span>
                </span>
                {external ? (
                  <ArrowUpRight className="size-5 text-char-soft transition group-hover:text-flame" />
                ) : (
                  <ChevronRight className="size-5 text-char-soft transition group-hover:text-flame" />
                )}
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-center text-sm text-char-soft">Open {hoursSummary}</p>
      </div>
    </dialog>
  );
}
