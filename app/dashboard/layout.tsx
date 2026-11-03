"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { mockCurrentUser } from "@/lib/data";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const currentUser = user || mockCurrentUser;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navLinks = [
    { href: "/dashboard", label: "ផ្ទាំងទូទៅ (Overview)", icon: "📊" },
    { href: "/dashboard/bookings", label: "សំបុត្រកុនរបស់ខ្ញុំ (My Tickets)", icon: "🎟️" },
    { href: "/dashboard/profile", label: "ព័ត៌មានផ្ទាល់ខ្លួន (Profile)", icon: "👤" },
    { href: "/blog", label: "ព័ត៌មានភាពយន្ត (Blog)", icon: "📰" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <aside className="space-y-6 lg:col-span-1">
            {/* User Profile Card */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.avatar || mockCurrentUser.avatar}
                  alt={currentUser.name}
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-red-500/30"
                />
                <div className="min-w-0">
                  <h3 className="truncate font-bold text-gray-900 dark:text-white">
                    {currentUser.name}
                  </h3>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {currentUser.email}
                  </p>
                  <span className="mt-1.5 inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-bold text-red-600 dark:text-red-400">
                    ⭐ {currentUser.memberPoints || 350} ពិន្ទុ
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="rounded-3xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                        isActive
                          ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  );
                })}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 cursor-pointer"
                >
                  <span className="text-lg">🚪</span>
                  <span>ចាកចេញ (Log Out)</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
