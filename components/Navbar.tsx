import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 dark:border-gray-800 dark:bg-gray-950/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Brand */}
                <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                    My<span className="text-sky-500">App</span>
                </Link>

                {/* Navigation Links */}
                <nav className="flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
                    <Link href="/" className="transition hover:text-sky-500">
                        Home
                    </Link>
                    <Link href="#features" className="transition hover:text-sky-500">
                        Features
                    </Link>
                    <Link href="#about" className="transition hover:text-sky-500">
                        About
                    </Link>
                </nav>

                {/* Actions (Toggle + CTA) */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <button className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-400 active:scale-95 shadow-md shadow-sky-500/20">
                        Get Started
                    </button>
                </div>
            </div>
        </header>
    );
}
