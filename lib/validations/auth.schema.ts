import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "សូមបញ្ចូលអ៊ីមែល")
    .email("ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវ"),
  password: z
    .string()
    .min(1, "សូមបញ្ចូលពាក្យសម្ងាត់")
    .min(6, "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "សូមបញ្ចូលឈ្មោះរបស់អ្នក")
      .min(2, "ឈ្មោះត្រូវមានយ៉ាងតិច ២ តួអក្សរ"),
    email: z
      .string()
      .trim()
      .min(1, "សូមបញ្ចូលអ៊ីមែល")
      .email("ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវ"),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || !val.trim() || /^\d{8,11}$/.test(val.replace(/[\s-]/g, "")),
        "លេខទូរស័ព្ទត្រូវមានពី ៨ ទៅ ១១ ខ្ទង់"
      ),
    password: z
      .string()
      .min(1, "សូមបញ្ចូលពាក្យសម្ងាត់")
      .min(6, "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ"),
    confirmPassword: z.string().min(1, "សូមបញ្ជាក់ពាក្យសម្ងាត់"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាទេ",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
