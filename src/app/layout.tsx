import type { Metadata } from "next";
import { Inter, Outfit, Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });
const rajdhani = Rajdhani({ weight: ["300", "400", "500", "600", "700"], subsets: ["latin"], variable: "--font-rajdhani" });

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
  viewportFit: "cover",
}

import { AuthProvider } from "@/context/auth-context"
import { AdBanner } from "@/components/features/ad-banner"
import { CookieConsent } from "@/components/ui/cookie-consent"
import { SplashScreen } from "@/components/ui/splash-screen"
import { Toaster } from "sonner"
import Script from "next/script"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  /*
  useEffect(() => {
     alert("FitAI JS Loaded Successfully");
  }, []);
  */
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} ${orbitron.variable} ${rajdhani.variable} font-sans antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <SplashScreen />
          {children}
          <CookieConsent />
          <Toaster
            position="top-center"
            richColors
            toastOptions={{
              className: "bg-black/80 border border-emerald-500/20 text-white backdrop-blur-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] rounded-2xl font-sans",
              classNames: {
                success: "border-emerald-500/50 text-emerald-400 bg-black/90",
                error: "border-red-500/50 text-red-400 bg-black/90",
                info: "border-blue-500/50 text-blue-400 bg-black/90",
                warning: "border-yellow-500/50 text-yellow-400 bg-black/90",
                title: "font-bold tracking-wide",
                description: "text-muted-foreground text-xs"
              }
            }}
          />
          <AdBanner />
          <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        </AuthProvider>
      </body>
    </html>
  );
}
