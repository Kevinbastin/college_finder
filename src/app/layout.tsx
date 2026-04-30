import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/context/AuthProvider";
import { CompareProvider } from "@/context/CompareContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "CollegeFind — Discover the Best Colleges in India",
  description: "Search from 500+ colleges. Compare fees, placements, and more. Find your perfect college in India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-offwhite min-h-screen flex flex-col">
        <AuthProvider>
          <CompareProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="bottom-right" toastOptions={{
              duration: 3000,
              style: { background: '#1E293B', color: '#fff', fontSize: '13px', borderRadius: '8px' },
              success: { style: { background: '#16A34A' } },
              error: { style: { background: '#DC2626' } },
            }} />
          </CompareProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
