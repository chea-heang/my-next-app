interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/50 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/50 dark:hover:shadow-sky-500/10">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-2xl text-sky-600 group-hover:bg-sky-500 group-hover:text-white dark:bg-sky-500/10 dark:text-sky-400 transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-300 transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
