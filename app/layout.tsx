import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <div className="aurora-bg" />
        <div className="dot-grid" />
        <Navbar />
        <main className="flex-1 pt-20 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
