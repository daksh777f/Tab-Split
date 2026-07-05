"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function ParallaxHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Background moves slower (parallax)
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  // Foreground text moves faster
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  // Opacity fades out on scroll
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  
  // Split text into two halves that slide apart
  const xLeft = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const xRight = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div 
      ref={containerRef} 
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      <motion.div 
        style={{ y: yText, opacity }}
        className="relative z-10 flex flex-col items-center justify-center w-full"
      >
        <div className="flex items-center justify-center gap-4 md:gap-8 w-full overflow-hidden px-4">
          <motion.h1 
            style={{ x: xLeft }}
            className="text-[12vw] font-black uppercase tracking-tighter text-foreground whitespace-nowrap drop-shadow-2xl"
          >
            THE
          </motion.h1>
          <motion.h1 
            style={{ x: xRight }}
            className="text-[12vw] font-black uppercase tracking-tighter text-accent whitespace-nowrap drop-shadow-[0_0_40px_rgba(109,40,217,0.5)]"
          >
            VERDICT
          </motion.h1>
        </div>
        
        <motion.p 
          style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "150%"]) }}
          className="text-xl md:text-3xl text-muted-foreground font-medium mt-8 max-w-3xl text-center px-4"
        >
          Scroll to uncover the truth.
        </motion.p>
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div 
        style={{ opacity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </div>
  );
}
