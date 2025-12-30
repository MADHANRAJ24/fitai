import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "FitAI - Next Gen Fitness",
  description: "AI-powered fitness tracking, coaching, and nutrition planning. Experience the future of personal training with real-time computer vision and personalized analytics.",
  manifest: "/manifest.json",
  openGraph: {
    title: "FitAI - Next Gen Fitness",
    description: "Train smarter with AI-powered coaching and real-time vision analytics.",
    type: "website",
    locale: "en_US",
    siteName: "FitAI",
    images: [
      {
        url: "/og-image.jpg", // Placeholder, would need a real image
        width: 1200,
        height: 630,
        alt: "FitAI Dashboard",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "FitAI - Next Gen Fitness",
    description: "Train smarter with AI-powered coaching and real-time vision analytics.",
  }
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming for native app feel
}

import { AuthProvider } from "@/context/auth-context"
import { VoiceCommand } from "@/components/features/voice-command"
import { CookieConsent } from "@/components/ui/cookie-consent"
import { SplashScreen } from "@/components/ui/splash-screen"
import { Toaster } from "sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <SplashScreen />
          {children}
          <VoiceCommand />
          <CookieConsent />
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
