import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../[lang]/globals.css";
import { Footer } from "@/components/footer/Footer";
import ThemeWrapper from "@/components/ThemeWrapper";
import { ToastProvider } from "@/providers/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "AVIE Platform | Policies",
  description: "Platform policies, terms of service, and legal information",
};

export default function PolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link
          rel="preload"
          href="/_next/static/media/a34f9d1faa5f3315-s.p.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>

      <body className={`${inter.className}`}>
        <ThemeWrapper>
          <ToastProvider>
            <div className="min-h-screen">
              {/* Policy pages don't require authentication or wallet connection */}
              {children}
            </div>
            <Footer />
          </ToastProvider>
        </ThemeWrapper>
      </body>
    </html>
  );
} 