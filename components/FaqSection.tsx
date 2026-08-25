"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is Spider-Sna & the Dimensional Nexus?",
    answer:
      "Spider-Sna connects movie lovers to theaters across Cambodia and the multiverse of Spider-Man films with real-time showtimes and KHQR ticketing.",
  },
  {
    question: "How do dimension-traveling Day-Pass Watches function?",
    answer:
      "Engineered by Miguel O'Hara (Spider-Man 2099), these biometric spatial stabilizers prevent cellular molecular decay (glitching) when visiting alternate realities.",
  },
  {
    question: "What differentiates Spider-Man Noir's suit?",
    answer:
      "Spider-Man Noir operates in 1933 Great Depression New York, wearing bullet-resistant Kevlar weave beneath a dark trench coat and fedora, optimized for noir stealth.",
  },
  {
    question: "Can anyone join the Spider-Society?",
    answer:
      "Entry into the Spider-Society requires verified Totemic resonance and adherence to the Prime Multiversal Canon Protocol.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center space-y-4 mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-50 px-4 py-1.5 text-xs font-bold text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
            ❓ Intel & Inquiries
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Frequently Asked <span className="text-purple-500">Questions</span>
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Essential directives and classified intelligence on multiversal operations.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 backdrop-blur-sm transition-colors dark:border-gray-800 dark:bg-gray-900/60"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-6 text-left font-bold text-gray-900 dark:text-white cursor-pointer"
                >
                  <span className="text-lg">{faq.question}</span>
                  <span
                    className={`ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-transform duration-300 dark:bg-gray-800 dark:text-gray-300 ${
                      isOpen ? "rotate-180 bg-red-500 text-white dark:bg-red-500" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-sm leading-relaxed text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800/60">
                    <p className="mt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
