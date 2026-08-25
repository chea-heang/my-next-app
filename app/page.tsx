import MovieSearchSection from "@/components/MovieSearchSection";
import CambodiaCinemas from "@/components/CambodiaCinemas";
import HeroVideoPlayer from "@/components/HeroVideoPlayer";
import TechMatrix from "@/components/TechMatrix";
import Timeline from "@/components/Timeline";
import FaqSection from "@/components/FaqSection";
import CtaNewsletter from "@/components/CtaNewsletter";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* 1. Hero Showcase Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-red-600/20 to-indigo-600/20 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-red-600 dark:bg-red-500/10 dark:text-red-400">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            📍 រោងភាពយន្តនៅកម្ពុជា • CAMBODIA THEATERS
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
            ទីតាំងរោងកុនមើល <span className="bg-gradient-to-r from-red-600 via-rose-500 to-indigo-600 bg-clip-text text-transparent">Spider-Man</span> នៅខ្មែរ
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
            ស្វែងរកទីតាំងរោងភាពយន្ត Major Cineplex, Legend Cinema និង Prime Cineplex នៅភ្នំពេញ សៀមរាប និងព្រះសីហនុ ជាមួយប្រព័ន្ធ IMAX, ScreenX & 4DX។
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-1">
            <a
              href="#cinemas"
              className="rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-red-600/25 transition hover:scale-105 active:scale-95"
            >
              📍 ស្វែងរកទីតាំងរោងកុន
            </a>
            <a
              href="#heroes"
              className="rounded-2xl border border-gray-300 bg-white/80 px-8 py-4 text-base font-bold text-gray-800 shadow-sm backdrop-blur-md transition hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900/80 dark:text-white dark:hover:bg-gray-800"
            >
              🎬 រឿង Spider-Man វគ្គ ១-៦
            </a>
          </div>

          {/* Spider-Man Video Player in Hero Section */}
          <HeroVideoPlayer />

          {/* Quick Metrics Bar for Cambodia Theaters */}
          <div className="pt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-gray-200/80 bg-white/60 p-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/40">
              <p className="text-3xl font-black text-red-600 dark:text-red-400">15+</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
                សាខារោងកុននៅកម្ពុជា
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200/80 bg-white/60 p-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/40">
              <p className="text-3xl font-black text-blue-600 dark:text-blue-400">IMAX</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
                Laser & ScreenX 270°
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200/80 bg-white/60 p-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/40">
              <p className="text-3xl font-black text-purple-600 dark:text-purple-400">4DX</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
                កៅអីរំញ័រ Motion 3D
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200/80 bg-white/60 p-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/40">
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">3 ក្រុង</p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
                ភ្នំពេញ សៀមរាប កំពង់សោម
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Cambodia Cinema Finder Section */}
      <CambodiaCinemas />

      {/* 3. Searchable Spider-Man Movie Saga: Part 1 to 6 */}
      <MovieSearchSection />

      {/* 4. Interactive Tech & Biomimetics Matrix */}
      <TechMatrix />

      {/* 5. Multiverse Timeline */}
      <Timeline />

      {/* 6. Frequently Asked Inquiries */}
      <FaqSection />

      {/* 7. Call To Action & Newsletter */}
      <CtaNewsletter />
    </div>
  );
}

