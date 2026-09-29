"use client";

import { useSyncExternalStore } from "react";
import type { HoursRow } from "@/lib/hours-summary";
import { athensClock } from "@/lib/open-status";

const noSubscribe = () => () => {};
const todayInAthens = () => athensClock(new Date()).day;
// The server can't know the visitor's "today", so nothing is highlighted
// until the client takes over.
const noToday = () => null;

/** Weekly hours; the row covering today (Athens time) is emphasised. */
export function HoursTable({ rows, tone = "light" }: { rows: HoursRow[]; tone?: "light" | "dark" }) {
  const today = useSyncExternalStore(noSubscribe, todayInAthens, noToday);

  const dark = tone === "dark";

  return (
    <table className="w-full text-sm tabular-nums">
      <caption className="sr-only">Opening hours</caption>
      <tbody>
        {rows.map((row) => {
          const isToday = today != null && row.dayIndexes.includes(today);
          return (
            <tr
              key={row.days}
              className={
                isToday ? (dark ? "bg-white/5" : "bg-white/70") : undefined
              }
            >
              <th
                scope="row"
                className={`py-1.5 pl-2 text-left font-medium ${
                  isToday ? (dark ? "text-cream" : "font-bold text-char") : dark ? "text-cream/60" : "text-char-soft"
                }`}
              >
                {row.days}
                {isToday && (
                  <span className="ml-2 inline-block rounded bg-flame px-1.5 py-0.5 font-label text-[0.6rem] font-bold tracking-[0.08em] text-white uppercase">
                    Today
                  </span>
                )}
              </th>
              <td
                className={`py-1.5 pr-2 text-right whitespace-nowrap ${
                  row.closed
                    ? dark
                      ? "font-semibold text-red-400"
                      : "font-semibold text-red-700"
                    : isToday
                      ? dark
                        ? "font-bold text-flame"
                        : "font-bold text-char"
                      : dark
                        ? "text-cream/80"
                        : "text-char"
                }`}
              >
                {row.time}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
