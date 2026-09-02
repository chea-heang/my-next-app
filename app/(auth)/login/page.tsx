"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockCurrentUser } from "@/lib/data";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("veasna.chan@example.com");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        // Save demo session
        localStorage.setItem("user_session", JSON.stringify(data.user));
        window.location.href = "/dashboard";
      } else {
        setError(data.message || "Email ឬ Password មិនត្រឹមត្រូវ!");
      }
    } catch (err) {
      // Fallback in case of server fetch issue
      const fallbackUser = {
        ...mockCurrentUser,
        name: email ? email.split("@")[0] : mockCurrentUser.name,
        email: email || mockCurrentUser.email,
      };
      localStorage.setItem("user_session", JSON.stringify(fallbackUser));
      window.location.href = "/dashboard";
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = () => {
    localStorage.setItem("user_session", JSON.stringify(mockCurrentUser));
    window.location.href = "/dashboard";
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-gray-200/80 bg-white/90 p-8 shadow-2xl backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/90 sm:p-10">
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-2xl text-white shadow-lg shadow-red-500/30">
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
          <div className="rounded-xl border border-red-500/20 bg-red-50 p-3.5 text-center text-sm font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              អ៊ីមែល (Email)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                ពាក្យសម្ងាត់ (Password)
              </label>
              <a href="#" className="text-xs font-semibold text-red-600 hover:underline dark:text-red-400">
                ភ្លេចលេខសម្ងាត់?
              </a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-red-600 to-rose-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
          >
            {isLoading ? "កំពុងចូល..." : "ចូលគណនី (Sign In)"}
          </button>

          <button
            type="button"
            onClick={handleQuickLogin}
            className="w-full cursor-pointer rounded-xl border border-red-500/30 bg-red-50/60 py-3 text-xs font-bold text-red-600 transition hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/50"
          >
            ⚡ ចូលភ្លាមៗដោយមិនបាច់វាយ (1-Click Test Login)
          </button>
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

