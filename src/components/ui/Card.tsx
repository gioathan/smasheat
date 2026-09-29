import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
