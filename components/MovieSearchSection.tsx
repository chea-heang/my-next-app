"use client";

import { useState, useMemo } from "react";
import BookingModal, { BookingMovieData } from "@/components/BookingModal";
import { useLanguage } from "@/contexts/LanguageContext";

export interface Movie {
  id: number;
  part: string;
  year: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  villain: string;
  price: number;
  rating: string;
  formats: string[];
  keywords: string[];
}

export const movies: Movie[] = [
  {
    id: 1,
    part: "1",
    year: "2002",
    tag: "វគ្គ ១ : ដើមកំណើត",
    title: "Spider-Man 1",
    description:
      "ការកកើតជាកំពូលវីរបុរស Spider-Man ដំបូង និងការប្រយុទ្ធតទល់ជាមួយ Green Goblin ដ៏កាចសាហាវ។",
    image:
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80",
    villain: "Green Goblin",
    price: 3.5,
    rating: "8.5/10",
    formats: ["2D Standard", "VIP Lounge"],
    keywords: ["1", "១", "វគ្គ ១", "វគ្គ1", "វគ្គ១", "part 1", "tobey", "goblin", "2002", "origin"],
  },
  {
    id: 2,
    part: "2",
    year: "2004",
    tag: "វគ្គ ២ : សត្រូវដៃដែក",
    title: "Spider-Man 2",
    description:
      "ការប្រឈមមុខនឹងបិសាចដៃដែក Doctor Octopus និងការតស៊ូជួយសង្គ្រោះអ្នកដំណើរលើរថភ្លើងដ៏ល្បីល្បាញ។",
    image:
      "https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&w=800&q=80",
    villain: "Doctor Octopus (Doc Ock)",
    price: 3.5,
    rating: "9.0/10",
    formats: ["2D Digital", "Dolby Atmos"],
    keywords: ["2", "២", "វគ្គ ២", "វគ្គ2", "វគ្គ២", "part 2", "doc ock", "octopus", "2004", "train"],
  },
  {
    id: 3,
    part: "3",
    year: "2007",
    tag: "វគ្គ ៣ : ឈុតខ្មៅ Black Suit",
    title: "Spider-Man 3",
    description:
      "ការផ្លាស់ប្តូរទៅជាឈុតខ្មៅ Symbiote និងការប្រយុទ្ធធំរវាង Sandman, New Goblin និង Venom។",
    image:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    villain: "Venom, Sandman, New Goblin",
    price: 4.0,
    rating: "8.0/10",
    formats: ["2D Digital", "3D Surround"],
    keywords: ["3", "៣", "វគ្គ ៣", "វគ្គ3", "វគ្គ៣", "part 3", "black suit", "venom", "sandman", "2007"],
  },
  {
    id: 4,
    part: "4",
    year: "2012",
    tag: "វគ្គ ៤ : The Amazing",
    title: "The Amazing Spider-Man 1",
    description:
      "ដំណើរស្វែងរកការពិតពីអតីតកាលឪពុកម្តាយ និងការប្រយុទ្ធទប់ទល់នឹងបិសាច The Lizard នៅក្រុងញូវយ៉ក។",
    image:
      "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=800&q=80",
    villain: "The Lizard",
    price: 4.0,
    rating: "8.2/10",
    formats: ["3D RealD", "ScreenX"],
    keywords: ["4", "៤", "វគ្គ ៤", "វគ្គ4", "វគ្គ៤", "part 4", "amazing", "andrew", "lizard", "2012"],
  },
  {
    id: 5,
    part: "5",
    year: "2014",
    tag: "វគ្គ ៥ : កម្លាំងរន្ទះ Electro",
    title: "The Amazing Spider-Man 2",
    description:
      "ការប៉ះទង្គិចជាមួយបិសាចអគ្គិសនី Electro និងការបាត់បង់ដ៏ក្រៀមក្រំបំផុតក្នុងជីវិតរបស់ Peter Parker។",
    image:
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80",
    villain: "Electro, Green Goblin",
    price: 4.5,
    rating: "8.4/10",
    formats: ["3D RealD", "4DX Motion"],
    keywords: ["5", "៥", "វគ្គ ៥", "វគ្គ5", "វគ្គ៥", "part 5", "electro", "amazing 2", "2014", "gwen"],
  },
  {
    id: 6,
    part: "6",
    year: "2021",
    tag: "វគ្គ ៦ : ច្រកទ្វារពហុសកល",
    title: "Spider-Man: No Way Home",
    description:
      "ការជួបជុំគ្នានៃ Spider-Man ទាំង ៣ ជំនាន់ ដើម្បីទប់ទល់នឹងសត្រូវឆ្លងទ្វីបពហុសកល (Multiverse)។",
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
    villain: "Green Goblin, Doc Ock, Electro",
    price: 5.0,
    rating: "9.8/10",
    formats: ["IMAX Laser", "4DX 3D", "ScreenX", "VIP"],
    keywords: [
      "6",
      "៦",
      "វគ្គ ៦",
      "វគ្គ6",
      "វគ្គ៦",
      "part 6",
      "no way home",
      "tom holland",
      "multiverse",
      "2021",
    ],
  },
];

