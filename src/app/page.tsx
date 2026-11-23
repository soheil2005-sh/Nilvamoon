import Header from "@/components/layout/header";
import Hero from "@/components/home/Hero";
import Experiences from "@/components/home/Experiences";
export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Experiences />
      </main>
    </>
  );
}
