import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LocaleProvider } from "@/lib/LocaleContext";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Titan Travel | Wisata Tour Travel Palembang - CV Titan Jaya Travelindo",
  description:
    "Titan Travel - Specialist Umroh, Corporate Gathering, Family Trip, Tour Domestik & Internasional. Melayani sejak 2013 dari Palembang. Booking online mudah dan terpercaya.",
  keywords: [
    "Titan Travel",
    "Travel Palembang",
    "Tour Domestik",
    "Tour Internasional",
    "Umroh",
    "Corporate Gathering",
    "Family Trip",
    "Booking Online",
  ],
  authors: [{ name: "CV Titan Jaya Travelindo" }],
  openGraph: {
    title: "Titan Travel | Wisata Tour Travel Palembang",
    description:
      "Specialist Umroh, Corporate Gathering, Family Trip, Tour Domestik & Internasional sejak 2013.",
    type: "website",
    locale: "id_ID",
  },
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body
        className={`${playfair.variable} ${dmSans.variable} antialiased`}
      >
        <ThemeProvider>
          <LocaleProvider>{children}</LocaleProvider>
        </ThemeProvider>
        
        {/* Midtrans Snap Script */}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
