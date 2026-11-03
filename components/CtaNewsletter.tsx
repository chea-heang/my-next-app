"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CtaNewsletter() {
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-indigo-900 px-8 py-16 text-center text-white shadow-2xl sm:px-16 sm:py-20">
          {/* Background Web Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 mx-auto max-w-2xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              ⚡ {language === "KH" ? "ចូលរួមជាមួយបណ្តាញពហុសកល" : "Join The Multiverse Network"}
            </span>

            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
              {language === "KH" ? "ត្រៀមខ្លួនសម្រាប់បេសកកម្មឆ្លងសកលហើយឬនៅ?" : "Ready to Suit Up Across Dimensions?"}
            </h2>

            <p className="text-base text-red-100 sm:text-lg">
              {language === "KH" ? "ទទួលបានព័ត៌មានលម្អិតថ្មីៗ ការជូនដំណឹងឆ្លងសកល និងការផ្តល់ជូនពិសេសដោយផ្ទាល់។" : "Receive top-secret suit updates, dimension-hopping alerts, and exclusive interactive drops straight to your terminal."}
            </p>

            {subscribed ? (
              <div className="rounded-2xl bg-white/20 p-6 backdrop-blur-md">
                <p className="text-lg font-bold">{language === "KH" ? "🎉 សូមស្វាគមន៍មកកាន់ Spider-Society!" : "🎉 Welcome to the Spider-Society!"}</p>
                <p className="mt-1 text-sm text-red-100">
                  {language === "KH" ? "ព័ត៌មានរបស់អ្នកត្រូវបានបញ្ជូនជោគជ័យ។" : "Your spatial stabilizer coordinates have been dispatched."}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === "KH" ? "បញ្ចូលអ៊ីមែលរបស់អ្នក..." : "Enter your hero email..."}
                  required
                  className="flex-1 rounded-xl bg-white/90 px-5 py-3.5 text-sm text-gray-900 placeholder-gray-500 shadow-inner outline-none transition focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-black px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-gray-900 active:scale-95 cursor-pointer"
                >
                  {language === "KH" ? "ចូលរួមឥឡូវនេះ" : "Join Society"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
