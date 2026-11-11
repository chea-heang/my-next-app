"use client";

import React, { useEffect, useState } from "react";
import { User } from "@/types";
import { adminApi } from "@/lib/api/admin";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await adminApi.getUsers();
        setUsers(data);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin"
          className="text-xs font-bold text-purple-600 hover:underline dark:text-purple-400"
        >
          ← Admin Overview
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1">
          👥 បញ្ជីអ្នកប្រើប្រាស់ (User & Membership Management)
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          គ្រប់គ្រងតួនាទី (Role: Admin vs User) និងពិន្ទុរង្វាន់ VIP របស់សមាជិក
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-3 w-40 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-md" />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 dark:bg-gray-800/60 dark:border-gray-800 dark:text-gray-400 uppercase font-bold tracking-wider">
              <tr>
                <th className="px-5 py-3.5">អត្តសញ្ញាណ (User)</th>
                <th className="px-5 py-3.5">អ៊ីមែល</th>
                <th className="px-5 py-3.5">លេខទូរស័ព្ទ</th>
                <th className="px-5 py-3.5">តួនាទី (Role)</th>
                <th className="px-5 py-3.5">ពិន្ទុ VIP</th>
                <th className="px-5 py-3.5 text-right">ស្ថានភាពគណនី</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                  <td className="px-5 py-3.5 flex items-center gap-3">
                    <img
                      src={
                        u.avatar ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                      }
                      alt={u.name}
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                    />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{u.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{u.id}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300 font-medium">
                    {u.email}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300 font-mono">
                    {u.phone || "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                        u.role === "admin"
                          ? "bg-purple-500/15 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/30"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-amber-600 dark:text-amber-400">
                    ⭐ {u.memberPoints} ពិន្ទុ
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
