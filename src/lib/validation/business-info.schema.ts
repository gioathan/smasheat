import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine((v) => !v || /^https?:\/\//.test(v), "Must be a full https:// URL.");

export const businessInfoSchema = z.object({
  phone: z.string().trim().min(6, "Enter a valid phone number."),
  address_line: z.string().trim().min(1, "Address is required."),
  google_maps_url: z.string().trim().url("Must be a full URL."),
  google_place_id: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || /^[A-Za-z0-9_-]{10,}$/.test(v),
      "That doesn't look like a Google Place ID (it usually starts with ChIJ)."
    ),
  instagram_url: optionalUrl,
  wolt_url: optionalUrl,
  efood_url: optionalUrl,
});
