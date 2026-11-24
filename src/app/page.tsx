import Header from "@/components/layout/header";
import Hero from "@/components/home/Hero";
import Experiences from "@/components/home/Experiences";
import Journal from "@/components/home/Journal";
import About from "@/components/home/About";
import Footer from "@/components/home/Footer";
import FloatingDock from "@/components/layout/FloatingDock";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Experiences />
        <Journal />
        <About />
      </main>
      <Footer />
      <FloatingDock />
    </>
  );
}
