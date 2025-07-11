// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ActivityTrackerWrapper from "@/components/ActivityTrackerWrapper"; // ✅

export const metadata: Metadata = {
  title: "GrinchGuard",
  description: "Operation GrinchStop: A Walmart-like e-commerce simulation for security demos.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased">
        <ActivityTrackerWrapper /> {/* ✅ this runs your bot detector */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}

