import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { SessionProvider } from "@/providers/SessionProvider";
import { WalletProviderWrapper } from "@/providers/WalletProvider";
import { Footer } from "@/components/footer/Footer";
import MultiWalletExample from "@/components/MultiWalletExample";
import ThemeWrapper from "@/components/ThemeWrapper";
import DynamicLayout from "@/components/DynamicLayout";
import { ToastProvider } from "@/providers/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "LiveStreamCoin",
  description: "Build and own your streaming empire",
};

export default function RootLayout({
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
        <SessionProvider>
          <WalletProviderWrapper>
            <ThemeWrapper>
              <ToastProvider>
                <div className="min-h-screen">
                  <AuthGuard>
                    <MultiWalletExample />
                    <DynamicLayout>{children}</DynamicLayout>
                  </AuthGuard>
                </div>
              </ToastProvider>
            </ThemeWrapper>
          </WalletProviderWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
