"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";
import PageTransition from "@/components/ui/PageTransition";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/admin", label: "ផ្ទាំងគ្រប់គ្រង (Overview)", icon: "📊" },
    { href: "/admin/movies", label: "គ្រប់គ្រងភាពយន្ត (Movies)", icon: "🎬" },
    { href: "/admin/bookings", label: "សំបុត្រកុន (Bookings)", icon: "🎟️" },
    { href: "/admin/users", label: "អ្នកប្រើប្រាស់ (Users)", icon: "👥" },
    { href: "/dashboard", label: "User Portal", icon: "👤" },
    { href: "/", label: "ទំព័រដើម", icon: "🏠" },
  ];

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        {/* Admin Top Navigation */}
        <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 backdrop-blur-md dark:border-gray-800/80 dark:bg-gray-900/90">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr from-purple-600 to-indigo-600 text-lg text-white shadow-md shadow-purple-500/30">
                  👑
                </span>
                <div>
                  <span className="text-base font-black tracking-tight text-gray-900 dark:text-white">
                    Cinema<span className="text-purple-600 dark:text-purple-400">Admin</span>
                  </span>
                  <span className="ml-2 rounded-md bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase">
                    RBAC Portal
                  </span>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />

              {/* Admin profile snippet */}
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-800">
                <img
                  src={
                    user?.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  }
                  alt={user?.name || "Admin"}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-purple-500"
                />
                <div className="hidden sm:block text-left text-xs">
                  <p className="font-bold text-gray-900 dark:text-white truncate max-w-32">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-purple-600 dark:text-purple-400 font-extrabold uppercase">
                    Administrator
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => logout()}
                className="cursor-pointer rounded-xl border border-red-500/30 bg-red-50/60 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/50 transition"
              >
                ចាកចេញ
              </button>
            </div>
          </div>

          {/* Admin Sub-navigation Links */}
          <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60">
            <div className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto px-4 sm:px-6 py-2">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      isActive
                        ? "bg-purple-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-200/70 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </header>

        {/* Admin Body */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
          <PageTransition>{children}</PageTransition>
        </div>
      </div>
    </ProtectedRoute>
  );
}
