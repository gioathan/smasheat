/* eslint-disable @next/next/no-img-element */
import { ArrowUp, Camera, Phone } from "lucide-react";
import { brand, footerLinks } from "@/content/story";
import { formatPhoneDisplay, formatPhoneHref } from "@/lib/utils";
import type { BusinessInfo } from "@/lib/data/business-info";
import type { HoursRow } from "@/lib/hours-summary";
import type { DateWindows, WeeklyWindows } from "@/lib/open-status";
import { HoursTable } from "./HoursTable";
import { StatusPill } from "./StatusPill";

const heading = "font-headline text-2xl leading-none tracking-[0.04em] text-flame";
const chip =
  "inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 font-label text-xs font-bold tracking-[0.06em] uppercase transition-colors hover:bg-flame hover:text-white";

export function Footer({
  businessInfo,
  hoursRows,
  weekly,
  overrides,
  hoursSummary,
}: {
  businessInfo: BusinessInfo | null;
  hoursRows: HoursRow[];
  weekly: WeeklyWindows;
  overrides: DateWindows;
  hoursSummary: string;
}) {
  const instagram = businessInfo?.instagram_url;
  const handle = instagram ? `@${new URL(instagram).pathname.split("/").filter(Boolean)[0] ?? ""}` : null;

  return (
    <footer className="bg-char pb-28 text-cream lg:pb-0">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 pt-16 pb-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_0.8fr] lg:px-12">
        <div>
          <a href="#top" className="flex items-center gap-3">
            <img src="/images/logo.avif" alt="" width={48} height={48} className="size-12 rounded-lg" />
            <span className="font-headline text-5xl leading-none tracking-[0.04em]">{brand.name}</span>
          </a>
          <p className="mt-4 max-w-sm leading-relaxed text-cream/70">
            Hand-smashed burgers, crispy buttermilk chicken and loaded fries, right on Notara Street.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {instagram && handle && (
              <a href={instagram} target="_blank" rel="noopener" className={chip}>
                <Camera className="size-3.5" /> {handle}
              </a>
            )}
            {businessInfo && (
              <a href={formatPhoneHref(businessInfo.phone)} className={chip}>
                <Phone className="size-3.5" /> {formatPhoneDisplay(businessInfo.phone)}
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className={heading}>Opening hours</h3>
          <div className="mt-3 -mx-2">
            <HoursTable rows={hoursRows} tone="dark" />
          </div>
          <StatusPill weekly={weekly} overrides={overrides} fallback={hoursSummary} tone="dark" className="mt-3" />
        </div>

        <div>
          <h3 className={heading}>Find us</h3>
          {businessInfo && (
            <a href="#visit" className="mt-3 block text-cream/80 hover:text-flame">
              {businessInfo.address_line}
            </a>
          )}
          {(businessInfo?.wolt_url || businessInfo?.efood_url) && (
            <>
              <p className="mt-4 font-label text-xs font-bold tracking-[0.08em] text-cream/50 uppercase">
                Order delivery online
              </p>
              <div className="mt-2 flex gap-2">
                {businessInfo?.wolt_url && (
                  <a
                    href={businessInfo.wolt_url}
                    target="_blank"
                    rel="noopener"
                    className="rounded-lg bg-cream px-3 py-1.5 font-label text-xs font-bold tracking-[0.06em] text-char uppercase hover:bg-flame hover:text-white"
                  >
                    Wolt
                  </a>
                )}
                {businessInfo?.efood_url && (
                  <a
                    href={businessInfo.efood_url}
                    target="_blank"
                    rel="noopener"
                    className="rounded-lg bg-cream px-3 py-1.5 font-label text-xs font-bold tracking-[0.06em] text-char uppercase hover:bg-flame hover:text-white"
                  >
                    efood
                  </a>
                )}
              </div>
            </>
          )}
        </div>

        <nav aria-label="Footer">
          <h3 className={heading}>Explore</h3>
          <ul className="mt-3 grid gap-1.5">
            {[...footerLinks.explore, { label: "Visit", href: "#visit" }].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-label text-sm font-bold tracking-[0.08em] text-cream/75 uppercase hover:text-flame"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 border-t border-white/10 px-5 py-6 text-sm text-cream/55 lg:px-12">
        <p>
          © {new Date().getFullYear()} {brand.name} · {businessInfo?.address_line}
        </p>
        <a
          href="#top"
          className="flex items-center gap-1.5 font-label text-xs font-bold tracking-[0.08em] uppercase hover:text-flame"
        >
          Back to top <ArrowUp className="size-3.5" />
        </a>
      </div>
    </footer>
  );
}
