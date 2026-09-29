import { dayName, hhmm, shortDayName } from "@/lib/utils";
import type { BusinessHour, HoursOverride } from "@/lib/data/business-info";

// Monday-first, so a Tue–Sun trading week reads as one unbroken run.
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

export type HoursRow = {
  days: string;
  time: string;
  closed: boolean;
  /** Day indexes (0 = Sunday) covered by this row, for highlighting today. */
  dayIndexes: number[];
};

/**
 * Weekly hours as table rows, Monday first, with consecutive days that
 * share the same hours merged: "Tuesday – Sunday · 17:00 – 00:00".
 */
export function groupHours(hours: BusinessHour[]): HoursRow[] {
  const rows: HoursRow[] = [];
  for (const day of WEEK_ORDER) {
    const h = hours.find((x) => x.day_of_week === day);
    if (!h) continue;
    const closed = h.is_closed || !h.open_time || !h.close_time;
    const time = closed ? "Closed" : `${hhmm(h.open_time!)} – ${hhmm(h.close_time!)}`;
    const last = rows[rows.length - 1];
    const prevDay = last?.dayIndexes[last.dayIndexes.length - 1];
    const consecutive = last && WEEK_ORDER.indexOf(day) === WEEK_ORDER.indexOf(prevDay!) + 1;
    if (last && consecutive && last.time === time) {
      last.dayIndexes.push(day);
    } else {
      rows.push({ days: "", time, closed, dayIndexes: [day] });
    }
  }
  for (const row of rows) {
    const first = dayName(row.dayIndexes[0]);
    const end = dayName(row.dayIndexes[row.dayIndexes.length - 1]);
    row.days = row.dayIndexes.length === 1 ? first : `${first} – ${end}`;
  }
  return rows;
}

/**
 * Condenses the weekly hours into the short strings the site header,
 * footer and order sheet show, e.g. "Tue–Sun · 17:00–00:00" plus
 * "Monday · Closed". Falls back to a day count when the week isn't a
 * single uniform run.
 */
export function summarizeHours(hours: BusinessHour[]): {
  open: string;
  closed: string | null;
} {
  const ordered = WEEK_ORDER.map((day) => hours.find((h) => h.day_of_week === day)).filter(
    (h): h is BusinessHour => Boolean(h)
  );

  const openDays = ordered.filter((h) => !h.is_closed && h.open_time && h.close_time);
  const closedDays = ordered.filter((h) => h.is_closed);

  const closed =
    closedDays.length === 0
      ? null
      : closedDays.length === 1
        ? `${dayName(closedDays[0].day_of_week)} · Closed`
        : `${closedDays.map((h) => shortDayName(h.day_of_week)).join(", ")} · Closed`;

  if (openDays.length === 0) return { open: "Temporarily closed", closed };

  const first = openDays[0];
  const uniformTimes = openDays.every(
    (h) => h.open_time === first.open_time && h.close_time === first.close_time
  );
  const times = `${hhmm(first.open_time!)}–${hhmm(first.close_time!)}`;

  if (!uniformTimes) return { open: `Open ${openDays.length} days a week`, closed };

  if (openDays.length === 7) return { open: `Daily · ${times}`, closed };

  // Contiguous in Monday-first order?
  const positions = openDays.map((h) => WEEK_ORDER.indexOf(h.day_of_week));
  const contiguous = positions.every((p, i) => i === 0 || p === positions[i - 1] + 1);

  const days = contiguous
    ? `${shortDayName(openDays[0].day_of_week)}–${shortDayName(openDays[openDays.length - 1].day_of_week)}`
    : openDays.map((h) => shortDayName(h.day_of_week)).join(", ");

  return { open: `${days} · ${times}`, closed };
}

/**
 * An open window as minutes since midnight: `[open, close]`, where a close
 * at or before the open time means it runs past midnight (00:00 → 1440).
 * `null` means closed all day.
 */
export type OpenWindow = [number, number] | null;

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function windowFor(
  isClosed: boolean,
  open: string | null,
  close: string | null
): OpenWindow {
  if (isClosed || !open || !close) return null;
  const openMin = toMinutes(open);
  const closeMin = toMinutes(close);
  return [openMin, closeMin <= openMin ? closeMin + 24 * 60 : closeMin];
}

/** Weekly open windows for the live status pill, keyed by day index (0 = Sunday). */
export function hoursForScript(hours: BusinessHour[]): Record<number, OpenWindow> {
  const map: Record<number, OpenWindow> = {};
  for (let day = 0; day < 7; day++) {
    const h = hours.find((x) => x.day_of_week === day);
    map[day] = h ? windowFor(h.is_closed, h.open_time, h.close_time) : null;
  }
  return map;
}

/**
 * Holiday / one-off overrides for the live status pill, keyed by ISO date
 * (`YYYY-MM-DD`). A matching date wins over the weekly hours.
 */
export function overridesForScript(overrides: HoursOverride[]): Record<string, OpenWindow> {
  const map: Record<string, OpenWindow> = {};
  for (const o of overrides) {
    map[o.date] = windowFor(o.is_closed, o.open_time, o.close_time);
  }
  return map;
}
