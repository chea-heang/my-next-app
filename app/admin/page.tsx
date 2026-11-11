"use client";

import React, { useEffect, useState, useTransition } from "react";
import { AdminStats, BookingTicket, Movie, User } from "@/types";
import { adminApi } from "@/lib/api/admin";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { useToast } from "@/hooks/useToast";
import AdminSkeleton from "@/components/skeletons/AdminSkeleton";

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<BookingTicket[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("bookings");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isPending, startTransition] = useTransition();

  // Add Movie Modal state
  const [isAddMovieModalOpen, setIsAddMovieModalOpen] = useState(false);
  const [isSubmittingMovie, setIsSubmittingMovie] = useState(false);
  const [movieFormError, setMovieFormError] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newYear, setNewYear] = useState("2026");
  const [newPrice, setNewPrice] = useState("5.00");
  const [newImage, setNewImage] = useState(
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
  );
  const [newStatus, setNewStatus] = useState<"NOW_SHOWING" | "COMING_SOON">("NOW_SHOWING");

  // Confirm Delete Dialog state
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const [isDeletingMovie, setIsDeletingMovie] = useState(false);

  // Fetch admin data on mount
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [statsData, bookingsData, moviesData, usersData] = await Promise.all([
          adminApi.getStats(),
          adminApi.getBookings(),
          adminApi.getMovies(),
          adminApi.getUsers(),
        ]);

        setStats(statsData);
        setBookings(bookingsData);
        setMovies(moviesData);
        setUsers(usersData);
      } catch (err) {
        console.error("Failed to load admin data", err);
        toast.error("មិនអាចផ្ទុកទិន្នន័យ Admin បានទេ!", "សូមពិនិត្យមើលការតភ្ជាប់បណ្តាញ។");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Update booking status
  const handleStatusChange = async (
    bookingId: string,
    newStatus: "CONFIRMED" | "USED" | "CANCELLED"
  ) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );

    startTransition(async () => {
      try {
        await adminApi.updateBookingStatus(bookingId, newStatus);
        const updatedStats = await adminApi.getStats();
        setStats(updatedStats);
        toast.info(
          `បានផ្លាស់ប្តូរស្ថានភាពសំបុត្រ (${bookingId})`,
          `ស្ថានភាពបច្ចុប្បន្ន: ${newStatus}`
        );
      } catch {
        toast.error("ការកែប្រែស្ថានភាពសំបុត្របរាជ័យ!");
      }
    });
  };

  // Add new movie with validation and pending state
  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setMovieFormError("");

    if (!newTitle.trim()) {
      setMovieFormError("សូមបញ្ចូលចំណងជើងរឿង!");
      return;
    }
    const parsedPrice = parseFloat(newPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setMovieFormError("សូមបញ្ចូលតម្លៃសំបុត្រត្រឹមត្រូវ (ឧ. 5.00)");
      return;
    }

    setIsSubmittingMovie(true);
    try {
      const movieObj: Omit<Movie, "id"> = {
        title: newTitle.trim(),
        year: newYear,
        price: parsedPrice,
        image: newImage,
        genre: ["Action", "Sci-Fi"],
        rating: 9.0,
        status: newStatus,
        formats: ["2D Standard", "IMAX Laser 3D"],
      };

      const added = await adminApi.addMovie(movieObj);
      setMovies((prev) => [added, ...prev]);
      setIsAddMovieModalOpen(false);
      setNewTitle("");
      setMovieFormError("");

      // Refresh stats
      const updatedStats = await adminApi.getStats();
      setStats(updatedStats);

      toast.success(
        "បានបន្ថែមភាពយន្តថ្មីជោគជ័យ!",
        `ភាពយន្ត "${added.title}" ត្រូវបានដាក់បញ្ចូលក្នុងកាតាឡុក។`
      );
    } catch {
      setMovieFormError("ការបន្ថែមភាពយន្តបរាជ័យ!");
      toast.error("ការបន្ថែមភាពយន្តបរាជ័យ!");
    } finally {
      setIsSubmittingMovie(false);
    }
  };

  // Confirm delete movie execution
  const handleConfirmDeleteMovie = async () => {
    if (!movieToDelete) return;
    setIsDeletingMovie(true);
    try {
      await adminApi.deleteMovie(movieToDelete.id);
      setMovies((prev) => prev.filter((m) => m.id !== movieToDelete.id));
      const updatedStats = await adminApi.getStats();
      setStats(updatedStats);
      toast.success(
        "បានលុបភាពយន្តដោយជោគជ័យ!",
        `បានលុបភាពយន្ត "${movieToDelete.title}" ចេញពីប្រព័ន្ធ។`
      );
    } catch {
      toast.error("មិនអាចលុបភាពយន្តបានទេ!");
    } finally {
      setIsDeletingMovie(false);
      setMovieToDelete(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === "ALL") return true;
    return b.status === statusFilter;
  });

  if (isLoading) {
    return <AdminSkeleton />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-50 px-3 py-1 text-xs font-black uppercase text-purple-700 dark:bg-purple-950/40 dark:text-purple-300">
            <span>🛡️</span>
            <span>Admin Control Center • RBAC Verified</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mt-1.5">
            ផ្ទាំងគ្រប់គ្រងរោងភាពយន្ត (Theater Management)
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ត្រួតពិនិត្យចំណូល សំបុត្រកុន ភាពយន្តកំពុងបញ្ចាំង និងអ្នកប្រើប្រាស់ក្នុងប្រព័ន្ធ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddMovieModalOpen(true)}
            className="cursor-pointer rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-500/25 hover:opacity-95 active:scale-95 transition flex items-center gap-1.5"
          >
            <span>+</span>
            <span>បន្ថែមភាពយន្តថ្មី</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              ចំណូលសរុប (Revenue)
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-sm font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              💵
            </span>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            ${stats ? stats.totalRevenueUSD.toFixed(2) : "0.00"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            ≈ {stats ? stats.totalRevenueKHR : "0"} ៛ (KHR)
          </p>
        </div>

        {/* Total Bookings */}
        <div className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              សំបុត្រដែលបានកក់
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              🎟️
            </span>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            {stats ? stats.totalBookings : 0}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
            ✓ {stats ? stats.confirmedBookings : 0} កំពុងដំណើរការ
          </p>
        </div>

        {/* Active Movies */}
        <div className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              ភាពយន្តកំពុងបញ្ចាំង
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-sm font-bold text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
              🎬
            </span>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            {stats ? stats.activeMovies : 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            ពី Catalog សរុប {movies.length} រឿង
          </p>
        </div>

        {/* Users */}
        <div className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              សមាជិកចុះឈ្មោះ
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-sm font-bold text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              👥
            </span>
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            {stats ? stats.totalUsers : 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            សមាជិកភាព VIP & Standard
          </p>
        </div>
      </div>

      {/* Reusable Compound Tabs Navigation */}
      <Tabs
        defaultValue="bookings"
        value={activeTab}
        onValueChange={setActiveTab}
        syncWithUrl
        urlParamName="view"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-800 pb-3 gap-3">
          <TabsList ariaLabel="Admin sections">
            <TabsTrigger
              value="bookings"
              activeClassName="bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold"
            >
              🎟️ ការកក់សំបុត្រ ({bookings.length})
            </TabsTrigger>
            <TabsTrigger
              value="movies"
              activeClassName="bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold"
            >
              🎬 ភាពយន្ត ({movies.length})
            </TabsTrigger>
            <TabsTrigger
              value="users"
              activeClassName="bg-purple-600 text-white shadow-md shadow-purple-600/30 font-bold"
            >
              👥 អ្នកប្រើប្រាស់ ({users.length})
            </TabsTrigger>
          </TabsList>

          {activeTab === "bookings" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:inline">ត្រងតាម:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 outline-none"
              >
                <option value="ALL">ទាំងអស់ (All)</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="USED">USED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: Bookings Management Table */}
        <TabsContent value="bookings">
          <div className="rounded-3xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 dark:bg-gray-800/60 dark:border-gray-800 dark:text-gray-400 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">កូដសំបុត្រ (ID)</th>
                    <th className="px-5 py-3.5">ភាពយន្ត</th>
                    <th className="px-5 py-3.5">រោងកុន & សាល</th>
                    <th className="px-5 py-3.5">កៅអី</th>
                    <th className="px-5 py-3.5">តម្លៃសរុប</th>
                    <th className="px-5 py-3.5">ស្ថានភាព</th>
                    <th className="px-5 py-3.5 text-right">សកម្មភាព (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-gray-500">
                        មិនមានទិន្នន័យសំបុត្រកុនទេ
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr
                        key={b.id}
                        className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition"
                      >
                        <td className="px-5 py-3.5 font-mono font-black text-purple-600 dark:text-purple-400">
                          {b.id}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-gray-900 dark:text-white">
                          {b.movieTitle}
                        </td>
                        <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">
                          <p className="font-semibold">{b.cinemaName}</p>
                          <p className="text-[10px] text-gray-400">
                            {b.hall} • {b.date} {b.time}
                          </p>
                        </td>
                        <td className="px-5 py-3.5 font-mono">
                          {b.seats.join(", ")}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-gray-900 dark:text-white">
                          ${b.totalPriceUSD.toFixed(2)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                              b.status === "CONFIRMED"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : b.status === "USED"
                                ? "bg-gray-500/10 text-gray-600 dark:text-gray-400"
                                : "bg-red-500/10 text-red-600 dark:text-red-400"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="inline-flex gap-1">
                            {b.status !== "USED" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(b.id, "USED")}
                                title="Mark as Used"
                                className="rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 cursor-pointer"
                              >
                                ✓ ប្រើរួច
                              </button>
                            )}
                            {b.status !== "CANCELLED" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(b.id, "CANCELLED")}
                                title="Cancel Ticket"
                                className="rounded-lg bg-red-50 px-2 py-1 text-[11px] font-bold text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 cursor-pointer"
                              >
                                ✕ លុបចោល
                              </button>
                            )}
                            {b.status === "CANCELLED" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(b.id, "CONFIRMED")}
                                className="rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 cursor-pointer"
                              >
                                ស្តារឡើងវិញ
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: Movies Manager */}
        <TabsContent value="movies">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {movies.map((m) => (
              <div
                key={m.id}
                className="flex flex-col justify-between rounded-3xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden"
              >
                <div className="flex gap-4">
                  <img
                    src={m.image}
                    alt={m.title}
                    className="h-24 w-18 rounded-2xl object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                          m.status === "NOW_SHOWING"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {m.status}
                      </span>
                      <span className="text-xs font-bold text-gray-500">{m.year}</span>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-1 truncate">
                      {m.title}
                    </h4>
                    <p className="text-xs font-black text-purple-600 dark:text-purple-400 mt-1">
                      ${m.price.toFixed(2)}/កៅអី
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {m.formats.slice(0, 2).map((fmt) => (
                        <span
                          key={fmt}
                          className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[9px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        >
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <span className="text-xs text-gray-400">ID: {m.id}</span>
                  <button
                    type="button"
                    onClick={() => setMovieToDelete(m)}
                    className="cursor-pointer text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    🗑️ លុបភាពយន្ត
                  </button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* TAB 3: User Directory */}
        <TabsContent value="users">
          <div className="rounded-3xl border border-gray-200/80 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 dark:bg-gray-800/60 dark:border-gray-800 dark:text-gray-400 uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">អ្នកប្រើប្រាស់</th>
                  <th className="px-5 py-3.5">អ៊ីមែល</th>
                  <th className="px-5 py-3.5">លេខទូរស័ព្ទ</th>
                  <th className="px-5 py-3.5">តួនាទី (Role)</th>
                  <th className="px-5 py-3.5">ពិន្ទុ VIP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40">
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      <img
                        src={
                          u.avatar ||
                          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                        }
                        alt={u.name}
                        className="h-8 w-8 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                      />
                      <span className="font-bold text-gray-900 dark:text-white">
                        {u.name}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Reusable Portal Modal: Add Movie */}
      <Modal
        isOpen={isAddMovieModalOpen}
        onClose={() => setIsAddMovieModalOpen(false)}
        title="+ បន្ថែមភាពយន្តថ្មីទៅកាន់ប្រព័ន្ធ"
        description="សូមបំពេញព័ត៌មានខាងក្រោមដើម្បីដាក់បញ្ចូលភាពយន្តថ្មី"
        size="md"
      >
        {movieFormError && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-50 p-3 text-center text-xs font-bold text-red-600 dark:bg-red-950/40 dark:text-red-400">
            ⚠️ {movieFormError}
          </div>
        )}

        <form onSubmit={handleAddMovie} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              ចំណងជើងរឿង (Movie Title) *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => {
                setNewTitle(e.target.value);
                if (movieFormError) setMovieFormError("");
              }}
              placeholder="ឧ. Spider-Man 4"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                ឆ្នាំផលិត
              </label>
              <input
                type="text"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                តម្លៃ ($/កៅអី)
              </label>
              <input
                type="number"
                step="0.5"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              ស្ថានភាពភាពយន្ត
            </label>
            <select
              value={newStatus}
              onChange={(e) =>
                setNewStatus(e.target.value as "NOW_SHOWING" | "COMING_SOON")
              }
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="NOW_SHOWING">កំពុងចាក់បញ្ចាំង (NOW SHOWING)</option>
              <option value="COMING_SOON">ឆាប់ៗនេះ (COMING SOON)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              URL រូបភាព Poster
            </label>
            <input
              type="url"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              disabled={isSubmittingMovie}
              onClick={() => setIsAddMovieModalOpen(false)}
              className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 cursor-pointer"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              disabled={isSubmittingMovie}
              className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-700 shadow-md shadow-purple-600/30 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {isSubmittingMovie ? (
                <>
                  <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>កំពុងរក្សាទុក...</span>
                </>
              ) : (
                "រក្សាទុក"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Reusable ConfirmDialog for deleting movies */}
      <ConfirmDialog
        isOpen={Boolean(movieToDelete)}
        onClose={() => setMovieToDelete(null)}
        onConfirm={handleConfirmDeleteMovie}
        title="បញ្ជាក់ការលុបភាពយន្ត"
        description={`តើអ្នកពិតជាចង់លុប "${movieToDelete?.title}" ចេញពីប្រព័ន្ធមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`}
        confirmText="លុបចេញ (Delete)"
        cancelText="បោះបង់ (Cancel)"
        variant="danger"
        isLoading={isDeletingMovie}
      />
    </div>
  );
}
