import { Hero } from "@/components/home/hero";
import { BuildingNow } from "@/components/home/building-now";
import { CTASection } from "@/components/home/cta-section";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <BuildingNow />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}