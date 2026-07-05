"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LandingHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const text = "WHERE'S MY CONTEXT?";
  
  // Staggered text reveal animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };

  const childVariants: Variants = {
    hidden: { opacity: 0, y: 50, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
  };

  return (
    <div ref={containerRef} className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      
      <motion.div 
        style={{ y: yText, opacity }}
        className="relative z-10 flex flex-col items-center justify-center px-4"
      >
        <motion.h1 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-8xl lg:text-[10vw] font-black uppercase tracking-tighter text-white drop-shadow-2xl flex flex-col items-center justify-center text-center leading-[0.9]"
          style={{ perspective: 1000 }}
        >
          <div className="flex flex-wrap justify-center">
            {"WHERE'S MY".split("").map((char, index) => (
              <motion.span 
                key={`line1-${index}`} 
                variants={childVariants}
                className={char === " " ? "w-[3vw]" : "inline-block origin-bottom"}
              >
                {char}
              </motion.span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center mt-2 md:mt-4 lg:mt-6">
            {"CONTEXT?".split("").map((char, index) => (
              <motion.span 
                key={`line2-${index}`} 
                variants={childVariants}
                className={char === " " ? "w-[3vw]" : "inline-block origin-bottom text-accent"}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-xl md:text-2xl text-muted-foreground font-medium mt-6 max-w-2xl text-center"
        >
          The real-time consensus engine for the morning after.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.5, type: "spring" }}
          className="mt-12"
        >
          <Link 
            href="/nights/demo"
            className="inline-flex items-center justify-center whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-full px-10 h-14 text-lg font-bold bg-accent text-accent-foreground hover:bg-accent/90 shadow-[0_0_30px_rgba(139,92,246,0.3)]"
          >
            Start a Verdict
          </Link>
        </motion.div>
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div 
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </div>
  );
}
