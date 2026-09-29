/* eslint-disable @next/next/no-img-element */
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { brand, nav } from "@/content/story";
import { formatPhoneDisplay, formatPhoneHref } from "@/lib/utils";
import type { BusinessInfo } from "@/lib/data/business-info";
import type { DateWindows, WeeklyWindows } from "@/lib/open-status";
import { MobileMenu } from "./MobileMenu";
import { StatusPill } from "./StatusPill";

export function Header({
  businessInfo,
  weekly,
  overrides,
  hoursSummary,
}: {
  businessInfo: BusinessInfo | null;
  weekly: WeeklyWindows;
  overrides: DateWindows;
  hoursSummary: string;
}) {
  return (
    <header
      id="site-header"
      className="fixed inset-x-0 top-0 z-40 transition-transform duration-500 data-[hidden]:-translate-y-[calc(100%+1.5rem)]"
    >
      {/* Desktop: floating dark bar */}
      <div className="mx-auto mt-4 hidden h-20 max-w-[1232px] items-center justify-between gap-4 rounded-2xl bg-char/95 px-6 text-cream shadow-float backdrop-blur-md lg:mx-6 lg:flex xl:mx-auto">
        <a href="#top" className="flex items-center gap-3" aria-label={`${brand.name}, back to top`}>
          <img src="/images/logo.avif" alt="" width={40} height={40} className="size-10 rounded-full" />
          <span className="grid leading-none">
            <span className="font-headline text-[1.7rem] tracking-[0.04em]">{brand.name}</span>
            <span className="font-label text-[0.65rem] font-bold tracking-[0.12em] text-flame uppercase">
              {brand.eyebrow}
            </span>
          </span>
        </a>

        <span className="hidden 2xl:block">
          <StatusPill weekly={weekly} overrides={overrides} fallback={hoursSummary} tone="dark" />
        </span>

        <nav aria-label="Primary">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  data-section-link
                  className="rounded-lg px-3 py-2 font-label text-sm font-bold tracking-[0.08em] whitespace-nowrap text-cream/80 uppercase xl:px-4 transition-colors hover:text-cream aria-[current]:bg-flame aria-[current]:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {businessInfo && (
            <a
              href={formatPhoneHref(businessInfo.phone)}
              className="hidden items-center gap-2 rounded-lg border border-white/15 px-3 py-2 font-label text-sm font-bold tracking-[0.04em] whitespace-nowrap transition-colors hover:border-flame hover:text-flame xl:flex"
            >
              <Phone className="size-4" />
              {formatPhoneDisplay(businessInfo.phone)}
            </a>
          )}
          <button
            type="button"
            data-order-trigger
            className="flex h-10 items-center gap-2 rounded-lg bg-flame px-4 font-label text-sm font-bold tracking-[0.06em] whitespace-nowrap text-white uppercase shadow-[0_4px_0_rgb(0_0_0/0.35)] transition active:translate-y-0.5 active:shadow-none"
          >
            Order now <ArrowRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Mobile: light two-row header */}
      <div className="border-b border-line bg-cream/90 backdrop-blur-md lg:hidden">
        <div className="flex h-18 items-center justify-between px-4">
          <a href="#top" className="flex items-center gap-3" aria-label={`${brand.name}, back to top`}>
            <img src="/images/logo.avif" alt="" width={40} height={40} className="size-10 rounded-full" />
            <span className="font-headline text-[1.7rem] leading-none tracking-[0.04em] text-char">
              {brand.name}
            </span>
            <span className="rounded bg-flame px-1.5 py-0.5 font-label text-[0.6rem] font-bold tracking-[0.1em] text-white uppercase">
              Patras
            </span>
          </a>
          <MobileMenu
            links={nav}
            footnote={`${businessInfo?.address_line ?? ""} · ${hoursSummary}`}
            phone={businessInfo?.phone ?? null}
          />
        </div>
        <div className="flex items-center justify-between gap-2 px-4 pb-2.5">
          {businessInfo && (
            <span className="inline-flex min-w-0 items-center gap-1.5 truncate rounded-full bg-char px-3 py-1.5 font-label text-xs font-bold tracking-[0.04em] text-cream">
              <MapPin className="size-3.5 shrink-0 text-flame" />
              <span className="truncate">{businessInfo.address_line}</span>
            </span>
          )}
          <StatusPill weekly={weekly} overrides={overrides} fallback={hoursSummary} className="shrink-0" />
        </div>
      </div>
    </header>
  );
}
