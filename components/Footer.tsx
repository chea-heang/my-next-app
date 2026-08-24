export default function Footer() {
    return (
        <footer className="w-full border-t border-gray-200 bg-gray-50 py-8 text-center text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
            <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p>© {new Date().getFullYear()} MyApp, Inc. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200 transition">Privacy Policy</a>
                    <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200 transition">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}
