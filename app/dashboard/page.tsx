"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookingTicket } from "@/types";
import { bookingsApi } from "@/lib/api/bookings";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

export default function DashboardOverviewPage() {
  const [tickets, setTickets] = useState<BookingTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      try {
        const data = await bookingsApi.getBookings();
        setTickets(data);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, []);

  const confirmedTickets = tickets.filter((t) => t.status === "CONFIRMED");

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <span className="text-3xl">🎟️</span>
            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-black text-red-600 dark:bg-red-950/50 dark:text-red-400">
              សកម្ម
            </span>
          </div>
          <h4 className="mt-4 text-2xl font-black text-gray-900 dark:text-white">
            {confirmedTickets.length} សំបុត្រ
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            សំបុត្រកុនកំពុងរង់ចាំទស្សនា
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <span className="text-3xl">⭐</span>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              VIP Silver
            </span>
          </div>
          <h4 className="mt-4 text-2xl font-black text-gray-900 dark:text-white">
            350 ពិន្ទុ
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ប្តូរបាន Popcorn ឬបញ្ចុះតម្លៃ ២០%
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <span className="text-3xl">🎬</span>
            <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-black text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              ប្រវត្តិ
            </span>
          </div>
          <h4 className="mt-4 text-2xl font-black text-gray-900 dark:text-white">
            {tickets.length} ដង
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ការទស្សនារោងកុនសរុប
          </p>
        </div>
      </div>

      {/* Latest Upcoming Ticket */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-5 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              សំបុត្រដែលត្រូវទស្សនាបន្ទាប់ (Upcoming Ticket)
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              បង្ហាញ QR Code នេះនៅមាត់ទ្វាររោងកុន
            </p>
          </div>
          <Link
            href="/dashboard/bookings"
            className="text-xs font-bold text-red-600 hover:underline dark:text-red-400"
          >
            មើលទាំងអស់ →
          </Link>
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-gray-500">កំពុងផ្ទុកទិន្នន័យ...</p>
        ) : confirmedTickets.length > 0 ? (
          <div className="mt-6 flex flex-col gap-6 rounded-2xl bg-gradient-to-br from-red-600/5 via-transparent to-indigo-600/5 p-6 sm:flex-row sm:items-center sm:justify-between border border-red-500/20">
            <div className="space-y-2">
              <div className="inline-flex rounded-lg bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
                {confirmedTickets[0].format}
              </div>
              <h4 className="text-xl font-black text-gray-900 dark:text-white">
                {confirmedTickets[0].movieTitle}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                📍 {confirmedTickets[0].cinemaName}
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-500 dark:text-gray-400 pt-2">
                <span>📅 {confirmedTickets[0].date}</span>
                <span>⏰ {confirmedTickets[0].time}</span>
                <span>💺 កៅអី: {confirmedTickets[0].seats.join(", ")}</span>
                <span>🏛️ {confirmedTickets[0].hall}</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-md dark:bg-gray-800">
              <img
                src={confirmedTickets[0].qrCode}
                alt="Ticket QR"
                className="h-28 w-28 rounded-lg"
              />
              <span className="text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400">
                {confirmedTickets[0].id}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500">អ្នកមិនទាន់មានសំបុត្រកក់នៅឡើយទេ។</p>
            <Link
              href="/#cinemas"
              className="mt-4 inline-block rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-red-700"
            >
              ស្វែងរករោងកុន និងកក់សំបុត្រឥឡូវនេះ
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
