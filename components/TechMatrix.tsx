"use client";

import { useState } from "react";

const abilities = [
  {
    id: "web-shooters",
    name: "Web-Shooters v4",
    icon: "🕸️",
    category: "Hardware",
    badge: "10,000 PSI",
    description:
      "Precision-engineered wrist-mounted shooters capable of high-velocity web fluid dispensing, rapid tethers, and electro-static web nets.",
    specs: [
      { label: "Tensile Strength", value: "120 MPa" },
      { label: "Range", value: "350 meters" },
      { label: "Fluid Capacity", value: "36 Cartridges" },
    ],
  },
  {
    id: "spider-sense",
    name: "Precognitive Sense",
    icon: "⚡",
    category: "Bio-Ability",
    badge: "Instantaneous",
    description:
      "Omni-directional clairvoyance detecting immediate incoming threats, unseen obstacles, and micro-vibrations in surrounding atmosphere.",
    specs: [
      { label: "Reaction Speed", value: "0.02 Seconds" },
      { label: "Detection Radius", value: "360° Sphere" },
      { label: "Threat Accuracy", value: "99.8%" },
    ],
  },
  {
    id: "bio-electricity",
    name: "Venom Strike",
    icon: "💥",
    category: "Energy",
    badge: "50,000 Volts",
    description:
      "Bio-electric energy discharge channels through fingertips, temporarily stunning superhuman foes or neutralizing electronic security grids.",
    specs: [
      { label: "Output Current", value: "High Amp Shock" },
      { label: "Charge Time", value: "Instantaneous" },
      { label: "Blast Radius", value: "8.5 meters" },
    ],
  },
  {
    id: "camouflage",
    name: "Optic Cloaking",
    icon: "🕶️",
    category: "Stealth",
    badge: "Active Invisibility",
    description:
      "Photonic bending capability allowing complete visual and infrared concealment in shadowy environments or daylight encounters.",
    specs: [
      { label: "Refraction Index", value: "99.4%" },
      { label: "Thermal Masking", value: "Active" },
      { label: "Duration", value: "Indefinite" },
    ],
  },
];

export default function TechMatrix() {
  const [activeTab, setActiveTab] = useState(abilities[0].id);
  const activeAbility = abilities.find((a) => a.id === activeTab) || abilities[0];

  return (
    <section id="tech" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center space-y-4 mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-50 px-4 py-1.5 text-xs font-bold text-red-600 dark:bg-red-500/10 dark:text-red-400">
            ⚙️ Suit Tech & Biomimetics
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Cutting-Edge <span className="text-red-500">Abilities Matrix</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 dark:text-gray-400">
            Explore the advanced biological traits and mechanical enhancements powering the multiverse heroes.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {abilities.map((ability) => {
            const isSelected = activeTab === ability.id;
            return (
              <button
                key={ability.id}
                onClick={() => setActiveTab(ability.id)}
                className={`flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105"
                    : "bg-white/80 text-gray-700 hover:bg-gray-100 dark:bg-gray-900/80 dark:text-gray-300 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800"
                }`}
              >
                <span>{ability.icon}</span>
                <span>{ability.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tech Showcase Panel */}
        <div className="relative overflow-hidden rounded-3xl border border-gray-200/80 bg-gradient-to-br from-white/90 to-gray-50/90 p-8 shadow-xl backdrop-blur-xl dark:border-gray-800 dark:from-gray-900/90 dark:to-gray-950/90 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left Details */}
            <div className="space-y-6 lg:col-span-7">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-700 dark:bg-red-950/80 dark:text-red-400">
                  {activeAbility.category}
                </span>
                <span className="rounded-lg bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950/80 dark:text-blue-400">
                  {activeAbility.badge}
                </span>
              </div>

              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl flex items-center gap-3">
                <span className="text-4xl">{activeAbility.icon}</span>
                {activeAbility.name}
              </h3>

              <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed sm:text-lg">
                {activeAbility.description}
              </p>

              <div className="pt-2">
                <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/25 transition hover:scale-105 active:scale-95">
                  Analyze Diagnostic Telemetry
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Specs Grid */}
            <div className="grid gap-4 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
              {activeAbility.specs.map((spec, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200/80 bg-white/70 p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/60"
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {spec.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
