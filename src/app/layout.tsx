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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.dataetica.info';
  
  return {
    title: {
      template: '%s | DataÉtica Blog',
      default: t('title'),
    },
    description: t('description'),
    keywords: [
      'digital ethics',
      'AI ethics', 
      'artificial intelligence ethics',
      'technology ethics',
      'data privacy',
      'digital transformation',
      'ethical technology',
      'algorithm transparency',
      'digital rights',
      'technology policy',
      'digital literacy',
      'ethical AI',
      'data ethics'
    ],
    authors: [{ name: 'DataÉtica Team', url: baseUrl }],
    creator: 'DataÉtica',
    publisher: 'DataÉtica',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: baseUrl,
      siteName: t('title'),
      title: t('title'),
      description: t('description'),
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: t('title') + ' - ' + t('tagline'),
          type: 'image/png',
        },
        {
          url: `${baseUrl}/logo1.png`,
          width: 400,
          height: 400,
          alt: 'DataÉtica Logo',
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@dataetica',
      creator: '@dataetica',
      title: t('title'),
      description: t('tagline'),
      images: {
        url: `${baseUrl}/twitter-image.png`,
        alt: t('title') + ' - ' + t('tagline'),
      },
    },
    alternates: {
      canonical: baseUrl,
      types: {
        'application/rss+xml': `${baseUrl}/feed.xml`,
      },
    },
    category: 'Technology',
    classification: 'Digital Ethics Blog',
    other: {
      'theme-color': '#7c3aed',
      'color-scheme': 'light',
      'twitter:image:alt': t('title') + ' - ' + t('tagline'),
      'og:image:alt': t('title') + ' - ' + t('tagline'),
    },
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
