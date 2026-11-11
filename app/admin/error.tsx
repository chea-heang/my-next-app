"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-100 text-3xl text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 mb-4 shadow-lg shadow-purple-500/10">
        🛡️
      </div>
      <h2 className="text-2xl font-black text-gray-900 dark:text-white">
        បញ្ហាក្នុងការផ្ទុកទិន្នន័យ Admin
      </h2>
      <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
        {error?.message || "ប្រព័ន្ធ Admin បានជួបប្រទះបញ្ហាបច្ចេកទេស។ សូមធ្វើការ Refresh ឬព្យាយាមម្តងទៀត។"}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="cursor-pointer rounded-2xl bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-purple-600/25 transition hover:bg-purple-700 active:scale-95"
        >
          🔄 ព្យាយាមម្តងទៀត (Retry)
        </button>
        <Link
          href="/admin"
          className="rounded-2xl border border-gray-300 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          👑 ត្រឡប់ទៅផ្ទាំង Admin
        </Link>
      </div>
    </div>
  );
}
