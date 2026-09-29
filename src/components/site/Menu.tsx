import { ArrowRight, CircleAlert } from "lucide-react";
import { allergenDisclaimer, dipsNote, menuCta, sectionCopy } from "@/content/story";
import { formatPrice } from "@/lib/utils";
import type { Category } from "@/lib/data/menu";
import { MenuTabs, type MenuGroup } from "./MenuTabs";
import { SectionHeading } from "./SectionHeading";

export function Menu({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  const groups: MenuGroup[] = categories.map((category) => ({
    id: category.slug,
    name: category.name,
    chips: category.menu_items.every((item) => item.price_cents == null),
    items: category.menu_items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: formatPrice(item.price_cents),
      available: item.is_available,
      allergen: item.allergen_notes,
    })),
  }));

  return (
    <section id="menu" aria-labelledby="menu-title" className="bg-toast/50 py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-5 lg:px-12">
        <MenuTabs
          heading={<SectionHeading id="menu-title" copy={sectionCopy.menu} />}
          groups={groups}
          dipsNote={dipsNote}
        />
        <MenuFooter />
      </div>
    </section>
  );
}

function MenuFooter() {
  return (
    <div
      data-reveal
      className="mt-8 flex flex-col items-start gap-4 rounded-xl border border-line bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="flex items-start gap-3 text-sm text-char-soft">
        <CircleAlert className="mt-0.5 size-5 shrink-0 text-flame" />
        <span>
          <strong className="font-semibold text-char">{menuCta.heading}</strong> {allergenDisclaimer}
        </span>
      </p>
      <button
        type="button"
        data-order-trigger
        className="flex h-10 shrink-0 items-center gap-2 rounded-lg bg-char px-4 font-label text-sm font-bold tracking-[0.06em] text-cream uppercase transition hover:bg-char-muted"
      >
        Order now <ArrowRight className="size-4" />
      </button>
    </div>
  );
}
