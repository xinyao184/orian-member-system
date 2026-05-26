import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LangProvider } from "@/i18n/LangProvider";

export const metadata: Metadata = {
  title: "O'rian Dessert · Members",
  description: "Premium handmade strawberry daifuku membership",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "O'rian" },
  icons: { apple: "/brand/logo.jpeg" },
};

export const viewport: Viewport = {
  themeColor: "#2a1d1d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <body className="bg-cocoa-atmos min-h-screen antialiased">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
