import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import BuyWidget from "@/components/BuyWidget";
import TrustStrip from "@/components/TrustStrip";
import Leader from "@/components/Leader";
import WhyToken from "@/components/WhyToken";
import PricingDeck from "@/components/PricingDeck";
import Tokenomics from "@/components/Tokenomics";
import Roadmap from "@/components/Roadmap";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import StickySaleBar from "@/components/StickySaleBar";
import LiveChat from "@/components/LiveChat";
import AmbientOrbs from "@/components/AmbientOrbs";

export default function Home() {
  return (
    <main className="relative pb-24 lg:pb-0">
      <AmbientOrbs />
      <Header />
      <Hero />
      <Marquee />
      <section id="buy" className="relative px-4 py-10 sm:px-6">
        <div className="mx-auto w-full max-w-xl">
          <BuyWidget />
        </div>
      </section>
      <TrustStrip />
      <Leader />
      <WhyToken />
      <PricingDeck />
      <Tokenomics />
      <Roadmap />
      <Faq />
      <Footer />
      <StickySaleBar />
      <LiveChat />
    </main>
  );
}
