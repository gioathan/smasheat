import { z } from "zod";

export const menuItemSchema = z.object({
  category_id: z.string().uuid({ message: "Choose a category." }),
  name: z.string().trim().min(1, "Name is required."),
  description: z.string().trim().optional().or(z.literal("")),
  price_euros: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || !Number.isNaN(Number(v)), "Enter a valid price."),
  allergen_notes: z.string().trim().optional().or(z.literal("")),
  is_available: z.coerce.boolean().optional(),
});

/** Dips are listed as name-only chips, so they never take a photo. */
export function categoryAllowsPhoto(slug: string): boolean {
  return slug !== "dips";
}

export const MAX_MENU_PHOTO_BYTES = 500 * 1024;

/** Checked in the form (after the browser has shrunk the photo) and again in the action. */
export function menuPhotoError(file: FormDataEntryValue | null): string | undefined {
  if (!(file instanceof File) || file.size === 0) return undefined;
  if (!file.type.startsWith("image/")) return "The photo must be an image file.";
  if (file.size > MAX_MENU_PHOTO_BYTES) {
    const kb = Math.ceil(file.size / 1024);
    return `The photo is ${kb} KB. Menu photos must be 500 KB or smaller.`;
  }
  return undefined;
}

export type MenuItemFormValues = z.infer<typeof menuItemSchema>;
