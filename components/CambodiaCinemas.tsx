"use client";

import { useState, useMemo } from "react";
import BookingModal, { BookingMovieData } from "@/components/BookingModal";
import { movies } from "@/components/MovieSearchSection";
import { useLanguage } from "@/contexts/LanguageContext";

interface Cinema {
  id: number;
  nameKh: string;
  nameEn: string;
  brand: "Legend" | "Major" | "Prime" | "Platinum";
  city: "ភ្នំពេញ" | "សៀមរាប" | "ព្រះសីហនុ";
  locationKh: string;
  locationEn: string;
  phone: string;
  technologies: string[];
  image: string;
  mapUrl: string;
  bookingUrl: string;
  status: "កំពុងបញ្ចាំង" | "បើកដំណើរការរាល់ថ្ងៃ";
  highlights: string;
}

const cinemas: Cinema[] = [
  {
    id: 1,
    nameKh: "Major Cineplex អ៊ីអន មានជ័យ (Aeon 3)",
    nameEn: "Major Cineplex - Aeon Mall Mean Chey",
    brand: "Major",
    city: "ភ្នំពេញ",
    locationKh: "ជាន់ទី២ ផ្សារទំនើប អ៊ីអន មានជ័យ (ផ្លូវ ៦០ ម៉ែត្រ), រាជធានីភ្នំពេញ",
    locationEn: "2nd Floor, Aeon Mall Mean Chey (Hun Sen Blvd), Phnom Penh",
    phone: "098 888 888",
    technologies: ["IMAX Laser", "ScreenX", "4DX", "VIP Lounge", "Dolby Atmos"],
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
    mapUrl: "https://maps.google.com/?q=Major+Cineplex+Aeon+Mall+Mean+Chey",
    bookingUrl: "https://www.majorcineplex.com.kh",
    status: "កំពុងបញ្ចាំង",
    highlights: "អេក្រង់យក្ស IMAX Laser ដំបូងគេ និងសាល ScreenX មុំ ២៧០ ដឺក្រេ",
  },
  {
    id: 2,
    nameKh: "Legend Cinema អ៊ីដិន ហ្កាឌិន (Eden Garden)",
    nameEn: "Legend Cinema - Eden Garden Mall",
    brand: "Legend",
    city: "ភ្នំពេញ",
    locationKh: "ផ្សារ Eden Garden, តំបន់បឹងកក់, សង្កាត់ស្រះចក, ខណ្ឌដូនពេញ, ភ្នំពេញ",
    locationEn: "Eden Garden Mall, Boeung Kak Area, Daun Penh, Phnom Penh",
    phone: "081 252 525",
    technologies: ["ScreenX", "VIP Diamond", "Dolby Atmos 7.1", "Laser 4K"],
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
    mapUrl: "https://maps.google.com/?q=Legend+Cinema+Eden+Garden",
    bookingUrl: "https://www.legend.com.kh",
    status: "កំពុងបញ្ចាំង",
    highlights: "សាលបញ្ចាំងប្រណីត Diamond Hall ជាមួយកៅអីទន់ស្បែក VIP",
  },
  {
    id: 3,
    nameKh: "Major Cineplex អ៊ីអន សែនសុខ (Aeon 2)",
    nameEn: "Major Cineplex - Aeon Mall Sen Sok",
    brand: "Major",
    city: "ភ្នំពេញ",
    locationKh: "ជាន់ទី២ ផ្សារទំនើប អ៊ីអន សែនសុខ ស៊ីធី, ខណ្ឌសែនសុខ, ភ្នំពេញ",
    locationEn: "2nd Floor, Aeon Mall Sen Sok City, Sen Sok, Phnom Penh",
    phone: "098 888 888",
    technologies: ["IMAX", "4DX 3D", "Kids Cinema", "VIP Platinum"],
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
    mapUrl: "https://maps.google.com/?q=Major+Cineplex+Aeon+Mall+Sen+Sok",
    bookingUrl: "https://www.majorcineplex.com.kh",
    status: "កំពុងបញ្ចាំង",
    highlights: "កៅអីរំញ័រ 4DX មានក្លិន ខ្យល់ ទឹក និង IMAX ដ៏ធំទូលាយ",
  },
  {
    id: 4,
    nameKh: "Legend Cinema អ៊ិចឆេង ស្ឃ្វែរ (Exchange Square)",
    nameEn: "Legend Cinema - Exchange Square",
    brand: "Legend",
    city: "ភ្នំពេញ",
    locationKh: "ជាន់ទី២ អាគារ Exchange Square, ផ្លូវ ១០៦ កែង ៦១, វត្តភ្នំ, ភ្នំពេញ",
    locationEn: "2nd Floor, Exchange Square, St. 106 & 61, Wat Phnom, Phnom Penh",
    phone: "081 252 525",
    technologies: ["VIP Lounge", "Premium Laser", "Dolby Atmos"],
    image: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=800&q=80",
    mapUrl: "https://maps.google.com/?q=Legend+Cinema+Exchange+Square",
    bookingUrl: "https://www.legend.com.kh",
    status: "កំពុងបញ្ចាំង",
    highlights: "សាលលំដាប់ High-End Business Premium សំឡេងកម្រិតស្ទូឌីយោ",
  },
  {
    id: 5,
    nameKh: "Prime Cineplex សម័យ ស្ឃ្វែរ (Samai Square)",
    nameEn: "Prime Cineplex - Samai Square TK",
    brand: "Prime",
    city: "ភ្នំពេញ",
    locationKh: "Samai Square Mall, ផ្លូវ 337, ទួលគោក, រាជធានីភ្នំពេញ",
    locationEn: "Samai Square Mall, St. 337, Toul Kork, Phnom Penh",
    phone: "087 888 001",
    technologies: ["Laser Cinema", "Sweetbox Couple", "Dolby 7.1"],
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80",
    mapUrl: "https://maps.google.com/?q=Prime+Cineplex+Samai+Square",
    bookingUrl: "https://primecineplex.com",
    status: "បើកដំណើរការរាល់ថ្ងៃ",
    highlights: "កៅអី Sweetbox សម្រាប់គូស្នេហ៍ និងបច្ចេកវិទ្យាបញ្ចាំង Laser ភ្លឺច្បាស់",
  },
  {
    id: 6,
    nameKh: "Major Cineplex សៀមរាប (Heritage Walk)",
    nameEn: "Major Cineplex - The Heritage Walk Siem Reap",
    brand: "Major",
    city: "សៀមរាប",
    locationKh: "ផ្សារ The Heritage Walk, ផ្លូវជាតិលេខ ៦, ក្រុងសៀមរាប",
    locationEn: "The Heritage Walk Mall, National Road 6, Siem Reap City",
    phone: "098 888 888",
    technologies: ["Digital 2D/3D", "VIP Lounge", "Dolby Atmos"],
    image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80",
    mapUrl: "https://maps.google.com/?q=Major+Cineplex+Heritage+Walk+Siem+Reap",
    bookingUrl: "https://www.majorcineplex.com.kh",
    status: "កំពុងបញ្ចាំង",
    highlights: "រោងភាពយន្តស្តង់ដារអន្តរជាតិធំជាងគេបង្អស់ក្នុងខេត្តសៀមរាប",
  }, 
  {
    id: 7,
    nameKh: "Legend Cinema ព្រះសីហនុ (Prince Mall)",
    nameEn: "Legend Cinema - Prince Mall Sihanoukville",
    brand: "Legend",
    city: "ព្រះសីហនុ",
    locationKh: "ជាន់ទី៤ ផ្សារ Prince Mall, វិថី ២ ធ្នូ, ក្រុងព្រះសីហនុ",
    locationEn: "4th Floor, Prince Mall, 2 Thnou St., Sihanoukville",
    phone: "081 252 525",              
    technologies: ["Laser 4K", "VIP Hall", "Dolby Surround 7.1"],
    image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&w=800&q=80",
    mapUrl: "https://maps.google.com/?q=Legend+Cinema+Prince+Mall+Sihanoukville",
    bookingUrl: "https://www.legend.com.kh",
    status: "កំពុងបញ្ចាំង",
    highlights: "រោងភាពយន្តប្រណីតជាប់មាត់សមុទ្រក្រុងព្រះសីហនុ",
  },
  {
    id: 8,
    nameKh: "Legend Cinema ជីប ម៉ុង ២៧១ (Chip Mong 271)",
    nameEn: "Legend Cinema - Chip Mong 271 Mega Mall",
    brand: "Legend",
    city: "ភ្នំពេញ",
    locationKh: "ជាន់ទី៤ ផ្សារ ជីប ម៉ុង ២៧១ មេហ្គាម៉ល, ផ្លូវ ២៧១, ភ្នំពេញ",
    locationEn: "4th Floor, Chip Mong 271 Mega Mall, St. 271, Phnom Penh",
    phone: "081 252 525",
    technologies: ["ScreenX", "Dolby Atmos", "VIP Gold Class"],
    image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=800&q=80",
    mapUrl: "https://maps.google.com/?q=Legend+Cinema+Chip+Mong+271+Mega+Mall",
    bookingUrl: "https://www.legend.com.kh",
    status: "កំពុងបញ្ចាំង",
    highlights: "រចនាបថទំនើបទាន់សម័យ រួមទាំងសាលបញ្ចាំងធំទូលាយច្រើនសាល",
  },
];

