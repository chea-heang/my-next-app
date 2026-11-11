"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookingTicket } from "@/types";
import { bookingsApi } from "@/lib/api/bookings";
import { Skeleton } from "@/components/ui/Skeleton";
import { StaggerList } from "@/components/ui/StaggerList";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";

export default function MyBookingsPage() {
  const [tickets, setTickets] = useState<BookingTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "CONFIRMED" | "USED">("ALL");

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await bookingsApi.getBookings();
        setTickets(data);
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === "ALL") return true;
    return ticket.status === filter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            សំបុត្រកុនរបស់ខ្ញុំ (My Bookings)
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ប្រវត្តិ និងសំបុត្រកុនដែលបានកក់ទាំងអស់
          </p>
        </div>

        {/* Filter buttons with compound Tabs primitive */}
        <Tabs
          defaultValue="ALL"
          value={filter}
          onValueChange={(val) => setFilter(val as "ALL" | "CONFIRMED" | "USED")}
          className="w-auto"
        >
          <TabsList ariaLabel="Filter tickets">
            <TabsTrigger
              value="ALL"
              activeClassName="bg-red-600 text-white shadow-sm font-bold"
            >
              ទាំងអស់
            </TabsTrigger>
            <TabsTrigger
              value="CONFIRMED"
              activeClassName="bg-red-600 text-white shadow-sm font-bold"
            >
              កំពុងរង់ចាំ
            </TabsTrigger>
            <TabsTrigger
              value="USED"
              activeClassName="bg-red-600 text-white shadow-sm font-bold"
            >
              បានប្រើប្រាស់
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-6 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-3 flex-1">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-24 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                </div>
                <Skeleton className="h-6 w-2/3 rounded-lg" />
                <Skeleton className="h-4 w-1/3 rounded-md" />
                <div className="flex gap-4 pt-2">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="h-4 w-24 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-24 w-24 rounded-lg" />
            </div>
          ))}
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="py-16 text-center rounded-3xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500">មិនមានសំបុត្រកុនក្នុងបញ្ជីនេះទេ។</p>
          <Link
            href="/#cinemas"
            className="mt-4 inline-block rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-red-700 transition"
          >
            កក់សំបុត្រឥឡូវនេះ
          </Link>
        </div>
      ) : (
        <StaggerList staggerDelay={60} className="space-y-4">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="flex flex-col gap-6 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${
                      ticket.status === "CONFIRMED"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    ● {ticket.status === "CONFIRMED" ? "អាចប្រើបាន (Active)" : "បានទស្សនារួច (Used)"}
                  </span>
                  <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600 dark:bg-red-950/40 dark:text-red-400">
                    {ticket.format}
                  </span>
                </div>

                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  {ticket.movieTitle}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  📍 {ticket.cinemaName}
                </p>

                <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                  <span>📅 កាលបរិច្ឆេទ: <strong className="text-gray-900 dark:text-white">{ticket.date}</strong></span>
                  <span>⏰ ម៉ោង: <strong className="text-gray-900 dark:text-white">{ticket.time}</strong></span>
                  <span>💺 កៅអី: <strong className="text-red-600 dark:text-red-400">{ticket.seats.join(", ")}</strong></span>
                  <span>💵 តម្លៃ: <strong className="text-gray-900 dark:text-white">${ticket.totalPriceUSD} ({ticket.totalPriceKHR} ៛)</strong></span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 border-t pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 border-gray-100 dark:border-gray-800">
                <img
                  src={ticket.qrCode}
                  alt="Ticket QR"
                  className="h-24 w-24 rounded-lg bg-gray-50 p-1"
                />
                <span className="font-mono text-xs font-bold text-gray-500">
                  {ticket.id}
                </span>
              </div>
            </div>
          ))}
        </StaggerList>
      )}
    </div>
  );
}
