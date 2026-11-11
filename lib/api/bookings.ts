import { apiClient } from "./client";
import { BookingTicket } from "@/types";
import { mockTickets } from "@/lib/data";

let localTickets: BookingTicket[] = [...mockTickets];

export const bookingsApi = {
  /**
   * Get all bookings for current user / admin
   */
  async getBookings(): Promise<BookingTicket[]> {
    try {
      // 1. Try Next.js internal API route first or NestJS
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch {
      // Fallback
    }

    try {
      // 2. Try NestJS backend
      const res = await apiClient.get<BookingTicket[]>("/bookings");
      if (Array.isArray(res)) {
        return res;
      }
    } catch {
      // Fallback
    }

    return localTickets;
  },

  /**
   * Create a new booking ticket
   */
  async createBooking(
    payload: Omit<BookingTicket, "id" | "status" | "bookedAt" | "qrCode"> & {
      id?: string;
      qrCode?: string;
    }
  ): Promise<BookingTicket> {
    const newTicket: BookingTicket = {
      id: payload.id || `TCK-${Math.floor(10000 + Math.random() * 90000)}`,
      movieTitle: payload.movieTitle,
      cinemaName: payload.cinemaName,
      cinemaBrand: payload.cinemaBrand || "Legend",
      date: payload.date,
      time: payload.time,
      hall: payload.hall,
      seats: payload.seats,
      format: payload.format,
      totalPriceUSD: payload.totalPriceUSD,
      totalPriceKHR: payload.totalPriceKHR,
      qrCode:
        payload.qrCode ||
        `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TCK-${Date.now()}`,
      status: "CONFIRMED",
      bookedAt: new Date().toLocaleString(),
    };

    try {
      // Try internal route
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTicket),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch {}

    try {
      // Try NestJS
      const res = await apiClient.post<BookingTicket>("/bookings", newTicket);
      if (res && res.id) return res;
    } catch {}

    localTickets = [newTicket, ...localTickets];
    return newTicket;
  },

  /**
   * Cancel booking
   */
  async cancelBooking(id: string): Promise<boolean> {
    return this.updateBookingStatus(id, "CANCELLED");
  },

  /**
   * Update booking status
   */
  async updateBookingStatus(
    id: string,
    status: "CONFIRMED" | "USED" | "CANCELLED"
  ): Promise<boolean> {
    try {
      await apiClient.patch(`/bookings/${id}/status`, { status });
    } catch {}

    localTickets = localTickets.map((t) =>
      t.id === id ? { ...t, status } : t
    );
    return true;
  },
};
