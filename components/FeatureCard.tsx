interface FeatureCardProps {
    title: string;
    description: string;
    icon: string;
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
    return (
        <div className="group relative rounded-2xl border border-gray-800 bg-gray-900/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/10">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-2xl text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-sky-300 transition-colors">
                {title}
            </h3>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                {description}
            </p>
        </div>
    );
}
