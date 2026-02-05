import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { SidebarProvider } from "./context/SidebarContext";
import { AnalysisProvider } from "./context/AnalysisContext";
import { QueryProvider } from "./providers/QueryProvider";
import { ThemeProvider } from "./context/ThemeContext";
import AnalysingIndicator from "./components/AnalysingIndicator";
import SmoothScroll from "./components/SmoothScroll";
import Script from "next/script";
import { Analytics } from "./analytics";
export const metadata: Metadata = {
  title: "Trendsta - Content Research Tool",
  description: "Your daily content strategy dashboard for viral content creation",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>

        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className="antialiased">
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <ThemeProvider>
          <QueryProvider>
            <AnalysisProvider>
              <SidebarProvider>
                <SmoothScroll>
                  <AnalysingIndicator />
                  {children}
                </SmoothScroll>
              </SidebarProvider>
            </AnalysisProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

