"use client";

import { useActionState } from "react";
import { uploadGalleryImage } from "@/app/admin/(protected)/gallery/actions";
import { Button } from "@/components/ui/Button";

export function GalleryUploader() {
  const [state, formAction, pending] = useActionState(uploadGalleryImage, undefined);

  return (
    <form
      action={formAction}
      className="flex max-w-lg flex-wrap items-end gap-3 rounded-xl border border-ink-900/10 bg-white p-4"
    >
      <div className="flex-1 min-w-40">
        <label className="block text-xs font-medium text-ink-600">Photo</label>
        <input name="image" type="file" accept="image/*" required className="mt-1 text-sm" />
      </div>
      <div className="flex-1 min-w-40">
        <label className="block text-xs font-medium text-ink-600">Alt text (optional)</label>
        <input
          name="alt_text"
          className="mt-1 w-full rounded-lg border border-ink-900/15 px-2 py-1.5 text-sm"
        />
      </div>
      <Button disabled={pending}>{pending ? "Uploading…" : "Upload"}</Button>
      {state?.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
