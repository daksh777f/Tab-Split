"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Snapshot {
  time: string;
  claim: string;
  confidence: number;
}

interface TimelineScrubberProps {
  history: Snapshot[];
  onScrub: (snapshot: Snapshot | null) => void;
  className?: string;
}

export function TimelineScrubber({ history, onScrub, className }: TimelineScrubberProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!history || history.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-1">
        <span>History Log</span>
        <span>Drag to scrub</span>
      </div>

      <div 
        className="relative h-12 w-full bg-white/5 border border-white/10 rounded-md overflow-hidden flex items-center cursor-crosshair"
        onMouseLeave={() => {
          setHoverIndex(null);
          onScrub(null);
        }}
      >
        {/* Receipt Tape texture / lines */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, #ffffff 10px, #ffffff 11px)' }}
        />

        {history.map((snapshot, index) => {
          const isHovered = hoverIndex === index;
          return (
            <div
              key={index}
              className="flex-1 h-full relative group"
              onMouseEnter={() => {
                setHoverIndex(index);
                onScrub(snapshot);
              }}
            >
              {/* Tick mark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white/30 rounded-full group-hover:bg-accent group-hover:scale-150 transition-all" />
              
              {/* Active segment highlight */}
              {isHovered && (
                <motion.div 
                  layoutId="scrubber-highlight"
                  className="absolute inset-0 bg-accent/20 border-x border-accent/50"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Time labels under the scrubber */}
      <div className="flex justify-between w-full px-2">
        <span className="text-[9px] font-mono text-muted-foreground">{history[0].time}</span>
        <span className="text-[9px] font-mono text-muted-foreground">{history[history.length - 1].time}</span>
      </div>
    </div>
  );
}
