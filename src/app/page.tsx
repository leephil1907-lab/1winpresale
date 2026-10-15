import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import BuyWidget from "@/components/BuyWidget";
import TrustStrip from "@/components/TrustStrip";
import Leader from "@/components/Leader";
import WhyToken from "@/components/WhyToken";
import PricingDeck from "@/components/PricingDeck";
import Litepaper from "@/components/Litepaper";
import TopParticipants from "@/components/TopParticipants";
import HowToBuy from "@/components/HowToBuy";
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
      <div className="relative z-10 mx-auto mt-20 w-full max-w-6xl px-4 sm:px-6">
        <div className="rounded-xl border border-amber-400/20 bg-amber-300/[0.06] px-4 py-3 text-center text-xs leading-relaxed text-amber-100/80 sm:text-sm">
          Independent TRON-based concept implementation. Not the official 1win token sale. Sale figures and purchases remain unavailable until independently verified.
        </div>
      </div>
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
      <Litepaper />
      <TopParticipants />
      <HowToBuy />
      <Roadmap />
      <Faq />
      <Footer />
      <StickySaleBar />
      <LiveChat />
    </main>
  );
}
