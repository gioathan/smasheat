"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import type { MenuFormState } from "@/app/admin/(protected)/menu/actions";
import type { Category, MenuItem } from "@/lib/data/menu";

export function MenuItemForm({
  categories,
  item,
  defaultCategoryId,
  action,
  submitLabel,
}: {
  categories: Category[];
  item?: MenuItem;
  defaultCategoryId?: string;
  action: (state: MenuFormState, formData: FormData) => Promise<MenuFormState>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <div>
        <label className="text-sm font-medium text-ink-900">Category</label>
        <select
          name="category_id"
          defaultValue={item?.category_id ?? defaultCategoryId}
          required
          className="mt-1 w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-ink-900">Name</label>
        <input
          name="name"
          defaultValue={item?.name}
          required
          className="mt-1 w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink-900">Description</label>
        <textarea
          name="description"
          defaultValue={item?.description ?? ""}
          rows={3}
          className="mt-1 w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink-900">Price (€, optional)</label>
        <input
          name="price_euros"
          type="number"
          step="0.01"
          min="0"
          defaultValue={item?.price_cents != null ? item.price_cents / 100 : ""}
          className="mt-1 w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink-900">Allergen notes</label>
        <input
          name="allergen_notes"
          defaultValue={item?.allergen_notes ?? ""}
          className="mt-1 w-full rounded-lg border border-ink-900/15 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink-900">Photo (optional)</label>
        <input
          name="image"
          type="file"
          accept="image/*"
          className="mt-1 w-full text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-ink-900">
        <input
          type="checkbox"
          name="is_available"
          defaultChecked={item?.is_available ?? true}
        />
        Available
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button disabled={pending}>{pending ? "Saving…" : submitLabel}</Button>
    </form>
  );
}
