import FeatureCard from "@/components/FeatureCard";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <span className="rounded-full border border-sky-500/30 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
          Next.js + Tailwind v4
        </span>
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          Build faster with <span className="text-sky-500">Modern Layouts</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Clean, composable components with responsive Tailwind CSS utilities.
        </p>
      </section>

      {/* Features Grid */}
      <section id="features" className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon="⚡"
          title="Lightning Fast"
          description="Built on Next.js App Router for optimal rendering performance."
        />
        <FeatureCard
          icon="🎨"
          title="Tailwind v4 Styling"
          description="Utility-first styling with zero runtime CSS overhead."
        />
        <FeatureCard
          icon="🧩"
          title="Modular Components"
          description="Reusable, clean TypeScript components that scale with your app."
        />
      </section>
    </div>
  );
}
