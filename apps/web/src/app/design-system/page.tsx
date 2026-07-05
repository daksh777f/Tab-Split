"use client";

import { ThreeBackground } from "@/components/custom/three-background";
import { ParallaxHero } from "@/components/custom/parallax-hero";
import { CircularGallery } from "@/components/custom/circular-gallery";
import { ConfidenceGauge } from "@/components/custom/confidence-gauge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DesignSystemPage() {
  return (
    <div className="relative min-h-screen font-sans text-foreground selection:bg-accent selection:text-white">
      {/* 3D WebGL Background spanning the whole page */}
      <ThreeBackground />
      
      {/* Parallax Hero Section */}
      <ParallaxHero />

      {/* 3D Circular Gallery Section */}
      <section className="relative w-full min-h-[100vh] py-24 flex flex-col items-center justify-center z-10">
        <div className="max-w-4xl mx-auto text-center mb-12 px-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            The Evidence Cylinder
          </h2>
          <p className="text-muted-foreground text-lg">
            A WebGL and CSS3D powered gallery of claims. Scroll to rotate the timeline.
          </p>
        </div>
        
        <CircularGallery />
      </section>

      {/* Data Section */}
      <section className="relative w-full py-32 z-10 bg-black/50 backdrop-blur-3xl border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Context Resolves Conflict
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                The engine processes conflicting accounts and assigns confidence scores in real-time. Everything is animated using Framer Motion and Three.js.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="rounded-full px-8">View Graph</Button>
                <Button size="lg" variant="outline" className="rounded-full px-8">Submit Claim</Button>
              </div>
            </div>
            
            <Card className="p-12 relative overflow-hidden bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl rounded-3xl">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
              <div className="flex flex-col items-center justify-center gap-12">
                <ConfidenceGauge score={92} label="TRUTH CENTROID" />
                <div className="text-center space-y-2">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Network Status</div>
                  <div className="text-success font-medium">Synced • 14 Nodes Connected</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
