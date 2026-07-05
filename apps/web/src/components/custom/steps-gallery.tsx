"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate, useAnimation } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    id: 1,
    title: "1. The Claim",
    description: "Submit conflicting memories and fragmented accounts of the night before.",
    status: "INPUT",
    icon: "🗣️"
  },
  {
    id: 2,
    title: "2. The Evidence",
    description: "Upload receipts, blurry photos, and time-stamped texts to back it up.",
    status: "PROCESSING",
    icon: "🧾"
  },
  {
    id: 3,
    title: "3. Truth Subspace",
    description: "Cognee cross-references the data, reranking facts in a real-time graph.",
    status: "ANALYZING",
    icon: "🧠"
  },
  {
    id: 4,
    title: "4. The Verdict",
    description: "The engine reaches consensus, outputting a final receipt of who owes what.",
    status: "RESOLVED",
    icon: "⚖️"
  }
];

export function StepsGallery() {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // We use a separate motion value for the rotation
  const rotation = useMotionValue(0);
  
  // Capture pointer events for dragging with momentum
  const handleDrag = (event: any, info: any) => {
    // Adjust sensitivity
    const delta = info.delta.x * 0.5;
    rotation.set(rotation.get() + delta);
  };

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    // Add momentum (decay)
    const velocity = info.velocity.x;
    if (Math.abs(velocity) > 10) {
      animate(rotation, rotation.get() + velocity * 0.2, {
        type: "inertia",
        velocity: velocity * 0.5,
        power: 0.8,
        timeConstant: 300,
        restDelta: 0.1
      });
    }
  };

  return (
    <div 
      className="relative w-full h-[60vh] md:h-[80vh] flex flex-col items-center justify-center overflow-hidden [perspective:1000px] cursor-grab active:cursor-grabbing"
      ref={containerRef}
    >
      <div className="absolute top-10 text-center z-20">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2">HOW IT WORKS</h2>
        <p className="text-muted-foreground uppercase tracking-widest text-sm font-semibold">Drag to rotate the timeline</p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10 pointer-events-none" />
      
      {/* Invisible drag surface covering the container */}
      <motion.div
        className="absolute inset-0 z-30"
        drag="x"
        dragElastic={0}
        dragConstraints={{ left: 0, right: 0 }}
        dragMomentum={false} // We handle momentum manually on the rotation value
        onDragStart={() => setIsDragging(true)}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ touchAction: "none" }}
      />

      <motion.div 
        className="relative w-full max-w-sm h-full flex items-center justify-center [transform-style:preserve-3d]"
        style={{ rotateY: rotation }}
      >
        {STEPS.map((step, index) => {
          // Angle for a 4-sided carousel (90 degrees each)
          const angle = (index / STEPS.length) * 360;
          // Radius based on width
          const radius = 350;

          return (
            <div
              key={step.id}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 md:w-80"
              style={{
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                backfaceVisibility: "hidden", 
              }}
            >
              <Card className={cn(
                "p-8 bg-card/40 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500",
                "group hover:border-accent/50 hover:bg-card/60",
                isDragging && "pointer-events-none"
              )}>
                <div className="flex justify-between items-start mb-6">
                  <div className="text-4xl">{step.icon}</div>
                  <Badge variant="outline" className="bg-black/50 border-white/10 text-xs">
                    {step.status}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </Card>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
