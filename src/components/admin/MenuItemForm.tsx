"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import type { MenuFormState } from "@/app/admin/(protected)/menu/actions";
import type { Category, MenuItem } from "@/lib/data/menu";
import { shrinkImageField } from "@/lib/shrink-image";
import { categoryAllowsPhoto, menuPhotoError } from "@/lib/validation/menu.schema";

export function MenuItemForm({
  category,
  item,
  action,
  submitLabel,
}: {
  /** Fixed: an item is added to a category and never moves. */
  category: Category;
  item?: MenuItem;
  action: (state: MenuFormState, formData: FormData) => Promise<MenuFormState>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(
    async (prevState: MenuFormState, formData: FormData) => {
      // Menu photos are small on the page, so shrink harder than the gallery.
      await shrinkImageField(formData, "image", 1200);
      const photoError = menuPhotoError(formData.get("image"));
      if (photoError) return { error: photoError };
      return action(prevState, formData);
    },
    undefined
  );

  const allowsPhoto = categoryAllowsPhoto(category.slug);

  return (
    <form action={formAction} className="max-w-lg space-y-4">
      <div>
        <span className="text-sm font-medium text-ink-900">Category</span>
        <p className="mt-1 text-sm text-ink-600">{category.name}</p>
        <input type="hidden" name="category_id" value={category.id} />
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

      {allowsPhoto && (
        <div>
          <label className="text-sm font-medium text-ink-900">Photo (optional)</label>
          {item?.image_url && (
            <div className="mt-2 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url}
                alt=""
                className="size-24 rounded-lg border border-ink-900/10 object-cover"
              />
              <div className="space-y-1.5 text-xs text-ink-600">
                <p>Current photo. Choose a new file below to replace it.</p>
                <label className="flex items-center gap-1.5 font-medium text-ink-900">
                  <input type="checkbox" name="remove_image" />
                  Remove photo
                </label>
              </div>
            </div>
          )}
          <input
            name="image"
            type="file"
            accept="image/*"
            aria-describedby="menu-photo-hint"
            className="mt-1 block w-full min-w-0 cursor-pointer text-sm text-ink-600 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-ink-900/5 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-900 hover:file:bg-ink-900/10"
          />
          <p id="menu-photo-hint" className="mt-1 text-xs text-ink-600">
            Max 500 KB. Large photos are shrunk automatically before upload.
          </p>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm font-medium text-ink-900">
        <input
          type="checkbox"
          name="is_available"
          defaultChecked={item?.is_available ?? true}
        />
        Available
      </label>

      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}

      <Button disabled={pending}>{pending ? "Saving…" : submitLabel}</Button>
    </form>
  );
}
