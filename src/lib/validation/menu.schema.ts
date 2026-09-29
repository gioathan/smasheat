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

export type MenuItemFormValues = z.infer<typeof menuItemSchema>;
