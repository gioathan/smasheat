import { marqueeItems } from "@/content/story";

/** Orange ribbon of rolling labels between the hero and the story. */
export function Ticker() {
  const run = (copy: number) => (
    <ul aria-hidden={copy > 0} className="flex shrink-0 items-center">
      {marqueeItems.map((item) => (
        <li
          key={item}
          className="flex items-center gap-8 px-8 font-label text-base font-bold tracking-[0.1em] whitespace-nowrap text-white uppercase sm:text-lg"
        >
          {item}
          <span aria-hidden="true" className="h-5 w-px bg-white/40" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="group overflow-hidden border-y-2 border-char bg-flame py-3">
      <div className="flex w-max animate-ticker group-hover:[animation-play-state:paused]">
        {run(0)}
        {run(1)}
      </div>
    </div>
  );
}
