import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 dark:border-gray-800/80 dark:bg-gray-950/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-black tracking-tight text-gray-900 dark:text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-lg text-white shadow-md shadow-red-500/25">
            🕷️
          </span>
          <span>
            Spider-<span className="text-red-600 dark:text-red-500">Sna</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600 dark:text-gray-300">
          <Link href="#cinemas" className="transition hover:text-red-500 text-red-600 dark:text-red-400">
            📍 ទីតាំងរោងកុន
          </Link>
          <Link href="#heroes" className="transition hover:text-red-500">
            ភាពយន្ត (Movies)
          </Link>
          <Link href="#tech" className="transition hover:text-red-500">
            Suit Tech
          </Link>
          <Link href="#timeline" className="transition hover:text-red-500">
            Timeline
          </Link>
          <Link href="#faq" className="transition hover:text-red-500">
            FAQ
          </Link>
        </nav>

        {/* Actions (Toggle + CTA) */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="#cinemas"
            className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-red-600/20 transition hover:opacity-90 active:scale-95"
          >
            រកទីតាំងរោងកុន
          </a>
        </div>
      </div>
    </header>
  );
}


