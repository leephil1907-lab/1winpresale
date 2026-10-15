import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import HowToBuy from "@/components/HowToBuy";
import Tokenomics from "@/components/Tokenomics";
import Roadmap from "@/components/Roadmap";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <Hero />
      <Marquee />
      <About />
      <HowToBuy />
      <Tokenomics />
      <Roadmap />
      <Faq />
      <Footer />
    </main>
  );
}
