"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "user" | "admin";
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole = "user",
  fallback,
  redirectTo,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, isAdmin, openLoginModal } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && redirectTo) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, redirectTo, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            កំពុងផ្ទៀងផ្ទាត់សិទ្ធិ (Verifying Permissions)...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="mx-auto max-w-lg p-6 sm:p-12 text-center space-y-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-3xl text-red-600 dark:bg-red-950/40 dark:text-red-400">
          🔒
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          តម្រូវឱ្យចូលគណនី (Authentication Required)
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          សូមចូលគណនីរបស់អ្នកដើម្បីចូលមើលទំព័រនេះ និងគ្រប់គ្រងសំបុត្រកុន។
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => openLoginModal("login")}
            className="cursor-pointer rounded-xl bg-linear-to-r from-red-600 to-rose-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition hover:opacity-90 active:scale-95"
          >
            ចូលគណនី (Sign In)
          </button>
          <Link
            href="/"
            className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition"
          >
            ត្រឡប់ទៅទំព័រដើម
          </Link>
        </div>
      </div>
    );
  }

  // Role insufficient
  if (requiredRole === "admin" && !isAdmin) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="mx-auto max-w-lg p-6 sm:p-12 text-center space-y-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-100 text-3xl text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
          🛡️
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          ការអនុញ្ញាតត្រូវបានបដិសេធ (Admin Privileges Required)
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          គណនីរបស់អ្នក ({user?.email}) មានសិទ្ធិជា <strong>{user?.role}</strong>។ ទំព័រនេះសម្រាប់តែ Administrator ប៉ុណ្ណោះ។
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-xl bg-linear-to-r from-red-600 to-rose-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition hover:opacity-90 active:scale-95"
          >
            ត្រឡប់ទៅ Dashboard ធម្មតា
          </Link>
          <button
            type="button"
            onClick={() => openLoginModal("login")}
            className="cursor-pointer rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition"
          >
            ប្តូរគណនី Admin
          </button>
        </div>
      </div>
    );
  }

  // Permitted
  return <>{children}</>;
}
