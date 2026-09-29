import { ArrowUpRight, Quote, Star } from "lucide-react";
import { sectionCopy } from "@/content/story";
import { languageName, type GoogleListing } from "@/lib/data/google-listing";
import { RatingCount } from "./RatingCount";
import { SectionHeading } from "./SectionHeading";

// A small, repeating set of tilts and drops so the cards read as pinned-up
// notes rather than a strict grid. Only applied from the `sm` breakpoint.
const COLLAGE = [
  { tilt: "sm:-rotate-2", offset: "" },
  { tilt: "sm:rotate-[1.5deg]", offset: "sm:translate-y-6" },
  { tilt: "sm:-rotate-1", offset: "sm:translate-y-2" },
  { tilt: "sm:rotate-2", offset: "sm:translate-y-4" },
  { tilt: "sm:rotate-[-1.5deg]", offset: "sm:translate-y-3" },
];

function Stars({ className = "" }: { className?: string }) {
  return (
    <span className={`flex gap-0.5 text-flame ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-4 fill-current" />
      ))}
    </span>
  );
}

export function Reviews({ google }: { google: GoogleListing }) {
  const { rating, count, reviews, readUrl, writeUrl } = google;

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="reviews-title" copy={sectionCopy.reviews} />

          <div data-reveal className="flex flex-wrap items-center gap-4">
            {rating != null && (
              <div className="flex items-center gap-3">
                <RatingCount value={rating} className="font-headline text-5xl leading-none text-char" />
                <span className="grid gap-1">
                  <Stars />
                  <span className="font-label text-xs font-bold tracking-[0.06em] text-char-soft uppercase">
                    {count != null ? `${count} Google reviews` : "On Google"}
                  </span>
                </span>
              </div>
            )}
            {writeUrl && (
              <a
                href={writeUrl}
                target="_blank"
                rel="noopener"
                className="flex h-10 items-center gap-2 rounded-lg border-2 border-char px-4 font-label text-sm font-bold tracking-[0.06em] text-char uppercase transition-colors hover:bg-char hover:text-cream"
              >
                Review us <ArrowUpRight className="size-4" />
              </a>
            )}
          </div>
        </div>

        {reviews.length > 0 && (
          // Phones: a swipeable row (scrollbar hidden). Wider screens: a loose,
          // slightly tilted collage (3 across, extras centred) with no scrolling.
          <ul
            data-reveal-group
            className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 touch-pan-x [scrollbar-width:none] sm:mx-0 sm:touch-auto sm:flex-wrap sm:items-start sm:justify-center sm:gap-x-6 sm:gap-y-10 sm:overflow-visible sm:px-2 sm:pt-4 sm:pb-6 lg:gap-x-8 [&::-webkit-scrollbar]:hidden"
          >
            {reviews.map((review, i) => (
              <li
                key={review.id}
                data-reveal
                className={`w-[85%] shrink-0 snap-start sm:w-[calc(50%-0.75rem)] lg:w-[calc((100%-4rem)/3)] ${
                  COLLAGE[i % COLLAGE.length].offset
                } ${i >= 3 ? "sm:hidden" : ""}`}
              >
              <div
                className={`relative flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition duration-300 hover:border-char hover:shadow-pop sm:hover:-translate-y-1 sm:hover:rotate-0 ${
                  COLLAGE[i % COLLAGE.length].tilt
                }`}
              >
                <Quote className="absolute top-5 right-5 size-10 fill-flame/10 text-flame/20" />
                <Stars />
                <blockquote className="mt-4 line-clamp-6 leading-relaxed text-char italic">
                  “{review.text}”
                </blockquote>
                <div className="mt-auto flex items-center gap-3 pt-6">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-flame font-headline text-xl text-white">
                    {review.author[0]}
                  </span>
                  <span className="grid">
                    {review.authorUrl ? (
                      <a
                        href={review.authorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-label text-sm font-bold tracking-[0.04em] text-char uppercase hover:text-flame-ink"
                      >
                        {review.author}
                      </a>
                    ) : (
                      <span className="font-label text-sm font-bold tracking-[0.04em] text-char uppercase">
                        {review.author}
                      </span>
                    )}
                    <span className="text-xs text-char-soft">
                      {review.translatedFrom
                        ? `Google review, translated from ${languageName(review.translatedFrom)}`
                        : "Google review"}
                    </span>
                  </span>
                </div>
              </div>
              </li>
            ))}
          </ul>
        )}

        {readUrl && (
          <a
            href={readUrl}
            target="_blank"
            rel="noopener"
            className="mt-6 inline-flex items-center gap-1.5 font-label text-sm font-bold tracking-[0.06em] text-flame-ink uppercase hover:underline"
          >
            Read all reviews on Google <ArrowUpRight className="size-4" />
          </a>
        )}
      </div>
    </section>
  );
}
