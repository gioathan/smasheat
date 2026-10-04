"use client";

import { useActionState } from "react";
import {
  uploadGalleryImage,
  type GalleryFormState,
} from "@/app/admin/(protected)/gallery/actions";
import { shrinkImageField } from "@/lib/shrink-image";
import { Button } from "@/components/ui/Button";

export function GalleryUploader() {
  const [state, formAction, pending] = useActionState(
    async (prevState: GalleryFormState, formData: FormData) => {
      await shrinkImageField(formData);
      return uploadGalleryImage(prevState, formData);
    },
    undefined
  );

  return (
    <form
      action={formAction}
      className="grid max-w-lg gap-4 rounded-xl border border-ink-900/10 bg-white p-4 sm:grid-cols-[1fr_auto] sm:items-end"
    >
      <div className="min-w-0 sm:col-span-2">
        <label className="block text-xs font-medium text-ink-600">Photo</label>
        <input
          name="image"
          type="file"
          accept="image/*"
          required
          className="mt-1 block w-full min-w-0 cursor-pointer text-sm text-ink-600 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-ink-900/5 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-900 hover:file:bg-ink-900/10"
        />
      </div>
      <div className="min-w-0">
        <label className="block text-xs font-medium text-ink-600">Alt text (optional)</label>
        <input
          name="alt_text"
          className="mt-1 w-full rounded-lg border border-ink-900/15 px-2 py-1.5 text-sm"
        />
      </div>
      <Button disabled={pending}>{pending ? "Uploading…" : "Upload"}</Button>
      {state?.error && <p className="text-sm text-red-600 sm:col-span-2">{state.error}</p>}
    </form>
  );
}
