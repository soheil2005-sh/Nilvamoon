import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";

const iranSans = localFont({
  src: "../../public/fonts/IRANSansWeb.woff2",
  variable: "--font-iransans",
  display: "swap",
  preload: true,
  weight: "400",
});

const SITE_URL = "https://nilvamoontest.netlify.app"; // موقع انتشار نهایی، دامنهٔ واقعی را بگذار

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "نیلوا‌مون | فال حافظ، تاروت و فال قهوه آنلاین",
    template: "%s | نیلوا‌مون",
  },
  description:
    "فال حافظ با معنی و تفسیر، فال تاروت روزانه و احساسی، فال قهوه و تجربه‌های شهودی دیگر در نیلوا‌مون. ساده، رایگان و با حال‌وهوای خودت.",
  authors: [{ name: "NilvaMoon" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "نیلوا‌مون | فال حافظ، تاروت و فال قهوه",
    description:
      "همین الان فال حافظ بگیر، کارت تاروت بچین یا فال قهوه ببین. تجربه‌ای صمیمی و جادویی.",
    url: "/",
    locale: "fa_IR",
    type: "website",
    siteName: "NilvaMoon",
  },
  twitter: {
    card: "summary_large_image",
    title: "نیلوا‌مون | فال آنلاین",
    description: "فال حافظ، تاروت و قهوه به سبک نیلوا‌مون",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${iranSans.className} ${iranSans.variable}`}>
        {children}
      </body>
    </html>
  );
}