import { apiClient } from "./client";
import { AdminStats, BookingTicket, Movie, User } from "@/types";
import { bookingsApi } from "./bookings";
import { moviesApi } from "./movies";
import { MOCK_ADMIN_USER, MOCK_DEFAULT_USER } from "./auth";

export const adminApi = {
  /**
   * Get Admin Overview Stats
   */
  async getStats(): Promise<AdminStats> {
    try {
      const res = await apiClient.get<AdminStats>("/admin/stats");
      if (res && res.totalRevenueUSD !== undefined) {
        return res;
      }
    } catch {
      // Backend not running
    }

    // Calculate dynamic stats from local data
    const bookings = await bookingsApi.getBookings();
    const movies = await moviesApi.getMovies();

    const confirmed = bookings.filter((b) => b.status === "CONFIRMED");
    const totalUSD = bookings
      .filter((b) => b.status !== "CANCELLED")
      .reduce((sum, b) => sum + (b.totalPriceUSD || 0), 0);
    const totalKHR = (totalUSD * 4100).toLocaleString();

    return {
      totalRevenueUSD: Math.round(totalUSD * 100) / 100,
      totalRevenueKHR: totalKHR,
      totalBookings: bookings.length,
      confirmedBookings: confirmed.length,
      activeMovies: movies.filter((m) => m.status === "NOW_SHOWING").length,
      totalUsers: 1420,
    };
  },

  /**
   * Get all bookings for admin oversight
   */
  async getBookings(): Promise<BookingTicket[]> {
    return bookingsApi.getBookings();
  },

  /**
   * Update status of a booking ticket
   */
  async updateBookingStatus(
    id: string,
    status: "CONFIRMED" | "USED" | "CANCELLED"
  ): Promise<boolean> {
    try {
      await apiClient.patch(`/admin/bookings/${id}/status`, { status });
    } catch {}
    // Ensure persistence across offline/mock layer
    await bookingsApi.updateBookingStatus(id, status);
    return true;
  },

  /**
   * Get registered users for admin oversight
   */
  async getUsers(): Promise<User[]> {
    try {
      const res = await apiClient.get<User[]>("/admin/users");
      if (Array.isArray(res)) return res;
    } catch {}

    return [
      MOCK_ADMIN_USER,
      MOCK_DEFAULT_USER,
      {
        id: "usr_2",
        name: "សុខ សុភ័ក្ត្រ (Sopheak Sok)",
        email: "sopheak.sok@example.com",
        phone: "089 123 456",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        role: "user",
        memberPoints: 120,
      },
      {
        id: "usr_3",
        name: "រិទ្ធី ដារ៉ា (Dara Rithy)",
        email: "dara.rithy@example.com",
        phone: "070 888 999",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        role: "user",
        memberPoints: 210,
      },
      {
        id: "usr_4",
        name: "កែវ ពិសិដ្ឋ (Piseth Keo)",
        email: "piseth.keo@example.com",
        phone: "098 765 432",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        role: "user",
        memberPoints: 450,
      },
    ];
  },

  /**
   * Get movies for admin management
   */
  async getMovies(): Promise<Movie[]> {
    return moviesApi.getMovies();
  },

  /**
   * Add movie
   */
  async addMovie(data: Omit<Movie, "id">): Promise<Movie> {
    return moviesApi.createMovie(data);
  },

  /**
   * Delete movie
   */
  async deleteMovie(id: string): Promise<boolean> {
    return moviesApi.deleteMovie(id);
  },
};
