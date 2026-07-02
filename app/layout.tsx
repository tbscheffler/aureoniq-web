import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: "AureonIQ",
  description:
    "AI-powered career discovery platform helping professionals uncover hidden opportunities, career paths, and future growth potential.",

  openGraph: {
    title: "AureonIQ",
    description:
      "Career Intelligence for Modern Career Coaches. Discover opportunities your clients didn't know they qualified for.",
    url: "https://www.aureoniq.com",
    siteName: "AureonIQ",
    images: [
      {
        url: "/images/social/coach-beta-preview.png",
        width: 1600,
        height: 900,
        alt: "AureonIQ Career Intelligence Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "AureonIQ",
    description:
      "Career Intelligence for Modern Career Coaches.",
    images: ["/images/social/coach-beta-preview.png"],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
          {gaId ? (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `}
              </Script>
            </>
          ) : null}

          {children}
        </body>
    </html>
  );
}
