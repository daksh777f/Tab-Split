"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView, animate } from "framer-motion";

interface ConfidenceGaugeProps {
  score: number; // 0 to 100
  label?: string;
  className?: string;
}

export function ConfidenceGauge({ score, label = "CONFIDENCE", className = "" }: ConfidenceGaugeProps) {
  const scoreRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });
  const controls = useAnimation();
  const prevScoreRef = useRef(0);

  useEffect(() => {
    if (isInView) {
      // Arc animation
      controls.start({
        strokeDashoffset: 100 - score,
        transition: { duration: 1.5, ease: "easeOut" },
      });

      // Number count-up using framer-motion animate
      if (scoreRef.current) {
        animate(prevScoreRef.current, score, {
          duration: 1.5,
          ease: "easeOut",
          onUpdate: (value) => {
            if (scoreRef.current) {
              scoreRef.current.innerHTML = Math.round(value).toString();
            }
          }
        });
      }
      
      prevScoreRef.current = score;
    }
  }, [isInView, score, controls]);

  // Determine color based on score (mocking truth subspace proximity)
  const colorClass =
    score > 75 ? "text-verdict-gold stroke-verdict-gold" :
    score > 40 ? "text-neon-alibi stroke-neon-alibi" :
    "text-guilty-red stroke-guilty-red";

  return (
    <div ref={containerRef} className={`relative flex flex-col items-center ${className}`}>
      <div className="relative w-48 h-48">
        {/* Background Arc */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="15.91549430918954"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="3"
            className="stroke-muted opacity-20"
          />
          {/* Foreground Arc */}
          <motion.circle
            cx="18"
            cy="18"
            r="15.91549430918954"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="100 100"
            strokeDashoffset="100"
            animate={controls}
            className={`drop-shadow-[0_0_8px_currentColor] ${colorClass}`}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-6xl font-bold tracking-tighter ${colorClass.split(" ")[0]} drop-shadow-[0_0_12px_currentColor]`}>
            <span ref={scoreRef}>0</span><span className="text-3xl">%</span>
          </div>
          <div className="text-xs tracking-widest text-muted-foreground font-semibold mt-1 uppercase">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
