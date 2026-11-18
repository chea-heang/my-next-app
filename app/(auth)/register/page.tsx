"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/lib/validations/auth.schema";
import { useAuth } from "@/contexts/AuthContext";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const { register: registerUser, isAuthenticated } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push(callbackUrl);
    }
  }, [isAuthenticated, router, callbackUrl]);

  const onSubmit = async (data: RegisterFormData) => {
    setServerError("");
    const res = await registerUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
    });

    if (res.success) {
      router.push(callbackUrl);
    } else {
      setServerError(res.message || "ការចុះឈ្មោះមិនបានសម្រេច");
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

        {serverError && (
          <div className="rounded-xl border border-red-500/20 bg-red-50 p-3.5 text-center text-sm font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400 animate-shake">
            ⚠️ {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              ឈ្មោះពេញ (Full Name) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="ឧ. សុខ វាសនា"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 outline-none transition dark:text-white dark:focus:bg-gray-900 ${
                errors.name
                  ? "border-red-500 bg-red-50/50"
                  : "border-gray-300 bg-gray-50 focus:border-red-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              អ៊ីមែល (Email) <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="name@example.com"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 outline-none transition dark:text-white dark:focus:bg-gray-900 ${
                errors.email
                  ? "border-red-500 bg-red-50/50"
                  : "border-gray-300 bg-gray-50 focus:border-red-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              លេខទូរស័ព្ទ (Phone Number)
            </label>
            <input
              type="tel"
              {...register("phone")}
              placeholder="012 345 678"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 outline-none transition dark:text-white dark:focus:bg-gray-900 ${
                errors.phone
                  ? "border-red-500 bg-red-50/50"
                  : "border-gray-300 bg-gray-50 focus:border-red-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800"
              }`}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              ពាក្យសម្ងាត់ (Password) <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="យ៉ាងតិច ៦ តួអក្សរ"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 outline-none transition dark:text-white dark:focus:bg-gray-900 ${
                errors.password
                  ? "border-red-500 bg-red-50/50"
                  : "border-gray-300 bg-gray-50 focus:border-red-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800"
              }`}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              បញ្ជាក់ពាក្យសម្ងាត់ (Confirm Password) <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="វាយពាក្យសម្ងាត់ម្តងទៀត"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-gray-900 outline-none transition dark:text-white dark:focus:bg-gray-900 ${
                errors.confirmPassword
                  ? "border-red-500 bg-red-50/50"
                  : "border-gray-300 bg-gray-50 focus:border-red-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-linear-to-r from-red-600 to-rose-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition hover:opacity-95 active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
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
