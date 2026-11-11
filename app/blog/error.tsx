"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Blog error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-3xl text-red-600 dark:bg-red-950/50 dark:text-red-400 mb-4 shadow-lg shadow-red-500/10">
        📰
      </div>
      <h2 className="text-2xl font-black text-gray-900 dark:text-white">
        មានបញ្ហាក្នុងការផ្ទុកអត្ថបទប្លក់
      </h2>
      <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
        {error?.message || "សូមអភ័យទោស មិនអាចផ្ទុកទិន្នន័យអត្ថបទបានទេ។ សូមព្យាយាមម្តងទៀត។"}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="cursor-pointer rounded-2xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-red-600/25 transition hover:bg-red-700 active:scale-95"
        >
          🔄 ព្យាយាមម្តងទៀត (Retry)
        </button>
        <Link
          href="/blog"
          className="rounded-2xl border border-gray-300 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          📰 ត្រឡប់ទៅបញ្ជីប្លក់
        </Link>
      </div>
    </div>
  );
}
