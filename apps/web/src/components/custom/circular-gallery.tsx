"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ClaimBubble } from "./claim-bubble";

const CLAIMS = [
  { id: 1, text: "I paid for the drinks at Neon.", author: "Alice", status: "verified", side: "left" as const },
  { id: 2, text: "No, you left your card at the hotel.", author: "Bob", status: "disputed", side: "right" as const },
  { id: 3, text: "Wait, I have the receipt.", author: "Alice", status: "supporting", side: "left" as const },
  { id: 4, text: "The Uber was ordered at 2AM.", author: "Charlie", status: "verified", side: "right" as const },
  { id: 5, text: "We went to the diner after.", author: "Bob", status: "pending", side: "left" as const },
  { id: 6, text: "I fell asleep in the booth.", author: "Dave", status: "conflict", side: "right" as const },
];

export function CircularGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Tie rotation to scroll position
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Rotate the entire cylinder based on scroll
  const rotationY = useTransform(scrollYProgress, [0, 1], [0, -360]);

  return (
    <div ref={containerRef} className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden [perspective:1200px]">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10 pointer-events-none" />
      
      <motion.div 
        className="relative w-full max-w-sm h-full flex items-center justify-center [transform-style:preserve-3d]"
        style={{ rotateY: rotationY }}
      >
        {CLAIMS.map((claim, index) => {
          // Calculate the angle for each item in the cylinder
          const angle = (index / CLAIMS.length) * 360;
          // Radius of the cylinder
          const radius = 400;

          return (
            <div
              key={claim.id}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80"
              style={{
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                backfaceVisibility: "hidden", // optional: hides items facing away
              }}
            >
              <ClaimBubble 
                author={claim.author}
                timestamp={`Item ${claim.id}`}
                text={claim.text}
                status={claim.status as any}
                side={claim.side}
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
