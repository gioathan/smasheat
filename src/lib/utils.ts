import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(cents: number | null): string {
  if (cents == null) return "";
  return `€${(cents / 100).toFixed(2).replace(/\.00$/, "")}`;
}

export function formatPhoneHref(phone: string): string {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

/** Greek numbers read locally, without the +30 country code: "261 042 1000". */
export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/[^+\d]/g, "");
  const match = digits.match(/^(?:\+30)?(\d{3})(\d{3})(\d{4})$/);
  if (!match) return phone;
  const [, a, b, c] = match;
  return `${a} ${b} ${c}`;
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function dayName(dayOfWeek: number): string {
  return DAY_NAMES[dayOfWeek] ?? "";
}

/** 24-hour clock, as the shop lists its hours locally: "17:00 – 00:00". */
export function formatTimeRange(
  open: string | null,
  close: string | null
): string {
  if (!open || !close) return "Closed";
  return `${hhmm(open)} – ${hhmm(close)}`;
}

const SHORT_DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function shortDayName(dayOfWeek: number): string {
  return SHORT_DAY_NAMES[dayOfWeek] ?? "";
}

/** "17:00:00" → "17:00" */
export function hhmm(time: string): string {
  return time.slice(0, 5);
}
