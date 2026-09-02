export default function HeroBanner() {
    return (
        <div className="w-full py-12 sm:py-20 lg:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* Main Grid: 1 column on mobile, 2 columns on desktop */}
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

                    {/* Left Column: Text Content */}
                    <div className="text-center lg:text-left space-y-6">
                        <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                            🚀 Responsive & Themed
                        </span>

                        <h1 className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
                            Design for <span className="text-sky-500">Every Screen</span> and Theme
                        </h1>

                        <p className="text-base text-gray-600 sm:text-lg dark:text-gray-400">
                            Fully fluid typography, adaptive grid layouts, and seamless light/dark mode transitions built with Tailwind CSS.
                        </p>

                        {/* Action buttons: Full-width on mobile, auto-width row on desktop */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                            <button className="w-full sm:w-auto rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 active:scale-95">
                                Explore Demo
                            </button>
                            <button className="w-full sm:w-auto rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 transition">
                                Documentation
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Responsive Preview Card */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
                                <div className="flex gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-400" />
                                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                                    <div className="h-3 w-3 rounded-full bg-green-400" />
                                </div>
                                <span className="text-xs text-gray-400">preview.tsx</span>
                            </div>
                            <div className="mt-4 space-y-3">
                                <div className="h-4 w-3/4 rounded bg-gray-100 dark:bg-gray-800" />
                                <div className="h-4 w-1/2 rounded bg-gray-100 dark:bg-gray-800" />
                                <div className="h-20 w-full rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-500 font-medium text-sm">
                                    Responsive Container
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
