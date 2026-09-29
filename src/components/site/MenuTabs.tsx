"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export type MenuCard = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  available: boolean;
  allergen: string | null;
};

export type MenuGroup = {
  id: string;
  name: string;
  /** Categories where nothing has a price (the dips) render as chips. */
  chips: boolean;
  items: MenuCard[];
};

const ALL = "all";
/** Cards shown on phones in the "All" tab before "Show more". */
const MOBILE_PREVIEW = 5;

export function MenuTabs({
  heading,
  groups,
  dipsNote,
}: {
  heading: React.ReactNode;
  groups: MenuGroup[];
  dipsNote: string;
}) {
  const [active, setActive] = useState(ALL);
  // Cards only animate after the visitor switches tabs; on first view the
  // whole grid pops in with the rest of the section.
  const [switched, setSwitched] = useState(false);
  // On phones the "All" list is long, so it starts collapsed.
  const [expanded, setExpanded] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const tabs = [
    { id: ALL, label: "All", count: total },
    ...groups.map((g) => ({ id: g.id, label: g.name, count: g.items.length })),
  ];

  const shown = active === ALL ? groups : groups.filter((g) => g.id === active);
  const cards = shown.filter((g) => !g.chips).flatMap((g) => g.items);
  const chipGroups = shown.filter((g) => g.chips);
  const isAll = active === ALL;
  const collapsible = isAll && cards.length > MOBILE_PREVIEW;

  const select = (id: string, focusIndex?: number) => {
    setActive(id);
    setSwitched(true);
    setExpanded(false);
    if (focusIndex != null) tabRefs.current[focusIndex]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = tabs.length - 1;
    const next =
      e.key === "ArrowRight" ? (index + 1) % tabs.length
      : e.key === "ArrowLeft" ? (index - 1 + tabs.length) % tabs.length
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next == null) return;
    e.preventDefault();
    select(tabs[next].id, next);
  };

  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      {heading}
      <div
        role="tablist"
        aria-label="Menu categories"
        data-reveal
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:mx-0 lg:max-w-[60%] lg:flex-wrap lg:justify-end lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {tabs.map((tab, i) => {
          const selected = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`menu-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls="menu-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => select(tab.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`shrink-0 rounded-full border-2 px-4 py-2 font-label text-xs font-bold tracking-[0.06em] whitespace-nowrap uppercase transition-colors ${
                selected
                  ? "border-flame bg-flame text-white"
                  : "border-char/15 bg-white text-char hover:border-char"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          );
        })}
      </div>
      </div>

      <div
        ref={panelRef}
        id="menu-panel"
        role="tabpanel"
        aria-labelledby={`menu-tab-${active}`}
        data-reveal
        className="mt-10 scroll-mt-40"
      >
        {cards.length > 0 && (
          <ul key={active} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((item, i) => (
              <li
                key={item.id}
                style={switched ? { animationDelay: `${Math.min(i, 8) * 45}ms` } : undefined}
                className={`flex flex-col rounded-2xl border border-line bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-char hover:shadow-pop ${
                  switched ? "animate-card-pop" : ""
                } ${item.available ? "" : "opacity-60"} ${
                  collapsible && !expanded && i >= MOBILE_PREVIEW ? "max-md:hidden" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-headline text-3xl leading-none tracking-[0.02em] text-char">
                    {item.name}
                  </h3>
                  <span
                    className={`shrink-0 pt-1 font-label text-lg font-bold ${
                      item.available ? "text-flame-ink" : "text-char-soft"
                    }`}
                  >
                    {item.available ? item.price : "Sold out"}
                  </span>
                </div>
                {item.description && (
                  <p className="mt-3 text-sm leading-relaxed text-char-soft">{item.description}</p>
                )}
                {item.allergen && (
                  <p className="mt-auto pt-5 font-label text-xs font-bold tracking-[0.06em] text-char-muted uppercase">
                    {item.allergen}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}

        {collapsible && (
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls="menu-panel"
            onClick={() => {
              if (expanded) panelRef.current?.scrollIntoView({ behavior: "smooth" });
              setExpanded((v) => !v);
            }}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-char font-label text-sm font-bold tracking-[0.06em] text-char uppercase transition-colors active:bg-char active:text-cream md:hidden"
          >
            {expanded ? "Show less" : `Show ${cards.length - MOBILE_PREVIEW} more`}
            <ChevronDown className={`size-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}

        {chipGroups.map((group) => (
          <div
            key={`${active}-${group.id}`}
            className={`rounded-2xl bg-char p-8 text-cream ${cards.length > 0 ? "mt-5" : ""} ${
              switched ? "animate-card-pop" : ""
            } ${isAll ? "max-md:hidden" : ""}`}
          >
            <p className="font-label text-sm font-bold tracking-[0.08em] text-flame uppercase">
              {group.name}
            </p>
            <h3 className="mt-1 font-headline text-4xl leading-none tracking-[0.02em]">
              {group.items.length} house-made {group.name.toLowerCase()}
            </h3>
            <p className="mt-3 max-w-2xl text-cream/70">{dipsNote}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {group.items.map((item, i) => (
                <li
                  key={item.id}
                  className={`rounded-full px-4 py-2 font-label text-xs font-bold tracking-[0.06em] uppercase ${
                    i === group.items.length - 1 ? "bg-flame text-white" : "bg-white/10 text-cream"
                  } ${item.available ? "" : "line-through opacity-50"}`}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
