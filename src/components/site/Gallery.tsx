/* eslint-disable @next/next/no-img-element */
import { ArrowRight, Camera } from "lucide-react";
import { sectionCopy } from "@/content/story";
import type { BusinessInfo } from "@/lib/data/business-info";
import type { GalleryImage } from "@/lib/data/gallery";
import { Lightbox, type Photo } from "./Lightbox";
import { SectionHeading } from "./SectionHeading";

// Shown until the admin uploads photos; uploads fill these slots in order.
const FALLBACK_PHOTOS: Photo[] = [
  { src: "/images/burger-bite.jpg", caption: "Cheezzzy, mid-bite", alt: "Hand holding a bitten smash burger with cheddar, pickles and sauce" },
  { src: "/images/burger-lineup.avif", caption: "The lineup", alt: "Row of Smasheat burgers and loaded fries on branded wrapping paper" },
  { src: "/images/table-share.jpg", caption: "Friday night on Notara", alt: "Friends sharing burgers and loaded fries at a wooden table" },
  { src: "/images/truffle-fries.jpg", caption: "Truffle fries", alt: "Fries covered in truffle mayo and chives next to a burger" },
  { src: "/images/hero-spread.avif", caption: "The full spread", alt: "Top-down spread of burgers and loaded fries on an orange table" },
];

/** "https://www.instagram.com/smash_eat_burgers/" → "@smash_eat_burgers" */
function instagramHandle(url: string): string {
  const handle = new URL(url).pathname.split("/").filter(Boolean)[0];
  return handle ? `@${handle}` : "Instagram";
}

export function Gallery({
  images,
  businessInfo,
}: {
  images: (GalleryImage & { url: string })[];
  businessInfo: BusinessInfo | null;
}) {
  const photos: Photo[] = FALLBACK_PHOTOS.map((fallback, i) => {
    const uploaded = images[i];
    return uploaded
      ? { src: uploaded.url, alt: uploaded.alt_text ?? fallback.alt, caption: uploaded.alt_text ?? fallback.caption }
      : fallback;
  });
  const instagram = businessInfo?.instagram_url ?? null;

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="bg-char py-20 text-cream lg:py-28">
      <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="gallery-title" copy={sectionCopy.gallery} tone="dark" />
          {instagram && (
            <a
              data-reveal
              href={instagram}
              target="_blank"
              rel="noopener"
              className="flex h-11 items-center gap-2 rounded-lg bg-flame px-5 font-label text-sm font-bold tracking-[0.06em] text-white uppercase shadow-[0_4px_0_rgb(0_0_0/0.4)] transition active:translate-y-0.5 active:shadow-none"
            >
              <Camera className="size-4" />
              Follow {instagramHandle(instagram)}
            </a>
          )}
        </div>

        <ul data-reveal-group className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-5">
          {photos.map((photo, i) => (
            <li key={photo.src} data-reveal>
              <button
                type="button"
                data-photo-index={i}
                aria-label={`Open photo: ${photo.caption}`}
                className="group relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-2xl bg-char-muted lg:aspect-[4/3]"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-char/85 to-transparent px-4 pt-10 pb-3 text-left font-label text-xs font-bold tracking-[0.06em] text-white uppercase opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                  {photo.caption}
                </span>
              </button>
            </li>
          ))}

          {instagram && (
            <li data-reveal>
              <a
                href={instagram}
                target="_blank"
                rel="noopener"
                className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 sm:gap-3 sm:p-6 text-center transition-colors hover:border-flame lg:aspect-[4/3]"
              >
                <span className="grid size-11 place-items-center rounded-full bg-flame text-white sm:size-14">
                  <Camera className="size-6" />
                </span>
                <strong className="font-headline text-2xl leading-none tracking-[0.02em] sm:text-3xl">
                  Follow along on Instagram
                </strong>
                <span className="hidden max-w-[16rem] text-sm text-cream/65 sm:block">
                  Specials, drops and late-night menu news
                </span>
                <span className="flex items-center gap-1 font-label text-xs font-bold tracking-[0.08em] text-flame uppercase">
                  {instagramHandle(instagram)} <ArrowRight className="size-3.5" />
                </span>
              </a>
            </li>
          )}
        </ul>
      </div>

      <Lightbox photos={photos} />
    </section>
  );
}
