import { ArrowRight, Phone } from "lucide-react";
import { formatPhoneDisplay, formatPhoneHref } from "@/lib/utils";

/** Mobile-only bar pinned to the bottom once the hero has scrolled away. */
export function OrderBar({ phone }: { phone: string }) {
  return (
    <div
      id="order-bar"
      className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 grid translate-y-[calc(100%+2rem)] grid-cols-[1fr_1.3fr] gap-2 rounded-xl bg-char/95 p-1.5 shadow-float backdrop-blur-md transition-transform duration-500 data-[visible]:translate-y-0 lg:hidden"
    >
      <a
        href={formatPhoneHref(phone)}
        className="flex h-12 items-center justify-center gap-2 rounded-lg font-label text-sm font-bold tracking-[0.04em] text-cream"
      >
        <Phone className="size-4 text-flame" />
        {formatPhoneDisplay(phone)}
      </a>
      <button
        type="button"
        data-order-trigger
        className="flex h-12 items-center justify-center gap-2 rounded-lg bg-flame font-label text-sm font-bold tracking-[0.06em] text-white uppercase"
      >
        Order now <ArrowRight className="size-4" />
      </button>
    </div>
  );
}
