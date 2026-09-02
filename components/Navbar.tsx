"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { User } from "@/types";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (session) {
      try {
        setCurrentUser(JSON.parse(session));
      } catch (e) {
        setCurrentUser(null);
      }
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 dark:border-gray-800/80 dark:bg-gray-950/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-black tracking-tight text-gray-900 dark:text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-lg text-white shadow-md shadow-red-500/25">
            🕷️
          </span>
          <span>
            Spider-<span className="text-red-600 dark:text-red-500">Sna</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600 dark:text-gray-300">
          <Link href="/#cinemas" className="transition hover:text-red-500 text-red-600 dark:text-red-400">
            📍 ទីតាំងរោងកុន
          </Link>
          <Link href="/#heroes" className="transition hover:text-red-500">
            ភាពយន្ត
          </Link>
          <Link href="/blog" className="transition hover:text-red-500">
            📰 Blog
          </Link>
          <Link href="/dashboard" className="transition hover:text-red-500">
            📊 Dashboard
          </Link>
        </nav>

        {/* Actions (Toggle + CTA + Login / User Info) */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {currentUser ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-50/50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400"
            >
              <span>👤 {currentUser.name.split(" ")[0]}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-xl border border-gray-300 px-3.5 py-1.5 text-xs font-bold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              ចូលគណនី
            </Link>
          )}

          <Link
            href="/#cinemas"
            className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-600/20 transition hover:opacity-90 active:scale-95"
          >
            កក់សំបុត្រ
          </Link>
        </div>
      </div>
    </header>
  );
}



