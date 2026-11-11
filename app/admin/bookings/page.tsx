"use client";

import React, { useEffect, useState } from "react";
import { BookingTicket } from "@/types";
import { adminApi } from "@/lib/api/admin";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminBookingsPage() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await adminApi.getBookings();
        setBookings(data);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const handleStatusChange = async (
    id: string,
    status: "CONFIRMED" | "USED" | "CANCELLED"
  ) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    await adminApi.updateBookingStatus(id, status);
    toast.info("បានកែប្រែស្ថានភាពសំបុត្រ!", `កូដ: ${id} → ${status}`);
  };

  const filtered = bookings.filter((b) => {
    if (filter === "ALL") return true;
    return b.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="text-xs font-bold text-purple-600 hover:underline dark:text-purple-400"
          >
            ← Admin Overview
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1">
            🎟️ គ្រប់គ្រងសំបុត្រកុន (Ticket Bookings Oversight)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            ត្រួតពិនិត្យ ផ្ទៀងផ្ទាត់ ឬលុបចោលសំបុត្រកុនរបស់អតិថិជន
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 outline-none"
          >
            <option value="ALL">សំបុត្រទាំងអស់</option>
            <option value="CONFIRMED">CONFIRMED (សកម្ម)</option>
            <option value="USED">USED (ប្រើប្រាស់រួច)</option>
            <option value="CANCELLED">CANCELLED (បានបោះបង់)</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-3 w-48 rounded-md" />
              </div>
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 dark:bg-gray-800/60 dark:border-gray-800 dark:text-gray-400 uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">កូដសំបុត្រ</th>
                  <th className="px-5 py-3.5">ខ្សែភាពយន្ត</th>
                  <th className="px-5 py-3.5">រោងកុន & សាល</th>
                  <th className="px-5 py-3.5">កៅអី</th>
                  <th className="px-5 py-3.5">តម្លៃ</th>
                  <th className="px-5 py-3.5">ស្ថានភាព</th>
                  <th className="px-5 py-3.5 text-right">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                    <td className="px-5 py-3.5 font-mono font-bold text-purple-600 dark:text-purple-400">
                      {b.id}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-gray-900 dark:text-white">
                      {b.movieTitle}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">
                      {b.cinemaName} • {b.date} {b.time}
                    </td>
                    <td className="px-5 py-3.5 font-mono">{b.seats.join(", ")}</td>
                    <td className="px-5 py-3.5 font-bold">${b.totalPriceUSD.toFixed(2)}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                          b.status === "CONFIRMED"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : b.status === "USED"
                            ? "bg-gray-500/10 text-gray-600"
                            : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(b.id, "USED")}
                          className="rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 cursor-pointer"
                        >
                          ✓ Used
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(b.id, "CANCELLED")}
                          className="rounded-lg bg-red-50 px-2 py-1 text-[11px] font-bold text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 cursor-pointer"
                        >
                          ✕ Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