const khmerNumeralsMap: Record<string, string> = {
  "១": "1",
  "២": "2",
  "៣": "3",
  "៤": "4",
  "៥": "5",
  "៦": "6",
};

const filterTabs = [
  { labelKh: "ទាំងអស់ (All)", labelEn: "All", value: "all" },
  { labelKh: "វគ្គ ១ ($3.50)", labelEn: "Part 1 ($3.50)", value: "1" },
  { labelKh: "វគ្គ ២ ($3.50)", labelEn: "Part 2 ($3.50)", value: "2" },
  { labelKh: "វគ្គ ៣ ($4.00)", labelEn: "Part 3 ($4.00)", value: "3" },
  { labelKh: "វគ្គ ៤ ($4.00)", labelEn: "Part 4 ($4.00)", value: "4" },
  { labelKh: "វគ្គ ៥ ($4.50)", labelEn: "Part 5 ($4.50)", value: "5" },
  { labelKh: "វគ្គ ៦ ($5.00)", labelEn: "Part 6 ($5.00)", value: "6" },
];

export default function MovieSearchSection() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPart, setSelectedPart] = useState("all");
  const [selectedMovieForBooking, setSelectedMovieForBooking] =
    useState<BookingMovieData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesPart =
        selectedPart === "all" || movie.part === selectedPart;

      const rawQ = searchQuery.toLowerCase().trim();
      if (!rawQ) return matchesPart;

      // Map any Khmer numbers typed in search
      const normalizedQ = rawQ
        .split("")
        .map((char) => khmerNumeralsMap[char] || char)
        .join("");

      const matchesQuery =
        movie.title.toLowerCase().includes(rawQ) ||
        movie.description.toLowerCase().includes(rawQ) ||
        movie.tag.toLowerCase().includes(rawQ) ||
        movie.year.includes(rawQ) ||
        movie.villain.toLowerCase().includes(rawQ) ||
        movie.part === normalizedQ ||
        movie.keywords.some(
          (k) =>
            k.toLowerCase().includes(rawQ) ||
            k.toLowerCase().includes(normalizedQ)
        );

      return matchesPart && matchesQuery;
    });
  }, [searchQuery, selectedPart]);

  const openBooking = (movie: Movie) => {
    setSelectedMovieForBooking({
      id: movie.id,
      title: movie.title,
      part: movie.part,
      price: movie.price,
      image: movie.image,
      tag: movie.tag,
      year: movie.year,
    });
    setIsModalOpen(true);
  };

  return (
    <section id="heroes" className="py-20 bg-gray-50/50 dark:bg-gray-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center space-y-4 mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-50 px-4 py-1.5 text-xs font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
            🎬 {language === "KH" ? "តម្លៃសំបុត្រ និងកាលវិភាគបញ្ចាំង • SPIDER-MAN SAGA" : "TICKET PRICES & SHOWTIMES • SPIDER-MAN SAGA"}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            {language === "KH" ? "តម្លៃសំបុត្រ " : "Ticket Prices for "}
            <span className="bg-gradient-to-r from-red-600 via-rose-500 to-indigo-600 bg-clip-text text-transparent">Spider-Man {language === "KH" ? "វគ្គ ១ ដល់ ៦" : "Parts 1 to 6"}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 dark:text-gray-400">
            {language === "KH" ? "ជ្រើសរើសវគ្គដែលលោកអ្នកចូលចិត្ត ដើម្បីកក់សំបុត្រទស្សនានៅរោងភាពយន្តល្បីៗនៅកម្ពុជា ជាមួយតម្លៃចាប់ពី" : "Choose your favorite part to book tickets at popular cinemas in Cambodia, with prices starting from"} <strong>$3.50</strong> {language === "KH" ? "ឡើងទៅ។" : "and up."}
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="mx-auto max-w-3xl space-y-4 mb-12">
          {/* Live Search Input */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 text-lg">
              🔍
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === "KH" ? "ស្វែងរកតាមវគ្គ តម្លៃ ឬឈ្មោះបិសាច (ឧ. វគ្គ ១, $3.50, Venom, 2021)..." : "Search by part, price, or villain (e.g. Part 1, $3.50, Venom)..."}
              className="w-full rounded-2xl border border-gray-200 bg-white/90 py-3.5 pl-12 pr-12 text-sm sm:text-base text-gray-900 shadow-sm outline-none transition-all placeholder:text-gray-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 dark:border-gray-800 dark:bg-gray-900/90 dark:text-white dark:focus:border-red-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {filterTabs.map((tab) => {
              const isSelected = selectedPart === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setSelectedPart(tab.value)}
                  className={`rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-red-600 text-white shadow-md shadow-red-600/30 scale-105"
                      : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800"
                  }`}
                >
                  {language === "KH" ? tab.labelKh : tab.labelEn}
                </button>
              );
            })}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between px-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
            <span>
              {language === "KH" ? "រកឃើញ" : "Found"} <strong className="text-red-500">{filteredMovies.length}</strong> {language === "KH" ? "ខ្សែភាពយន្ត" : "movies"}
            </span>
            {(searchQuery || selectedPart !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedPart("all");
                }}
                className="text-red-600 hover:underline cursor-pointer dark:text-red-400"
              >
                {language === "KH" ? "សម្អាតការស្វែងរក (Reset)" : "Reset Search"}
              </button>
            )}
          </div>
        </div>

        {/* Movies Grid with Price Tags & Booking Action */}
        {filteredMovies.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="group relative flex flex-col rounded-3xl border border-gray-200/80 bg-white/80 dark:border-gray-800 dark:bg-gray-900/80 overflow-hidden shadow-lg hover:shadow-2xl hover:border-red-500/50 transition-all duration-300 backdrop-blur-sm"
              >
                {/* Poster Image */}
                <div className="relative h-60 w-full overflow-hidden bg-gray-950">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent" />

                  {/* Part Tag & Rating */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-md border border-white/10">
                      Part {movie.part} ({movie.year})
                    </span>
                  </div>

                  {/* Price Badge on Poster */}
                  <div className="absolute top-3 right-3">
                    <div className="rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 px-3.5 py-1.5 text-center shadow-lg shadow-red-600/40">
                      <span className="text-[10px] uppercase font-bold text-red-100 block">
                        {language === "KH" ? "តម្លៃសំបុត្រ" : "Price"}
                      </span>
                      <span className="text-sm font-black text-white">
                        ${movie.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Title & Tag on Bottom Poster */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider block">
                      {movie.tag}
                    </span>
                    <h3 className="text-xl font-black text-white drop-shadow-md">
                      {movie.title}
                    </h3>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {movie.description}
                    </p>

                    {/* Villain & Formats */}
                    <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                      <p>
                        🦹 <strong className="text-gray-700 dark:text-gray-300">{language === "KH" ? "សត្រូវ:" : "Villain:"}</strong> {movie.villain}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {movie.formats.map((f) => (
                        <span
                          key={f}
                          className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Book Button */}
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] text-gray-400 block">
                        {language === "KH" ? "តម្លៃចាប់ពី" : "Starting at"}
                      </span>
                      <div className="text-lg font-black text-red-600 dark:text-red-400">
                        ${movie.price.toFixed(2)}
                        <span className="text-xs font-normal text-gray-500 ml-1">
                          {language === "KH" ? "/កៅអី" : "/seat"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => openBooking(movie)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-600/30 transition hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      🎟️ {language === "KH" ? "កក់សំបុត្រឥឡូវនេះ" : "Book Ticket"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-md rounded-3xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-800">
            <span className="text-5xl">🕸️</span>
            <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
              {language === "KH" ? "រកមិនឃើញវគ្គដែលអ្នកចង់ស្វែងរកទេ" : "Could not find what you were looking for"}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {language === "KH" ? "សូមសាកល្បងវាយពាក្យគន្លឹះផ្សេង ដូចជា \"វគ្គ ១\", \"$3.50\" ឬ \"No Way Home\"។" : "Please try searching with different keywords like \"Part 1\", \"$3.50\" or \"No Way Home\"."}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedPart("all");
              }}
              className="mt-6 rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-red-500 cursor-pointer"
            >
              {language === "KH" ? "បង្ហាញទាំងអស់ឡើងវិញ" : "Show All Movies"}
            </button>
          </div>
        )}
      </div>

      {/* Booking Modal Instance */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={selectedMovieForBooking}
      />
    </section>
  );
}

