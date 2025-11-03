// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import ToastOnAuth from "@/components/toast-on-auth";
import { Suspense } from "react";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Load the local Retrock font
const retrock = localFont({
  src: "../font/Retrock.ttf",
  variable: "--font-retrock",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SuarAsa",
  description: "Review your favorite tracks",
  icons: {
    icon: "/favicon.png", // ✅ path ke favicon baru di folder public
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen flex flex-col ${geistSans.variable} ${geistMono.variable} ${retrock.variable} font-sans`}
        style={{
          background:
            "linear-gradient(180deg, #02C397 0%, #FFFDEE 20%, #FFFDEE 85%, #02C397 200%)",
        }}
      >
        {children}
        <Toaster richColors position="top-center" closeButton />
        <Suspense fallback={null}>
          <ToastOnAuth />
        </Suspense>
      </body>
    </html>
  );
}
