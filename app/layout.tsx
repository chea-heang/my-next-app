import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";

export const metadata: Metadata = {
  title: "Veasna | ទីតាំងរោងកុននៅកម្ពុជា",
  description: "Veasna: ស្វែងរកទីតាំងរោងភាពយន្តនៅកម្ពុជា និងកក់សំបុត្រភាពយន្ត Spider-Man",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-200 antialiased">
        <LanguageProvider>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <LoginModal />
            </ThemeProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

