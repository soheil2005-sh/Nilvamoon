import type { Metadata } from "next";
import Header from "@/components/layout/header";
import Hero from "@/components/home/Hero";
import Experiences from "@/components/home/Experiences";
import HowItWorks from "@/components/home/HowItWorks";
import SymbolsAtlas from "@/components/home/SymbolsAtlas";   // ← خط جدید
import Journal from "@/components/home/Journal";
import About from "@/components/home/About";
import Footer from "@/components/home/Footer";
import FloatingDock from "@/components/layout/FloatingDock";
import { SITE_NAME, SITE_NAME_EN, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      alternateName: SITE_NAME_EN,
      url: SITE_URL,
      inLanguage: "fa-IR",
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: SITE_NAME_EN,
      url: SITE_URL,
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />
      <main>
        <Hero />
        <Experiences />
        <HowItWorks />
        <SymbolsAtlas />   {/* ← خط جدید */}
        <Journal />
        <About />
      </main>

      <Footer />
      <FloatingDock />
    </>
  );
}