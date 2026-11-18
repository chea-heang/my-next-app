import { z } from "zod";

export const movieFormSchema = z.object({
  title: z.string().trim().min(1, "សូមបញ្ចូលចំណងជើងរឿង!"),
  titleKh: z.string().optional(),
  year: z.string().trim().regex(/^\d{4}$/, "សូមបញ្ចូលឆ្នាំត្រឹមត្រូវ (ឧ. 2026)"),
  price: z.coerce.number().positive("សូមបញ្ចូលតម្លៃសំបុត្រត្រឹមត្រូវ!"),
  image: z.string().trim().url("សូមបញ្ចូលតំណភ្ជាប់រូបភាពត្រឹមត្រូវ (URL)"),
  status: z.enum(["NOW_SHOWING", "COMING_SOON", "ARCHIVED"]),
  genre: z.array(z.string()).min(1, "សូមជ្រើសរើសប្រភេទភាពយន្តយ៉ាងតិចមួយ!"),
  rating: z.coerce.number().min(1).max(10).default(9.0),
  formats: z.array(z.string()).default(["2D Standard", "IMAX Laser 3D"]),
});

export type MovieFormInput = z.input<typeof movieFormSchema>;
export type MovieFormData = z.output<typeof movieFormSchema>;
