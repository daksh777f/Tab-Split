"use client";

import { motion } from "framer-motion";

interface AmbientBackgroundProps {
  variant?: "grid" | "aurora" | "glow";
  className?: string;
}

export function AmbientBackground({ variant = "grid", className = "" }: AmbientBackgroundProps) {
  if (variant === "grid") {
    return (
      <div className={`fixed inset-0 z-[-1] pointer-events-none ${className}`}>
        {/* Dark noise overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        {/* Fade out edges */}
        <div className="absolute inset-0 bg-midnight-docket [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,transparent_20%,black_100%)]" />
      </div>
    );
  }

  if (variant === "aurora") {
    return (
      <div className={`fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none ${className}`}>
        {/* Very subtle mesh gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(109,40,217,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(109,40,217,0.1),transparent_50%)]" />
        
        {/* Soft floating orbs */}
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px]"
        />
        <motion.div
          animate={{
            rotate: [0, -5, 5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] -left-[10%] w-[40%] h-[60%] rounded-full bg-accent/5 blur-[120px]"
        />
      </div>
    );
  }

  // Glow variant
  return (
    <div className={`fixed inset-0 z-[-1] pointer-events-none ${className}`}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-verdict-gold/15 rounded-full blur-[150px] opacity-50 mix-blend-screen" />
    </div>
  );
}
