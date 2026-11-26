import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_NAME_EN, SITE_URL, IS_LIVE } from "@/lib/site";

const iranSans = localFont({
  src: "../../public/fonts/IRANSansWeb.woff2",
  variable: "--font-iransans",
  display: "swap",
  preload: true,
  weight: "400",
});
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6eff2" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1426" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME_EN,
  title: {
    default: "نیلوا‌مون | فال حافظ، تاروت و فال قهوه آنلاین",
    template: "%s | نیلوا‌مون",
  },
  description:
    "فال حافظ با معنی و تفسیر، فال تاروت روزانه و احساسی، فال قهوه و تجربه‌های شهودی دیگر در نیلوا‌مون. ساده، رایگان و با حال‌وهوای خودت.",
  authors: [{ name: SITE_NAME_EN }],
  creator: SITE_NAME_EN,
  // نکته: عمداً alternates/canonical اینجا نیست؛ هر صفحه canonical خودش را دارد.
  openGraph: {
    title: "نیلوا‌مون | فال حافظ، تاروت و فال قهوه",
    description:
      "همین الان فال حافظ بگیر، کارت تاروت بچین یا فال قهوه ببین. تجربه‌ای صمیمی و جادویی.",
    locale: "fa_IR",
    type: "website",
    siteName: SITE_NAME_EN,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "نیلوا‌مون | فال حافظ، تاروت و فال قهوه",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "نیلوا‌مون | فال آنلاین",
    description: "فال حافظ، تاروت و قهوه به سبک نیلوا‌مون",
    images: ["/og-image.jpg"],
  },
  robots: IS_LIVE
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      }
    : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${iranSans.className} ${iranSans.variable}`}>
        {children}
      </body>
    </html>
  );
}