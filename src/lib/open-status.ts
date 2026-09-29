import type { OpenWindow } from "@/lib/hours-summary";

export type WeeklyWindows = Record<number, OpenWindow>;
export type DateWindows = Record<string, OpenWindow>;
export type OpenStatus = { open: boolean; text: string };

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const pad = (n: number) => String(n).padStart(2, "0");
const clock = (mins: number) => `${pad(Math.floor(mins / 60) % 24)}:${pad(mins % 60)}`;
const closeLabel = (mins: number) => (mins % 1440 === 0 ? "midnight" : clock(mins));

/** Day of week, ISO date and minutes past midnight, all in Athens time. */
export function athensClock(now: Date): { day: number; date: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Athens",
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    day: SHORT_DAYS.indexOf(get("weekday")),
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

// Calendar arithmetic on an ISO date, done in UTC so DST can't skew it.
function shiftDate(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/**
 * Whether the shop is open at `now`, and the pill text to show. A holiday
 * override for a date beats the weekly hours; a window closing after 1440
 * minutes runs into the small hours of the next day.
 */
export function computeOpenStatus(
  weekly: WeeklyWindows,
  overrides: DateWindows,
  now: Date = new Date()
): OpenStatus {
  const { day, date, minutes } = athensClock(now);
  const windowOn = (dayIndex: number, iso: string): OpenWindow =>
    Object.prototype.hasOwnProperty.call(overrides, iso) ? overrides[iso] : (weekly[dayIndex] ?? null);

  const today = windowOn(day, date);
  const yesterday = windowOn((day + 6) % 7, shiftDate(date, -1));

  if (today && minutes >= today[0] && minutes < today[1]) {
    return { open: true, text: `Open now · until ${closeLabel(today[1])}` };
  }
  if (yesterday && yesterday[1] > 1440 && minutes < yesterday[1] - 1440) {
    return { open: true, text: `Open now · until ${closeLabel(yesterday[1])}` };
  }
  if (today && minutes < today[0]) {
    return { open: false, text: `Closed · opens today at ${clock(today[0])}` };
  }
  for (let k = 1; k <= 7; k++) {
    const next = windowOn((day + k) % 7, shiftDate(date, k));
    if (next) {
      const when = k === 1 ? "tomorrow" : DAY_NAMES[(day + k) % 7];
      return { open: false, text: `Closed · opens ${when} at ${clock(next[0])}` };
    }
  }
  return { open: false, text: "Temporarily closed" };
}
