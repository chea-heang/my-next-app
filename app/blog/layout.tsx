"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [readingProgress, setReadingProgress] = useState(0);

  const isArticleDetail = pathname.startsWith("/blog/") && pathname !== "/blog";

  // Track scroll reading progress on article pages
  useEffect(() => {
    if (!isArticleDetail) {
      setReadingProgress(0);
      return;
    }

    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(
          100,
          Math.max(0, (window.scrollY / totalHeight) * 100)
        );
        setReadingProgress(progress);
      } else {
        setReadingProgress(0);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isArticleDetail, pathname]);

  return (
    <div className="relative min-h-screen bg-gray-50/40 dark:bg-gray-950">
      {/* Reading Progress Bar (visible on article detail view) */}
      {isArticleDetail && (
        <div
          className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200/50 dark:bg-gray-800"
          aria-hidden="true"
        >
          <div
            className="h-full bg-linear-to-r from-red-600 via-rose-500 to-indigo-600 transition-all duration-150 ease-out"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      )}

      {/* Sub-header with Breadcrumbs & Blog Quick Info */}
      <div className="border-b border-gray-200/80 bg-white/80 backdrop-blur-md dark:border-gray-800/80 dark:bg-gray-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3 text-xs">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-medium text-gray-500 dark:text-gray-400">
            <Link
              href="/"
              className="hover:text-red-600 dark:hover:text-red-400 transition"
            >
              ទំព័រដើម
            </Link>
            <span>/</span>
            <Link
              href="/blog"
              className={
                isArticleDetail
                  ? "hover:text-red-600 dark:hover:text-red-400 transition"
                  : "font-bold text-gray-900 dark:text-white"
              }
            >
              ប្លក់ភាពយន្ត & បច្ចេកវិទ្យា
            </Link>
            {isArticleDetail && (
              <>
                <span>/</span>
                <span className="font-bold text-gray-900 dark:text-white truncate max-w-48 sm:max-w-xs">
                  អត្ថបទអាន
                </span>
              </>
            )}
          </nav>

          {/* Quick links */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-semibold">
            <Link
              href="/#cinemas"
              className="text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition"
            >
              🎬 រោងភាពយន្តទាំងអស់
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl bg-red-500/10 px-3 py-1 text-red-600 hover:bg-red-500/20 dark:bg-red-500/20 dark:text-red-400 transition"
            >
              🎟️ សំបុត្ររបស់ខ្ញុំ
            </Link>
          </div>
        </div>
      </div>

      {/* Blog Page Content */}
      <main className="animate-fade-in">{children}</main>
    </div>
  );
}
