"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookingTicket } from "@/types";

export default function MyBookingsPage() {
  const [tickets, setTickets] = useState<BookingTicket[]>([]);
  const [filter, setFilter] = useState<"ALL" | "CONFIRMED" | "USED">("ALL");

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings");
        const json = await res.json();
        if (json.success) {
          setTickets(json.data);
        }
      } catch (e) {}
    }
    fetchBookings();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    if (filter === "ALL") return true;
    return ticket.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            សំបុត្រកុនរបស់ខ្ញុំ (My Bookings)
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ប្រវត្តិ និងសំបុត្រកុនដែលបានកក់ទាំងអស់
          </p>
        </div>

        {/* Filter buttons */}
        <div className="inline-flex rounded-2xl border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900">
          {(["ALL", "CONFIRMED", "USED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                filter === tab
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              {tab === "ALL" ? "ទាំងអស់" : tab === "CONFIRMED" ? "កំពុងរង់ចាំ" : "បានប្រើប្រាស់"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
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
      </div>
    </div>
  );
}
