import { ArrowRight, MapPin, Navigation, Phone, Store } from "lucide-react";
import { sectionCopy } from "@/content/story";
import { formatPhoneDisplay, formatPhoneHref, formatTimeRange } from "@/lib/utils";
import type { BusinessInfo, HoursOverride } from "@/lib/data/business-info";
import type { HoursRow } from "@/lib/hours-summary";
import type { DateWindows, WeeklyWindows } from "@/lib/open-status";
import { HoursTable } from "./HoursTable";
import { SectionHeading } from "./SectionHeading";
import { StatusPill } from "./StatusPill";

export function Visit({
  businessInfo,
  hoursRows,
  overrides,
  weekly,
  overrideWindows,
  hoursSummary,
}: {
  businessInfo: BusinessInfo | null;
  hoursRows: HoursRow[];
  overrides: HoursOverride[];
  weekly: WeeklyWindows;
  overrideWindows: DateWindows;
  hoursSummary: string;
}) {
  if (!businessInfo) return null;

  const mapQuery = encodeURIComponent(`Smasheat, ${businessInfo.address_line}`);
  const channels = [
    businessInfo.wolt_url && {
      href: businessInfo.wolt_url,
      name: "Wolt",
      kicker: "Wolt delivery",
      kickerClass: "text-[#0079ad]",
      // Wolt's brand blue
      brandClass: "bg-[#009de0]",
      title: "Order on Wolt",
      body: "Order in the Wolt app or website.",
      cta: "Open Wolt",
    },
    businessInfo.efood_url && {
      href: businessInfo.efood_url,
      name: "efood",
      kicker: "efood delivery",
      kickerClass: "text-[#c41a12]",
      // efood's brand red
      brandClass: "bg-[#e2231a]",
      title: "Order on efood",
      body: "Order in the efood app or website.",
      cta: "Open efood",
    },
  ].filter(Boolean) as {
    href: string;
    name: string;
    kicker: string;
    kickerClass: string;
    brandClass: string;
    title: string;
    body: string;
    cta: string;
  }[];

  return (
    <section id="visit" aria-labelledby="visit-title" className="py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1280px] items-start gap-6 px-5 lg:grid-cols-2 lg:px-12">
        <div data-reveal className="rounded-2xl border border-line bg-white p-6 sm:p-8">
          <SectionHeading id="visit-title" copy={sectionCopy.visit} />

          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-flame" />
              <div>
                <dt className="font-label text-xs font-bold tracking-[0.08em] text-char uppercase">
                  Address
                </dt>
                <dd className="mt-1">
                  <a
                    href={businessInfo.google_maps_url}
                    target="_blank"
                    rel="noopener"
                    className="text-char-soft hover:text-flame-ink"
                  >
                    {businessInfo.address_line}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-flame" />
              <div>
                <dt className="font-label text-xs font-bold tracking-[0.08em] text-char uppercase">
                  Call direct
                </dt>
                <dd className="mt-1">
                  <a
                    href={formatPhoneHref(businessInfo.phone)}
                    className="text-lg font-bold text-flame-ink hover:underline"
                  >
                    {formatPhoneDisplay(businessInfo.phone)}
                  </a>
                </dd>
              </div>
            </div>
          </dl>

          <div className="mt-8 rounded-xl bg-toast/70 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
              <h3 className="font-label text-base font-bold tracking-[0.04em] text-char uppercase">
                Opening hours
              </h3>
              <StatusPill weekly={weekly} overrides={overrideWindows} fallback={hoursSummary} />
            </div>
            <div className="mt-2 -mx-2">
              <HoursTable rows={hoursRows} />
            </div>

            {overrides.length > 0 && (
              <div className="mt-4 border-t border-line pt-3">
                <h4 className="font-label text-xs font-bold tracking-[0.08em] text-flame-ink uppercase">
                  Holiday &amp; special hours
                </h4>
                <ul className="mt-2 grid gap-2 text-sm">
                  {overrides.map((o) => (
                    <li key={o.id} className="flex items-start justify-between gap-4">
                      <span>
                        <span className="block font-semibold text-char">
                          {new Date(o.date).toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            timeZone: "UTC",
                          })}
                        </span>
                        {o.note && <span className="text-char-soft">{o.note}</span>}
                      </span>
                      <span className={o.is_closed ? "font-semibold text-red-700" : "text-char"}>
                        {o.is_closed ? "Closed" : formatTimeRange(o.open_time, o.close_time)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={businessInfo.google_maps_url}
              target="_blank"
              rel="noopener"
              className="flex h-12 items-center gap-2 rounded-lg bg-flame px-5 font-label text-sm font-bold tracking-[0.06em] text-white uppercase shadow-pop-sm transition hover:bg-flame-ink active:translate-y-0.5 active:shadow-none"
            >
              <Navigation className="size-4" /> Get directions
            </a>
            <a
              href={formatPhoneHref(businessInfo.phone)}
              className="flex h-12 items-center gap-2 rounded-lg bg-char px-5 font-label text-sm font-bold tracking-[0.06em] text-cream uppercase transition hover:bg-char-muted"
            >
              <Phone className="size-4" /> Call to order
            </a>
          </div>
        </div>

        <div className="grid gap-6">
          <div
            data-reveal
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
            className="relative h-72 overflow-hidden rounded-2xl border border-line bg-toast sm:h-80"
          >
            <iframe
              title={`Map showing Smasheat at ${businessInfo.address_line}`}
              src={`https://maps.google.com/maps?q=${mapQuery}&z=16&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 size-full border-0"
            />
            <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-xl bg-white/95 p-3 shadow-float backdrop-blur">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-flame text-white">
                <Store className="size-5" />
              </span>
              <span className="grid">
                <strong className="font-headline text-2xl leading-none tracking-[0.02em] text-char">
                  Smasheat
                </strong>
                <span className="text-sm text-char-soft">{businessInfo.address_line}</span>
              </span>
            </div>
          </div>

          {channels.length > 0 && (
            // Phones: compact buttons in each platform's own colour.
            <div data-reveal className="grid grid-cols-2 gap-3 md:hidden">
              {channels.map((c) => (
                <a
                  key={c.name}
                  href={c.href}
                  target="_blank"
                  rel="noopener"
                  className={`flex items-center justify-between gap-2 rounded-xl p-3.5 text-white transition active:scale-[0.98] ${c.brandClass}`}
                >
                  <span className="grid">
                    <span className="font-headline text-2xl leading-none tracking-[0.04em] uppercase">
                      {c.name}
                    </span>
                    <span className="mt-1 font-label text-xs font-semibold text-white/85">
                      Order delivery
                    </span>
                  </span>
                  <ArrowRight className="size-5 shrink-0" />
                </a>
              ))}
            </div>
          )}

          {channels.length > 0 && (
            <div data-reveal-group className="hidden gap-4 md:grid md:grid-cols-2">
              {channels.map((c) => (
                <a
                  key={c.title}
                  data-reveal
                  href={c.href}
                  target="_blank"
                  rel="noopener"
                  className="group rounded-2xl border border-line bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-char hover:shadow-pop"
                >
                  <p className={`font-label text-xs font-bold tracking-[0.08em] uppercase ${c.kickerClass}`}>
                    {c.kicker}
                  </p>
                  <h3 className="mt-1 font-headline text-3xl leading-none tracking-[0.02em] text-char">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm text-char-soft">{c.body}</p>
                  <span className="mt-4 flex items-center gap-1 font-label text-xs font-bold tracking-[0.08em] text-flame-ink uppercase">
                    {c.cta} <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
