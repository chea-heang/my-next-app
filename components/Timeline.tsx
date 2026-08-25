import React from "react";

const events = [
  {
    year: "Earth-616",
    title: "The Genesis: Radioactivity",
    description:
      "Peter Parker bitten by a genetically altered super-spider, discovering great power and lifelong responsibility.",
    badge: "Origin",
  },
  {
    year: "Earth-1610",
    title: "A New Champion Rises",
    description:
      "Miles Morales inherits the mantle, mastering bio-electric venom blasts and light-bending invisibility cloaks.",
    badge: "Next Gen",
  },
  {
    year: "Earth-90214",
    title: "Shadows of the Great Depression",
    description:
      "Spider-Man Noir navigates 1933 New York's underworld, blending trench-coat grit with ruthless detective work.",
    badge: "Noir Era",
  },
  {
    year: "Earth-928",
    title: "Cyberpunk 2099 Neuropolis",
    description:
      "Miguel O'Hara re-engineers genetic strands in futuristic Nueva York, forging the Spider-Society across the multiverse.",
    badge: "Future",
  },
];

export default function Timeline() {
  return (
    <section id="timeline" className="relative py-24 bg-gray-50/50 dark:bg-gray-950/50">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center space-y-4 mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            🌌 Dimensional Nexus
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Multiverse <span className="text-blue-500">Timeline & Canon</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 dark:text-gray-400">
            Witness the convergence of parallel realities, key canon events, and legendary heroes across time.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="relative flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/50 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/60"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-red-600 dark:text-red-400">
                    {event.year}
                  </span>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
                    {event.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {event.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {event.description}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>View Multiverse Record</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
