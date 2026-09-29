"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type Photo = { src: string; alt: string; caption: string };

/** Opens when any element with `data-photo-index` is clicked. */
export function Lightbox({ photos }: { photos: Photo[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + photos.length) % photos.length),
    [photos.length]
  );

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const trigger = (e.target as Element | null)?.closest<HTMLElement>("[data-photo-index]");
      if (!trigger) return;
      setIndex(Number(trigger.dataset.photoIndex));
      ref.current?.showModal();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (photos.length === 0) return null;
  const photo = photos[index];

  return (
    <dialog
      ref={ref}
      aria-label="Photo viewer"
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-char/90 open:grid open:place-items-center"
    >
      <figure className="grid justify-items-center gap-4 px-4 py-20">
        <img
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          className="max-h-[calc(100dvh-12rem)] max-w-[min(92vw,1100px)] animate-card-pop rounded-2xl object-contain"
        />
        <figcaption className="font-label text-sm font-bold tracking-[0.08em] text-cream uppercase">
          {photo.caption} · {index + 1} / {photos.length}
        </figcaption>
      </figure>

      <button
        type="button"
        aria-label="Close photo viewer"
        onClick={() => ref.current?.close()}
        className="fixed top-4 right-4 grid size-11 place-items-center rounded-lg bg-cream text-char hover:bg-flame hover:text-white"
      >
        <X className="size-5" />
      </button>
      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => go(-1)}
            className="fixed bottom-6 left-[calc(50%-3.5rem)] grid size-11 place-items-center rounded-lg bg-cream text-char hover:bg-flame hover:text-white sm:top-1/2 sm:bottom-auto sm:left-4 sm:-translate-y-1/2"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => go(1)}
            className="fixed right-[calc(50%-3.5rem)] bottom-6 grid size-11 place-items-center rounded-lg bg-cream text-char hover:bg-flame hover:text-white sm:top-1/2 sm:right-4 sm:bottom-auto sm:-translate-y-1/2"
          >
            <ChevronRight className="size-5" />
          </button>
        </>
      )}
    </dialog>
  );
}
