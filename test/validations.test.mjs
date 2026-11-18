import test from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";

// Test schemas
const loginSchema = z.object({
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

const registerSchema = z
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

const profileSchema = z.object({
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

const movieFormSchema = z.object({
  title: z.string().trim().min(1, "សូមបញ្ចូលចំណងជើងរឿង!"),
  titleKh: z.string().optional(),
  year: z.string().trim().regex(/^\d{4}$/, "សូមបញ្ចូលឆ្នាំត្រឹមត្រូវ (ឧ. 2026)"),
  price: z.preprocess(
    (val) => (val === "" || (typeof val === "number" && isNaN(val)) ? undefined : val),
    z.coerce
      .number({ error: "សូមបញ្ចូលតម្លៃសំបុត្រត្រឹមត្រូវ!" })
      .positive("សូមបញ្ចូលតម្លៃសំបុត្រត្រឹមត្រូវ!")
  ),
  image: z.string().trim().url("សូមបញ្ចូលតំណភ្ជាប់រូបភាពត្រឹមត្រូវ (URL)"),
  status: z.enum(["NOW_SHOWING", "COMING_SOON", "ARCHIVED"]),
  genre: z.array(z.string()).min(1, "សូមជ្រើសរើសប្រភេទភាពយន្តយ៉ាងតិចមួយ!"),
  rating: z.coerce.number().min(1).max(10).default(9.0),
  formats: z.array(z.string()).default(["2D Standard", "IMAX Laser 3D"]),
});

test("loginSchema validation", async (t) => {
  await t.test("accepts valid email and password", () => {
    const res = loginSchema.safeParse({
      email: "veasna.chan@example.com",
      password: "password123",
    });
    assert.equal(res.success, true);
    assert.equal(res.data.email, "veasna.chan@example.com");
  });

  await t.test("trims whitespace from email", () => {
    const res = loginSchema.safeParse({
      email: "  veasna.chan@example.com  ",
      password: "password123",
    });
    assert.equal(res.success, true);
    assert.equal(res.data.email, "veasna.chan@example.com");
  });

  await t.test("rejects whitespace-only email with required message", () => {
    const res = loginSchema.safeParse({
      email: "   ",
      password: "password123",
    });
    assert.equal(res.success, false);
    assert.equal(res.error.issues[0].message, "សូមបញ្ចូលអ៊ីមែល");
  });

  await t.test("rejects short password with min length message", () => {
    const res = loginSchema.safeParse({
      email: "veasna@example.com",
      password: "123",
    });
    assert.equal(res.success, false);
    assert.equal(res.error.issues[0].message, "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ");
  });
});

test("registerSchema validation", async (t) => {
  await t.test("accepts valid registration without phone", () => {
    const res = registerSchema.safeParse({
      name: "Sok Veasna",
      email: "sok@example.com",
      phone: "",
      password: "password123",
      confirmPassword: "password123",
    });
    assert.equal(res.success, true);
  });

  await t.test("accepts phone with dashes and spaces", () => {
    const res = registerSchema.safeParse({
      name: "Sok Veasna",
      email: "sok@example.com",
      phone: "012-345 678",
      password: "password123",
      confirmPassword: "password123",
    });
    assert.equal(res.success, true);
  });

  await t.test("rejects whitespace-only name", () => {
    const res = registerSchema.safeParse({
      name: "   ",
      email: "sok@example.com",
      password: "password123",
      confirmPassword: "password123",
    });
    assert.equal(res.success, false);
    assert.equal(res.error.issues[0].message, "សូមបញ្ចូលឈ្មោះរបស់អ្នក");
  });

  await t.test("rejects mismatched passwords with path confirmPassword", () => {
    const res = registerSchema.safeParse({
      name: "Sok Veasna",
      email: "sok@example.com",
      password: "password123",
      confirmPassword: "differentPassword",
    });
    assert.equal(res.success, false);
    assert.equal(res.error.issues[0].path[0], "confirmPassword");
    assert.equal(res.error.issues[0].message, "ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាទេ");
  });
});

test("movieFormSchema validation", async (t) => {
  const baseMovie = {
    title: "Avatar: Fire and Ash",
    year: "2026",
    price: 5.5,
    image: "https://example.com/avatar.jpg",
    status: "NOW_SHOWING",
    genre: ["Action", "Sci-Fi"],
  };

  await t.test("accepts valid movie and applies default rating and formats", () => {
    const res = movieFormSchema.safeParse(baseMovie);
    assert.equal(res.success, true);
    assert.equal(res.data.rating, 9.0);
    assert.deepEqual(res.data.formats, ["2D Standard", "IMAX Laser 3D"]);
  });

  await t.test("coerces string price and rating", () => {
    const res = movieFormSchema.safeParse({
      ...baseMovie,
      price: "6.5",
      rating: "8.5",
    });
    assert.equal(res.success, true);
    assert.equal(res.data.price, 6.5);
    assert.equal(res.data.rating, 8.5);
  });

  await t.test("rejects NaN or empty price with localized Khmer error", () => {
    const emptyRes = movieFormSchema.safeParse({ ...baseMovie, price: "" });
    assert.equal(emptyRes.success, false);
    assert.equal(emptyRes.error.issues[0].message, "សូមបញ្ចូលតម្លៃសំបុត្រត្រឹមត្រូវ!");

    const nanRes = movieFormSchema.safeParse({ ...baseMovie, price: NaN });
    assert.equal(nanRes.success, false);
    assert.equal(nanRes.error.issues[0].message, "សូមបញ្ចូលតម្លៃសំបុត្រត្រឹមត្រូវ!");
  });

  await t.test("rejects non-positive price", () => {
    const zeroRes = movieFormSchema.safeParse({ ...baseMovie, price: 0 });
    assert.equal(zeroRes.success, false);
    assert.equal(zeroRes.error.issues[0].message, "សូមបញ្ចូលតម្លៃសំបុត្រត្រឹមត្រូវ!");

    const negRes = movieFormSchema.safeParse({ ...baseMovie, price: -5 });
    assert.equal(negRes.success, false);
    assert.equal(negRes.error.issues[0].message, "សូមបញ្ចូលតម្លៃសំបុត្រត្រឹមត្រូវ!");
  });

  await t.test("rejects invalid year format", () => {
    const res = movieFormSchema.safeParse({ ...baseMovie, year: "26" });
    assert.equal(res.success, false);
    assert.equal(res.error.issues[0].message, "សូមបញ្ចូលឆ្នាំត្រឹមត្រូវ (ឧ. 2026)");
  });

  await t.test("rejects empty genre list", () => {
    const res = movieFormSchema.safeParse({ ...baseMovie, genre: [] });
    assert.equal(res.success, false);
    assert.equal(res.error.issues[0].message, "សូមជ្រើសរើសប្រភេទភាពយន្តយ៉ាងតិចមួយ!");
  });
});