export default function CambodiaCinemas() {
  const { language, toggleLanguage } = useLanguage();
  const [selectedCity, setSelectedCity] = useState<string>("ទាំងអស់");
  const [selectedBrand, setSelectedBrand] = useState<string>("ទាំងអស់");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [bookingCinemaName, setBookingCinemaName] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<BookingMovieData | null>(
    movies[movies.length - 1] // default to Spider-Man No Way Home
  );

  const cities = [
    { kh: "ទាំងអស់", en: "All" },
    { kh: "ភ្នំពេញ", en: "Phnom Penh" },
    { kh: "សៀមរាប", en: "Siem Reap" },
    { kh: "ព្រះសីហនុ", en: "Sihanoukville" },
  ];

  const filteredCinemas = useMemo(() => {
    return cinemas.filter((cinema) => {
      const matchCity =
        selectedCity === "ទាំងអស់" || cinema.city === selectedCity;
      const matchBrand =
        selectedBrand === "ទាំងអស់" || cinema.brand === selectedBrand;
      const matchSearch =
        cinema.nameKh.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cinema.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cinema.locationKh.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cinema.technologies.some((tech) =>
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchCity && matchBrand && matchSearch;
    });
  }, [selectedCity, selectedBrand, searchQuery]);

  const handleOpenBookingForCinema = (cinema: Cinema) => {
    setBookingCinemaName(cinema.nameKh);
    setSelectedMovie(movies[movies.length - 1]);
    setIsModalOpen(true);
  };

  return (
    <section id="cinemas" className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Language Toggle */}
      <div className="flex justify-end mb-4">
        <button
          id="cinema-language-toggle"
          onClick={toggleLanguage}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 shadow-sm
            bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700
            text-gray-700 dark:text-gray-200 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400"
        >
          <span className={language === "KH" ? "text-red-600 dark:text-red-400" : "text-gray-400"}>
            ខ្មែរ
          </span>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span className={language === "EN" ? "text-red-600 dark:text-red-400" : "text-gray-400"}>
            EN
          </span>
        </button>
      </div>
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-red-500 dark:text-red-400">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          {language === "KH" ? "📍 រោងភាពយន្តនៅកម្ពុជា • CAMBODIA CINEMA LOCATOR" : "📍 Cambodia Cinemas • LOCATOR"}
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
          {language === "KH" ? "ទីតាំងរោងភាពយន្តនៅកម្ពុជា" : "Cinemas in Cambodia"}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
          {language === "KH" ? "ស្វែងរកសាខារោងភាពយន្ត Major Cineplex, Legend Cinema និង Prime Cineplex ដែលនៅជិតលោកអ្នកបំផុត ជាមួយនឹងបច្ចេកវិទ្យា IMAX, 4DX & ScreenX។" : "Find the nearest branches of Major Cineplex, Legend Cinema, and Prime Cineplex with IMAX, 4DX & ScreenX technologies."}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl p-5 sm:p-6 shadow-xl mb-10 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* City Filter Pills */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 self-center mr-1">
              {language === "KH" ? "ទីក្រុង:" : "City:"}
            </span>
            {cities.map((cityObj) => (
              <button
                key={cityObj.kh}
                onClick={() => setSelectedCity(cityObj.kh)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition duration-200 ${
                  selectedCity === cityObj.kh
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {language === "KH" ? cityObj.kh : cityObj.en}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder={language === "KH" ? "ស្វែងរកឈ្មោះរោងកុន ឬទីតាំង (ឧ. Aeon, Eden, IMAX)..." : "Search cinema or location (e.g. Aeon, IMAX)..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <svg
              className="absolute left-3.5 top-3 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Brand Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800/80">
          <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mr-1">
            {language === "KH" ? "ម៉ាករោងកុន:" : "Cinema Brand:"}
          </span>
          {["ទាំងអស់", "Major", "Legend", "Prime"].map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedBrand === brand
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              {brand === "ទាំងអស់" ? (language === "KH" ? "គ្រប់ម៉ាកទាំងអស់" : "All Brands") : `${brand} Cinema`}
            </button>
          ))}
          <span className="ml-auto text-xs font-medium text-gray-500 dark:text-gray-400">
            {language === "KH" ? "បង្ហាញ" : "Showing"} {filteredCinemas.length} {language === "KH" ? "ទីតាំង" : "locations"}
          </span>
        </div>
      </div>

      {/* Cinema Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredCinemas.map((cinema) => (
          <div
            key={cinema.id}
            className="group relative flex flex-col rounded-3xl overflow-hidden bg-white dark:bg-gray-900/90 border border-gray-200/80 dark:border-gray-800 shadow-lg hover:shadow-2xl hover:border-red-500/50 transition-all duration-300"
          >
            {/* Top Banner Image with Overlay */}
            <div className="relative h-48 w-full overflow-hidden bg-gray-950">
              <img
                src={cinema.image}
                alt={cinema.nameEn}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase shadow-md ${
                    cinema.brand === "Major"
                      ? "bg-red-600 text-white"
                      : cinema.brand === "Legend"
                      ? "bg-amber-500 text-black"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  {cinema.brand}
                </span>
                <span className="bg-black/60 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-xs font-bold">
                  📍 {cinema.city}
                </span>
              </div>

              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {cinema.status}
                </span>
              </div>

              {/* Title on Image */}
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-xl font-black text-white drop-shadow-md">
                  {language === "KH" ? cinema.nameKh : cinema.nameEn}
                </h3>
                <p className="text-xs text-gray-300 font-medium">
                  {language === "KH" ? cinema.nameEn : cinema.nameKh}
                </p>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {/* Highlights */}
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/50 rounded-xl p-3 text-xs text-red-700 dark:text-red-300 font-medium">
                  ⭐ <strong className="font-bold">{language === "KH" ? "ចំណុចពិសេស:" : "Highlights:"}</strong> {cinema.highlights}
                </div>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {cinema.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Address and Phone */}
                <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <p className="flex items-start gap-2">
                    <span className="text-base leading-none">🏢</span>
                    <span>{language === "KH" ? cinema.locationKh : cinema.locationEn}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-base leading-none">📞</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {language === "KH" ? "ទំនាក់ទំនង:" : "Contact:"} {cinema.phone}
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-3">
                <a
                  href={cinema.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-bold transition shadow-sm"
                >
                  <svg
                    className="w-4 h-4 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {language === "KH" ? "មើលលើ Maps" : "View on Maps"}
                </a>
                <button
                  type="button"
                  onClick={() => handleOpenBookingForCinema(cinema)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold transition shadow-lg shadow-red-600/30 cursor-pointer"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                  {language === "KH" ? "កក់សំបុត្រឥឡូវនេះ" : "Book Ticket"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal Instance */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movie={selectedMovie}
        defaultCinema={bookingCinemaName}
      />
    </section>
  );
}
