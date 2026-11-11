"use client";

import React, { useEffect, useState } from "react";
import { Movie } from "@/types";
import { adminApi } from "@/lib/api/admin";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/hooks/useToast";

export default function AdminMoviesPage() {
  const { toast } = useToast();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Add Movie Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("2026");
  const [price, setPrice] = useState("5.00");
  const [status, setStatus] = useState<"NOW_SHOWING" | "COMING_SOON">("NOW_SHOWING");
  const [image, setImage] = useState(
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
  );

  // Confirm delete dialog state
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const data = await adminApi.getMovies();
        setMovies(data);
      } catch (err) {
        toast.error("មិនអាចផ្ទុកបញ្ជីភាពយន្តបានទេ!");
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovies();
  }, []);

  const handleAddMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!title.trim()) {
      setFormError("សូមបញ្ចូលចំណងជើងរឿង!");
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError("សូមបញ្ចូលតម្លៃសំបុត្រត្រឹមត្រូវ!");
      return;
    }

    setIsSubmitting(true);
    try {
      const newMovie = await adminApi.addMovie({
        title: title.trim(),
        year,
        price: parsedPrice,
        image,
        genre: ["Action", "Sci-Fi"],
        rating: 9.0,
        status,
        formats: ["2D Standard", "IMAX Laser 3D"],
      });

      setMovies((prev) => [newMovie, ...prev]);
      setIsModalOpen(false);
      setTitle("");
      setFormError("");
      toast.success(
        "បានបន្ថែមភាពយន្តថ្មី!",
        `ភាពយន្ត "${newMovie.title}" ត្រូវបានបន្ថែមទៅក្នុងប្រព័ន្ធ។`
      );
    } catch {
      setFormError("ការបន្ថែមភាពយន្តបរាជ័យ!");
      toast.error("ការបន្ថែមភាពយន្តបរាជ័យ!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!movieToDelete) return;
    setIsDeleting(true);
    try {
      await adminApi.deleteMovie(movieToDelete.id);
      setMovies((prev) => prev.filter((m) => m.id !== movieToDelete.id));
      toast.success(
        "បានលុបភាពយន្ត!",
        `បានលុបភាពយន្ត "${movieToDelete.title}" ដោយជោគជ័យ។`
      );
    } catch {
      toast.error("មិនអាចលុបភាពយន្តនេះបានទេ!");
    } finally {
      setIsDeleting(false);
      setMovieToDelete(null);
    }
  };

  const filteredMovies = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.titleKh && m.titleKh.includes(searchTerm))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="text-xs font-bold text-purple-600 hover:underline dark:text-purple-400"
            >
              ← Admin Overview
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1">
            🎬 គ្រប់គ្រងភាពយន្ត (Movie Catalog Management)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            បន្ថែម កែប្រែ ឬលុបភាពយន្តចេញពីប្រព័ន្ធបញ្ចាំងរបស់រោងកុន
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer self-start sm:self-auto rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-600/30 hover:opacity-95 transition"
        >
          + បន្ថែមភាពយន្តថ្មី
        </button>
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ស្វែងរកចំណងជើងរឿង..."
          className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-white outline-none focus:border-purple-500"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex gap-4">
                <Skeleton className="h-28 w-20 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-5 w-3/4 rounded-md" />
                  <Skeleton className="h-3 w-16 rounded-md" />
                  <Skeleton className="h-4 w-24 rounded-md" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between">
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMovies.map((m) => (
            <div
              key={m.id}
              className="flex flex-col justify-between rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex gap-4">
                <img
                  src={m.image}
                  alt={m.title}
                  className="h-28 w-20 rounded-2xl object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                />
                <div className="flex-1 min-w-0">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                      m.status === "NOW_SHOWING"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {m.status}
                  </span>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mt-1 truncate">
                    {m.title}
                  </h3>
                  <p className="text-xs text-gray-500">{m.year}</p>
                  <p className="text-xs font-black text-purple-600 dark:text-purple-400 mt-1">
                    ${m.price.toFixed(2)}/កៅអី
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <span className="text-[11px] font-mono text-gray-400">ID: {m.id}</span>
                <button
                  type="button"
                  onClick={() => setMovieToDelete(m)}
                  className="cursor-pointer text-xs font-bold text-red-600 hover:underline dark:text-red-400"
                >
                  🗑️ លុបភាពយន្ត
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Movie Modal using Reusable Modal Primitive */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="+ បន្ថែមភាពយន្តថ្មី"
        description="សូមបំពេញព័ត៌មានខាងក្រោមដើម្បីដាក់បញ្ចូលភាពយន្តថ្មីទៅក្នុងកាតាឡុក"
        size="md"
      >
        {formError && (
          <div className="mb-4 rounded-xl border border-red-500/20 bg-red-50 p-3 text-center text-xs font-bold text-red-600 dark:bg-red-950/40 dark:text-red-400">
            ⚠️ {formError}
          </div>
        )}

        <form onSubmit={handleAddMovie} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              ចំណងជើងរឿង *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (formError) setFormError("");
              }}
              placeholder="Spider-Man: ..."
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
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                តម្លៃ ($)
              </label>
              <input
                type="number"
                step="0.5"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              ស្ថានភាព
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "NOW_SHOWING" | "COMING_SOON")
              }
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3.5 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="NOW_SHOWING">NOW SHOWING</option>
              <option value="COMING_SOON">COMING SOON</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 cursor-pointer"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-700 shadow-md shadow-purple-600/30 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {isSubmitting ? (
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

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(movieToDelete)}
        onClose={() => setMovieToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="បញ្ជាក់ការលុបភាពយន្ត"
        description={`តើអ្នកប្រាកដជាចង់លុបភាពយន្ត "${movieToDelete?.title}" ចេញពីប្រព័ន្ធមែនទេ?`}
        confirmText="លុបភាពយន្ត (Delete)"
        cancelText="បោះបង់ (Cancel)"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
