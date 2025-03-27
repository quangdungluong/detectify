import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Detectify",
  description: "Upload images to detect and count people",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-gray-900">
                  Detectify
                </Link>
              </div>
              <nav className="flex items-center space-x-4">
                <Link href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <Link href="/history" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  History
                </Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Detectify. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
