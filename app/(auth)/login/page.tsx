"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const { toast } = useToast();

  const { login, quickLogin, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("veasna.chan@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      router.push(callbackUrl);
    }
  }, [isAuthenticated, router, callbackUrl]);

  const validateField = (field: string, value: string): string => {
    if (field === "email") {
      if (!value.trim()) return "សូមបញ្ចូលអ៊ីមែល";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "ទម្រង់អ៊ីមែលមិនត្រឹមត្រូវ";
      }
    }
    if (field === "password") {
      if (!value) return "សូមបញ្ចូលពាក្យសម្ងាត់";
      if (value.length < 6) return "ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ";
    }
    return "";
  };

  const handleBlur = (field: string, val: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, val);
    setFieldErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const emailErr = validateField("email", email);
    const passErr = validateField("password", password);
    setFieldErrors({ email: emailErr, password: passErr });
    setTouched({ email: true, password: true });

    if (emailErr || passErr) return;

    setIsLoading(true);
    setError("");

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      router.push(callbackUrl);
    } else {
      setError(res.message || "Email ឬ Password មិនត្រឹមត្រូវ!");
    }
  };

  const handleQuickLogin = async (role: "user" | "admin" = "user") => {
    setIsLoading(true);
    setError("");
    await quickLogin(role);
    setIsLoading(false);
    router.push(callbackUrl);
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-gray-200/80 bg-white/90 p-8 shadow-2xl backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/90 sm:p-10">
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-tr from-red-600 to-rose-500 text-2xl text-white shadow-lg shadow-red-500/30">
            🕷️
          </div>
          <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            ចូលគណនី (Login)
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            គ្រប់គ្រងសំបុត្រកុន និងពិន្ទុរង្វាន់របស់អ្នក
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-50 p-3.5 text-center text-sm font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400 animate-shake">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              អ៊ីមែល (Email) *
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
              className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none transition dark:text-white dark:focus:bg-gray-900 ${
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
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                ពាក្យសម្ងាត់ (Password) *
              </label>
              <button
                type="button"
                onClick={() =>
                  toast.info(
                    "ព័ត៌មានគណនីសាកល្បង",
                    "សូមប្រើ '1-Click User Login' ឬ 'Admin Login' សម្រាប់សាកល្បង!"
                  )
                }
                className="text-xs font-semibold text-red-600 hover:underline dark:text-red-400 cursor-pointer"
              >
                ភ្លេចលេខសម្ងាត់?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
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
                placeholder="••••••••"
                className={`w-full rounded-xl border px-4 py-3 pr-10 text-sm text-gray-900 outline-none transition dark:text-white dark:focus:bg-gray-900 ${
                  fieldErrors.password
                    ? "border-red-500 bg-red-50/50"
                    : "border-gray-300 bg-gray-50 focus:border-red-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm cursor-pointer"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-red-500">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer rounded-xl bg-linear-to-r from-red-600 to-rose-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition hover:opacity-95 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>កំពុងចូល...</span>
              </>
            ) : (
              "ចូលគណនី (Sign In)"
            )}
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickLogin("user")}
              className="cursor-pointer rounded-xl border border-red-500/30 bg-red-50/60 py-2.5 px-2 text-xs font-bold text-red-600 transition hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/50"
            >
              ⚡ User Quick Login
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleQuickLogin("admin")}
              className="cursor-pointer rounded-xl border border-purple-500/30 bg-purple-50/60 py-2.5 px-2 text-xs font-bold text-purple-700 transition hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:hover:bg-purple-900/50"
            >
              👑 Admin Quick Login
            </button>
          </div>
        </form>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-800" />
          </div>
          <span className="relative bg-white px-4 text-xs font-bold uppercase text-gray-400 dark:bg-gray-900">
            ឬ
          </span>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          មិនទាន់មានគណនីមែនទេ?{" "}
          <Link
            href="/register"
            className="font-bold text-red-600 hover:underline dark:text-red-400"
          >
            ចុះឈ្មោះឥឡូវនេះ
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[85vh] items-center justify-center">
          <div className="h-8 w-8 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
