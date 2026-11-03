"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { language } = useLanguage();
  return (
    <footer className="border-t border-gray-200/80 bg-white/50 dark:border-gray-800/80 dark:bg-gray-950/50 py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-6 flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="text-xl">🕷️</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">
            Veasna Hub
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} {language === "KH" ? "បណ្តាញ Veasna។ ថាមពលដ៏អស្ចារ្យមកជាមួយការទទួលខុសត្រូវដ៏ធំធេង។" : "Veasna Network. Great power comes with great responsibility."}
        </p>
      </div>
    </footer>
  );
}
