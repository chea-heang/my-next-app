"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, openLoginModal, logout } = useAuth();
  const { language: lang, toggleLanguage } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 bg-white/80 dark:border-gray-800/80 dark:bg-gray-950/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-black tracking-tight text-gray-900 dark:text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr from-red-600 to-rose-500 text-lg text-white shadow-md shadow-red-500/25">
            🕷️
          </span>
          <span>
            Vea<span className="text-red-600 dark:text-red-500">sna</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600 dark:text-gray-300">
          <Link
            href="/#cinemas"
            className="transition hover:text-red-500 text-red-600 dark:text-red-400"
          >
            {lang === "KH" ? "📍 ទីតាំងរោងកុន" : "📍 Cinemas"}
          </Link>
          <Link href="/#heroes" className="transition hover:text-red-500">
            {lang === "KH" ? "ភាពយន្ត" : "Movies"}
          </Link>
          <Link href="/blog" className="transition hover:text-red-500">
            {lang === "KH" ? "ព័ត៌មាន (Blog)" : "Blog"}
          </Link>
          {user?.role === "admin" && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-xl bg-purple-500/10 px-3 py-1.5 text-xs font-black text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 ring-1 ring-purple-500/30 hover:bg-purple-500/20 transition"
            >
              <span>👑</span>
              <span>{lang === "KH" ? "ផ្ទាំង Admin" : "Admin Portal"}</span>
            </Link>
          )}
        </nav>

        {/* Actions (Language + Theme + Auth + CTA) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={toggleLanguage}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
            title={lang === "KH" ? "Switch to English" : "ប្តូរទៅភាសាខ្មែរ"}
          >
            {lang === "KH" ? "KH" : "EN"}
          </button>
          <ThemeToggle />

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-50/60 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/50 cursor-pointer"
              >
                <img
                  src={
                    user.avatar ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                  }
                  alt={user.name}
                  className="h-5 w-5 rounded-full object-cover ring-1 ring-red-500"
                />
                <span className="max-w-20 sm:max-w-30 truncate">
                  {user.name.split(" ")[0]}
                </span>
                <span className="text-[10px]">▼</span>
              </button>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-800 dark:bg-gray-900 z-50 animate-fade-in">
                  <div className="border-b border-gray-100 px-3 py-2 dark:border-gray-800">
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                    <span className="mt-1 inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                      ⭐ {user.memberPoints || 350} ពិន្ទុ VIP
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition"
                    >
                      <span>📊</span>
                      <span>{lang === "KH" ? "ផ្ទាំងទូទៅ" : "Dashboard"}</span>
                    </Link>
                    <Link
                      href="/dashboard/bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition"
                    >
                      <span>🎟️</span>
                      <span>{lang === "KH" ? "សំបុត្ររបស់ខ្ញុំ" : "My Tickets"}</span>
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 transition"
                    >
                      <span>👤</span>
                      <span>{lang === "KH" ? "គណនីផ្ទាល់ខ្លួន" : "Profile"}</span>
                    </Link>

                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950/40 transition"
                      >
                        <span>👑</span>
                        <span>{lang === "KH" ? "ផ្ទាំងគ្រប់គ្រង Admin" : "Admin Portal"}</span>
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-1 dark:border-gray-800">
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition cursor-pointer"
                    >
                      <span>🚪</span>
                      <span>{lang === "KH" ? "ចាកចេញ (Logout)" : "Log Out"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openLoginModal("login")}
                className="cursor-pointer rounded-xl border border-gray-300 px-3 sm:px-3.5 py-1.5 text-xs font-bold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                {lang === "KH" ? "ចូលគណនី" : "Login"}
              </button>
              <button
                type="button"
                onClick={() => openLoginModal("register")}
                className="hidden sm:inline-block cursor-pointer rounded-xl border border-red-500/30 bg-red-50/60 px-3.5 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/40"
              >
                {lang === "KH" ? "ចុះឈ្មោះ" : "Register"}
              </button>
            </div>
          )}

          <Link
            href="/#cinemas"
            className="rounded-xl bg-linear-to-r from-red-600 to-rose-600 px-3.5 sm:px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-600/20 transition hover:opacity-90 active:scale-95"
          >
            {lang === "KH" ? "កក់សំបុត្រ" : "Book Ticket"}
          </Link>
        </div>
      </div>
    </header>
  );
}
