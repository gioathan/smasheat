/* eslint-disable @next/next/no-img-element */
import { ArrowRight, Star } from "lucide-react";
import { brand } from "@/content/story";
import { formatRating, type GoogleListing } from "@/lib/data/google-listing";

const FALLBACK_HERO_IMAGE = "/images/table-share.jpg";

export function Hero({
  google,
  heroImageUrl,
  openHours,
}: {
  google: GoogleListing;
  heroImageUrl?: string | null;
  /** e.g. { days: "Tue–Sun", time: "17:00–00:00" } */
  openHours: { days: string; time: string } | null;
}) {
  const rating = google.rating != null ? formatRating(google.rating) : null;
  const lines = brand.heroHeadlineLines;
  const lead = lines.slice(0, -1);
  const accent = lines[lines.length - 1];

  const stats = [
    rating && {
      value: (
        <>
          {rating} <Star className="inline size-5 -translate-y-0.5 fill-current" />
        </>
      ),
      label: google.count != null ? `Google · ${google.count} reviews` : "Google rating",
      accent: true,
    },
    {
      value: google.priceRange ?? brand.priceRange,
      label: "Per person",
      accent: false,
    },
    openHours && {
      value: openHours.time,
      label: `Open ${openHours.days}`,
      accent: false,
    },
  ].filter(Boolean) as { value: React.ReactNode; label: string; accent: boolean }[];

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-[radial-gradient(60%_70%_at_0%_0%,rgb(235_103_30/0.14),transparent_70%),radial-gradient(50%_60%_at_100%_100%,rgb(235_103_30/0.12),transparent_70%)] pt-36 pb-16 lg:pt-32 lg:pb-20"
    >
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 lg:grid-cols-[1fr_1fr] lg:px-12">
        <div>
          <p
            data-reveal
            className="inline-flex items-center gap-2 rounded-full bg-char px-3 py-1.5 font-label text-xs font-bold tracking-[0.08em] text-cream uppercase"
          >
            <span className="size-2 rounded-full bg-flame" />
            {brand.eyebrow}
          </p>

          <h1
            id="hero-title"
            data-reveal
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            className="mt-5 font-headline text-[3.5rem] leading-[0.95] tracking-[0.03em] text-char uppercase sm:text-7xl lg:text-[5.25rem]"
          >
            {lead.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <span className="relative inline-block text-flame">
              {accent}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-1 h-2 rounded-full bg-flame/25"
              />
            </span>
          </h1>

          <p
            data-reveal
            style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
            className="mt-6 max-w-[34rem] text-lg leading-relaxed text-char-soft"
          >
            {brand.heroDescription}
          </p>

          <div
            data-reveal
            style={{ "--reveal-delay": "240ms" } as React.CSSProperties}
            className="mt-8 flex flex-wrap gap-3"
          >
            <button
              type="button"
              data-order-trigger
              className="flex h-12 items-center gap-2 rounded-lg bg-flame px-6 font-label font-bold tracking-[0.06em] text-white uppercase shadow-pop transition hover:bg-flame-ink active:translate-y-1 active:shadow-pop-sm"
            >
              Order now <ArrowRight className="size-4" />
            </button>
            <a
              href="#menu"
              className="flex h-12 items-center rounded-lg bg-char px-6 font-label font-bold tracking-[0.06em] text-cream uppercase transition hover:bg-char-muted"
            >
              Explore the menu
            </a>
          </div>

          <ul data-reveal-group className="mt-10 grid grid-cols-3 gap-2 sm:gap-3">
            {stats.map((stat) => (
              <li
                key={stat.label}
                data-reveal
                className="rounded-xl border border-line bg-white p-2.5 sm:p-4"
              >
                <p
                  className={`font-headline text-lg leading-none tracking-[0.02em] whitespace-nowrap sm:text-3xl ${
                    stat.accent ? "text-flame" : "text-char"
                  }`}
                >
                  {stat.value}
                </p>
                <p className="mt-1.5 font-label text-[0.65rem] font-bold tracking-[0.06em] text-char-soft uppercase sm:text-xs">
                  {stat.label}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div
          data-reveal
          style={{ "--reveal-delay": "200ms" } as React.CSSProperties}
          className="relative mx-auto w-full max-w-[36rem] pb-10 lg:max-w-none"
        >
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-toast shadow-float lg:aspect-[592/420]">
            <img
              src={heroImageUrl ?? FALLBACK_HERO_IMAGE}
              alt="Smasheat burgers and loaded fries on the table"
              fetchPriority="high"
              className="size-full object-cover"
            />
          </div>

          {rating && (
            <div className="absolute -top-5 -right-3 flex size-24 rotate-[8deg] flex-col items-center justify-center rounded-full bg-flame text-center text-white shadow-pop sm:size-28">
              <span className="font-headline text-3xl leading-none">
                {rating}
                <Star className="ml-0.5 inline size-4 -translate-y-1 fill-current" />
              </span>
              <span className="font-label text-[0.6rem] font-bold tracking-[0.1em] uppercase">
                Google
              </span>
            </div>
          )}

          <div className="absolute bottom-0 left-4 flex max-w-[20rem] items-center gap-3 rounded-xl bg-white p-3 pr-5 shadow-float sm:-left-6">
            <img
              src="/images/logo.avif"
              alt=""
              width={48}
              height={48}
              className="size-12 shrink-0 rounded-lg border border-line"
            />
            <span className="grid">
              <span className="font-label text-[0.65rem] font-bold tracking-[0.08em] text-flame-ink uppercase">
                {brand.name}
              </span>
              <span className="text-sm leading-snug font-medium text-char">{brand.tagline}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
