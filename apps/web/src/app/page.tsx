import { ThreeBackground } from "@/components/custom/three-background";
import { LandingHero } from "@/components/custom/landing-hero";
import { StepsGallery } from "@/components/custom/steps-gallery";
import { CogneeTeaser } from "@/components/custom/cognee-teaser";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black text-foreground selection:bg-accent selection:text-white">
      {/* Global Background Layer */}
      <ThreeBackground />

      {/* 1. Hero Section */}
      <LandingHero />

      {/* 2. How It Works Section */}
      <section className="relative w-full z-10 bg-black/60 backdrop-blur-sm border-t border-white/5 py-12">
        <StepsGallery />
      </section>

      {/* 3. Why This Is Real */}
      <div className="relative z-10">
        <CogneeTeaser />
      </div>

      {/* 4. Footer CTA */}
      <footer className="relative w-full py-40 z-10 bg-[#050505] border-t border-white/10 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8">
          READY FOR THE VERDICT?
        </h2>
        <p className="text-muted-foreground text-lg mb-12 max-w-md mx-auto">
          Stop arguing. Start converging. Let the engine decide who owes what.
        </p>
        <Link 
          href="/nights/demo"
          className="inline-flex items-center justify-center whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-full px-12 h-16 text-xl font-bold bg-white text-black hover:bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
        >
          Start a Verdict
        </Link>
      </footer>
    </main>
  );
}
