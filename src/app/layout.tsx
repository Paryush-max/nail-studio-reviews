import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Rakhee's NailStudio | Leave a Review",
  description: "Generate a beautiful, natural review for your nail salon experience in seconds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-slate-50 dark:bg-slate-950 transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          {/* This Toaster is what makes the "Review Copied!" popups appear */}
          <Toaster position="top-center" toastOptions={{ style: { borderRadius: '16px', background: '#333', color: '#fff' } }} />
        </ThemeProvider>
      </body>
    </html>
  );
}