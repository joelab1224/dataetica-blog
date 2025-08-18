import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "../styles/design-system.css";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { getTranslation } from "@/lib/i18n/server";
import { defaultLocale } from "@/lib/i18n/config";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation(defaultLocale, 'blog');
  
  return {
    title: t('title'),
    description: t('tagline'),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale}>
      <body
        className={`${poppins.variable} font-sans antialiased`}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
