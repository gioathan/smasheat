/* eslint-disable @next/next/no-img-element */
import { Check, UtensilsCrossed } from "lucide-react";
import { brand, sectionCopy, story } from "@/content/story";
import { formatRating, type GoogleListing } from "@/lib/data/google-listing";
import { SectionHeading } from "./SectionHeading";

const PHOTOS = [
  { src: "/images/burger-bite.jpg", caption: "Cheezzzy, mid-bite" },
  { src: "/images/truffle-fries.jpg", caption: "Truffle fries" },
];

export function OurStory({ google }: { google: GoogleListing }) {
  const rating = google.rating != null ? formatRating(google.rating) : null;

  const stats = [
    rating && { value: `${rating}★`, label: "Google score", accent: true },
    { value: "6", label: "Nights a week", accent: false },
    { value: "7", label: "House dips", accent: true },
  ].filter(Boolean) as { value: string; label: string; accent: boolean }[];

  return (
    <section id="story" aria-labelledby="story-title" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="story-title" copy={sectionCopy.story} />
          <p
            data-reveal
            className="inline-flex items-center gap-2 rounded-full bg-flame-soft/60 px-4 py-2 font-label text-xs font-bold tracking-[0.06em] text-char uppercase"
          >
            <UtensilsCrossed className="size-4 text-flame" />
            {brand.serviceTypes}
          </p>
        </div>

        <div data-reveal-group className="mt-12 grid items-start gap-6 lg:grid-cols-3">
          <article data-reveal className="rounded-2xl border border-line bg-white p-8 lg:self-center">
            <div className="flex items-start justify-between gap-4">
              <span className="font-headline text-6xl leading-none text-flame">01</span>
              <span className="pt-2 text-right font-label text-xs font-bold tracking-[0.08em] text-char-soft uppercase">
                {story.smash.overlayLabel}
              </span>
            </div>
            <h3 className="mt-5 font-headline text-4xl leading-none tracking-[0.02em] text-char">
              {story.smash.title}
            </h3>
            <p className="mt-4 leading-relaxed text-char-soft">{story.smash.body}</p>
            <ul className="mt-6 grid gap-3 rounded-xl bg-toast/70 p-4">
              {story.smash.bullets.map((bullet) => (
                <li key={bullet.label} className="flex gap-2.5">
                  <Check className="mt-0.5 size-4 shrink-0 text-flame" strokeWidth={3} />
                  <span>
                    <strong className="block font-label text-sm font-bold tracking-[0.06em] text-char uppercase">
                      {bullet.label}
                    </strong>
                    <span className="text-sm text-char-soft">{bullet.sub}</span>
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <div data-reveal className="grid grid-cols-2 gap-6 lg:grid-cols-1">
            {PHOTOS.map((photo) => (
              <figure
                key={photo.src}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-toast sm:aspect-[390/256]"
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-char/80 to-transparent px-4 pt-10 pb-3 font-label text-xs font-bold tracking-[0.06em] text-white uppercase sm:text-sm">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>

          <article
            data-reveal
            className="rounded-2xl bg-char p-8 text-cream shadow-float lg:self-center"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="font-headline text-6xl leading-none text-flame">02</span>
              <span className="pt-2 text-right font-label text-xs font-bold tracking-[0.08em] text-cream/50 uppercase">
                {story.table.overlayLabel}
              </span>
            </div>
            <h3 className="mt-5 font-headline text-4xl leading-none tracking-[0.02em]">
              {story.table.title}
            </h3>
            <p className="mt-4 leading-relaxed text-cream/75">{story.table.body}</p>
            <dl className="mt-6 grid grid-cols-3 gap-2 rounded-xl bg-white/5 p-4 text-center">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd
                    className={`font-headline text-3xl leading-none ${stat.accent ? "text-flame" : "text-cream"}`}
                  >
                    {stat.value}
                  </dd>
                  <dd className="mt-1.5 font-label text-[0.65rem] font-bold tracking-[0.06em] text-cream/60 uppercase">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        </div>
      </div>
    </section>
  );
}
