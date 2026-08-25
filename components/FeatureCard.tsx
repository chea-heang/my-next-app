import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  tag?: string;
  universe?: string;
}

export default function FeatureCard({
  title,
  description,
  icon,
  image,
  tag,
  universe,
}: FeatureCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/10 dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-red-500/40 dark:hover:shadow-red-500/20">
      {image && (
        <div className="relative mb-4 h-56 w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {universe && (
            <span className="absolute top-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-md border border-white/10">
              {universe}
            </span>
          )}
          {tag && (
            <span className="absolute top-3 right-3 rounded-full bg-red-600/90 px-3 py-1 text-xs font-bold text-white shadow-md backdrop-blur-md">
              {tag}
            </span>
          )}
        </div>
      )}

      {icon && (
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl text-red-600 group-hover:bg-red-500 group-hover:text-white dark:bg-red-500/10 dark:text-red-400 transition-colors duration-300">
          {icon}
        </div>
      )}

      <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-500 dark:text-white dark:group-hover:text-red-400 transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}


