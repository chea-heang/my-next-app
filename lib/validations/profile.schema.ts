import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "សូមបញ្ចូលឈ្មោះរបស់អ្នក")
    .min(2, "ឈ្មោះត្រូវមានយ៉ាងតិច ២ តួអក្សរ"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || !val.trim() || /^\d{8,11}$/.test(val.replace(/[\s-]/g, "")),
      "លេខទូរស័ព្ទត្រូវមានពី ៨ ទៅ ១១ ខ្ទង់"
    ),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
