"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const { register, isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      router.push(callbackUrl);
    }
  }, [isAuthenticated, router, callbackUrl]);

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "name":
        if (!value.trim()) return "សូមបញ្ចូលឈ្មោះរបស់អ្នក";
        if (value.trim().length < 2) return "ឈ្មោះត្រូវមានយ៉ាងតិច ២ តួអក្សរ";
        return "";
      case "email":
        if (!value.trim()) return "សូមបញ្ចូលអ៊ីមែល";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវ";
        }
        return "";
      case "phone":
        if (value.trim()) {
          const cleaned = value.replace(/[\s-]/g, "");
          if (!/^\d{8,11}$/.test(cleaned)) {
            return "លេខទូរស័ព្ទត្រូវមានពី ៨ ទៅ ១១ ខ្ទង់";
          }
        }
        return "";
      case "password":
        if (!value) return "សូមបញ្ចូលពាក្យសម្ងាត់";
        if (value.length < 6) return "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ";
        return "";
      case "confirmPassword":
        if (!value) return "សូមបញ្ជាក់ពាក្យសម្ងាត់";
        if (value !== password) return "ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាទេ";
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (field: string, val: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, val);
    setFieldErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {
      name: validateField("name", name),
      email: validateField("email", email),
      phone: validateField("phone", phone),
      password: validateField("password", password),
      confirmPassword: validateField("confirmPassword", confirmPassword),
    };

    setFieldErrors(errors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.values(errors).some(Boolean)) return;

    setIsLoading(true);
    setError("");

    const res = await register({ name, email, phone, password });
    setIsLoading(false);

    if (res.success) {
      router.push(callbackUrl);
    } else {
      setError(res.message || "ការចុះឈ្មោះមិនបានសម្រេច");
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-7 rounded-3xl border border-gray-200/80 bg-white/90 p-8 shadow-2xl backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/90 sm:p-10">
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-tr from-red-600 to-rose-500 text-2xl text-white shadow-lg shadow-red-500/30">
            ✨
          </div>
          <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            បង្កើតគណនី (Register)
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ចុះឈ្មោះដើម្បីទទួលបាន 50 ពិន្ទុរង្វាន់សម្រាប់ការកក់សំបុត្រ!
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-50 p-3.5 text-center text-sm font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400 animate-shake">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              ឈ្មោះពេញ (Full Name) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (touched.name) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    name: validateField("name", e.target.value),
                  }));
                }
              }}
              onBlur={() => handleBlur("name", name)}
              placeholder="ឧ. សុខ វាសនា"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 outline-none transition dark:text-white dark:focus:bg-gray-900 ${
                fieldErrors.name
                  ? "border-red-500 bg-red-50/50"
                  : "border-gray-300 bg-gray-50 focus:border-red-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800"
              }`}
            />
            {fieldErrors.name && (
              <p className="text-xs text-red-500">{fieldErrors.name}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              អ៊ីមែល (Email) <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched.email) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    email: validateField("email", e.target.value),
                  }));
                }
              }}
              onBlur={() => handleBlur("email", email)}
              placeholder="name@example.com"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 outline-none transition dark:text-white dark:focus:bg-gray-900 ${
                fieldErrors.email
                  ? "border-red-500 bg-red-50/50"
                  : "border-gray-300 bg-gray-50 focus:border-red-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800"
              }`}
            />
            {fieldErrors.email && (
              <p className="text-xs text-red-500">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              លេខទូរស័ព្ទ (Phone Number)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (touched.phone) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    phone: validateField("phone", e.target.value),
                  }));
                }
              }}
              onBlur={() => handleBlur("phone", phone)}
              placeholder="012 345 678"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 outline-none transition dark:text-white dark:focus:bg-gray-900 ${
                fieldErrors.phone
                  ? "border-red-500 bg-red-50/50"
                  : "border-gray-300 bg-gray-50 focus:border-red-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800"
              }`}
            />
            {fieldErrors.phone && (
              <p className="text-xs text-red-500">{fieldErrors.phone}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              ពាក្យសម្ងាត់ (Password) <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (touched.password) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    password: validateField("password", e.target.value),
                  }));
                }
              }}
              onBlur={() => handleBlur("password", password)}
              placeholder="យ៉ាងតិច ៦ តួអក្សរ"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 outline-none transition dark:text-white dark:focus:bg-gray-900 ${
                fieldErrors.password
                  ? "border-red-500 bg-red-50/50"
                  : "border-gray-300 bg-gray-50 focus:border-red-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800"
              }`}
            />
            {fieldErrors.password && (
              <p className="text-xs text-red-500">{fieldErrors.password}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              បញ្ជាក់ពាក្យសម្ងាត់ (Confirm Password) <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (touched.confirmPassword) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    confirmPassword: validateField("confirmPassword", e.target.value),
                  }));
                }
              }}
              onBlur={() => handleBlur("confirmPassword", confirmPassword)}
              placeholder="វាយពាក្យសម្ងាត់ម្តងទៀត"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 outline-none transition dark:text-white dark:focus:bg-gray-900 ${
                fieldErrors.confirmPassword
                  ? "border-red-500 bg-red-50/50"
                  : "border-gray-300 bg-gray-50 focus:border-red-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800"
              }`}
            />
            {fieldErrors.confirmPassword && (
              <p className="text-xs text-red-500">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-linear-to-r from-red-600 to-rose-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition hover:opacity-95 active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>កំពុងចុះឈ្មោះ...</span>
              </>
            ) : (
              "បង្កើតគណនី (Sign Up)"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          មានគណនីរួចហើយ?{" "}
          <Link
            href="/login"
            className="font-bold text-red-600 hover:underline dark:text-red-400"
          >
            ចូលគណនីនៅទីនេះ
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[85vh] items-center justify-center">
          <div className="h-8 w-8 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
