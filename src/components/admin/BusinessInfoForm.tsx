"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { updateBusinessInfo } from "@/app/admin/(protected)/business-info/actions";
import type { BusinessInfo } from "@/lib/data/business-info";

const fields: {
  name: keyof BusinessInfo;
  label: string;
  hint?: string;
}[] = [
  { name: "phone", label: "Phone (e.g. +302610421000)" },
  { name: "address_line", label: "Address" },
  { name: "google_maps_url", label: "Google Maps URL" },
  {
    name: "google_place_id",
    label: "Google Place ID",
    hint: "Your Google rating, review count and review links are read live from Google using this ID — nothing else to type in.",
  },
  { name: "instagram_url", label: "Instagram URL" },
  { name: "wolt_url", label: "Wolt order URL" },
  { name: "efood_url", label: "efood order URL" },
];

export function BusinessInfoForm({ businessInfo }: { businessInfo: BusinessInfo }) {
  const [state, formAction, pending] = useActionState(updateBusinessInfo, undefined);

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="text-sm font-medium text-ink-900">{field.label}</label>
          <input
            name={field.name}
            defaultValue={businessInfo[field.name] ?? ""}
            className="mt-1 w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
          />
          {field.hint && <p className="mt-1 text-xs text-ink-600">{field.hint}</p>}
        </div>
      ))}

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-700">Saved.</p>}

      <Button disabled={pending}>{pending ? "Saving…" : "Save business info"}</Button>
    </form>
  );
}
