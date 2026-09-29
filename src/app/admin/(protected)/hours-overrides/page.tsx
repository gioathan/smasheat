import { getUpcomingHoursOverrides } from "@/lib/data/business-info";
import { addHoursOverride, deleteHoursOverride } from "./actions";

export const dynamic = "force-dynamic";

export default async function HoursOverridesPage() {
  const overrides = await getUpcomingHoursOverrides();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink-900">Holiday hours</h1>
      <p className="mt-1 text-sm text-ink-600">
        Add a one-off closure or a different schedule for a specific date.
      </p>

      <form
        action={addHoursOverride}
        className="mt-6 flex max-w-2xl flex-wrap items-end gap-3 rounded-xl border border-ink-900/10 bg-white p-4"
      >
        <div>
          <label className="block text-xs font-medium text-ink-600">Date</label>
          <input
            type="date"
            name="date"
            required
            className="mt-1 rounded-lg border border-ink-900/15 px-2 py-1.5 text-sm"
          />
        </div>
        <label className="flex items-center gap-1.5 text-sm text-ink-600">
          <input type="checkbox" name="is_closed" defaultChecked />
          Closed all day
        </label>
        <div>
          <label className="block text-xs font-medium text-ink-600">Open</label>
          <input
            type="time"
            name="open_time"
            className="mt-1 rounded-lg border border-ink-900/15 px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-600">Close</label>
          <input
            type="time"
            name="close_time"
            className="mt-1 rounded-lg border border-ink-900/15 px-2 py-1.5 text-sm"
          />
        </div>
        <div className="flex-1 min-w-40">
          <label className="block text-xs font-medium text-ink-600">Note (optional)</label>
          <input
            name="note"
            placeholder="e.g. Closed for Easter"
            className="mt-1 w-full rounded-lg border border-ink-900/15 px-2 py-1.5 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Add
        </button>
      </form>

      <ul className="mt-6 max-w-2xl divide-y divide-ink-900/10 rounded-xl border border-ink-900/10 bg-white">
        {overrides.length === 0 && (
          <li className="px-4 py-4 text-sm text-ink-600">No upcoming overrides.</li>
        )}
        {overrides.map((o) => (
          <li key={o.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
            <span>
              <span className="font-medium text-ink-900">{o.date}</span>
              {o.note ? ` — ${o.note}` : ""} —{" "}
              {o.is_closed ? "Closed" : `${o.open_time}–${o.close_time}`}
            </span>
            <form action={deleteHoursOverride.bind(null, o.id)}>
              <button type="submit" className="font-medium text-ink-600 hover:text-red-600">
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
