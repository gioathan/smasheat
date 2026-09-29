import { dayName } from "@/lib/utils";
import { updateBusinessHours } from "@/app/admin/(protected)/business-info/actions";
import type { BusinessHour } from "@/lib/data/business-info";

export function BusinessHoursForm({ hours }: { hours: BusinessHour[] }) {
  return (
    <form action={updateBusinessHours} className="max-w-lg space-y-3">
      {hours.map((h) => (
        <div
          key={h.id}
          className="flex flex-wrap items-center gap-3 rounded-lg border border-ink-900/10 p-3"
        >
          <span className="w-24 text-sm font-medium text-ink-900">
            {dayName(h.day_of_week)}
          </span>
          <label className="flex items-center gap-1.5 text-sm text-ink-600">
            <input
              type="checkbox"
              name={`closed_${h.day_of_week}`}
              defaultChecked={h.is_closed}
            />
            Closed
          </label>
          <input
            type="time"
            name={`open_${h.day_of_week}`}
            defaultValue={h.open_time ?? ""}
            className="rounded-lg border border-ink-900/15 px-2 py-1 text-sm"
          />
          <span className="text-ink-600">–</span>
          <input
            type="time"
            name={`close_${h.day_of_week}`}
            defaultValue={h.close_time ?? ""}
            className="rounded-lg border border-ink-900/15 px-2 py-1 text-sm"
          />
        </div>
      ))}
      <button
        type="submit"
        className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
      >
        Save hours
      </button>
    </form>
  );
}
