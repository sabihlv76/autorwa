import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { CurrencyProvider } from "@/components/providers/CurrencyProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Autorwa — Cars & Spare Parts Marketplace",
  description:
    "Autorwa is a multilingual marketplace for cars and automotive spare parts in Rwanda.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <LocaleProvider>
            <CurrencyProvider>{children}</CurrencyProvider>
          </LocaleProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
