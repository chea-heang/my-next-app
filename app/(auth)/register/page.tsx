"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("ពាក្យសម្ងាត់បញ្ជាក់មិនត្រូវគ្នាទេ!");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរឡើងទៅ!");
      setIsLoading(false);
      return;
    }

    const res = await register({ name, email, phone, password });
    setIsLoading(false);

    if (res.success) {
      router.push("/dashboard");
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
          <div className="rounded-xl border border-red-500/20 bg-red-50 p-3.5 text-center text-sm font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              ឈ្មោះពេញ (Full Name) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ឧ. សុខ វាសនា"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              អ៊ីមែល (Email) <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              លេខទូរស័ព្ទ (Phone Number)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="012 345 678"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              ពាក្យសម្ងាត់ (Password) <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="យ៉ាងតិច ៦ តួអក្សរ"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              បញ្ជាក់ពាក្យសម្ងាត់ (Confirm Password) <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="វាយពាក្យសម្ងាត់ម្តងទៀត"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-linear-to-r from-red-600 to-rose-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition hover:opacity-95 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "កំពុងចុះឈ្មោះ..." : "បង្កើតគណនី (Sign Up)"}
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
