import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});
import { SidebarProvider } from "./context/SidebarContext";
import { AnalysisProvider } from "./context/AnalysisContext";
import { QueryProvider } from "./providers/QueryProvider";
import { ThemeProvider } from "./context/ThemeContext";
import AnalysingIndicator from "./components/AnalysingIndicator";
import SmoothScroll from "./components/SmoothScroll";

export const metadata: Metadata = {
  title: "Trendsta - Content Research Tool",
  description: "Your daily content strategy dashboard for viral content creation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased ${inter.variable} ${spaceMono.variable}`}>
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

