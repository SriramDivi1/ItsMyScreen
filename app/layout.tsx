import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ItsMyScreen — Real-time Polls",
  description:
    "Create instant polls, share them with anyone, and watch votes roll in live. No sign-up required. Powered by Next.js & Supabase.",
  metadataBase: new URL("https://itsmyscreen.vercel.app"),
  openGraph: {
    title: "ItsMyScreen — Real-time Polls",
    description:
      "Create instant polls, share them, and watch votes roll in live.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ItsMyScreen — Real-time Polls",
    description:
      "Create instant polls, share them, and watch votes roll in live.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
