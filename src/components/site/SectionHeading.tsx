export function SectionHeading({
  id,
  copy,
  tone = "light",
  className = "",
}: {
  id: string;
  copy: { eyebrow: string; lead: string; emphasis: string };
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div data-reveal className={className}>
      <p
        className={`font-label text-sm font-bold tracking-[0.08em] uppercase ${
          dark ? "text-flame" : "text-flame-ink"
        }`}
      >
        {copy.eyebrow}
      </p>
      <h2
        id={id}
        className={`mt-2 font-headline text-[2.6rem] leading-none tracking-[0.03em] uppercase sm:text-6xl ${
          dark ? "text-cream" : "text-char"
        }`}
      >
        {copy.lead}{" "}
        <span className={`inline-block -skew-x-6 ${dark ? "text-flame" : "text-flame-ink"}`}>
          {copy.emphasis}
        </span>
      </h2>
    </div>
  );
}
